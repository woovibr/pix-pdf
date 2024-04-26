import React from "react";
import type { StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { PDFViewer } from "@react-pdf/renderer";
import type { BoletoProps } from "./InputSchema";
import { defaultArgs } from "./DefaultArgs";
import { Boleto } from "./Boleto";

const Setup = (args: BoletoProps) => {
  const Doc = Boleto.component;

  return (
    <PDFViewer
      style={{
        width: "100%",
        height: "90vh",
      }}
    >
      <Doc {...args} />
    </PDFViewer>
  );
};

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Example/PDF",
  component: Setup,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    // layout: "f",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    backgroundColor: { control: "color" },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onClick: fn() },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    ...defaultArgs,
  },
};
