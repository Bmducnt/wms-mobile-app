import * as React from "react";
import PropTypes from "prop-types";
import {
  Animated,
  StyleSheet,
  Switch,
  Text,
  View,
  ActivityIndicator
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { SvgUri } from "react-native-svg";
import { colors, device, gStyle } from "../constants";
// components
import LinearGradient from "../components/LinearGradient";
import LineOrderTracking from "../components/LineOrderTracking";
import TouchIcon from "../components/TouchIcon";
import {
  _getTimeDefaultFrom,
  _getTimeDefaultTo,
} from "../helpers/device-height";

class ListOrderHandover extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view_by_status: true,
      scrollY: new Animated.Value(0),
      isloading: false,
      carrier_name: null,
      carrier_logo: null,
      totals_orders: null,
      list_tracking: [],
    };
    this.toggleViewByStatus = this.toggleViewByStatus.bind(this);
    this.detailOrder = this.detailOrder.bind(this);
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.setState({
      carrier_name: navigation.getParam("carrier_name"),
      carrier_logo: navigation.getParam("carrier_logo"),
      totals_orders: navigation.getParam("totals_orders"),
    });
  }

  UNSAFE_componentWillMount = async () => {
    const { navigation } = this.props;
    this._fetchListOrderHandler({
      carrier_name: navigation.getParam("carrier_name"),
      type: 1,
      status: 2,
      type_order: 0,
      from_time: _getTimeDefaultFrom(),
      to_time: _getTimeDefaultTo(),
    });
  };

  _fetchListOrderHandler = async (parram) => {
    this.setState({ isloading: true });
    const response = await getOrderHandover(parram);
    if (response.status === 200) {
      this.setState({ list_tracking: response.data.results, isloading: false });
    }
    this.setState({ isloading: false });
  };

  toggleViewByStatus(val) {
    this._fetchListOrderHandler({
      q: "",
      type: 1,
      carrier_name: this.state.carrier_name,
      status:  val === true ? 2: 0,
      type_order: 0,
      from_time: _getTimeDefaultFrom(),
      to_time: _getTimeDefaultTo(),
    });
    this.setState({
      view_by_status: val,
    });
  }

  detailOrder(tracking_code) {
    this.props.navigation.navigate("ModelTimelineTracking", {"tracking_code" : tracking_code,"is_show" : true})
  }

  render() {
    const { navigation } = this.props;
    const {
      view_by_status,
      scrollY,
      list_tracking,
      carrier_name,
      carrier_logo,
      totals_orders,
      isloading,
    } = this.state;
    const stickyArray = device.web ? [] : [0];
    const headingRange = device.web ? [140, 200] : [230, 280];
    const shuffleRange = device.web ? [40, 80] : [40, 80];

    const opacityHeading = scrollY.interpolate({
      inputRange: headingRange,
      outputRange: [0, 1],
      extrapolate: "clamp",
    });

    const opacityShuffle = scrollY.interpolate({
      inputRange: shuffleRange,
      outputRange: [0, 1],
      extrapolate: "clamp",
    });
    const { t } = this.props.screenProps;
    return (
      <View style={gStyle.container}>
        <View style={styles.containerHeader}>
          <Animated.View
            style={[styles.headerLinear, { opacity: opacityHeading }]}
          >
            <LinearGradient fill="#3d4c6c" height={89} ></LinearGradient>
          </Animated.View>
          <View style={styles.header}>
            <TouchIcon
              icon={<Feather color={colors.white} name="chevron-left" />}
              onPress={() => navigation.goBack(null)}
            />
            <Animated.View style={[gStyle.flexRow,{ opacity: opacityShuffle }]}>
              <SvgUri width={25} height={25} uri={carrier_logo} />
              <Text style={styles.headerTitle}>{carrier_name}</Text>
            </Animated.View>
          </View>
        </View>

        <View style={styles.containerFixed}>
          <View style={styles.containerLinear}>
            <LinearGradient fill="#70603b" height={89} ></LinearGradient>
          </View>
          <View style={styles.containerImage}>
            <SvgUri width={148} height={148} uri={carrier_logo} />
          </View>
          <View style={styles.containerTitle}>
            <Text ellipsizeMode="tail" numberOfLines={1} style={styles.title}>
              {carrier_name}
            </Text>
          </View>
          <View style={styles.containerAlbum}>
            <Text style={styles.packingInfo}>
              {t("screen.module.handoverd.await_handover")}
              {` · ${totals_orders}`}
            </Text>
          </View>
        </View>

        <Animated.ScrollView
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          stickyHeaderIndices={stickyArray}
          style={styles.containerScroll}
        >
          <View style={styles.containerSticky}>
            <Animated.View
              style={[
                styles.containerStickyLinear,
                { opacity: opacityShuffle },
              ]}
            ></Animated.View>
          </View>
          <View style={styles.containerOrders}>
            {isloading && <View style={{marginTop:10}}><ActivityIndicator/></View>}
            <View style={styles.row}>
              <Text style={styles.toggleText}>
                {view_by_status
                  ? t("screen.module.handoverd.await_handover")
                  : t("screen.module.handoverd.list_order")}
              </Text>
              <Switch
                onValueChange={(val) => this.toggleViewByStatus(val)}
                value={view_by_status}
              />
            </View>
            {list_tracking &&
              list_tracking.map((track, index) => (
                <LineOrderTracking
                  downloaded={view_by_status}
                  key={index.toString()}
                  onPress={this.detailOrder}
                  t={t}
                  orderData={{
                    tracking_code: track.tracking_code,
                    status_name: track.order_status,
                    badge_color:
                      track.order_status === "Shipped" ? "#34c75a" : "#f99f00",
                    image: track.carrier_tracking_code,
                    created_date: track.created_date,
                    failed_kpi: track.kpi_time_ship[0],
                    failed_time_kpi: track.kpi_time_ship[1],
                    ready_to_ship : track.handover_time[1],
                    logo_hvc : track.carrier_tracking_code,
                    weight : track.weight,
                    total : track.total,
                    box_packed : track.box_packed,
                    handover_scan : track.handover_time[0]

                  }}
                />
              ))}
          </View>
          <View style={gStyle.spacer16} />
        </Animated.ScrollView>
      </View>
    );
  }
}

