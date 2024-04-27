import type { TemplateInput, TemplateSchema } from "../factories/createPdf.js";

import fsSync from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { hideBin } from "yargs/helpers";
import yargs from "yargs/yargs";
import { createPdf } from "../factories/index.js";
import { Boleto } from "../templates/Boleto/Boleto";

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

const mapTemplates = (template: string) => {
  switch (template) {
    case "Boleto":
      return Boleto;
    default:
      throw new Error(`Unknown template: ${template}`);
  }
};

(async () => {
  if (argv.template) {
    const templateStart = Date.now();
    await createTemplatePdfs(mapTemplates(argv.template));
    const templateEnd = Date.now();
    console.log(
      `${argv.template} generated in ${templateEnd - templateStart}ms`
    );
  } else {
    // generate all pdfs
    const startTime = Date.now();
    for (const template of Object.keys(templatesMap)) {
      console.log(`Generating ${template}...`);
      const templateStart = Date.now();
      await createTemplatePdfs(mapTemplates(template));
      const templateEnd = Date.now();
      console.log(`${template} generated in ${templateEnd - templateStart}ms`);
    }
    const endTime = Date.now();
    console.log(`Total generation time: ${endTime - startTime}ms`);
  }
})();
