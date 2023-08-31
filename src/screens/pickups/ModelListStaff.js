import * as React from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  Alert,
  View,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Text,
} from "react-native";

import { Feather } from "@expo/vector-icons";
import { colors, gStyle, device } from "../../constants";

// components
import ModalHeader from "../../components/ModalHeader";
import {
  _getTimeDefaultFrom,
  _getTimeDefaultTo,
} from "../../helpers/device-height";
import { permissionDenied } from "../../helpers/async-storage";
import ListCarrierName from "../../components/ListCarrierAtWarehouse";
//service api
import createPickupByStaff from "../../services/pickup/create-pickup";
import getListStaffPickup from "../../services/pickup/list-staff";
import getListZoneStaffPickup from "../../services/pickup/list-zone";
import getListRulePickup from "../../services/pickup/list-rule";
import ModelOptionPickup from "./ModelOptionPickup";
import {translate} from "../../i18n/locales/IMLocalized";

const pickup_option = [
  {
    title: "screen.module.pickup.create.title_b2c",
    data: [
      {
        id: 3,
        icon: "navigation",
        title: "screen.module.pickup.create.ff_now",
        tab: "ff_now",
        colorActive: "#fecc01",
        sub: "screen.module.pickup.create.ff_now_sub",
        key_value: "order_ff",
        is_border: true,
      },
      {
        id: 2,
        icon: "alert-circle",
        title: "screen.module.pickup.create.sugget_sys",
        tab: "kpi",
        colorActive: "#29bca7",
        sub: "screen.module.pickup.create.sugget_sys_sub",
        key_value: "order_kpi",
        is_border: true,
      },
      {
        id: 9,
        icon: "trending-up",
        title: "screen.module.pickup.create.timekpi",
        tab: "sla_fail",
        colorActive: "#29bca7",
        sub: "screen.module.pickup.create.timekpi_sub",
        key_value: "sla_fail",
        is_border: true,
      },
      {
        id: 10,
        icon: "target",
        title: "screen.module.pickup.create.pick_by_order",
        tab: "pick_by_order",
        colorActive: "#fd0d37",
        sub: "screen.module.pickup.create.pick_by_order_sub",
        key_value: "pick_by_order",
        is_border: false,
      },
      {
        id: 11,
        icon: "user",
        title: "screen.module.pickup.create.customize",
        tab: "customize",
        colorActive: "#fd0d37",
        sub: "screen.module.pickup.create.customize_sub",
        key_value: "customize",
        is_border: false,
      },
    ],
  },
  {
    title: "screen.module.pickup.create.title_b2b",
    data: [
      {
        id: 4,
        icon: "truck",
        title: "screen.module.pickup.create.b2b",
        tab: "b2b",
        colorActive: "#45bd63",
        sub: "screen.module.pickup.create.b2b_sub",
        key_value: "order_b2b",
        is_border: false,
      },
    ],
  },
  {
    title: "screen.module.pickup.create.title_damaged",
    data: [
      {
        id: 6,
        icon: "shopping-bag",
        title: "screen.module.pickup.create.over_damaged",
        tab: "damaged_goods",
        colorActive: "#fd0d37",
        sub: "screen.module.pickup.create.over_damaged_sub",
        key_value: "order_damaged",
        is_border: false,
      },
    ],
  },
  {
    title: "screen.module.pickup.create.title_wo",
    data: [
      {
        id: 7,
        icon: "award",
        title: "screen.module.pickup.create.wo_order",
        tab: "wo",
        colorActive: "#fd0d37",
        sub: "screen.module.pickup.create.wo_order_sub",
        key_value: "order_wo",
        is_border: false,
      },
    ],
  },
  {
    title: "screen.module.pickup.create.title_dropship",
    data: [
      {
        id: 8,
        icon: "tag",
        title: "screen.module.pickup.create.dropship_order",
        tab: "dropship",
        colorActive: "#fd0d37",
        sub: "screen.module.pickup.create.dropship_order_sub",
        key_value: "dropship",
        is_border: false,
      },
    ],
  },
];

