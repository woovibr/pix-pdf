import {
  type DocumentProps,
  renderToFile,
  renderToStream,
  renderToString,
} from "@react-pdf/renderer";

// biome-ignore lint/style/useImportType: <explanation>
import * as React from "react";
import { createContext, createElement, type FunctionComponent } from "react";
import type { SomeZodObject, z } from "zod";
import { registerFonts } from "../utils/registerFonts";

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

registerFonts();

// biome-ignore lint/complexity/noBannedTypes: <explanation>
const TemplateContext = createContext<{}>({});

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
