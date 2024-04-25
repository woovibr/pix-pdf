import React from 'react'
import QR from "qrcode.react";
import {Path, Svg} from "@react-pdf/renderer";

export const createQRCodeSVG =  (url: string) => {
    //@ts-expect-error qrcode-react does not have a type definition
    return <QR.QRCodeSVG value={url} size={128} />;
}

export const QRCode = ({qrcode}: { qrcode: string[] }) => {
    return (
        <Svg height="128" width="128" viewBox="0 0 41 41">
            {qrcode.map((path, index) => (
                <Path key={path} fill={index === 0 ? 'white' : 'black'} d={path}/>
            ))}
        </Svg>
    );
};