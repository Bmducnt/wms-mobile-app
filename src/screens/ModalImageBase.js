import * as React from "react";
import PropTypes from "prop-types";
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView
} from "react-native";
import { Feather } from "@expo/vector-icons";
import {
  Image as Imagecompressor,
  Video as Videocompressor,
} from "react-native-compressor";
import * as ImagePicker from "expo-image-picker";
import { serviceUploadAsset } from "../helpers/upload-base";
import { 
  colors, 
  gStyle, 
  images, 
  device
} from "../constants";
import TextInputComponent from "../components/TextInputComponent";
import SliderBase from "../components/SliderBase";
// components
import CameraModule from "../components/CameraModule";

const backgroundMode = true;
class ModalImageBase extends React.Component {
  constructor() {
    super();
    this.state = {
      code_scan: null,
      code_note: null,
      is_load: null,
      open_camera: false,
      image_path: null,
      is_tracking: true,
      is_selected : false,
      is_loading: false,
      text_label: null,
      type_upload: "image",
      background_percent: 0,
      text_placeholder: null,
      list_asset: [],
    };
    this.video = React.createRef(null);
    this.toggleCamera = this.toggleCamera.bind(this);
  }

  UNSAFE_componentWillMount = async () => {
    const { t } = this.props.screenProps;
    const { navigation } = this.props;

    Alert.alert(
      t("screen.module.qualitycontrol.alert_head"),
      t("screen.module.qualitycontrol.alert_body"),
      [
        {
          text: t("screen.module.qualitycontrol.alert_btn"),
          onPress: () => navigation.navigate("QcScreens",{}),
        },
        {
          text: t("base.ok"),
          onPress: null,
        },
      ],
      { cancelable: false }
    );
  };



  componentDidMount() {
    const { t } = this.props.screenProps;
    const { navigation } = this.props;
    this.setState({
      text_label:
        navigation.getParam("is_tracking") === 1
          ? t("screen.module.camera.lable_tracking_code")
          : t("screen.module.camera.lable_fnsku_code"),
      text_placeholder:
        navigation.getParam("is_tracking") === 1
          ? t("screen.module.camera.tracking_code")
          : t("screen.module.camera.fnsku_code"),
      is_tracking: navigation.getParam("is_tracking"),
    });
  }

  _validate_data_upload = async () => {
    const { t } = this.props.screenProps;
    if (this.state.code_scan === null) {
      Alert.alert(
        "",
        this.state.is_tracking === 1
          ? t("screen.module.camera.alert_scan_order")
          : t("screen.module.camera.alert_scan_fnsku"),
        [
          {
            text: t("base.confirm"),
            onPress: null,
          },
        ],
        { cancelable: false }
      );
    } else {
      Alert.alert(
        "",
        t("screen.module.camera.confirm_text"),
        [
          {
            text: t("base.confirm"),
            onPress: () => this.submitAllAsset(),
          },
        ],
        { cancelable: false }
      );
    }
  };

  _onSubmitEditingInput = async (code) => {
    if (code) {
      this.setState({ code_scan: code });
    }
  };

  _onSubmitEditingInputNote = async (code) => {
    if (code) {
      this.setState({ code_note: code });
    }
  };

  toggleCamera() {
    this.setState((prev) => ({
      open_camera: !prev.open_camera,
    }));
  }
  
  submitAllAsset = async () => {
    const { t } = this.props.screenProps;
    this.setState({ is_loading: true });
    for (let key = 0; key < this.state.list_asset.length; key++) {
      await serviceUploadAsset(
        this.state.list_asset[key].path,
        this.state.code_scan,
        this.state.code_note,
        this.state.is_tracking,
        0,
        this.state.is_selected,
      );
    }
    this.setState({ is_loading: false });
    return Alert.alert(
      "",
      t("screen.module.putaway.text_ok"),
      [
        {
          text: t("base.confirm"),
          onPress: () =>
            this.setState({ list_asset: [], code_note: null, code_scan: null }),
        },
      ],
      { cancelable: false }
    );
  };

  countObjectKey = (key_compare) => {
    return this.state.list_asset.filter(item => item.type_upload === key_compare).length;
  };


  pickImageByCamera = async (path) => {
    const resultcompress = await Imagecompressor.compress(path, {
      compressionMethod: "auto",
    });
    this.setState({
      list_asset: [
        {
          type_upload: "image",
          index: this.state.list_asset.length + 1,
          path: resultcompress,
        },
        ...this.state.list_asset,
      ],
    });
  };

