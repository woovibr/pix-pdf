import type {
  Template,
  TemplateInput,
  TemplateSchema,
} from "../factories/createPdf.js";

import { createPdf } from "../factories/index.js";
import fsSync from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { hideBin } from "yargs/helpers";
import yargs from "yargs/yargs";
import { Boleto } from "../templates/Boleto";

// @ts-ignore
const __dirname = fileURLToPath(new URL(".", import.meta.url));

const pdfBaseDirectory = path.resolve(__dirname, "../../generated-pdfs");

const templatesMap = {
  Boleto,
};

const argv = yargs(hideBin(process.argv))
  .help()
  .wrap(80)
  .options({
    template: {
      choices: Object.keys(templatesMap),
      description: "Template name",
      type: "string",
    },
  })
  .parseSync();

const createTemplatePdfs = async <T extends TemplateSchema>(
  template: TemplateInput<T>
) => {
  for (const [storyName, story] of Object.entries(template.stories)) {
    if (!story.prefix.trim()) {
      throw new Error("Story must have a prefix.");
    }

    const pdfDirectory = path.resolve(pdfBaseDirectory, story.prefix);

    if (!fsSync.existsSync(pdfDirectory)) {
      fsSync.mkdirSync(pdfDirectory, {
        recursive: true,
      });
    }

    const pdfPath = path.resolve(pdfDirectory, `${storyName}.pdf`);
    if (fsSync.existsSync(pdfPath)) {
      await fs.unlink(pdfPath);
    }

    await createPdf(template).savePdfFile(story.args, pdfPath);
  }
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const mapTemplates = (template: string): Template<any> => {
  switch (template) {
    case "Boleto":
      return Boleto;
    default:
      throw new Error(`Unknown template: ${template}`);
  }
};

(async () => {
  if (argv.template) {
    await createTemplatePdfs(mapTemplates(argv.template));
  } else {
    // generate all pdfs
    for (const template of Object.keys(templatesMap)) {
      console.log(`Generating ${template}...`);
      await createTemplatePdfs(mapTemplates(template));
    }
  }
})();
