import {BoletoComponent} from "./BoletoComponent";
import {createPdf} from "../../factories";
import {inputSchema} from "./input-schema";
import {defaultArgs} from "./default-args";


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
