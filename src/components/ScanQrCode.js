import React, { useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  LayoutAnimation,
  Modal
} from "react-native";
import { 
  BarCodeScanner
 } from "expo-barcode-scanner";
import { 
  Camera
 } from 'expo-camera';
import { 
  FontAwesome
} from '@expo/vector-icons';

import Constants from "expo-constants";
import ScannerView from "./ScannerView";
import TouchIcon from './TouchIcon';
import { 
  colors,
  gStyle
} from '../constants';

const ScanQrCode = props => {
  
  const [scanned, setScanned] = useState(null);
  const [lastScannedCode,setlastScannedCode] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [textError, settextError] = useState(null);
  
  React.useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      setScanned(false);
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    getBarCodeScannerPermissions();

  }, []);

  React.useEffect(() => {
    settextError(props.textError);
  },[props.textError]);

  const handleBarCodeScanned =  ({data }) => {
    if (data !== lastScannedCode) {
      setlastScannedCode(data)
      props.onPress(data);
      props.onClose(false);
    }
  };

  return (
    <Modal
        animationType="slide"
        transparent={true}
        visible={true}
        onRequestClose={() => {
            props.onClose(false);
        }}
        >
        <SafeAreaView style={styles.container}>
          {!scanned && hasPermission && (
            <View style={{ flex: 1 }}>
              
              <BarCodeScanner
                style={StyleSheet.absoluteFillObject}
                onBarCodeScanned={handleBarCodeScanned}
                barCodeTypes={[
                  BarCodeScanner.Constants.BarCodeType.qr,
                  BarCodeScanner.Constants.BarCodeType.code128,
                  BarCodeScanner.Constants.BarCodeType.ean13,
                  BarCodeScanner.Constants.BarCodeType.ean8,
                  BarCodeScanner.Constants.BarCodeType.code39,
                  BarCodeScanner.Constants.BarCodeType.code93,
                  BarCodeScanner.Constants.BarCodeType.code39mod43,
                  BarCodeScanner.Constants.BarCodeType.upc_e,
                  BarCodeScanner.Constants.BarCodeType.pdf417,
                  BarCodeScanner.Constants.BarCodeType.aztec,
                  BarCodeScanner.Constants.BarCodeType.codabar,
                  BarCodeScanner.Constants.BarCodeType.code39mod43,
                  BarCodeScanner.Constants.BarCodeType.datamatrix,
                  BarCodeScanner.Constants.BarCodeType.interleaved2of5,
                  BarCodeScanner.Constants.BarCodeType.itf14,
                  BarCodeScanner.Constants.BarCodeType.maxicode,
                  BarCodeScanner.Constants.BarCodeType.rssexpanded,
                  BarCodeScanner.Constants.BarCodeType.rss14,
                  BarCodeScanner.Constants.BarCodeType.upc_a,
                  BarCodeScanner.Constants.BarCodeType.upc_ean
                ]}
              />
              <View style={styles.helpTextWrapper}>
                {textError && lastScannedCode &&<View style={[gStyle.flexCenter,{
                    paddingVertical:15,
                    paddingHorizontal:5,
                    width:'90%',
                    borderRadius:3,
                    marginBottom:10,
                    backgroundColor:colors.whiteBg
                }]}>
                  <Text style={{color:colors.black,...gStyle.textBoxmeBold18}}>
                    {lastScannedCode}
                  </Text>
                  <Text style={{color:colors.boxmeBrand,
                    ...gStyle.textBoxmeBold16,paddingTop:3}}>
                    {textError}
                  </Text>
                </View>}
                <Text style={styles.helpText}>Find QR Code to scan</Text>
              </View>
            </View>
          )}

          <View style={styles.content}>
            {scanned !== null && hasPermission === null && (
              <Text style={styles.helpText}>Requesting for camera permission</Text>
            )}

            {scanned !== null && hasPermission === false && (
              <Text style={styles.helpText}>No access to camera</Text>
            )}

            {scanned === false && hasPermission && (
              <ScannerView scanned={scanned} />
            )}
          </View>
          <View style={styles.iconRight}>
            <TouchIcon
              icon={<FontAwesome color={colors.white} name="close" />}
              onPress={() => props.onClose(false)}
            />
          </View>
        </SafeAreaView>
      </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#000",
  },
  content: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  helpTextWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  helpText: {
    color: colors.white,
  },
  valueText:{
    position:"absolute",
    alignContent:"center",
    justifyContent:"center",
    alignItems: 'center',
    flexDirection:"row",
    backgroundColor:"rgba(0,0,0,0.6)",
    padding:10,
    borderRadius:3,
    width:"60%",
    left:"20%",
    top:78
  },
  iconRight: {
    alignItems: 'center',
    height: 28,
    justifyContent: 'center',
    position: 'absolute',
    right: 24,
    top:70,
    width: 28
  }
});

export default ScanQrCode;