  pickImageorVideo = async () => {
    const { t } = this.props.screenProps;
    if (this.state.list_asset.length >= 3) {
      Alert.alert(
        "",
        t("screen.module.camera.upload_select_alert"),
        [
          {
            text: t("base.confirm"),
            onPress: null,
          },
        ],
        { cancelable: false }
      );
      return;
    }
    this.setState({ is_loading: true });
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      aspect: [4, 3],
      quality: 1,
    });
    if (result.assets[0].type === "image") {
      if (!result.canceled) {
        const resultcompress = await Imagecompressor.compress(result.assets[0].uri, {
          compressionMethod: "auto",
        });
        this.setState({
          list_asset: [
            {
              type_upload: "image",
              index: this.state.list_asset.length + 1,
              path: resultcompress,
            },
            ...this.state.list_asset,
          ],
        });
      }
    }
    if (result.assets[0].type === "video") {
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
        this.setState({
          list_asset: [
            {
              type_upload: "video",
              index: this.state.list_asset.length + 1,
              path: resultcompress,
            },
            ...this.state.list_asset,
          ],
        });
      }
    }
    this.setState({ is_loading: false });
  };

  renderIntro = (t) => {
    return (
      <View>
        <View
          style={[
            gStyle.flexRowCenter,
            { marginTop: device.iPhoneNotch ? "40%" : "10%" },
          ]}
        >
          <Image source={images["file_upload"]} style={styles.fileUpload} />
        </View>
        <View style={[gStyle.flexRowCenter]}>
          <Text
            style={{
              color: colors.white,
              ...gStyle.textBoxme16,
              paddingTop: 20,
            }}
          >
            {t("screen.module.camera.upload_text")}
          </Text>
        </View>
        <View style={[gStyle.flexRowCenter]}>
          <Text
            style={{
              color: colors.white,
              ...gStyle.textBoxmeBold22,
              paddingTop: 5,
            }}
          >
            {t("screen.module.camera.upload_text_sub")}
          </Text>
        </View>
        <View style={[gStyle.flexRowCenter]}>
          <Text
            style={{
              color: colors.greyInactive,
              ...gStyle.textBoxme14,
              paddingTop: 40,
            }}
          >
            {t("screen.module.camera.upload_size")}
          </Text>
        </View>
      </View>
    );
  };

  render() {
    const { navigation } = this.props;
    const {
      open_camera,
      list_asset,
      text_label,
      text_placeholder,
      is_loading,
      code_scan,
      is_selected,
      background_percent,
    } = this.state;
    const { t } = this.props.screenProps;
    return (
      <ScrollView>
        <KeyboardAvoidingView
          style={{ height: "100%", width: "100%" }}
          behavior="padding"
          keyboardVerticalOffset={0}
        >
          <View style={gStyle.container}>
            <View
              style={{
                height: Dimensions.get("window").height - 350,
              }}
            >
              {list_asset.length > 0 ? (
                <SliderBase data={list_asset} />
              ) : (
                this.renderIntro(t)
              )}
            </View>
            <View style={[{ height: 350, backgroundColor: "#f6f7f7" }]}>
              <View style={gStyle.flexRow}>
                <TouchableOpacity
                  style={[
                    gStyle.flexCenter,
                    {
                      width: "60%",
                      marginTop: -35,
                      paddingVertical: 14,
                      marginHorizontal: "20%",
                      borderRadius: 50,
                      backgroundColor: colors.boxmeBrand,
                    },
                  ]}
                  onPress={() => {
                    this.toggleCamera();
                  }}
                >
                  {!is_loading ? (
                    <View style={gStyle.flexRowCenterAlign}>
                      <Feather color={colors.white} name="camera" size={25} />
                      <Text style={[styles.textButton, { paddingLeft: 8 }]}>
                        {" "}
                        {t("screen.module.camera.btn_camera")}
                      </Text>
                    </View>
                  ) : (
                    <View style={gStyle.flexRowCenterAlign}>
                      <ActivityIndicator color={colors.white} />
                      <Text
                        style={{
                          color: colors.black,
                          ...gStyle.textBoxmeBold14,
                        }}
                      >
                        {" "}
                        {background_percent} %
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => this.pickImageorVideo()}
                style={[
                  gStyle.flexRow,
                  {
                    paddingVertical: 12,
                    marginHorizontal: 15,
                    marginTop: 10,
                    backgroundColor: colors.whiteBg,
                  },
                ]}
              >
                <View style={[gStyle.flexRowCenter, { width: 60 }]}>
                  <Feather color={"#162a53"} name="file-text" size={20} />
                </View>
                <View style={[{ width: Dimensions.get("window").width - 100 }]}>
                  <Text style={{ color: "#162a53", ...gStyle.textBoxme14 }}>
                    {t("screen.module.camera.upload_select")}
                  </Text>
                  <Text
                    style={{
                      color: colors.greyInactive,
                      ...gStyle.textBoxme12,
                    }}
                  >
                    PNG , JPG or MP4, MOV
                  </Text>
                </View>
              </TouchableOpacity>
              <View
                style={{
                  position: "absolute",
                  width: "100%",
                  paddingVertical: 15,
                  bottom: device.iPhoneNotch ? 4 : 10,
                }}
              >
                <TextInputComponent
                  navigation={navigation}
                  labeView={true}
                  autoFocus={false}
                  showSearch={false}
                  showScan={false}
                  numberOfLines={4}
                  multiline={true}
                  heightInput={60}
                  autoChange={true}
                  onPressCamera={this._onSubmitEditingInputNote}
                  onSubmitEditingInput={this._onSubmitEditingInputNote}
                  textPlaceholder={t("screen.module.camera.staff_note_input")}
                />
                <View style={{ paddingTop: 8 }}>
                  <TextInputComponent
                    navigation={navigation}
                    labeView={true}
                    autoFocus={false}
                    autoChange={true}
                    textLabel={`${text_label} ${code_scan}`}
                    onPressCamera={this._onSubmitEditingInput}
                    onSubmitEditingInput={this._onSubmitEditingInput}
                    textPlaceholder={`${text_placeholder}`}
                  />
                </View>
                <TouchableOpacity
                  disabled={!code_scan}
                  style={[styles.bottomButton, { marginTop: 15 }]}
                  onPress={() => this.submitAllAsset()}
                >
                  {!is_loading ? (
                    <Text style={styles.textButton}>
                      {t("screen.module.camera.btn_upload")}{" "}
                      {this.countObjectKey("video")} video ,{" "}
                      {this.countObjectKey("image")} image
                    </Text>
                  ) : (
                    <ActivityIndicator color={colors.white} />
                  )}
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.blockBack}>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => navigation.goBack(null)}
              >
                <Feather color={colors.white} name="arrow-left" size={26} />
              </TouchableOpacity>
            </View>
            {open_camera && (
              <CameraModule
                showModal={open_camera}
                trans={t}
                setModalVisible={() => this.toggleCamera(false)}
                setImage={(result) => this.pickImageByCamera(result.uri)}
              />
            )}
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    );
  }
}

