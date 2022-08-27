import { isNumber } from "util";
import * as Yup from "yup";

export const createCardSchema = Yup.object().shape({
  type: Yup.string().required("O tipo é obrigatório!"),
  cvv: Yup.string()
    .length(3, "o código de seguraça deve ter 3 dígitos")
    .test("cvv", "o código de seguraça deve ser um número", (cvv) =>
      /^\d+$/.test(cvv as string)
    )
    .required("o código de seguraça é obrigatório!"),
  number: Yup.string()
    .test(
      "number",
      "o número do cartão deve conter somente números e espaços",
      (number) => /^\d+$/.test(String(number).replace(/ /g, ""))
    )
    .length(19)
    .required("número do cartão é obrigatório!"),
});
