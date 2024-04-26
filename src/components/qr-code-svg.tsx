import React from "react";
import QR from "qrcode.react";
import { Path, Svg } from "@react-pdf/renderer";
import { parseHtmlSvgToPdf } from "../utils/parseHtmlSvgToPdf";
import { renderToString } from "react-dom/server";

export const createQRCodeSVG = (url: string) => {
  //@ts-expect-error qrcode-react does not have a type definition
  return <QR.QRCodeSVG value={url} size={128} />;
};

export const QRCode = ({ qrcode }: { qrcode: string }) => {
  const paths = parseHtmlSvgToPdf(renderToString(createQRCodeSVG(qrcode)));
  return (
    <Svg height="200" width="200" viewBox="0 0 100 100">
      {paths.map((path, index) => (
        <Path key={path} fill={index === 0 ? "white" : "black"} d={path} />
      ))}
    </Svg>
  );
};
