import * as React from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  TextInput
} from "react-native";
import LottieView from 'lottie-react-native';
import * as ImagePicker from "expo-image-picker";
import {
    Image as Imagecompressor,
    Video as Videocompressor,
  } from "react-native-compressor";
import { FontAwesome,AntDesign } from '@expo/vector-icons';
import {
  colors,
  gStyle,
  device,
  images
 } from "../../constants";
import {
  handleSoundScaner,
  permissionDenied,
  handleSoundOkScaner,
} from "../../helpers/async-storage";
// components
import ScreenHeader from "../../components/ScreenHeader";
import getOrderQC from "../../services/reports/qc_order";
import CameraModule from "../../components/CameraModule";

import { serviceUploadAsset } from "../../helpers/upload-base";
import {translate} from "../../i18n/locales/IMLocalized";

const backgroundMode = true;
class QcScreens extends React.Component {
    constructor() {
        super();
        this.state = {
            code_scan: null,
            is_loading: false,
            order_info : null,
            model_camera : false,
            qc_note : null,
            list_asset : [],
            background_percent:0
        };
    }

    fetchOrderQC = async (code) => {
        this.setState({ is_loading: true });
        const response = await getOrderQC({q:code});
        if (response.status === 200) {
            handleSoundOkScaner();
            this.setState({
                order_info: response.data.results
            });

        } else if (response.status === 403) {
          await permissionDenied(this.props.navigation);
        } else {
          await handleSoundScaner();
        }
        this.setState({ is_loading: false });
    };

    setModalVisibleScan = async (code) => {
        await this.setState({ is_scan: code });
    };

    toggleCamera() {
        this.setState((prev) => ({
            model_camera: !prev.model_camera,
        }));
    }

    cameraSubmit = async (path) => {
        const resultcompress = await Imagecompressor.compress(path, {
          compressionMethod: "auto",
        });
        this.commitFileToServer(resultcompress);
    };


    commitFileToServer = async (assetPath) => {
        this.setState({ is_loading: true });
        await serviceUploadAsset(assetPath, this.state.order_info?.tracking_code, null, 3,0,false);
        this.setState({
          list_asset: [
            {
              type_upload: "image",
              index: this.state.list_asset.length + 1,
              path: assetPath,
            },
            ...this.state.list_asset,
          ],
          is_loading: false,
        });
    };

    submitQCResult = async () => {
        this.setState({ is_loading: true });
        for (let key = 0; key < this.state.list_asset.length; key++) {
          await serviceUploadAsset(
            this.state.list_asset[key].path,
            this.state.order_info?.tracking_code,
            this.state.qc_note,
            0,
            0,
            0,
          );
        }
        this.setState({ is_loading: false });
        return Alert.alert(
          "",
          translate("screen.module.putaway.text_ok"),
          [
            {
              text: translate("base.confirm"),
              onPress: () =>
                this.setState({ list_asset: [], qc_note: null, code_scan: null }),
            },
          ],
          { cancelable: false }
        );
    };

