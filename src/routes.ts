import express from "express";
import { AccountController } from "./controllers/AccountController";
import { CardController } from "./controllers/CardController";
import { PersonController } from "./controllers/PersonController";
import { TransactionController } from "./controllers/TransactionController";
import {
  accountIdSchema,
  personIdSchema,
  transactionIdSchema,
} from "./helpers/validators/IdSchema";
import { createPersonSchema } from "./helpers/validators/createPersonSchema";
import {
  validateBody,
  validateParams,
} from "./middlewarers/schemaValidationMiddleware";
import { createAccountSchema } from "./helpers/validators/createAccountSchema";
import { createCardSchema } from "./helpers/validators/createCardSchema";
import { createTransactionSchema } from "./helpers/validators/createTransactionSchema";
import { revertTransactionSchema } from "./helpers/validators/revertTransactionSchema";

export const rotas = express();

rotas.post(
  "/people",
  validateBody(createPersonSchema),
  new PersonController().create
);
rotas.get(
  "/people/:peopleId/:offset/cards",
  validateParams(personIdSchema),
  new PersonController().getCards
);
rotas.post(
  "/people/:peopleId/account",
  validateParams(personIdSchema),
  validateBody(createAccountSchema),
  new AccountController().create
);
rotas.get(
  "/people/:peopleId/accounts",
  validateParams(personIdSchema),
  new AccountController().getAccounts
);

rotas.get(
  "/accounts/:accountId/balance",
  validateParams(accountIdSchema),
  new AccountController().getBalance
);

rotas.get(
  "/accounts/:accountId/cards",
  validateParams(accountIdSchema),
  new AccountController().getCards
);

rotas.post(
  "/accounts/:accountId/cards",
  validateParams(accountIdSchema),
  validateBody(createCardSchema),
  new CardController().create
);

rotas.post(
  "/accounts/:accountId/transactions",
  validateParams(accountIdSchema),
  validateBody(createTransactionSchema),
  new TransactionController().create
);

rotas.post(
  "/accounts/:accountId/transactions/:transactionId/revert",
  validateParams(accountIdSchema),
  validateParams(transactionIdSchema),
  validateBody(revertTransactionSchema),
  new TransactionController().revertTransaction
);

rotas.get(
  "/accounts/:accountId/transactions",
  validateParams(accountIdSchema),
  new TransactionController().getTransactions
);