ModalImageBase.propTypes = {
  // required
  navigation: PropTypes.object.isRequired,
  screenProps: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  textButton: {
    textAlign: "center",
    color: colors.white,
    ...gStyle.textBoxme16,
  },
  fileUpload: {
    height: device.iPhoneNotch ? device.width - 250 : device.width - 300,
    width: device.iPhoneNotch ? device.width - 250 : device.width - 300,
    aspectRatio: 1,
  },

  containerCapture: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: device.iPhoneNotch ? 20 : 8,
    borderRadius: 6,
    backgroundColor: colors.boxmeBrand,
    marginVertical: 3,
    paddingVertical: 13,
    marginHorizontal: 3,
  },
  btnUpload: {
    width: "45%",
    backgroundColor: colors.brandPrimary,
    borderColor: colors.brandPrimary,
  },
  textCamera: {
    color: colors.white,
    ...gStyle.textBoxme20,
  },
  bottomButton: {
    justifyContent: "center",
    alignContent: "center",
    width: "92%",
    paddingVertical: 15,
    marginHorizontal: 15,
    borderRadius: 6,
    backgroundColor: colors.boxmeBrand,
  },
  textButton: {
    textAlign: "center",
    color: colors.white,
    ...gStyle.textBoxme16,
  },
  blockBack: {
    position: "absolute",
    width: "100%",
    left: 20,
    top: device.iPhoneNotch ? 50 : 30,
  },
});

export default ModalImageBase;
