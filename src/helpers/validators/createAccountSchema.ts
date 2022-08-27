import * as Yup from "yup";

export const createAccountSchema = Yup.object().shape({
  branch: Yup.string()
    .length(3, "deve conter apenas 3 dígitos!")
    .test("branch", "deve conter somente números", (branch) =>
      /^\d+$/.test(branch as string)
    )
    .required("O agência é obrigatório!"),
  account: Yup.string().required("número da conta é obrigatório"),
});
