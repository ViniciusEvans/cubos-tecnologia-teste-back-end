import { Request, Response } from "express-serve-static-core";
import { resourceLimits } from "worker_threads";
import { accountRepository } from "../repositories/accountRepository";
import { cardRepository } from "../repositories/cardRepository";

export class CardController {
  async create(req: Request, res: Response) {
    const { type, number, cvv } = req.body;
    const { accountId } = req.params;

    try {
      const account = await accountRepository.findOne({
        where: { id: accountId },
        relations: { person: true },
      });

      if (!account) {
        return res.status(404).json({ error: "conta não encontrada!" });
      }

      const existNumber = await cardRepository.findOneBy({ number });

      if (existNumber) {
        return res
          .status(400)
          .json({ error: "esse número de cartão já existe" });
      }

      const newCard = cardRepository.create({
        type,
        number,
        cvv,
        account,
        person: account.person,
      });

      const {
        account: trashData,
        person,
        ...result
      } = await cardRepository.save(newCard);

      return res.status(200).json(result);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "internal server error!" });
    }
  }
}
