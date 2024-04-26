import React from "react";
import * as QR from "qrcode.react";
import { Path, Svg } from "@react-pdf/renderer";
import { parseHtmlSvgToPdf } from "../utils/parseHtmlSvgToPdf";
import { renderToString } from "react-dom/server";

const createQRCodeSVG = (url: string) => {
  //@ts-ignore - client and server have different exports
  const Comp =typeof QR && QR.default.QRCodeSVG ? QR.default.QRCodeSVG : QR.QRCodeSVG;
  return <Comp value={url} size={128} />;
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
