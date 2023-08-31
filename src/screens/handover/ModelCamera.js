import React, { useState, useEffect } from "react";
import {
    Modal,
    Text,
    TouchableOpacity,
    View,StyleSheet,
    Alert,
    Image,
    ActivityIndicator,
    KeyboardAvoidingView,
    Dimensions
} from "react-native";
import {
    FontAwesome,
    Feather,
    AntDesign,
    Ionicons
} from '@expo/vector-icons';
import {
    colors,
    device,
    gStyle
 } from "../../constants";
 import * as Device from "expo-device"
import * as ImagePicker from 'expo-image-picker';
import ScanDocument from "../../components/ScanDocument";
import {
    Image as Imagecompressor,
    Video as Videocompressor
} from 'react-native-compressor';
import CameraModule from "../../components/CameraModule";
import { serviceUploadAsset } from "../../helpers/upload-base";
import {translate} from "../../i18n/locales/IMLocalized";

const ModelCamera = props => {

    const [isLoading,setisLoading] = useState(false);
    const [backgroundMode,setbackgroundMode] = useState(true);
    const [percentUpload,setpercentUpload] = useState(0);
    const [countryId,setcountryId] = useState(props.country_id);
    const [trackingCode,settrackingCode] = useState(props.tracking_code);
    const [openCamera,setopenCamera] = useState(false);
    const [openScan,setopenScan] = useState(false);
    const [stepUpload,setstepUpload] = useState(0);
    const [imageFull,setimageFull] = useState(null);
    const [imageOrder,setimageOrder] = useState(null);
    const [imageProduct,setimageProduct] = useState(null);
    const [totalImagePush,settotalImagePush] = useState(0);
    const [isVideo,setisVideo] = useState(false);
    const [isScan,setisScan] = useState(false);

    const openCameraStep = async (code) =>{
        setstepUpload(code);
        setopenCamera(true);
    };

    const onClose = async () =>{
        if(!imageFull || !imageOrder || !imageProduct){
            Alert.alert(
                "",

                translate("screen.module.handover.alert_image"),
                [
                  {
                    text: translate('base.confirm'),
                    onPress: () => null,
                  },
                ],
                { cancelable: false }
              );
        }
        else if(!isVideo){
            Alert.alert(
                "",
                translate("screen.module.handover.alert_video"),
                [
                  {
                    text: translate('base.confirm'),
                    onPress: () => null,
                  },
                ],
                { cancelable: false }
            );
        }
        else if (countryId === 237 && !isScan && Device.osName !== "Android"){
            Alert.alert(
                "",
                translate("screen.module.handover.alert_scan"),
                [
                  {
                    text: translate('base.confirm'),
                    onPress: () => null,
                  },
                ],
                { cancelable: false }
            );
        }else{
            props.onClose(false)
        }

    }
    const pickImageorVideo = async () => {
        setisLoading(true);
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          aspect: [4, 3],
          quality: 1,
        });
        if (result.assets[0].type === 'image'){
          const resultcompress = await Imagecompressor.compress(result.assets[0].uri, {
            compressionMethod: 'auto',
          });

          if (!result.canceled) {
            setisLoading(true);
            await serviceUploadAsset(
                resultcompress,
                trackingCode,
                null,
                3,
                0,
                false
            );
            settotalImagePush(totalImagePush+1)
            setisLoading(false);
          }
        }
        if (result.assets[0].type === 'video'){
          const resultcompress = await Videocompressor.compress(
            result.assets[0].uri,
            {
              compressionMethod: 'auto',
            },
            (progress) => {
              if (backgroundMode) {
                setpercentUpload(Number((progress).toFixed(2))*100);
              } else {
                setpercentUpload(Number((progress).toFixed(2))*100);
              }
            }
          );
          if (!result.canceled) {
            setisVideo(true);
            setisLoading(true);
            await serviceUploadAsset(
                resultcompress,
                trackingCode,
                null,
                3,
                0,
                false
            );
            settotalImagePush(totalImagePush+1)
            setisLoading(false);
          }
        };
    };

    const imageCompressDocumentScan = async (path) => {
        setisScan(true);
        await imageCompress(path);
    };

    const imageCompress = async (path) => {
        setisLoading(true);
        const resultcompress = await Imagecompressor.compress(path, {
          compressionMethod: 'auto',
        });
        if (stepUpload === 1){
            setimageFull(resultcompress)
        }
        if (stepUpload === 2){
            setimageOrder(resultcompress)
        }
        if (stepUpload === 3){
            setimageProduct(resultcompress)
        }
        await serviceUploadAsset(
            resultcompress,
            trackingCode,
            null,
            3,
            0,
            false
        );
        settotalImagePush(totalImagePush+1)
        setisLoading(false);
    };

    return (
        <Modal
            animationType="slide"
            presentationStyle="formSheet"
            visible={true}
        >
            <KeyboardAvoidingView
                    style={{ height: '100%', width: '100%' }}
                    behavior="height"
                    keyboardVerticalOffset={0}>
                <View style={[gStyle.container,{backgroundColor:'#f6f7f7'}]}>
                    <View style={{
                        borderTopLeftRadius:20,
                        borderTopRightRadius:20,
                        backgroundColor:'#f0f1f6'
                    }}>
                        <View style={[gStyle.flexRowCenter,{
                            paddingVertical:6,
                            paddingHorizontal:15,
                            borderTopLeftRadius:20,
                            borderTopRightRadius:20,
                            borderBottomColor:'#f0f1f6',
                            borderBottomWidth:1.5,
                            marginBottom:5,
                            backgroundColor:colors.whiteBg
                        }]}>
                            <TouchableOpacity
                                onPress={() => onClose()}
                                activeOpacity={gStyle.activeOpacity}
                                style={gStyle.flexCenter}
                            >
                                <Feather color={colors.black70} name='chevron-down' size={20}/>
                                <Text>{translate("screen.module.handover.order_need_image")}</Text>
                            </TouchableOpacity>

                        </View>
                        <TouchableOpacity
                            disabled={isLoading}
                            onPress={() => openCameraStep(1)}
                            style={[gStyle.flexRow,{
                            paddingHorizontal:10,
                            marginHorizontal:10,
                            borderRadius:3,
                            marginVertical:5,
                            paddingVertical:10,
                            backgroundColor:colors.whiteBg
                        }]}>
                            { !imageFull ? <FontAwesome name="image" size={50} color={colors.greyInactive} /> :
                            <Image source={{ uri: imageFull }} style={{
                                width:50,height:undefined,
                                resizeMode: 'contain',
                                aspectRatio: 1,
                                borderRadius:6
                            }} />}
                            <View style={[gStyle.flexRowSpace,{paddingLeft:10,width: Dimensions.get("window").width-100}]}>
                                <View style={{width:'65%'}}>
                                    <Text style={{...gStyle.textBoxmeBold14,color:colors.black70}}>

                                        {translate("screen.module.handover.overview_text")}
                                    </Text>
                                    <Text style={{...gStyle.textBoxme12,color:colors.black70}}>
                                        {translate("screen.module.handover.overview_text_sub")}
                                    </Text>
                                </View>
                                <View style={[gStyle.flexCenter,{
                                    padding:5,
                                    borderRadius:3,
                                    backgroundColor:colors.boxmeBrand
                                }]}>
                                    <Text style={{...gStyle.textBoxmeBold14,color:colors.white}}>{translate("screen.module.camera.btn_camera")}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            disabled={isLoading}
                            onPress={() => openCameraStep(2)} style={[gStyle.flexRow,{
                            paddingHorizontal:10,
                            marginHorizontal:10,
                            borderRadius:3,
                            marginVertical:5,
                            paddingVertical:10,
                            backgroundColor:colors.whiteBg
                        }]}>
                            { !imageOrder ? <FontAwesome name="image" size={50} color={colors.greyInactive} /> :
                            <Image source={{ uri: imageOrder }} style={{
                                width:50,height:undefined,
                                resizeMode: 'contain',
                                aspectRatio: 1,
                                borderRadius:6
                            }} />}
                            <View style={[gStyle.flexRowSpace,{paddingLeft:10,width: Dimensions.get("window").width-100}]}>
                                <View style={{width:'65%'}}>
                                    <Text style={{...gStyle.textBoxmeBold14,color:colors.black70}}>

                                        {translate("screen.module.handover.orders_text")}
                                    </Text>
                                    <Text style={{...gStyle.textBoxme12,color:colors.black70}}>
                                        {translate("screen.module.handover.orders_text_sub")}
                                    </Text>
                                </View>
                                <View style={[gStyle.flexCenter,{
                                    padding:5,
                                    borderRadius:3,
                                    backgroundColor:colors.boxmeBrand
                                }]}>
                                    <Text style={{...gStyle.textBoxmeBold14,color:colors.white}}>{translate("screen.module.camera.btn_camera")}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            disabled={isLoading}
                            onPress={() => openCameraStep(3)}
                            style={[gStyle.flexRow,{
                                paddingHorizontal:10,
                                marginHorizontal:10,
                                marginVertical:5,
                                borderRadius:3,
                                paddingVertical:10,
                                backgroundColor:colors.whiteBg
                        }]}>
                            { !imageProduct ? <FontAwesome name="image" size={50} color={colors.greyInactive} /> :
                            <Image source={{ uri: imageProduct }} style={{
                                width:50,height:undefined,
                                resizeMode: 'contain',
                                aspectRatio: 1,
                                borderRadius:6
                            }} />}
                            <View style={[gStyle.flexRowSpace,{paddingLeft:10,width: Dimensions.get("window").width-100}]}>
                                <View style={{width:'65%'}}>
                                    <Text style={{...gStyle.textBoxmeBold14,color:colors.black70}}>

                                        {translate("screen.module.handover.fnskus_text")}
                                    </Text>
                                    <Text style={{...gStyle.textBoxme12,color:colors.black70}}>
                                        {translate("screen.module.handover.fnskus_text_sub")}
                                    </Text>
                                </View>
                                <View style={[gStyle.flexCenter,{
                                    padding:5,
                                    borderRadius:3,
                                    backgroundColor:colors.boxmeBrand
                                }]}>
                                    <Text style={{...gStyle.textBoxmeBold14,color:colors.white}}>{translate("screen.module.camera.btn_camera")}</Text>
                                </View>
                            </View>

                        </TouchableOpacity>
                        <View style={[gStyle.flexCenter,{marginVertical:5}]}>
                            <Text style={{...gStyle.textBoxmeBold12,color:colors.black50}}>{translate("screen.module.handover.fnskus_upload_option")}</Text>
                            <TouchableOpacity
                                disabled={isLoading}
                                onPress={() => pickImageorVideo()}
                                style={[gStyle.flexRow,{
                                    paddingVertical:15,
                                    marginTop:10,
                                    backgroundColor:colors.whiteBg,
                                }]}
                            >
                                <View style={[gStyle.flexRowCenter,{paddingLeft:10}]}>
                                    <Feather color={colors.greyInactive} name="file-text" size={35} />
                                </View>
                                <View style={[{width:Dimensions.get("window").width -75,marginLeft:8}]}>
                                    <Text style={{color:colors.black70,...gStyle.textBoxme16}}>{translate("screen.module.camera.upload_select")}</Text>
                                    <Text style={{color:colors.greyInactive,
                                        ...gStyle.textBoxme12}}>PNG , JPG or MP4, MOV</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        {Device.osName !== "Android" && <View style={[gStyle.flexCenter,{marginVertical:5}]}>
                            <Ionicons name="ios-arrow-down-sharp" size={24} color={colors.greyInactive}/>
                            <TouchableOpacity
                                onPress={() => setopenScan(true)}
                                style={[gStyle.flexRow,{
                                    paddingVertical:15,
                                    marginTop:10,
                                    backgroundColor:colors.whiteBg,
                                }]}
                            >
                                <View style={[gStyle.flexRowCenter,{paddingLeft:10}]}>
                                    <AntDesign name="pdffile1" size={35} color={colors.greyInactive}  />
                                </View>
                                <View style={[{width:Dimensions.get("window").width -75,marginLeft:8}]}>
                                    <Text style={{color:colors.black70,...gStyle.textBoxme16}}>{translate("screen.module.inbound.scan_btn")}</Text>
                                    <Text style={{color:colors.greyInactive,
                                        ...gStyle.textBoxme12}}>PDF / WORD ...</Text>
                                </View>
                            </TouchableOpacity>
                            <View style={[gStyle.flexRow,{marginTop:5}]}>
                                <Text
                                style={{
                                    color: colors.brandPrimary,
                                    ...gStyle.textBoxmeBold14,
                                }}
                                >
                                    {translate("screen.module.inbound.upload_text_1")}{" "}
                                    {totalImagePush}{" "}
                                    {translate("screen.module.inbound.upload_text_2")}
                                </Text>
                            </View>
                        </View>}
                        <View style={[styles.containerBottom]}>
                            <View style={gStyle.flexRowCenter}>
                            {!isLoading ?  <TouchableOpacity disabled={isLoading} style={[styles.bottomButton]}
                                onPress={() => onClose()}>
                                    <Text style={styles.textButton} numberOfLines={1}>{translate("screen.module.handover.upload_all")} </Text>
                                </TouchableOpacity>:
                                    <View style={[styles.bottomButton,gStyle.flexCenter]}>
                                        <ActivityIndicator color={colors.white}/>
                                        <Text style={{color:colors.white,...gStyle.textBoxmeBold14}}> {percentUpload} %</Text>
                                    </View>}
                            </View>
                        </View>
                        {openCamera && (
                            <CameraModule
                                showModal={openCamera}
                                setModalVisible={() => setopenCamera(false)}
                                setImage={(result) => imageCompress(result.uri)}
                            />
                        )}
                        {openScan && (
                            <ScanDocument
                            setModalVisible={setopenScan}
                            onSubmit={imageCompressDocumentScan}
                            />
                        )}
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    textLabel :{
        ...gStyle.textBoxme14,
        color:colors.black50
      },
    textValue :{
        ...gStyle.textBoxme16,
        color:colors.black70
    },
    containerBottom:{
        marginTop:20,
        flexDirection : 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width:'100%'
      },
      bottomButton :{
          width: Dimensions.get("window").width-20,
          marginHorizontal:3,
          paddingVertical:15,
          borderRadius:3,
          marginBottom:device.iPhoneNotch ? 25 :0,
          backgroundColor:colors.brandPrimary
      },
      textButton :{
          textAlign:'center',
          paddingHorizontal:5,
          color:colors.white,
          ...gStyle.textBoxme16,
      }
});
export default ModelCamera;
