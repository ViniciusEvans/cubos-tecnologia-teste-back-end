import { Request, Response } from "express";
import { accountRepository } from "../repositories/accountRepository";
import { personRepository } from "../repositories/personRepository";

export class AccountController {
  async create(req: Request, res: Response) {
    const { branch, account } = req.body;
    const { peopleId } = req.params;

    if (!branch || !account) {
      return res
        .status(400)
        .json({ error: "todos os campos devem ser preenchidos!" });
    }

    try {
      const person = await personRepository.findOneBy({ id: peopleId });

      if (!person) {
        return res.status(404).json({ error: "id não existe!" });
      }

      const existAccount = await accountRepository.findOneBy({ account });

      if (existAccount) {
        return res.status(404).json({ error: "Essa conta já existe!" });
      }

      const balance = 0;

      const newAccount = accountRepository.create({
        branch,
        account,
        balance: String(balance.toFixed(2)),
        person,
      });

      const { person: personData, ...accountData } =
        await accountRepository.save(newAccount);

      return res.status(200).json(accountData);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "internal server error!" });
    }
  }
  async getAccounts(req: Request, res: Response) {
    const { peopleId } = req.params;

    try {
      const personAccounts = await personRepository.findOne({
        relations: { accounts: true },
        where: { id: peopleId },
      });
      if (!personAccounts) {
        return res.status(404).json({ error: "Não encontrado nenhuma conta!" });
      }
      return res.status(200).json(personAccounts.accounts);
    } catch (error) {
      return res.status(500).json({ error: "internal server error!" });
    }
  }
  async getCards(req: Request, res: Response) {
    const { accountId } = req.params;

    try {
      const accountData = await accountRepository.findOneBy({ id: accountId });
      if (!accountData) {
        return res.status(404).json({ error: "conta não existe" });
      }

      const cards = await accountRepository.findOne({
        where: { id: accountId },
        select: { id: true, account: true, branch: true },
        relations: { cards: true },
      });

      return res.status(200).json(cards);
    } catch (error) {
      return res.status(500).json({ error: "internal server error!" });
    }
  }
  async getBalance(req: Request, res: Response) {
    const { accountId } = req.params;
    try {
      const account = await accountRepository.findOneBy({ id: accountId });

      if (!account) {
        return res.status(404).json({ error: "conta não encontrada" });
      }

      return res.status(200).json({ balance: account.balance });
    } catch (error) {
      return res.status(500).json({ error: "internal server error!" });
    }
  }
}
