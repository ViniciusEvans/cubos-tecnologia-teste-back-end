import { Request, Response } from "express";
import { accountRepository } from "../repositories/accountRepository";
import { transactionRepository } from "../repositories/transactionRepository";

export class TransactionController {
  async create(req: Request, res: Response) {
    const { accountId } = req.params;
    const { description, value } = req.body;

    try {
      const accountData = await accountRepository.findOneBy({ id: accountId });

      if (!accountData) {
        return res.status(404).json({ error: "conta não encontrada!" });
      }

      if (Number(value + Number(accountData.balance)) < 0) {
        return res.status(400).json({
          error: "não é possível realizar uma trasação maior que o saldo!",
        });
      }

      const newBalance = await accountRepository.update(accountId, {
        balance: String(Number(value + Number(accountData.balance)).toFixed(2)),
      });

      if (!newBalance) {
        return res
          .status(200)
          .json({ error: "não foi possível adicionar o valor!" });
      }

      const newTransaction = transactionRepository.create({
        description,
        value,
        account: accountData,
      });

      const { account, ...transctionData } = await transactionRepository.save(
        newTransaction
      );

      return res.status(200).json(transctionData);
    } catch (error) {
      return res.status(500).json({ error: "internal server error!" });
    }
  }

  async getTransactions(req: Request, res: Response) {
    const { offset, date } = req.query;
    const { accountId } = req.params;
    try {
      const skip = (Number(offset ? offset : 1) - 1) * 5;

      const accountsTransactions = await accountRepository.query(
        `SELECT transactions.id, transactions.value, transactions.description, transactions."createdAt", transactions."updatedAt" 
        FROM accounts LEFT JOIN transactions ON transactions.account_id= accounts.id
        WHERE (transactions."createdAt" >= $1 ) 
        AND accounts.id = $2
        OFFSET $3
        LIMIT $4`,
        [date ? new Date(date as string) : new Date(0), accountId, skip, 5]
      );
      if (!accountsTransactions.length) {
        return res
          .status(404)
          .json({ error: "não foi achado nenhuma transação para essa conta!" });
      }

      return res.status(200).json({
        transactions: accountsTransactions,
        pagination: { itemsPerPage: "5", currentPage: offset ? offset : 1 },
      });
    } catch (error) {
      return res.status(500).json({ error: "internal server error!" });
    }
  }
  async revertTransaction(req: Request, res: Response) {
    const { accountId, transactionId } = req.params;

    try {
      const accountData = await accountRepository.findOneBy({ id: accountId });

      if (!accountData) {
        return res.status(404).json({ error: "conta não encontrada!" });
      }

      const transactionData = await transactionRepository.findOne({
        where: { id: transactionId },
        relations: { account: true },
      });

      if (!transactionData) {
        return res.status(404).json({ error: "transação não encontrada!" });
      }
      if (transactionData.account.id !== accountData.id) {
        return res
          .status(404)
          .json({ error: "A transação não pertence a essa conta!" });
      }

      if (transactionData.createdAt !== transactionData.updatedAt) {
        return res.status(400).json({ error: "transação já revertida!" });
      }
      await accountRepository.update(accountId, {
        balance: String(
          (
            Number(transactionData.value) * -1 +
            Number(accountData.balance)
          ).toFixed(2)
        ),
      });
      const updatedTransaction = await transactionRepository.update(
        transactionId,
        {
          description: "reventendo transação",
          value: String((Number(transactionData.value) * -1).toFixed(2)),
        }
      );
      return res.status(200).json(updatedTransaction);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "internal server error!" });
    }
  }
}
