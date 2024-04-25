import  {
  type DocumentProps,
  Font,
  renderToFile,
  renderToStream,
  renderToString,
} from "@react-pdf/renderer";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {createContext, createElement, type FunctionComponent} from "react";
import type { SomeZodObject, z } from "zod";
// biome-ignore lint/style/useImportType: <explanation>
import * as React from "react";

// @ts-ignore
const __dirname = fileURLToPath(new URL(".", import.meta.url));
export type TemplateSchema = SomeZodObject;
export type TemplateData<T extends TemplateSchema> = z.infer<T>;

type Story<T> = {
  args: T;
  prefix: string;
};

export type TemplateInput<T extends TemplateSchema> = {
  component: FunctionComponent<TemplateData<T>>;
  inputSchema: T;
  stories: Record<string, Story<TemplateData<T>>>;
};

export type Template<T extends TemplateSchema> = {
  component: FunctionComponent<TemplateData<T>>;
  getPdfStream: (input: TemplateData<T>) => Promise<NodeJS.ReadableStream>;
  getPdfString: (input: TemplateData<T>) => Promise<string>;
  inputSchema: T;
  savePdfFile: (input: TemplateData<T>, filepath: string) => Promise<void>;
  stories: Record<string, Story<TemplateData<T>>>;
};

// biome-ignore lint/complexity/noBannedTypes: <explanation>
const TemplateContext = createContext<{}>({});

const registerFonts = () => {
  const baseDirectory = path.resolve(__dirname, "..", "fonts", "Inter");
  Font.register({
    family: "Inter",
    fonts: [
      {
        src: path.resolve(baseDirectory, "Inter-Regular.ttf"),
      },
      {
        fontStyle: "italic",
        src: path.resolve(baseDirectory, "Inter-Italic.ttf"),
      },
      {
        fontStyle: "italic",
        fontWeight: 600,
        src: path.resolve(baseDirectory, "Inter-BoldItalic.ttf"),
      },
      {
        fontWeight: 700,
        src: path.resolve(baseDirectory, "Inter-Bold.ttf"),
      },
      {
        fontWeight: 500,
        src: path.resolve(baseDirectory, "Inter-Medium.ttf"),
      },
      {
        fontWeight: 600,
        src: path.resolve(baseDirectory, "Inter-SemiBold.ttf"),
      },
    ],
  });
};

registerFonts();

const getReactElement = async <T extends TemplateSchema>(
  template: TemplateInput<T>,
  input: TemplateData<T>
) => {
  await template.inputSchema.parseAsync(input);

  const element = createElement(
    TemplateContext.Provider,
    {
      value: {},
    },
    template.component({
      ...input,
    })
  );

  if (element === null) {
    throw new Error("Component must not return null.");
  }

  return element as React.ReactElement<DocumentProps>;
};

export const createPdf = <T extends TemplateSchema>(
  template: TemplateInput<T>
): Template<T> => {
  if (Object.keys(template.stories).length === 0) {
    throw new Error('Template must have at least one story".');
  }

  return {
    component: (input) => {
      return createElement(
        TemplateContext.Provider,
        {
          value: {},
        },
        template.component({
          ...input,
        })
      );
    },

    getPdfStream: async (input) => {
      const element = await getReactElement(template, input);

      return await renderToStream(element);
    },

    getPdfString: async (input) => {
      const element = await getReactElement(template, input);

      return await renderToString(
          // @ts-expect-error - TODO needs to be fixed
        createElement(
          TemplateContext.Provider,
          {
            value: {},
          },
          element
        )
      );
    },

    inputSchema: template.inputSchema,

    savePdfFile: async (input, filepath) => {
      const element = await getReactElement(template, input);

      await renderToFile(element, filepath);
    },

    stories: template.stories,
  };
};
