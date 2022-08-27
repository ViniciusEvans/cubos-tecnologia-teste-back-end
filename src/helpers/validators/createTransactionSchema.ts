import * as Yup from "yup";

export const createTransactionSchema = Yup.object().shape({
  value: Yup.number().required("valor é obrigatório!"),
  description: Yup.string(),
});
