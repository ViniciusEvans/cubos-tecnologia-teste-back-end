import { Request, Response } from "express";
import { personRepository } from "../repositories/personRepository";

export class PersonController {
  async create(req: Request, res: Response) {
    const { name, document, password } = req.body;

    if (!name || !document || !password) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos!" });
    }

    try {
      const existPerson = await personRepository.findOneBy({ document });

      if (existPerson) {
        return res.status(400).json({ error: "documento já existe" });
      }
      const newPerson = personRepository.create({
        name,
        document,
        password,
      });

      await personRepository.save(newPerson);

      return res.status(200).json(newPerson);
    } catch (error) {
      return res.status(500).json({ error: "internal server error!" });
    }
  }
  async getCards(req: Request, res: Response) {
    const { offset, peopleId } = req.params;

    try {
      const skip = (Number(offset) - 1) * 5;
      const personData = await personRepository.findOneBy({
        id: peopleId,
      });
      console.log(peopleId, personData);

      if (!personData) {
        return res.status(404).json({ error: "pessoa não encontrada!" });
      }

      const cards = await personRepository
        .find({
          skip,
          take: 5,
          where: { id: peopleId },
          relations: { cards: true },
        })
        .then((person) => {
          person[0].cards.forEach((card) => {
            card.number = card.number.substring(
              card.number.length - 4,
              card.number.length
            );
          });

          return person;
        });
      if (!cards[0].cards.length) {
        return res.status(404).json({ error: "Não há cartões a mostrar" });
      }
      return res.status(200).json({
        cards: cards[0].cards,
        pagination: { itemsPerPage: "5", currentPage: offset },
      });
    } catch (error) {
      return res.status(500).json({ error: "internal server error!" });
    }
  }
}
