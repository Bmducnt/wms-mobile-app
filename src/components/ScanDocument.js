import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  Modal,
} from 'react-native';
import DocumentScanner from 'react-native-document-scanner-plugin';
import { colors, gStyle,device} from '../constants';

const ScanDocument = props => {

    const [scannedImage, setScannedImage] = React.useState();



    const scanDocument = async () => {
      // start the document scanner
      const { scannedImages } = await DocumentScanner.scanDocument({
        letUserAdjustCrop: false
      })
      if (scannedImages.length > 0) {
        setScannedImage(scannedImages[0]);
        props.onSubmit(scannedImages[0]);
        props.setModalVisible();
      }
    }

    
    React.useEffect(() => {
      // call scanDocument on load
      scanDocument()
    }, []); 

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={true}
        >
            <View style={styles.container}>
              
                {scannedImage &&

                    <Image
                    resizeMode="contain"
                    style={{ width: '100%', height: '100%' }}
                    source={{ uri: scannedImage }}
                    />
                }
            </View>
            
      </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.whiteBg,
    },
    instructions: {
      textAlign: 'center',
      color: colors.black,
      ...gStyle.textBoxme14,
      marginVertical: 5,
    },
    scanner: {
      flex: 1,
      width: 400,
      height: 200
    },
    bottomButton :{
        justifyContent: 'center',
        alignContent:'center',
        width:'46%',
        paddingVertical:15,
        borderRadius:6,
        backgroundColor:colors.brandPrimary,
        marginBottom:15
    },
    textButton :{
        textAlign:'center',
        color:colors.white,
        ...gStyle.textBoxme16,
    },
    blockLeft: {
      justifyContent: 'center',
      position: 'absolute',
      right: 25,
      top: device.iPhoneNotch ? 65 : 40,
    },
  });

export default ScanDocument;