import * as Yup from "yup";

export const createPersonSchema = Yup.object().shape({
  name: Yup.string().required("nome é obrigatório!"),
  document: Yup.string()
    .test(
      "document",
      "documento deve ser um cpf ou cpnj!",
      (document) =>
        String(document).replace(/[^0-9]/g, "").length === 11 ||
        String(document).replace(/[^0-9]/g, "").length === 14
    )
    .required("documento é obrigatório!"),
  password: Yup.string().required("senha é obrigatória!"),
});
