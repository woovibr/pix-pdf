import {
  Document,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import React from "react";
import { WooviLogo } from "../../components/woovi-logo";
import type { BoletoProps } from "./input-schema";
import { boletoBarcodeSvg } from "../../components/barcode";
import { QRCode } from "../../components/qr-code-svg";
import { HStack, VStack } from "../../components/layout";
import PixIcon from "../../components/pix-icon";
import BarIcon from "../../components/bar-icon";

const formatDate = (date: string): string => {
  return new Intl.DateTimeFormat("pt-BR").format(new Date(date));
};

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
    display: "flex",
    flexWrap: "wrap",
  },
  barCode: {
    marginTop: 10,
    maxWidth: 344,
  },
  leftColumn: {
    flexDirection: "column",
    gap: "4px",
    padding: "4px 6px",
    width: 390,
  },
  rightColumn: {
    flexDirection: "column",
    gap: "4px",
    borderLeft: "1px solid black",
    padding: "4px 6px",
    height: "100%",
  },
  rightColumnStacked: {
    flexDirection: "column",
    gap: "4px",
    padding: "4px 6px",
  },
  valueSmall: {
    fontSize: "10px",
    width: 152,
  },
  value: {
    fontSize: "10px",
    textTransform: "uppercase",
  },
});

const mapLogo = {
  Woovi: <WooviLogo />,
};

const WrapText = ({ text }: { text?: string }) => (
  <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
    {text?.match(/\w+|\W+/g)?.map((seg, i) => (
      <Text
        style={{
          fontSize: 8,
        }}
        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
        key={i}
      >
        {seg}
      </Text>
    ))}
  </View>
);

