import { AppDataSource } from "../data-source";
import { Person } from "../entities/Person";

export const personRepository = AppDataSource.getRepository(Person);
