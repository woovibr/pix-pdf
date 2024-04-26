import React from "react";
import type { StoryObj } from "@storybook/react";
import { PDFViewer } from "@react-pdf/renderer";
import { Boleto } from "./Boleto";
import type { BoletoProps } from "./input-schema";
import { defaultArgs } from "./default-args";
import { registerFonts } from "../../utils/registerFonts";

registerFonts("./");

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
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    ...defaultArgs,
  },
};