    pickVideos = async () => {
        this.setState({ is_loading: true });
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Videos,
          aspect: [4, 3],
          quality: 1,
        });
        if (!result.canceled) {
            const resultcompress = await Videocompressor.compress(
                result.assets[0].uri,
                {
                  compressionMethod: "auto",
                },
                (progress) => {
                  if (backgroundMode) {
                    this.setState({
                      background_percent: Number(progress.toFixed(2)) * 100,
                    });
                  } else {
                    this.setState({
                      background_percent: Number(progress.toFixed(2)) * 100,
                    });
                  }
                }
            );
            this.commitFileToServer(resultcompress);
        }
        this.setState({ is_loading: false });
    };

    pickImages = async () => {
        this.setState({ is_loading: true });
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          aspect: [4, 3],
          quality: 1,
        });
        if (!result.canceled) {
          const resultcompress = await Imagecompressor.compress(result.assets[0].uri, {
            compressionMethod: "auto",
          });
          this.commitFileToServer(resultcompress);
        }
        this.setState({ is_loading: false });
    };

    onChangeText = async (value) => {
        await this.setState({qc_note: value})
    }

    render() {
        const {
            list_asset,
            order_info,
            model_camera,
            qc_note,
            background_percent,
            is_loading } =this.state;
        const { navigation } = this.props;


        return (
            <ScrollView contentContainerStyle={{flexGrow: 1}}>
                <KeyboardAvoidingView
                    style={{ height: "100%", width: "100%" }}
                >
                    <View style={gStyle.container}>
                    <ScreenHeader
                        title={translate("screen.module.inbound.header")}
                        showBack={true}
                        iconLeft={"chevron-down"}
                        showInput={true}
                        inputValueSend={null}
                        onPressCamera={this.fetchOrderQC}
                        onSubmitEditingInput={this.fetchOrderQC}
                        textPlaceholder={translate("screen.module.qualitycontrol.scan")}
                     navigation={navigation}/>
                    {is_loading && <ActivityIndicator/>}

                    {!order_info ? (
                        <View style={[gStyle.flexCenter,{marginHorizontal:30}]}><LottieView style={{
                        width: 150,
                                    height: 100,
                        }} source={require('../../assets/icons/qr-scan.json')} autoPlay loop />
                                <Text style={{...gStyle.textBoxme14,color:colors.white}}>
                                    {translate("screen.module.qualitycontrol.step1")}
                                </Text>
                            <Text style={{...gStyle.textBoxme14,color:colors.white}}>{translate("screen.module.qualitycontrol.step2")}</Text>
                            <Text style={{...gStyle.textBoxme14,color:colors.white}}>{translate("screen.module.qualitycontrol.step3")}</Text>
                        </View>
                    ):
                    <View style={{marginHorizontal:10}}>
                        <View>
                            <Text style={styles.textValue}>{translate("screen.module.qualitycontrol.tracking_code")} {order_info.tracking_code}</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => navigation.navigate("HandoverImages",
                            {handover_code : null,load_local : true,path :[images['qc_standard_note']]})}
                            style={[gStyle.flexRowSpace,{
                                backgroundColor : colors.cardLight,
                                paddingVertical:13,
                                paddingHorizontal:10,
                                marginTop:5,
                                borderRadius:3
                            }]}
                        >
                                <Text style={{color:colors.white,...gStyle.textBoxme14}}>
                                {translate("screen.module.qualitycontrol.qc_text")}
                                </Text>
                                <AntDesign name="right" size={16} color={colors.white} />
                        </TouchableOpacity>
                        <View style={{
                                backgroundColor:colors.cardLight,marginTop:0.5,paddingVertical:4,paddingHorizontal:10,borderRadius:3,minHeight : 70
                            }}>
                            <Text style={{paddingVertical:3, color:colors.greyInactive,...gStyle.textBoxme14}}>{translate("screen.module.qualitycontrol.qc_note")}</Text>
                            <Text style={{color:colors.white,...gStyle.textBoxme14}}>
                                {order_info.note_quality_control}
                            </Text>
                        </View>

                        <View style={{marginVertical : 5}}>
                            <Text style={styles.textLabel}>{translate("screen.module.qualitycontrol.step")}</Text>
                        </View>
                        <View style={gStyle.flexRow}>
                            <TouchableOpacity
                                onPress={() => this.pickVideos(true)}
                                style={[gStyle.flexRowCenterAlign,{
                                    width : '49%',
                                    backgroundColor: colors.brandPrimary,
                                    borderRadius:3,
                                    paddingHorizontal:8,
                                    paddingVertical:2
                            }]}>
                                <View style={[gStyle.flexRowCenter,{
                                    width:45,
                                    height:45,
                                    borderRadius:45/2,
                                    backgroundColor : colors.white
                                }]}>
                                    <FontAwesome name="video-camera" size={16} color={colors.brandPrimary} />
                                </View>
                                <View style={{paddingHorizontal:6,color:colors.white,width:'80%'}}>
                                    <Text style={{color:colors.white,...gStyle.textBoxme14}}>
                                      {translate("screen.module.qualitycontrol.video")}
                                    </Text>
                                    {background_percent > 0 && <Text style={{color:colors.red}}>
                                        Upload {background_percent} %
                                    </Text>}
                                </View>
                            </TouchableOpacity>

                            <View style={{
                                width : '2%',
                                backgroundColor: colors.transparent,
                                height:80
                            }}>
                            </View>

                            <TouchableOpacity onPress={() => this.toggleCamera()} style={[gStyle.flexRowCenterAlign,{
                                width : '49%',
                                backgroundColor: colors.boxmeBrand,
                                borderRadius:3,
                                paddingHorizontal:8,
                                paddingVertical:2
                            }]}>
                                <View style={[gStyle.flexRowCenter,{
                                    width:45,
                                    height:45,
                                    borderRadius:45/2,
                                    backgroundColor : colors.white
                                }]}>
                                    <FontAwesome name="image" size={16} color={colors.boxmeBrand} />
                                </View>
                                <Text style={{paddingHorizontal:6,color:colors.white,width:'80%'}}>
                                {translate("screen.module.qualitycontrol.camera")}
                                </Text>
                            </TouchableOpacity>

                        </View>
                        <TouchableOpacity onPress={() => this.pickImages()} style={[gStyle.flexRowCenterAlign,{
                                width : '100%',
                                backgroundColor: colors.cardLight,
                                borderRadius:3,
                                paddingHorizontal:8,
                                paddingVertical:6,
                                marginVertical:5
                            }]}>
                                <View style={[gStyle.flexRowCenter,{
                                    width:45,
                                    height:45,
                                    borderRadius:45/2,
                                    backgroundColor : colors.cardLight
                                }]}>
                                    <FontAwesome name="cloud-upload" size={22} color={colors.white} />
                                </View>
                                <Text style={{paddingHorizontal:6,color:colors.white,width:'80%'}}>
                                    {translate("screen.module.qualitycontrol.upload")}
                                </Text>
                            </TouchableOpacity>
                        <View style={{marginVertical : 8}}>
                            <Text style={styles.textLabel}>{translate("screen.module.qualitycontrol.input_note")}</Text>
                        </View>
                        <View>
                            <TextInput
                                blurOnSubmit={false}
                                value={qc_note}
                                numberOfLines={5}
                                multiline={true}
                                onChangeText={text => this.onChangeText(text)}
                                onSubmitEditing = {text => this.onChangeText(text)}
                                style={{
                                    ...gStyle.textBoxme14,
                                    color: colors.black,
                                    paddingVertical:4,
                                    paddingHorizontal:10,
                                    backgroundColor:colors.white,
                                    height:75,
                                    borderRadius:3,
                                }}
                                placeholder={translate("screen.module.qualitycontrol.input_note")} />
                        </View>

                    </View>
                    }
                     {order_info && <View style={[styles.containerBottom]}>
                        <View style={gStyle.flex1}>
                            <View style={[gStyle.flexRowCenter]}>
                            <TouchableOpacity
                                onPress = {() => this.submitQCResult()}
                                style={[styles.bottomButton]}
                            >
                                {is_loading ? <ActivityIndicator color={colors.white}/> :
                                <Text style={styles.textButton} numberOfLines={1}>
                                    {translate("screen.module.qualitycontrol.btn")}({list_asset.length})
                                </Text>}
                            </TouchableOpacity>
                            </View>
                        </View>
                    </View>}
                    {model_camera && (
                        <CameraModule
                            showModal={model_camera}
                            setModalVisible={() => this.toggleCamera()}
                            setImage={(result) => this.cameraSubmit(result.uri)}
                            />
                        )}
                    </View>

                </KeyboardAvoidingView>
            </ScrollView>
        );
    }
}

QcScreens.propTypes = {
  // required
  navigation: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  textValue: {
    ...gStyle.textBoxme14,
    color: colors.white,
  },
  textLabel: {
    ...gStyle.textBoxme14,
    color: colors.greyInactive,
  },
  containerBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    width: "100%",
    backgroundColor: colors.cardLight,
    bottom: device.iPhoneNotch ? 20 : 0,
  },
  bottomButton: {
    width: "90%",
    marginHorizontal: 3,
    paddingVertical: 18,
    borderRadius: 6,
    backgroundColor: colors.darkgreen,
  },
  textButton: {
    textAlign: "center",
    paddingHorizontal: 5,
    color: colors.white,
    ...gStyle.textBoxmeBold14,
  },
});

export default React.memo(QcScreens);
