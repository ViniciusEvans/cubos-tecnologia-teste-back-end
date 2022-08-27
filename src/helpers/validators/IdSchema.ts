import * as Yup from "yup";

export const accountIdSchema = Yup.object().shape({
  accountId: Yup.string()
    .uuid("ID deve ser no formato de uuid")
    .required("O id é obrigatório!"),
});
export const transactionIdSchema = Yup.object().shape({
  transactionId: Yup.string()
    .uuid("ID deve ser no formato de uuid")
    .required("O id é obrigatório!"),
});
export const personIdSchema = Yup.object().shape({
  peopleId: Yup.string()
    .uuid("ID deve ser no formato de uuid")
    .required("O id é obrigatório!"),
});
