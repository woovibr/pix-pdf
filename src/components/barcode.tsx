import React from "react";
import { Rect, Svg } from "@react-pdf/renderer";
import { z } from "zod";

interface SVGProps {
  x: number;
  width: number;
  fill: string;
}
/**
 * Encodes a base-10 code into its Interleaved 2 of 5 (ITF) representation
 *
 * @param {String} code The code to be encoded
 * @return {String} The input code encoded into its ITF representation
 *
 * @example
 * // Returns "111121121111222121121112211222111112111122211121122211211"
 * ITF.encode('1234567890');
 */
export function itf(code: string) {
  return START + code.match(/(..?)/g)?.map(interleavePair).join("") + STOP;
}

const START = "1111"; // Representation of Start portion of the barcode
const STOP = "211"; // Representation of Stop portion of the barcode

// Representations of each decimal digit
const WEIGHTS = [
  "11221", // 0
  "21112", // 1
  "12112", // 2
  "22111", // 3
  "11212", // 4
  "21211", // 5
  "12211", // 6
  "11122", // 7
  "21121", // 8
  "12121", // 9
];

/**
 * Converts a pair of digits into their ITF representation and interleave them
 *
 * @param {String} pair The pair to be interleaved
 * @return {String} The input pair encoded into its ITF representation
 *
 * @example
 * // Returns "1211212112"
 * ITF.interleavePair('01');
 */
function interleavePair(pair: string) {
  const numericPair = z.coerce.number().parse(pair)
  const black = WEIGHTS[Math.floor(numericPair / 10)];
  const white = WEIGHTS[numericPair % 10];

  let p = "";

  for (let i = 0; i < 5; i += 1) {
    p += black[i];
    p += white[i];
  }

  return p;
}

export function buildSvg(props: SVGProps[]) {
  const barcodeSvg = props.map(rect);
  // sum the last "x" with the last width
  const viewBoxWidth = (({ width, x }) => width + x)(props[props.length - 1]);

  return <Svg viewBox={`0 0 ${viewBoxWidth} 100`}>{barcodeSvg}</Svg>;
}

function rect({ fill, width, x }: SVGProps) {
  const key = `${x}-${width}`;
  return <Rect key={key} y="0" height="100%" fill={fill} width={width} x={x} />;
}

function indent(lines = []) {
  return lines.map((line) => `  ${line}`).join("\n");
}

export function boletoBarcodeSvg(code: string) {
  const codeCopy = format(code);
  const stripes = itf(codeCopy);
  const props = stripesToProps(stripes);
  const svg = buildSvg(props);

  return svg;
}

/**
 * Converts the printed bank slip code into the barcode code
 *
 * The bank slip's code is a rearrangement of its barcode, plus three
 * checksum digits. This function executes the inverse process and returns the
 * original arrangement of the code. Specifications can be found at
 * https://portal.febraban.org.br/pagina/3166/33/pt-br/layour-arrecadacao
 *
 */
function format(code: string) {
  return code
    .replace(/\D/g, "")
    .replace(
      /^(\d{4})(\d{5})\d{1}(\d{10})\d{1}(\d{10})\d{1}(\d{15})$/,
      "$1$5$2$3$4"
    );
}

/**
 * Transform [1, 2, 2, 1] into [
 *  {x: 0, width: 4, fill: "#fff"},
 *  {x: 4, width: 8, fill: "#000"}
 *  {x: 12, width: 8, fill: "#fff"}
 *  {x: 20, width: 4, fill: "#000"}
 * ]
 */
function stripesToProps(stripes: string): SVGProps[] {
  return strToIntArray(stripes).map(
    ((x) => (bit, i) => {
      const attr = {
        x,
        width: bit * STRIPE_WIDTH,
        fill: i % 2 ? WHITE : BLACK,
      };
      x += attr.width;
      return attr;
    })(0)
  );
}

// Transform "1221121" into [1, 2, 2, 1, 1, 2, 1]
// can't use parseInt with map because the second param (index)
function strToIntArray(stripes: string): number[] {
  return stripes.split("").map(Number);
}

// bars colors
const BLACK = "#000";
const WHITE = "#fff";
// bar width multiplier
const STRIPE_WIDTH = 4;
