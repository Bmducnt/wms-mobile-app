import * as React from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  FlatList,
  Alert,
  Switch,
  Dimensions,
  ScrollView,
  SafeAreaView,
  ActivityIndicator
} from "react-native";
import LottieView from 'lottie-react-native';
import moment from "moment";
import { 
  TabView, 
  SceneMap, 
  TabBar 
} from "react-native-tab-view";
import * as ImagePicker from "expo-image-picker";
import { 
  Image as Imagecompressor 
} from "react-native-compressor";
import { 
  Feather 
} from "@expo/vector-icons";
import { 
  colors, 
  gStyle, 
  device
 } from "../constants";
import {
  handleSoundScaner,
  permissionDenied,
  handleSoundOkScaner,
} from "../helpers/async-storage";
import LineParcelShipment from "../components/LineParcelShipment";
// components
import ScreenHeader from "../components/ScreenHeader";
import getDetailShipmentCode from "../services/putaway/received";
import confirmReceivedInbound from "../services/putaway/received-inbound-put";
import CameraModule from "../components/CameraModule";
import EmptySearch from "../components/EmptySearch";
import ScanDocument from "../components/ScanDocument";
import ButtonInbound from "../components/ButtonInbound";

import { serviceUploadAsset } from "../helpers/upload-base";

class ModelReceivedShipment extends React.Component {
  constructor() {
    super();
    this.state = {
      code_scan: null,
      is_loading: false,
      status_flow: 0,
      total_box: 0,
      total_item: 0,
      shipment_id: null,
      open_camera: false,
      is_reject_goods : 0,
      address_info: [],
      created_date: null,
      is_priority: false,
      is_unloaded: false,
      is_co_inspection: false,
      data: [],
      index: 0,
      is_scan: false,
      list_asset: [],
      routes: [],
    };
    this.toggleCamera = this.toggleCamera.bind(this);
  }

  UNSAFE_componentWillMount = async () => {
    const { t } = this.props.screenProps;
    this.setState({
      routes: [
        { key: "info", title: t("screen.module.inbound.tab_info") },
        { key: "box", title: t("screen.module.inbound.tab_box") },
      ],
    });
  };


  setIndex = async (index_tab) => {
    this.setState({ index: index_tab });
  };

  toggleCamera() {
    this.setState((prev) => ({
      open_camera: !prev.open_camera,
    }));
  }

  setModalVisibleScan = async () => {
    this.setState((prev) => ({
      is_scan: !prev.is_scan,
    }));
  };

