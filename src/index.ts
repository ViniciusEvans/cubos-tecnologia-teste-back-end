import express from "express";
import { AppDataSource } from "./data-source";
import { rotas } from "./routes";

AppDataSource.initialize().then(() => {
  const app = express();

  app.use(express.json());
  app.use(rotas);

  app.listen(process.env.PORT || 3000);
});
