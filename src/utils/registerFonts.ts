import { Font } from "@react-pdf/renderer";

const __dirname = "src/";

export const registerFonts = () => {
  const baseDirectory = `${__dirname}fonts/Inter`;
  Font.register({
    family: "Inter",
    fonts: [
      {
        src: `${baseDirectory}/Inter-Regular.ttf`,
      },
      {
        fontStyle: "italic",
        src: `${baseDirectory}/Inter-Italic.ttf`,
      },
      {
        fontStyle: "italic",
        fontWeight: 600,
        src: `${baseDirectory}/Inter-BoldItalic.ttf`,
      },
      {
        fontWeight: 700,
        src: `${baseDirectory}/Inter-Bold.ttf`,
      },
      {
        fontWeight: 500,
        src: `${baseDirectory}/Inter-Medium.ttf`,
      },
      {
        fontWeight: 600,
        src: `${baseDirectory}/Inter-SemiBold.ttf`,
      },
    ],
  });
};
