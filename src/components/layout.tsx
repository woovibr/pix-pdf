// biome-ignore lint/style/useImportType: <explanation>
import React from "react";
import { View, type ViewProps } from "@react-pdf/renderer";

type ComponentType = "Text" | "Link";
type AlignItemsOptions =
  | "flex-start"
  | "flex-end"
  | "center"
  | "baseline"
  | "stretch";
type JustifyContentOptions =
  | "flex-start"
  | "flex-end"
  | "center"
  | "space-between"
  | "space-around"
  | "space-evenly";

interface StackProps extends ViewProps {
  pt?: number | string;
  pb?: number | string;
  pl?: number | string;
  pr?: number | string;
  mt?: number | string;
  mb?: number | string;
  ml?: number | string;
  mr?: number | string;
  gap?: number | string;
  width?: number | string;
  as?: ComponentType;
  alignItems?: AlignItemsOptions;
  justifyContent?: JustifyContentOptions;
  children: React.ReactNode;
}
const VStack: React.FC<StackProps> = ({
  children,
  pt,
  pb,
  pl,
  pr,
  mt,
  mb,
  ml,
  mr,
  gap,
    width,
  alignItems,
  justifyContent,
  style,
  ...props
}) => {
  return (
    <View
      style={{
          width,
        paddingTop: pt,
        paddingBottom: pb,
        paddingLeft: pl,
        paddingRight: pr,
        marginTop: mt,
        marginBottom: mb,
        marginLeft: ml,
        marginRight: mr,
        flexDirection: "column",
        gap,
        alignItems,
        justifyContent,
        ...style,
      }}
      {...props}
    >
      {children}
    </View>
  );
};

const HStack: React.FC<StackProps> = ({
  children,
  pb,
  pt,
  pl,
  pr,
  mt,
  mb,
  ml,
  mr,
  gap,
    width,
  alignItems,
  justifyContent,
  style,
  ...props
}) => {
  return (
    <View
      style={{
          width,
        paddingTop: pt,
        paddingBottom: pb,
        paddingLeft: pl,
        paddingRight: pr,
        marginTop: mt,
        marginBottom: mb,
        marginLeft: ml,
        marginRight: mr,
        flexDirection: "row",
        gap,
        alignItems,
        justifyContent,
        ...style,
      }}
      {...props}
    >
      {children}
    </View>
  );
};

export { VStack, HStack };
