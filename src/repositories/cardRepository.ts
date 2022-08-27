import { AppDataSource } from "../data-source";
import { Card } from "../entities/Card";

export const cardRepository = AppDataSource.getRepository(Card);