  pickImageorVideo = async () => {
    const { t } = this.props.screenProps;
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
      this.commitAssetToServer(resultcompress);
    }
    this.setState({ is_loading: false });
  };

  _onSubmitEditingInput = async (code) => {
    if (code) {
      this.setState({ code_scan: code });
      this._fetchDetailShipment(code);
    }
  };

  imageCompress = async (path) => {
    const resultcompress = await Imagecompressor.compress(path, {
      compressionMethod: "auto",
    });
    this.commitAssetToServer(resultcompress);
  };

  commitAssetToServer = async (assetPath) => {
    this.setState({ is_loading: true });
    await serviceUploadAsset(assetPath, this.state.code_scan, null, 3,0,false);
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

  _fetchDetailShipment = async (code) => {
    this.setState({ is_loading: true });
    const response = await getDetailShipmentCode(code);
    if (response.status === 200) {
      if(response.data.results.status.status_id === 300){
        handleSoundOkScaner();
        this.setState({
          data: response.data.results.parcels,
          shipment_id: response.data.results.shipment_id,
          is_priority: response.data.results.is_priority,
          is_co_inspection: response.data.results.is_co_inspection,
          status_flow: response.data.results.status.status_id,
          total_box: response.data.results.parcels.length,
          total_item: response.data.results.quantity,
          address_info: response.data.results.address,
          created_date: response.data.results.created_date,
          is_reject_goods : response.data.results.is_reject_goods
        });
      }else{
        handleSoundScaner();
      }
      
    } else if (response.status === 403) {
      permissionDenied(this.props.navigation);
    } else {
      handleSoundScaner();
    }
    this.setState({ is_loading: false });
  };

  _confirmReceivedInbound = async () => {
    const { t } = this.props.screenProps;
    if (this.state.list_asset.length < 3) {
      Alert.alert(
        "",
        t("screen.module.inbound.upload_alert"),
        [
          {
            text: t("base.confirm"),
            onPress: () => null,
          },
        ],
        { cancelable: false }
      );
    } else {
      Alert.alert(
        "",
        t("screen.module.inbound.text_confirm_accept"),
        [
          {
            text: t("base.confirm"),
            onPress: () => {
              this._fetchUpdateInbound(301);
            },
          },
          {
            text: t("screen.module.product.move.btn_cancel"),
            onPress: null,
          },
        ],
        { cancelable: false }
      );
    }
  };

  _confirmNotReceivedInbound = async () => {
    const { t } = this.props.screenProps;
    Alert.alert(
      "",
      t("screen.module.inbound.text_confirm_cancell"),
      [
        {
          text: t("base.confirm"),
          onPress: () => {
            this._fetchUpdateInbound(302);
          },
        },
        {
          text: t("screen.module.product.move.btn_cancel"),
          onPress: null,
        },
      ],
      { cancelable: false }
    );
  };

  _fetchUpdateInbound = async (status_id) => {
    this.setState({ is_loading: true });
    const { t } = this.props.screenProps;
    const response = await confirmReceivedInbound(
      this.state.shipment_id,
      JSON.stringify({
        is_unloaded: this.state.is_unloaded,
        note: null,
        overpack_code: null,
        status: status_id,
      })
    );
    if (response.status === 200) {
      handleSoundOkScaner();
      this.setState({ status_flow: status_id });
      Alert.alert(
        "",
        t("screen.module.putaway.text_ok"),
        [
          {
            text: t("base.confirm"),
            onPress: () => {
              this.props.navigation.goBack(null);
            },
          },
        ],
        { cancelable: false }
      );
    } else if (response.status === 403) {
      permissionDenied(this.props.navigation);
    } else {
      handleSoundScaner();
    }
    this.setState({ is_loading: false });
  };

  shipmentInfoBox = ({}) => {
    const { t } = this.props.screenProps;
    return (
      <SafeAreaView style={gStyle.flex1}>
        <ScrollView contentContainerStyle={[gStyle.flex1, gStyle.pB80]}
            showsVerticalScrollIndicator={true}
            contentInset={{bottom: 80}}
            style={[gStyle.container]}>
          <View style={{marginHorizontal:10}}>
            <View>
              <View
                style={{
                  paddingHorizontal: 6,
                }}
              >
                <View
                  style={[
                    gStyle.flexRowSpace,
                    { paddingVertical: 3, paddingTop: 10 },
                  ]}
                >
                  <Text style={styles.textLabel}>
                    {t("screen.module.inbound.tracking_code")}
                  </Text>
                  <Text style={[styles.textValue, { color: colors.white }]}>
                    {this.state.code_scan}
                  </Text>
                </View>
              </View>
              <View
                style={{ height: 1, backgroundColor: colors.borderLight,marginHorizontal:10  }}
              />
              <View
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 6,
                }}
              >
                <View style={gStyle.flexRowSpace}>
                  <Text style={[styles.textLabel]}>
                    {t("screen.module.inbound.box_quantity_list")}
                  </Text>
                  <Text
                    style={[
                      styles.textValue,
                      { color: colors.white, ...gStyle.textBoxmeBold16 },
                    ]}
                  >
                    {this.state.total_box}
                  </Text>
                </View>
                <View style={gStyle.flexRowSpace}>
                  <Text style={[styles.textLabel]}>
                    {t("screen.module.inbound.box_quantity_item")}
                  </Text>
                  <Text
                    style={[
                      styles.textValue,
                      { color: colors.white, ...gStyle.textBoxmeBold16 },
                    ]}
                  >
                    {this.state.total_item}
                  </Text>
                </View>
              </View>
              <View
                style={{ height: 1, backgroundColor: colors.borderLight,marginHorizontal:10 }}
              />

              <View
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 6,
                }}
              >
                <View style={gStyle.flexRowSpace}>
                  <Text style={styles.textLabel}>
                    {t("screen.module.inbound.sender_name")}
                  </Text>
                  <Text style={[styles.textValue, { color: colors.white }]}>
                    {this.state.address_info[0].from_user_name}
                  </Text>
                </View>
                <Text style={styles.textLabel}>
                  {t("screen.module.inbound.sender_address")}
                </Text>
                <View style={gStyle.flexRow}>
                  <Text
                    style={[
                      styles.textValue,
                      { ...gStyle.textBoxme14, paddingTop: 3 },
                    ]}
                  >
                    {this.state.address_info[0].from_user_address}
                  </Text>
                </View>
              </View>
              {this.state.is_priority && (
                <View
                  style={[
                    gStyle.flexRowCenterAlign,
                    {
                      marginHorizontal: 6,
                      marginVertical: 5,
                      backgroundColor: colors.cardLight,
                      paddingVertical: 13,
                      paddingLeft: 10,
                      borderRadius: 3,
                    },
                  ]}
                >
                  <Feather
                    name="alert-triangle"
                    size={16}
                    color={colors.boxmeBrand}
                  />
                  <Text
                    style={{
                      color: colors.boxmeBrand,
                      ...gStyle.textBoxmeBold14,
                      paddingLeft: 6,
                    }}
                  >
                    {t("screen.module.inbound.shipment_urgert")}
                  </Text>
                </View>
              )}
              {this.state.is_reject_goods === 1 && (
                <View
                  style={[
                    gStyle.flexRowCenterAlign,
                    {
                      marginHorizontal: 6,
                      marginVertical: 5,
                      backgroundColor: colors.cardLight,
                      paddingVertical: 13,
                      borderRadius: 3,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: colors.boxmeBrand,
                      ...gStyle.textBoxme14,
                      paddingHorizontal: 6,
                    }}
                  >
                    {t("screen.module.inbound.shipment_goods_reject")}
                  </Text>
                </View>
              )}
              <View
                style={[
                  gStyle.flexRowSpace,
                  {
                    marginHorizontal: 6,
                    marginVertical: 4,
                    backgroundColor: colors.cardLight,
                    paddingVertical: 8,
                    paddingHorizontal: 10,
                    borderRadius: 3,
                  },
                ]}
              >
                <Text style={styles.textLabel}>{t("screen.module.inbound.co_inspection")}</Text>
                <Switch
                  style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                  value={this.state.is_co_inspection}
                />
              </View>

              <View
                style={[
                  gStyle.flexRowSpace,
                  {
                    marginHorizontal: 6,
                    marginVertical: 4,
                    backgroundColor: colors.cardLight,
                    paddingVertical: 8,
                    paddingHorizontal: 10,
                    borderRadius: 3,
                  },
                ]}
              >
                <Text style={styles.textLabel}>{t("screen.module.inbound.is_unload")}</Text>
                <Switch
                  style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                  value={this.state.is_unloaded}
                />
              </View>

              <View
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 6,
                }}
              >
                <View style={gStyle.flexRowSpace}>
                  <Text style={styles.textLabel}>
                    {t("screen.module.inbound.journey_created")}
                  </Text>
                  <Text style={[styles.textValue, { color: colors.white }]}>
                    {moment(this.state.created_date).fromNow()}
                  </Text>
                </View>
              </View>
              <View
                style={{ height: 1, backgroundColor: colors.borderLight ,marginHorizontal:5}}
              />
              <View style={gStyle.flexCenter}>
                <Text
                  style={{ color: colors.greyInactive, paddingVertical: 5 }}
                >
                  {" "}
                  {t("screen.module.inbound.shipment_text_alert")}
                </Text>
              </View>
              <ButtonInbound 
                icon={"camera"}
                onPress={this.toggleCamera}
                main_text= {t("screen.module.inbound.btn_accept_photo")}
                sub_text= {'camera ...'} 
              />
              <ButtonInbound 
                icon={"file-text"}
                onPress={this.setModalVisibleScan}
                main_text= {t("screen.module.inbound.scan_btn")}
                sub_text= {'pdf ,file'} 
              />
              <ButtonInbound 
                icon={"image"}
                onPress={this.pickImageorVideo}
                main_text= {t("screen.module.camera.upload_select")}
                sub_text= {'png , jpg'} 
              />
              
            </View>
          </View>
          <View style={gStyle.spacer11} />
          <View style={gStyle.spacer11} />
        </ScrollView>
      </SafeAreaView>
    );
  };

  shipmentBoxList = ({}) => {
    const { t } = this.props.screenProps;
    const { navigation } = this.props;
    return (
      <View style={{ flex: 1,marginHorizontal:10}}>
        {this.state.data.length > 0 ? (
          <FlatList
            data={this.state.data}
            keyExtractor={({ overpack_code }) => overpack_code.toString()}
            renderItem={({ item }) => (
              <LineParcelShipment
                navigation={navigation}
                trans={t}
                parcel={{
                  tracking_code: item.tracking_code,
                  status_name: item.status.description,
                  created_date: moment(item.created_date).fromNow(),
                  content: item.content,
                  volume: item.volume,
                  weight: item.weight,
                  quantity: item.quantity,
                }}
              />
            )}
          />
        ) : (
          <EmptySearch t={t} />
        )}
      </View>
    );
  };

  render() {
    const { 
      data, 
      status_flow, 
      open_camera, 
      index, 
      routes, 
      is_scan,
      is_loading } =
      this.state;
    const { t } = this.props.screenProps;
    return (
      <TouchableWithoutFeedback>
        <View style={gStyle.container}>
          <ScreenHeader
            title={t("screen.module.inbound.header")}
            showBack={true}
            iconLeft={"chevron-down"}
            showInput={true}
            inputValueSend={null}
            onPressCamera={this._onSubmitEditingInput}
            onSubmitEditingInput={this._onSubmitEditingInput}
            textPlaceholder={t("screen.module.inbound.input")}
          />
          {is_loading && <ActivityIndicator/>}
          {data.length > 0 ? (
            <TabView
              lazy
              navigationState={{ index, routes }}
              renderScene={SceneMap({
                info: this.shipmentInfoBox,
                box: this.shipmentBoxList,
              })}
              onIndexChange={this.setIndex}
              initialLayout={{ width: Dimensions.get("window").width }}
              renderTabBar={(props) => (
                <TabBar
                  {...props}
                  indicatorStyle={{ backgroundColor: colors.transparent }}
                  style={{
                    backgroundColor: colors.cardLight,
                  }}
                  tabStyle={{ backgroundColor: colors.blackBg, marginTop: -18 }} // here
                  renderLabel={({ route, focused, color }) => (
                    <View style={[gStyle.flexRowCenterAlign]}>
                      {focused && (
                        <View
                          style={{
                            height: 6,
                            width: 6,
                            backgroundColor: colors.yellow,
                            borderRadius: 8 / 2,
                            marginRight: 5,
                          }}
                        />
                      )}
                      <Text
                        style={{ color, ...gStyle.textBoxmeBold14 }}
                        numberOfLines={1}
                      >
                        {route.title}
                      </Text>
                    </View>
                  )}
                />
              )}
            />
          ) : (
            <View style={[gStyle.flexCenter]}><LottieView style={{
              width: 150,
                        height: 100,
            }} source={require('../assets/icons/qr-scan.json')} autoPlay loop />
                      <Text style={{...gStyle.textBoxme14,color:colors.white}}>{t('screen.module.inbound.step1')}</Text>
                  <Text style={{...gStyle.textBoxme14,color:colors.white}}>{t('screen.module.inbound.step2')}</Text>
                  <Text style={{...gStyle.textBoxme14,color:colors.white}}>{t('screen.module.inbound.step3')}</Text> 
            </View>
          )}
          {data.length > 0 && (
            <View style={[styles.containerBottom]}>
              <View style={gStyle.flex1}>
                <View style={[gStyle.flex1, { marginHorizontal: 25 }]}>
                  <View style={[gStyle.flexRowSpace,{paddingVertical:12,}]}>
                    <Text style={[styles.textLabel]}>
                      {t("screen.module.inbound.upload_text")}
                    </Text>
                    <Text
                      style={{
                        color: colors.boxmeBrand,
                        ...gStyle.textBoxmeBold14,
                      }}
                    >
                      {this.state.list_asset.length}/3
                    </Text>
                  </View>
                </View>
                <View style={[gStyle.flexRowCenter]}>
                  <TouchableOpacity
                    disabled={status_flow !== 300}
                    style={[
                      styles.bottomButton,
                      { backgroundColor: colors.boxmeBrand,width:'20%' },
                    ]}
                    onPress={() => this._confirmNotReceivedInbound(302)}
                  >
                    <Text style={styles.textButton} numberOfLines={1}>
                      {t("screen.module.inbound.btn_cancell")}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    disabled={status_flow !== 300}
                    style={[styles.bottomButton]}
                    onPress={() => this._confirmReceivedInbound(301)}
                  >
                    <Text style={styles.textButton} numberOfLines={1}>
                      {t("screen.module.inbound.btn_accept")}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
          {open_camera && (
            <CameraModule
              showModal={open_camera}
              trans={t}
              setModalVisible={() => this.toggleCamera()}
              setImage={(result) => this.imageCompress(result.uri)}
            />
          )}
          {is_scan && (
            <ScanDocument
              t={t}
              setModalVisible={this.setModalVisibleScan}
              onSubmit={this.imageCompress}
            />
          )}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

ModelReceivedShipment.propTypes = {
  // required
  navigation: PropTypes.object.isRequired,
  screenProps: PropTypes.object.isRequired,
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
    bottom: 0,
  },
  bottomButton: {
    width: "66%",
    marginHorizontal: 3,
    paddingVertical: 16,
    borderRadius: 6,
    marginBottom: device.iPhoneNotch ? 25 : 0,
    backgroundColor: colors.darkgreen,
  },
  textButton: {
    textAlign: "center",
    paddingHorizontal: 5,
    color: colors.white,
    ...gStyle.textBoxmeBold14,
  },
});

export default React.memo(ModelReceivedShipment);