ListOrderHandover.propTypes = {
  // required

  navigation: PropTypes.object.isRequired,
  screenProps: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  containerHeader: {
    height: 89,
    position: "absolute",
    top: 0,
    width: "100%",
    zIndex: 100,
  },
  headerLinear: {
    height: 89,
    width: "100%",
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: device.iPhoneNotch ? 48 : 24,
    position: "absolute",
    top: 0,
    width: "100%",
  },
  headerTitle: {
    ...gStyle.textBoxmeBold16,
    color: colors.white,
    marginLeft:5,
    textAlign: "center",
    alignContent:"center",
  },
  containerFixed: {
    alignItems: "center",
    paddingTop: device.iPhoneNotch ? 94 : 60,
    position: "absolute",
    width: "100%",
  },
  containerLinear: {
    position: "absolute",
    top: 0,
    width: "100%",
    zIndex: device.web ? 5 : 0,
  },
  image: {
    height: 148,
    marginBottom: device.web ? 0 : 16,
    width: 148,
  },
  containerTitle: {
    marginTop: 10,
    zIndex: device.web ? 20 : 0,
  },
  title: {
    ...gStyle.textBoxmeBold20,
    color: colors.white,
    paddingHorizontal: 24,
    marginBottom: 8,
    textAlign: "center",
  },
  packingInfo: {
    ...gStyle.textBoxme20,
    color: colors.greyInactive,
    marginBottom: 48,
  },
  containerScroll: {
    paddingTop: 89,
  },
  containerSticky: {
    marginTop: device.iPhoneNotch ? 238 : 194,
  },
  containerStickyLinear: {
    top: 0,
    position: "absolute",
    width: "100%",
  },
  containerOrders: {
    alignItems: "center",
    backgroundColor: colors.cardLight,
    borderTopLeftRadius:20,
    borderTopRightRadius:20,
    minHeight: 540,
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    width: "100%",
  },
  toggleText: {
    ...gStyle.textBoxmeBold16,
    color: colors.white,
  },
});

export default ListOrderHandover;
