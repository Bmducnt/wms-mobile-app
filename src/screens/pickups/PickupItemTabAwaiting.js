import * as React from "react";
import {
  View,
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";

import { colors, gStyle } from "../../constants";
import { FontAwesome5 } from "@expo/vector-icons";
import ListPickupItems from "../../components/ListPickupItems";
import {
  _getTimeDefaultFrom,
  _getTimeDefaultTo,
} from "../../helpers/device-height";
import { permissionDenied } from "../../helpers/async-storage";

// mock
import EmptySearch from "../../components/EmptySearch";
//service api
import getListPickup from "../../services/pickup/list";
import getListRulePickup from "../../services/pickup/list-rule";

import { LinearGradient } from "expo-linear-gradient";

class PickupItemTabAwaiting extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      list_pickup: [],
      role_id: 3,
      pickup_rule: null,
    };
    this._isMounted = false;
    this._fetchListPickupHandler = this._fetchListPickupHandler.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    this.willFocusSubscription = this.props.navigation.addListener(
      "willFocus",
      () => {
        this._fetchListRules();
        this._fetchListPickupHandler({
          status: this.props.status_id,
          q: this.props.code !== null ? this.props.code : "",
          is_error: 0,
        });
      }
    );
  }

  UNSAFE_componentWillMount = async () => {
    let staff_info = await AsyncStorage.getItem("staff_profile");
    this.setState({
      role_id: JSON.parse(staff_info).role,
      pickup_rule_total: 0,
    });
    this._fetchListRules();
    this._fetchListPickupHandler({
      status: this.props.status_id,
      q: this.props.code !== null ? this.props.code : "",
      is_error: 0,
    });
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  _fetchListPickupHandler = async (parram) => {
    this.setState({ isloading: true, list_pickup: [] });
    const response = await getListPickup(parram);
    if (response.status === 200) {
      this.setState({ list_pickup: response.data.results });
    } else if (response.status === 403) {
      await permissionDenied(this.props.navigation);
    }
    this.setState({ isloading: false });
  };

  _onRefresh = async () => {
    this.setState({ isloading: true }, () => {
      this._fetchListPickupHandler({
        status: this.props.status_id,
        q: this.props.code !== null ? this.props.code : "",
        is_error: 0,
      });
    });
  };

  _fetchListRules = async () => {
    const response = await getListRulePickup({ key: "by_summary" });

    if (response?.status === 200) {
      this.setState({ pickup_rule: response?.data?.results });
    }
  };

  render() {
    const { list_pickup, isloading, role_id, pickup_rule } = this.state;
    const { t, navigation } = this.props;
    return (
      <View style={[gStyle.container]}>
        {isloading && (
          <View style={[gStyle.flexCenter, { marginTop: "20%" }]}>
            <ActivityIndicator
              animating={true}
              style={{ opacity: 1 }}
              color={colors.white}
            />
          </View>
        )}
        <View>
          {role_id < 3 && !isloading && (
            <LinearGradient
              colors={["#22c1c3", "#fdbb2d"]}
              style={[
                gStyle.flexCenter,
                { paddingVertical: 10, marginHorizontal: 10 },
              ]}
            >
              <TouchableOpacity
                activeOpacity={gStyle.activeOpacity}
                onPress={() => navigation.navigate("PickupRules", {})}
              >
                <Text
                  style={[
                    gStyle.flexRowCenterAlign,
                    {
                      ...gStyle.textBoxme14,
                      color: colors.white,
                      marginVertical: pickup_rule ? 6 : 13,
                    },
                  ]}
                >
                  <FontAwesome5 name="plus" size={14} color={colors.white} />{" "}
                  {t("screen.module.pickup_rule.btn_add")}
                </Text>
                {pickup_rule && (
                  <Text
                    style={[
                      gStyle.flexRowCenterAlign,
                      {
                        ...gStyle.textBoxme14,
                        color: colors.white,
                      },
                    ]}
                  >
                    {t("screen.module.pickup_rule.prioritize")} {pickup_rule}
                  </Text>
                )}
              </TouchableOpacity>
            </LinearGradient>
          )}
          {list_pickup.length === 0 && !isloading && <EmptySearch t={t} />}
          {list_pickup.length > 0 && (
            <FlatList
              data={list_pickup}
              onRefresh={() => this._onRefresh()}
              refreshing={isloading}
              keyExtractor={({ pickupbox_id }) => pickupbox_id.toString()}
              renderItem={({ item }) => (
                <ListPickupItems
                  navigation={navigation}
                  translate={t}
                  itemInfo={{
                    time_created: item.created_date,
                    assigner_by: item.assigner_by.email,
                    assigner_by_avatar: item.assigner_by.avatar,
                    assigner_by_img: item.assigner_by.is_image,
                    created_by: item.created_by.email,
                    created_by_avatar: item.created_by.avatar,
                    created_by_img: item.created_by.is_image,
                    pickup_code: item.pickup_id.pickup_code,
                    part_id: item.part_id,
                    is_open_model: true,
                    is_vas: item?.is_vas ? item?.is_vas : 0,
                    pickup_type: item.pickup_id.pickup_type,
                    pickup_xe: item.pickup_id.pickup_xe,
                    quantity: item.pickup_id.total_items,
                    total_items_pick:
                      item?.part_quantity > 0
                        ? item?.part_quantity
                        : item.total_items_pick,
                    pickup_box_id: item.pickupbox_id,
                    quantity_tracking: item.list_order_id__tracking_code,
                    quantity_bin: item.list_bin_id,
                    quantity_fnsku: item.list_product_id__bsin,
                    tab_value: 1,
                    total_orders_sla: item.total_orders_sla,
                    zone_picking: item.pickup_id.zone_picking,
                    status_id: item.status_id.status_id,
                    pickup_kpi_flat: item.pickup_kpi.is_kpi,
                    pickup_kpi_left: item.pickup_kpi.time_left,
                  }}
                  onPress={this._onUpdate}
                  disableRightSide={false}
                />
              )}
            />
          )}
        </View>
      </View>
    );
  }
}

export default React.memo(PickupItemTabAwaiting);
