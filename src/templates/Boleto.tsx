import {createPdf} from "../factories";
import {BoletoComponent} from "./BoletoComponent";
import {inputSchema} from "./InputSchema";
import {defaultArgs} from "./DefaultArgs";

export const Boleto = createPdf({
  component: BoletoComponent,
  inputSchema,
  stories: {
    default: {
      args: defaultArgs,
      prefix: "Basic",
    },
  },
});