export const BoletoComponent = (args: BoletoProps) => {
  const SvgBarcode = boletoBarcodeSvg(args.barcodeData);
  const displayExpirationDay = formatDate(args.expirationDay);
  const displayDocumentDate = formatDate(args.documentDate);

  return (
    <Document
      author="woovi.com"
      creator="woovi.com"
      producer="woovi.com"
      subject={"Woovi"}
      title={"Boleto - Woovi"}
    >
      <Page style={styles.page}>
        <HStack justifyContent={"space-between"}>
          <VStack
            gap={6}
            style={{
              maxWidth: 400,
            }}
          >
            <VStack
              gap={6}
              style={{
                flex: 1,
              }}
            >
              <HStack alignItems="center" gap={4}>
                <PixIcon size={12} />
                <Text style={styles.label}>Código pix</Text>
              </HStack>
              <WrapText text={args.qrCodeData} />
            </VStack>

            <VStack
              gap={6}
              style={{
                flex: 1,
              }}
            >
              <HStack alignItems="center" gap={4}>
                <BarIcon width={12} height={12} />
                <Text style={styles.label}>Linha digitável</Text>
              </HStack>
              <WrapText text={args.scannerBarcode} />
              <View debug={args.debug} style={styles.barCode}>
                {SvgBarcode}
              </View>
            </VStack>
          </VStack>
          <VStack
            mb={20}
            debug={args.debug}
            alignItems="center"
            gap={6}
            style={{
              maxWidth: 150,
            }}
          >
            <HStack gap={4} alignItems={"center"} pl={20} pr={30}>
              <PixIcon size={12} />
              <Text style={styles.labelSmall}>
                Pague o boleto com Pix usando o QRcode abaixo
              </Text>
            </HStack>
            <HStack alignItems={"center"}>
              <QRCode qrcode={args.qrCodeData} debug={args.debug} />
            </HStack>
          </VStack>
        </HStack>
        <HStack
          gap={6}
          style={{
            alignItems: "baseline",
          }}
        >
          <Link
            href={"https://woovi.com"}
            debug={args.debug}
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
        </HStack>

        <HStack
          alignItems={"baseline"}
          style={{
            border: "1px solid black",
          }}
        >
          <View style={{ ...styles.leftColumn }}>
            <Text style={styles.labelSmall}>Local de pagamento</Text>
            <Text style={styles.value}>{args.paymentPlace}</Text>
          </View>
          <View style={styles.rightColumn}>
            <Text style={styles.labelSmall}>Vencimento</Text>
            <Text style={{ ...styles.valueSmall, fontWeight: "semibold" }}>
              {displayExpirationDay}
            </Text>
          </View>
        </HStack>

        <HStack
          alignItems={"baseline"}
          style={{
            border: "1px solid black",
            borderTop: "none",
          }}
        >
          <View style={{ ...styles.leftColumn }}>
            <Text style={styles.labelSmall}>Beneficiário</Text>
            <Text style={styles.value}>{args.beneficiary}</Text>
          </View>
          <View style={styles.rightColumn}>
            <Text style={styles.labelSmall}>
              Agência / Código do Beneficiário
            </Text>
            <Text style={styles.valueSmall}>
              {args.agency} / {args.account}
            </Text>
          </View>
        </HStack>

        <HStack
          alignItems={"baseline"}
          style={{
            border: "1px solid black",
            borderTop: "none",
          }}
        >
          <HStack width={390} style={{ height: "100%" }}>
            <VStack
              style={{
                padding: "4px 6px",
              }}
            >
              <Text style={styles.labelSmall}>Data do Documento</Text>
              <Text style={styles.value}>{displayDocumentDate}</Text>
            </VStack>

            <VStack
              style={{
                padding: "4px 6px",
                borderLeft: "1px solid black",
              }}
            >
              <Text style={styles.labelSmall}>N° do Documento</Text>
              <Text style={styles.value}>{args.documentNumber}</Text>
            </VStack>
          </HStack>

          <View style={styles.rightColumn}>
            <Text style={styles.labelSmall}>Nosso Número</Text>
            <Text style={styles.valueSmall}>{args.formattedOurNumber}</Text>
          </View>
        </HStack>

        <HStack
          alignItems={"baseline"}
          style={{
            border: "1px solid black",
            borderTop: "none",
          }}
        >
          <View style={{ ...styles.leftColumn }}>
            <Text style={styles.labelSmall}>Espécie</Text>
            <Text style={styles.value}>{args.currencyType}</Text>
          </View>
          <View style={styles.rightColumn}>
            <Text style={styles.labelSmall}>Valor do Documento</Text>
            <Text style={styles.valueSmall}>{args.formattedValue}</Text>
          </View>
        </HStack>

        <HStack
          alignItems={"baseline"}
          style={{
            border: "1px solid black",
            borderTop: "none",
            minHeight: "108px",
          }}
        >
          <View style={{ ...styles.leftColumn }}>
            <Text style={styles.labelSmall}>
              Instruções (Texto de responsabilidade do beneficiário)
            </Text>
            <Text style={styles.value}>{args.instructions}</Text>
          </View>

          <VStack
            style={{
              borderLeft: "1px solid black",
              height: "100%",
            }}
          >
            <View style={styles.rightColumnStacked}>
              <Text style={styles.labelSmall}>(-) Desconto / Abatimentos</Text>
              <Text style={styles.valueSmall}>{args.discountValue}</Text>
            </View>

            <View
              style={{
                ...styles.rightColumnStacked,
                borderTop: "1px solid black",
              }}
            >
              <Text style={styles.labelSmall}>(-) Outras deduções</Text>
              <Text style={styles.valueSmall}>{args.otherDiscounts}</Text>
            </View>

            <View
              style={{
                ...styles.rightColumnStacked,
                borderTop: "1px solid black",
              }}
            >
              <Text style={styles.labelSmall}>(+) Mora / Multa</Text>
              <Text style={styles.valueSmall}>{args.feeValue}</Text>
            </View>

            <View
              style={{
                ...styles.rightColumnStacked,
                borderTop: "1px solid black",
              }}
            >
              <Text style={styles.labelSmall}>(+) Outros acréscimos</Text>
              <Text style={styles.valueSmall}>{args.otherFees}</Text>
            </View>

            <View
              style={{
                ...styles.rightColumnStacked,
                borderTop: "1px solid black",
              }}
            >
              <Text style={styles.labelSmall}>(=) Valor cobrado</Text>
              <Text style={styles.valueSmall}>{args.amount}</Text>
            </View>
          </VStack>
        </HStack>

        <VStack
          gap={6}
          style={{
            border: "1px solid black",
            borderTop: "none",
            padding: "4px 6px",
          }}
        >
          <Text style={styles.labelSmall}>Pagador</Text>
          <Text style={styles.value}>
            {args.payer.name}, CPF: {args.payer.registerNumber}
          </Text>
        </VStack>

        <View debug={args.debug} style={styles.barCode}>
          {SvgBarcode}
        </View>
      </Page>
    </Document>
  );
};
