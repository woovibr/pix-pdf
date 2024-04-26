import React from "react";
import {
  Document,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { createPdf } from "../factories";
import { z } from "zod";
import { boletoBarcodeSvg } from "../components/barcode";
import { WooviLogo } from "../components/woovi-logo";
import { QRCode } from "../components/qr-code-svg";

export const inputSchema = z.object({
  barcodeData: z.string(),
  scannerBarcode: z.string(),
  qrCodeData: z.string(),
  paymentPlace: z.string(),
  beneficiary: z.string(),
  beneficiaryAddress: z.string(),
  instructions: z.string(),
  agency: z.string(),
  agencyDigit: z.string(),
  account: z.string(),
  accountDigit: z.string(),
  expirationDay: z.date(),
  documentDate: z.date(),
  processingDate: z.date(),
  card: z.string(),
  documentNumber: z.string(),
  formattedOurNumber: z.string(),
  formattedValue: z.string(),
  documentType: z.string(),
  accept: z.string(),
  currencyType: z.string(),
  amount: z.string(),
  valueOf: z.string(),
  discountValue: z.string(),
  otherDiscounts: z.string(),
  feeValue: z.string(),
  otherFees: z.string(),
  chargeValue: z.string(),
  payer: z.object({
    name: z.string(),
    registerNumber: z.string(),
    street: z.string(),
    number: z.string(),
    complement: z.string(),
    district: z.string(),
    city: z.string(),
    state: z.string(),
    postalCode: z.string(),
  }),
  guarantor: z.object({
    name: z.string(),
    registerNumber: z.string(),
    street: z.string(),
    number: z.string(),
    district: z.string(),
    complement: z.string(),
    city: z.string(),
    state: z.string(),
    postalCode: z.string(),
  }),
});

const styles = StyleSheet.create({
  heading: {
    marginTop: 25,
  },
  page: {
    fontFamily: "Inter",
    padding: "32 20 52 20",
  },
  label: {
    fontSize: 12,
  },
  labelSmall: {
    fontSize: 8,
  },
  barCode: {
    maxWidth: 344,
    marginTop: 20,
  },
  leftColumn: {
    maxWidth: 399,
    width: "100%",
    flexDirection: "column",
    gap: "4px",
    padding: "4px 6px",
  },
  rightColumn: {
    flexDirection: "column",
    gap: "4px",
    borderLeft: "1px solid black",
    padding: "4px 6px",
    height: "100%",
  },
  valueSmall: {
    fontSize: "10px",
    width: 148,
    textAlign: "right",
  },
  value: {
    fontSize: "10px",
    textTransform: "uppercase",
  },
});

const mapLogo = {
  Woovi: <WooviLogo />,
};

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("pt-BR").format(date);
};

export const Boleto = createPdf({
  component: (args) => {
    const SvgBarcode = boletoBarcodeSvg(args.barcodeData);

    const displayExpirationDay = formatDate(args.expirationDay);
    const displayDocumentDate = formatDate(args.documentDate);
    const displayProcessingDate = formatDate(args.processingDate);

    return (
      <Document
        author="woovi.com"
        creator="woovi.com"
        producer="woovi.com"
        subject={"Woovi"}
        title={"Boleto - Woovi"}
      >
        <Page style={styles.page}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "baseline",
              gap: 6,
            }}
          >
            <Link
              href={"https://woovi.com"}
              style={{
                width: 100,
              }}
            >
              {mapLogo.Woovi}
            </Link>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "bold",
                padding: "0 6px",
                borderLeft: "1px solid black",
                borderRight: "1px solid black",
              }}
            >
              {args.documentNumber}
            </Text>

            <Text
              style={{
                fontSize: 12,
                fontWeight: "bold",
              }}
            >
              {args.scannerBarcode}
            </Text>
          </View>

          <View
            style={{
              border: "1px solid black",
              flexDirection: "row",
              alignItems: "baseline",
            }}
          >
            <View style={{...styles.leftColumn}}>
              <Text style={styles.labelSmall}>Local de pagamento</Text>
              <Text style={styles.value}>{args.paymentPlace}</Text>
            </View>
            <View style={styles.rightColumn}>
              <Text style={styles.labelSmall}>Vencimento</Text>
              <Text style={styles.valueSmall}>{displayExpirationDay}</Text>
            </View>
          </View>

          <View
            style={{
              border: "1px solid black",
              borderTop: "none",
              flexDirection: "row",
              alignItems: "baseline",
              height: '108px'
            }}
          >
            <View style={{...styles.leftColumn}}>
              <Text style={styles.labelSmall}>Instruções</Text>
              <Text style={styles.value}>{args.instructions}</Text>
            </View>
            <View style={styles.rightColumn}>
              <Text style={styles.labelSmall}>(=)Valor Documento</Text>
              <Text style={styles.valueSmall}>{args.formattedValue}</Text>
            </View>
          </View>

          <View style={{ marginTop: "10px" }}>
            <QRCode qrcode={args.qrCodeData} />
          </View>

          <View style={styles.barCode}>{SvgBarcode}</View>
        </Page>
      </Document>
    );
  },
  inputSchema,
  stories: {
    default: {
      args: {
        barcodeData: "23797726700000009997506091900000120800542910",
        scannerBarcode:
          "23797.50603 91900.000125 08005.429108 7 72670000000999",
        paymentPlace:
          "Pagável preferencialmente na rede Bradesco ou Bradesco Expresso.",
        beneficiary: "UNICRED FLORIANÓPOLIS - CNPJ: 074.064.502/0001-12",
        beneficiaryAddress:
          "Rua Tenete Silveira, 315 - Centro - Florianópolis - SC  - CEP 88010-301",
        instructions:
          "Após o vencimento cobrar multa de 2,00% , mais juros ao mes de 1,00%.",
        agency: "7506",
        agencyDigit: "0",
        account: "54291",
        accountDigit: "1",
        expirationDay: new Date(2017, 7, 30),
        documentDate: new Date(2017, 7, 18),
        processingDate: new Date(2017, 7, 18),
        card: "09",
        documentNumber: "42493",
        formattedOurNumber: "09/19000001208-0",
        formattedValue: "R$ 9,90",
        documentType: "DS",
        accept: "N",
        currencyType: "Real (R$)",
        amount: " ",
        valueOf: " ",
        discountValue: " ",
        otherDiscounts: " ",
        feeValue: " ",
        otherFees: " ",
        chargeValue: " ",
        qrCodeData:
          "00020126580014br.gov.bcb.pix01369e94d622-aecd-4f41-9b0e-5e9342465383520400005303986540510.005802BR5910Flop_Robux6009Sao_Paulo62290525617a30238ffb442e99a6a0c266304F356",
        payer: {
          name: "Anita Albuquerque",
          registerNumber: "221.412.772-05",
          street: "Rua Maria Gertrudes Coelho",
          number: "827",
          complement: " ",
          district: "Estrada Nova",
          city: "Divinópolis",
          state: "MG",
          postalCode: "35500-700",
        },
        guarantor: {
          name: "ACME Telecomunicações Ltda",
          registerNumber: "074.064.502/0001-12",
          street: "Servidão",
          number: "439",
          district: "Estrada Nova",
          complement: " ",
          city: "Jaraguá do Sul",
          state: "SC",
          postalCode: "89254-375",
        },
      },
      prefix: "Basic",
    },
  },
});
