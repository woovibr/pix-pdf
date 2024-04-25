import React from "react";
import {Document, Page, StyleSheet, Text, View,} from "@react-pdf/renderer";

import {createPdf} from "../factories";
import {z} from "zod";
import {boletoBarcodeSvg} from "../components/barcode";
import {WooviLogo} from "../components/woovi";
import VercelLogo from "../components/vercel";
import {createQRCodeSVG, QRCode} from "../components/qr-code-svg";
import {renderToString} from "react-dom/server";
import {parseHtmlSvgToPdf} from "../utils/parseHtmlSvgToPdf";

const inputSchema = z.object({
  companyName: z.literal("Woovi").or(z.literal("Vercel")),
  number: z.string(),
  short: z.string(),
  dueDate: z.string(),
  qrcode: z.string(),
});

const styles = StyleSheet.create({
  heading: {
    marginTop: 25,
  },
  page: {
      fontFamily: 'Inter',
      padding: "32 20 52 20",
  },
  label: {
    fontSize: 12,
  },
});


export const Boleto = createPdf({
  component: (args) => {
    const SvgBarcode = boletoBarcodeSvg(args.number);
    const qrcode = parseHtmlSvgToPdf(
      renderToString(createQRCodeSVG(args.qrcode))
    );

    const mapLogo = {
      Woovi: <WooviLogo />,
      Vercel: <VercelLogo />,
    };

    return (
      <Document
        author="woovi.com"
        creator="woovi.com"
        producer="woovi.com"
        subject={args.companyName}
        title={`Boleto - ${args.companyName}`}
      >
        <Page style={styles.page}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "baseline",
              gap: 6,
            }}
          >
            <View
              style={{
                  width: 100,
              }}
            >
              {mapLogo[args.companyName]}
            </View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "bold",
                  padding: "0 6px",
                  borderLeft: "1px solid black",
                  borderRight: "1px solid black",
                }}
              >
                {args.short}
              </Text>

              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "bold",
                }}
              >
                {args.number}
              </Text>
          </View>

          <View
            style={{
              border: "1px solid black",
              flexDirection: "row",
              alignItems: "baseline",
            }}
          >
            <View
              style={{
                maxWidth: 399,
                flexDirection: "column",
                gap: "4px",
                padding: "4px 6px",
              }}
            >
              <Text
                style={{
                  fontSize: "8px",
                }}
              >
                Local de pagamento
              </Text>
              <Text
                style={{
                  fontSize: "10px",
                  textTransform: "uppercase",
                }}
              >
                Pagável preferencialmente nas agências da Woovi.
              </Text>
            </View>
            <View
              style={{
                flexDirection: "column",
                gap: "4px",
                borderLeft: "1px solid black",
                padding: "4px 6px",
              }}
            >
              <Text
                style={{
                  fontSize: "8px",
                }}
              >
                Vencimento
              </Text>
              <Text
                style={{
                  fontSize: "10px",
                  width: 148,
                  textAlign: "right",
                }}
              >
                {args.dueDate}
              </Text>
            </View>
          </View>

          <View>
            <QRCode qrcode={qrcode}  />
          </View>
          <View
            style={{
              maxWidth: "344px",
              margin: "20px",
            }}
          >
            {SvgBarcode}
          </View>
        </Page>
      </Document>
    );
  },
  inputSchema,
  stories: {
    default: {
      args: {
        companyName: "Woovi",
        short: "237-2",
        number: "23791.11103 60000.000103 01000.222206 1 48622000000000",
        dueDate: "29/01/2011",
        qrcode: "https://woovi.com",
      },
      prefix: "Basic",
    },
    custom: {
      args: {
        companyName: "Vercel",
        short: "237-2",
        number: "23791.11103 60000.000103 01000.222206 1 48622000000000",
        dueDate: "29/01/2011",
        qrcode: "00020126330014BR.GOV.BCB.PIX01110980827191052040000530398654040.015802BR5919Julio Cezar Merisio6009SAO PAULO62140510QISyLSve056304551F",
      },
      prefix: "Basic",
    },
  },
});
