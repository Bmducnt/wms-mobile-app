import * as React from "react";
import PropTypes from "prop-types";
import {
  Animated,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
  Alert,
  TouchableOpacity
} from "react-native";
import { Feather,Fontisto } from "@expo/vector-icons";
import QRCode from 'react-native-qrcode-svg';

import { colors, device, gStyle,images } from "../../constants";

// components
import ModelFilter from "./ModelFilter";
import ScreenHeader from "../../components/ScreenHeader";
import TouchIcon from "../../components/TouchIcon";
import FNSKUItems from "../../components/ListFNSKUPickup";
import ButtonSwiper from "../../components/ButtonSwiper";

import {
  _getTimeDefaultFrom,
  _getTimeDefaultTo,
} from "../../helpers/device-height";
import {
  handleSoundScaner,
  permissionDenied,
  handleSoundOkScaner,
} from "../../helpers/async-storage";

// mock
import menuPickupDetail from "../../mockdata/menuPickupDetail.json";
import ModelConfirmXE from "./ModelConfirmXE";
import ModelCard from './ModelCard';
//service api
import getDetailPickup from "../../services/pickup/detail";
import putDetailPickup from "../../services/pickup/box-master";
import confirmOrderException from "../../services/pickup/exception";

class PickupDetails extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      scrollY: new Animated.Value(0),
      isloading: false,
      pickup_id: null,
      pickup_box_id: null,
      is_tab: 3,
      is_error: 1,
      is_pick_model_xe : false,
      is_model: false,
      is_model_xe: false,
      is_confirm: false,
      toggle_box: false,
      total_orders_sla:0,
      list_data: [],
    };
  }is_open_model

  componentDidMount() {
    const { navigation } = this.props;
    this.setState({
      pickup_code: navigation.getParam("pickup_code"),
      is_error: navigation.getParam("is_error"),
      is_confirm: navigation.getParam("is_confirm"),
      pickup_box_id: navigation.getParam("pickup_box_id"),
      total_orders_sla: navigation.getParam("total_orders_sla"),
      is_pick_model_xe: navigation.getParam("total_orders") <= 20 ? navigation.getParam("is_open_model") : false,
    });
    this.willFocusSubscription = this.props.navigation.addListener(
      "willFocus",
      () => {
        if (this.state.pickup_box_id) {
          this._fetchDetailPickupHandler(this.state.pickup_box_id, {
            is_tab: this.state.is_tab,
            is_error: navigation.getParam("is_error"),
          });
        }
      }
    );
  }

  componentWillUnmount() {
    this.willFocusSubscription.remove();
  }

  UNSAFE_componentWillMount = async () => {
    this._fetchDetailPickupHandler(
      this.props.navigation.getParam("pickup_box_id"),
      { is_tab: 3, is_error: this.props.navigation.getParam("is_error") }
    );
  };

  _fetchDetailPickupHandler = async (code, parram) => {
    this.setState({
      isloading: true,
      list_data: [],
      is_error: parram["is_error"],
    });
    const response = await getDetailPickup(code, parram);
    if (response.status === 200) {
      const rows = response.data.results.filter((result) => {
        return parseInt(result[1]) !== parseInt(result[2]);
        });
        
      this.setState({ list_data: parram["is_tab"] === 3 ? rows : response.data.results });


    } else if (response.status === 403) {
      permissionDenied(this.props.navigation);
    }
    this.setState({ isloading: false });
  };

  _confirmChangeLocation = async (code, scan_type) => {
    const { t } = this.props.screenProps;
    Alert.alert(
      "",
      t("screen.module.pickup.detail.confirm_change_bin"),
      [
        {
          text: t("base.confirm"),
          onPress: () => {
            this._putBoxDetailPickup(code, scan_type);
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

  _confirmCancellOrder = async (tracking_code) => {
    const { t } = this.props.screenProps;
    Alert.alert(
      "",
      t("screen.module.pickup.detail.text_confirm_lost"),
      [
        {
          text: t("base.confirm"),
          onPress: () => {
            this._putOrderException(4, tracking_code);
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

  _confirmSloveOrder = async (tracking_code) => {
    const { t } = this.props.screenProps;
    Alert.alert(
      "",
      t("screen.module.pickup.detail.text_confirm_packed"),
      [
        {
          text: t("base.confirm"),
          onPress: () => {
            this._putOrderException(5, tracking_code);
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

  _putBoxDetailPickup = async (code, scan_type) => {
    this.setState({ isloading: true });
    const response = await putDetailPickup(
      this.state.pickup_box_id,
      JSON.stringify({
        box_pickup: code,
        bin_id: code,
        scan_type: scan_type,
        pickup_code: this.state.pickup_code,
      })
    );
    const { t } = this.props.screenProps;
    if (response.status === 200) {
      handleSoundOkScaner();
      Alert.alert(
        "",
        t("screen.module.handover.text_ok"),
        [
          {
            text: t("base.confirm"),
            onPress: () => {
              this._fetchDetailPickupHandler(this.state.pickup_box_id, {
                is_tab: 3,
                is_error: this.state.is_error,
              });
            },
          },
        ],
        { cancelable: false }
      );
    } else if (response.status === 403) {
      permissionDenied(this.props.navigation);
    } else {
      Alert.alert(
        "",
        t("screen.module.pickup.detail.box_fail"),
        [
          {
            text: t("base.confirm"),
            onPress: null,
          },
        ],
        { cancelable: false }
      );
    }
    this.setState({ isloading: false });
  };

  _putOrderException = async (is_confirm, tracking_code) => {
    this.setState({ isloading: true });
    const { t } = this.props.screenProps;
    const response = await confirmOrderException(
      JSON.stringify({
        bin_id: null,
        pickupbox_id: this.state.pickup_box_id,
        is_confirm: is_confirm,
        tracking_code: tracking_code,
      })
    );
    if (response.status === 200) {
      Alert.alert(
        "",
        t("base.success"),
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
    } else if (response.status === 400) {
      handleSoundScaner();
      Alert.alert(
        "",
        t("screen.module.pickup.detail.text_confirm_lost_403"),
        [
          {
            text: t("base.confirm"),
            onPress: () => {
              null;
            },
          },
        ],
        { cancelable: false }
      );
    }
    this.setState({ isloading: false });
  };

  _filterByTab = async (tab_value) => {
    this.onCloseModel(false);
    this.setState({ is_tab: tab_value }, () => {
      this._fetchDetailPickupHandler(
        this.props.navigation.getParam("pickup_box_id"),
        {
          is_tab: tab_value,
          is_error: this.props.navigation.getParam("is_error"),
        }
      );
    });
  };

  onToggleBox = (code) =>  {
    this.setState({ is_pick_model_xe: code });
  }

  onCloseModel =  (code) => {
    this.setState({ is_model: code });
  };

  onCloseModelXe = (code) => {
    this.setState({ is_model_xe: code });
  };

  onSubmitPickByXe = async (code) => {
    if (code) {
      this._putBoxDetailPickup(code, 3);
      this.onToggleBox(false);
    }else{
      this.onToggleBox(false);
      handleSoundOkScaner();
    }
    
  };

  _putConfirmOk = async (code) => {
    this.setState({ isloading: true });
    const response = await putDetailPickup(
      this.state.pickup_box_id,
      JSON.stringify({
        scan_type: 5,
        code_xe: code,
      })
    );
    const { t } = this.props.screenProps;
    if (response.status === 200) {
      this.onCloseModelXe(false)
      handleSoundOkScaner();
      Alert.alert(
        "",
        this.state.total_orders_sla === 0 ? 
        t("screen.module.handover.text_ok"):
        `${t("screen.module.handover.sla_text_1")} ${this.state.total_orders_sla} ${t("screen.module.handover.sla_text_2")}`
        ,
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
    }
    this.setState({ isloading: false });
  };

  render() {
    const { navigation } = this.props;
    const { 
      list_data, 
      isloading, 
      is_tab, 
      is_model, 
      is_error, 
      is_confirm,
      is_model_xe,
      pickup_box_id,
      is_pick_model_xe
    } = this.state;
    const { t } = this.props.screenProps;
    return (
      <View style={[gStyle.container]}>
        <View>
          <ScreenHeader
            title={`${t(
              "screen.module.packed.detail.text"
            )} ${navigation.getParam("pickup_code")}`}
            showBack={true}
            showInput={false}
            inputValueSend={null}
            autoFocus={false}
            bgColor={colors.cardLight}
            textPlaceholder={t("screen.module.pickup.detail.box_master")}
          />
          {!is_confirm && (
            <ButtonSwiper
                isLeftToRight={true} // set false to move slider Right to Left
                childrenContainer={{ backgroundColor: 'rgba(255,255,255,0.0)'}}
                slideOverStyle={{backgroundColor:'#c4f8e4',
                  borderBottomLeftRadius:0, 
                  borderBottomRightRadius: 5, 
                  borderTopLeftRadius: 0, 
                  borderTopRightRadius: 5 
                }}
                onEndReached={() => this.onCloseModelXe(true)}
                isOpacityChangeOnSlide={true}
                containerStyle={{
                  margin: 8,
                  backgroundColor: colors.whiteBg,
                  borderRadius: 6,
                  overflow: 'hidden',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                thumbElement={
                  <View style={{
                    width: 45,
                    margin: 4,
                    borderRadius: 5,
                    height: 45,
                    backgroundColor:colors.darkgreen,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Fontisto name="angle-dobule-right" size={20} color={colors.white} />
                  </View>
                }
            >
              <Text >{t("screen.module.pickup.detail.btn_text_confirm")}</Text>
            </ButtonSwiper>
          )}
          {isloading && (
            <View style={[gStyle.flexCenter, { marginTop: "20%" }]}>
              <ActivityIndicator
                animating={true}
                style={{ opacity: 1 }}
                color={colors.white}
              />
            </View>
          )}
        </View>

        {list_data.length === 0 && !isloading && (
          <View style={styles.containerQrcode}>
            <View style={{
              borderWidth:10,
              borderLeftColor:colors.whiteBg,
              borderTopColor:colors.whiteBg,
              borderBottomColor:colors.whiteBg,
              borderRightColor:colors.whiteBg,
              borderRadius:8,
            }}>
                <QRCode
                    value={navigation.getParam('pickup_code')}
                    size={220}
                    logo={images["iconMotify"]}
                    logoSize={64}
                    logoBackgroundColor={colors.transparent}
                />
            </View>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                paddingHorizontal: 20,
                paddingVertical: 5,
                borderRadius: 3,
                marginTop:10
              }}
              onPress={() =>
                navigation.navigate("ModalPickupQRCode", {
                  pickup_code: navigation.getParam("pickup_code"),
                  quantity: navigation.getParam("quantity"),
                  is_query: 0,
                })
              }
            >
              <Feather color={colors.white} name="printer" size={22} />
              <Text style={styles.textBtnPrint}>
                {t("screen.module.pickup.detail.qr_print")}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.containerScroll}>
          <FlatList
            data={list_data}
            keyExtractor={(item, index) => `${item[0]}` + index}
            renderItem={({ item }) => (
              <FNSKUItems
                navigation={navigation}
                fnsku_info={{
                  code: item[0],
                  quantity_oubound: item[1],
                  pickup_box_id: navigation.getParam("pickup_box_id"),
                  quantity_pick: item[2],
                  is_pick: item[1] === item[2] ? true : false,
                  total_product: item[3],
                  expire_date: item[4],
                  is_error: item[5] ? item[5] : false,
                  is_rollback: item[6] ? item[6] : false,
                  expire_date: item[4],
                  box_code: "",
                  is_sugget_location: is_tab === 3 ? true : false,
                  is_show_button: is_tab === 4 ? true : false,
                  is_error_rollback: is_error,
                  is_lost_items: item[7] ? item[7] : false,
                  condition_goods: item[8],
                }}
                trans={t}
                onPressPack={this._confirmSloveOrder}
                onPressLost={this._confirmCancellOrder}
                onChangeLocation={this._confirmChangeLocation}
                disableRightSide={is_tab === 2 || is_tab === 4 ? true : false}
              />
            )}
          />
          <View style={gStyle.spacer11} />
          <View style={gStyle.spacer11} />
        </View>
        <View style={gStyle.iconRight}>
          <TouchIcon
            icon={<Feather color={colors.white} name="filter" />}
            onPress={() => this.onCloseModel(true)}
            iconSize={16}
          />
        </View>
        {is_model && (
          <ModelFilter
            data={menuPickupDetail}
            t={t}
            onClose={this.onCloseModel}
            onCofirm={this._filterByTab}
          />
        )}
        {is_model_xe && <ModelConfirmXE 
                t={t} 
                onClose={this.onCloseModelXe} 
                onSubmit ={this._putConfirmOk} 
                pickup_id ={pickup_box_id} 
                pickup_code ={navigation.getParam("pickup_code")}
                index ={1}
        />}

        {is_pick_model_xe && <ModelCard t={t} onClose={this.onToggleBox} onSubmit={this.onSubmitPickByXe} />}
        {list_data.length > 0 && (
          <View style={styles.containerBottom}>
            <View style={[gStyle.flex1, gStyle.flexCenter]}>
              <View style={gStyle.flexRow}>
                <TouchableOpacity
                  style={{
                    width: "100%",
                    paddingVertical: 15,
                    backgroundColor: colors.darkgreen,
                  }}
                  onPress={() =>
                    navigation.navigate("ModalPickupUpdate", {
                      pickup_box_id: navigation.getParam("pickup_box_id"),
                      bin_code: navigation.getParam("pickup_code"),
                      is_bin: 0,
                      is_error_rollback: is_error,
                    })
                  }
                >
                  <Text style={styles.textButton}>
                    {t("screen.module.pickup.detail.btn_update_pickup")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        <View style={gStyle.spacer11} />
        <View style={gStyle.spacer11} />
        <View style={gStyle.spacer11} />
        <View style={gStyle.spacer11} />
        <View style={gStyle.spacer11} />
        <View style={gStyle.spacer11} />
      </View>
    );
  }
}

PickupDetails.propTypes = {
  // required
  navigation: PropTypes.object.isRequired,
  screenProps: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  containerQrcode: {
    marginTop: "15%",
    alignItems: "center",
  },
  containerScroll: {
    paddingTop: device.iPhoneNotch ? 5 : 0,
    paddingBottom: device.iPhoneNotch ? 200 : 130,
  },
  containerBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    width: "100%",
    backgroundColor: colors.blackBg,
    bottom: 0,
  },
  bottomButton: {
    width: "96%",
    paddingVertical: 15,
    marginHorizontal: 2,
    backgroundColor: colors.boxmeBrand,
  },
  textButton: {
    textAlign: "center",
    paddingHorizontal: 5,
    color: colors.white,
    ...gStyle.textBoxmeBold14,
  },
  textBtnPrint: {
    color: colors.white,
    paddingVertical: 5,
    paddingLeft: 10,
  }
});

export default PickupDetails;