class ModelListStaff extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      total_pickup: [],
      pickup_pending_code: null,
      list_zone: [],
      order_report: {},
      staff_id: null,
      option_add: null,
      isLoading: false,
      loading_order: false,
      tracking_code: null,
      is_model: false,
      pickup_rule: null,
    };
    this._onSelectOption = this._onSelectOption.bind(this);
    this._fetchListStaffHandler = this._fetchListStaffHandler.bind(this);
  }

  UNSAFE_componentWillMount = async () => {
    this._fetchListZone();
    this._fetchListRules();
  };

  _fetchListRules = async () => {
    const response = await getListRulePickup({ key: "by_summary" });

    if (response?.status === 200) {
      this.setState({ pickup_rule: response?.data?.results });
    }
  };

  _fetchListStaffHandler = async () => {
    this.setState({ loading_order: true });
    const { navigation } = this.props;
    const { params } = this.props?.route;

    const response = await getListStaffPickup({
      from_time: _getTimeDefaultFrom(),
      to_time: _getTimeDefaultTo(),
      zone_picking: this.state.staff_id,
    });
    if (response.status === 200) {
      if (response.data.is_sale && pickup_option.length < 9) {
        pickup_option.unshift({
          id: 10,
          icon: "star",
          title: "screen.module.pickup.create.sale",
          tab: "ff_now",
          colorActive: "#fecc01",
          sub: "screen.module.pickup.create.sale_sub",
          key_value: "order_hero",
        });
      }
      this.setState({
        total_pickup: params?.is_ff_now
          ? 0
          : response.data.results.pickup_pending,
        pickup_pending_code: response.data.results.pickup_pending_code,
        order_report: response.data.reports_order,
      });
    } else if (response.status === 403) {
      permissionDenied(this.props.navigation);
    }
    this.setState({ loading_order: false });
  };

  _fetchListZone = async () => {
    this.setState({ isLoading: true });
    const response = await getListZoneStaffPickup({
      zone: "fetch",
      v2: true,
    });
    if (response.status === 200) {
      this.setState({ list_zone: response.data.report_by_order });
    } else if (response.status === 403) {
      permissionDenied(this.props.navigation);
    }
    this.setState({ isLoading: false });
  };

  _createdPickupHandler = async () => {
    this.setState({ isLoading: true, is_model: false });
    const response = await createPickupByStaff(
      JSON.stringify({
        arr_orders: [],
        is_pda: 1,
        option_add: this.state.option_add,
        assigner_by: 4143,
        zone_picking: this.state.staff_id,
        tracking_code: this.state.tracking_code,
      })
    );
    if (response.status === 200) {
      Alert.alert(
        "",
        translate("screen.module.pickup.create.ok"),
        [
          {
            text: translate("base.confirm"),
            onPress: () => {
              this._onGoback();
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
        translate("screen.module.handover.list_driver_empty"),
        [
          {
            text: translate("base.confirm"),
            onPress: null,
          },
        ],
        { cancelable: false }
      );
    }
    this.setState({ isLoading: false });
  };

  _onSelectStaffPick = async (staff_id) => {
    this.setState({ staff_id: staff_id });
  };

  _confirmCreated = async () => {
    if (!this.state.staff_id) {
      Alert.alert(
        "",
        translate("screen.module.pickup.create.empty_zone"),
        [
          {
            text: translate("base.confirm"),
            onPress: null,
          },
        ],
        { cancelable: false }
      );
      return;
    }
    await this._fetchListStaffHandler();
    await this.setState({ is_model: true });
  };

  _onSelectOption = async (tab_value, tracking_code) => {
    await this.setState({
      option_add: tab_value,
      tracking_code: tracking_code,
    });
    await this._createdPickupHandler();
  };

  _onGoback = async () => {
    this.props.navigation.goBack(null);
  };

  _onCloseModel = async () => {
    await this.setState({ is_model: false });
  };

  render() {
    const { navigation } = this.props;
    const {
      total_pickup,
      staff_id,
      isLoading,
      is_model,
      order_report,
      list_zone,
      pickup_pending_code,
      loading_order,
      pickup_rule,
    } = this.state;
    return (
      <View
        style={[
          gStyle.containerModel,
          is_model ? { backgroundColor: "rgba(0,0,0,0.8)" } : "",
        ]}
      >
        <ModalHeader
          right={<Feather color={colors.white} name="x" />}
          rightPress={() => navigation.goBack(null)}
          text={translate("screen.module.pickup.create.select_zone")}
        />
        <View style={styles.containerScroll}>
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <FlatList
              data={list_zone}
              keyExtractor={({ warehouse_zone }) => warehouse_zone.toString()}
              renderItem={({ item }) => (
                <ListCarrierName
                  navigation={navigation}
                  carrier_name={item.warehouse_zone}
                  courier_id={item.warehouse_zone}
                  is_select={staff_id}
                  text_note1={"screen.module.pickup.create.text_1"}
                  text_note2={"screen.module.staff_report.text2"}
                  text_note3={
                    pickup_rule
                      ? `${translate(
                          "screen.module.pickup_rule.prioritize"
                        )} ${pickup_rule}`
                      : null
                  }
                  quantity={item.total_bin}
                  avarta={true}
                  avarta_name={"zone_pick"}
                  onPress={this._onSelectStaffPick}
                />
              )}
            />
          )}
        </View>
        <View style={styles.containerBottom}>
          {total_pickup > 0 && (
            <View
              style={[
                gStyle.flexCenter,
                { width: "92%", paddingVertical: 13, marginHorizontal: 15 },
              ]}
            >
              <Text
                style={{
                  color: colors.white,
                  ...gStyle.textBoxme14,
                }}
              >
                {translate("screen.module.pickup.create.pickup_full")}{" "}
                {pickup_pending_code}.
              </Text>
              <Text
                style={{
                  color: colors.white,
                  ...gStyle.textBoxme14,
                }}
              >
                {translate("screen.module.pickup.create.pickup_full_de")}
              </Text>
            </View>
          )}
          <TouchableOpacity
            style={[styles.bottomButton]}
            onPress={() => this._confirmCreated()}
          >
            {!loading_order ? (
              <Text style={styles.textButton}>
                {translate("screen.module.pickup.create.btn_create")}
              </Text>
            ) : (
              <ActivityIndicator />
            )}
          </TouchableOpacity>
        </View>
        {is_model && (
          <ModelOptionPickup
            listData={pickup_option}
            listDataReport={order_report}
            onClose={this._onCloseModel}
            onSelect={this._onSelectOption}
          />
        )}
      </View>
    );
  }
}

ModelListStaff.propTypes = {
  // required
  navigation: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  containerScroll: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
    marginBottom: device.iPhoneNotch ? 150 : 110,
  },
  containerBottom: {
    position: "absolute",
    width: "100%",
    bottom: device.iPhoneNotch ? 10 : 0,
  },
  bottomButton: {
    justifyContent: "center",
    alignContent: "center",
    width: "92%",
    paddingVertical: 15,
    marginHorizontal: 15,
    borderRadius: 6,
    backgroundColor: colors.darkgreen,
  },
  textButton: {
    textAlign: "center",
    color: colors.white,
    ...gStyle.textBoxmeBold14,
  },
  labelOption: {
    backgroundColor: colors.borderLight,
    padding: 6,
    marginHorizontal: 3,
    borderColor: colors.borderLight,
    borderWidth: 1,
    borderRadius: 6,
  },
  labelOptionText: {
    ...gStyle.textBoxme14,
    color: colors.white,
  },
});
export default ModelListStaff;
