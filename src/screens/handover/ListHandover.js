import * as React from "react";
import PropTypes from "prop-types";
import {
  Animated,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  KeyboardAvoidingView
} from "react-native";
import { Feather,FontAwesome5} from "@expo/vector-icons";
import { colors, device, gStyle } from "../../constants";
import EmptySearch from "../../components/EmptySearch";
// components
import ScreenHeader from "../../components/ScreenHeader";
import TouchIcon from "../../components/TouchIcon";
import {_getTimeDefaultFrom,
  _getTimeDefaultTo,
  _getDatetimeToTimestamp,
  _convertDatetimeToTimestamp} from '../../helpers/device-height';
import ListHandoverItem from "../../components/ListHandoverItem";
import ModelDate from '../../screens/packed/ModelDate';
import OrderHandoverHorizontal from "../../components/OrderHandoverHorizontal";
import { permissionDenied } from "../../helpers/async-storage";
import {translate} from "../../i18n/locales/IMLocalized";

//service api

import ActionButton from 'react-native-action-button';
import getListHandover from "../../services/handover/list";
import getListRMA from "../../services/handover/rma";
import getOrderHandover from "../../services/reports/handover";
import getReportHandover from "../../services/handover/report";

class ListHandover extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      scrollY: new Animated.Value(0),
      isloading: false,
      list_data: [],
      from_time: _getTimeDefaultFrom(),
      to_time: _getTimeDefaultTo(),
      isLoadTime: false,
      page : 1,
      status_id : 2,
      is_handover: true,
      listOrderhandover: [],
      awaiting_handover : 0,
      done_handover : 0,
      total_page : 0,
      isDatePickerVisible: false,
    };
    this._fetchListHandover = this._fetchListHandover.bind(this);
    this._fetchListRMA = this._fetchListRMA.bind(this);
    this._handleLoadMore = this._handleLoadMore.bind(this);
    this._fetchReportHandover = this._fetchReportHandover.bind(this);
  }

  componentDidMount = async () => {
    this.setState({
      is_handover: this.props?.route?.params?.is_handover,
    });
  };

  UNSAFE_componentWillMount = async () => {
    const { navigation } = this.props;
    this._fetchReportHandover();
    if (this.props?.route?.params?.is_handover) {
      this._fetchListHandover("",2);
      this._fetchOrderHandoverHandler();
    } else {
      this._fetchListRMA();
    }
  };

  _onRefresh = async () => {
    this.state.page = 1;
    if (this.props?.route?.params?.is_handover) {
      this.setState({ isloading: true }, () => {
        this._fetchListHandover("");
        this._fetchOrderHandoverHandler();
      });
    } else {
      this.setState({ isloading: true }, () => {
        this._fetchListRMA();
      });
    }
  };

  _fetchOrderHandoverHandler = async () => {
    this.setState({ listOrderhandover: [] });
    const response = await getOrderHandover({
      q: null,
      is_report: 1,
      status: 0,
      type_order: 0,
      from_time: this.state.from_time,
      to_time: this.state.to_time,
    });
    if (response.status === 200) {
      this.setState({ listOrderhandover: response.data.report });
    } else if (response.status === 403) {
      permissionDenied(this.props.navigation);
    }
  };

  _handleLoadMore = () => {
    if (!this.state.isloading) {
      this.state.page = this.state.page + 1; // increase page by 1
      if (this.props?.route?.params?.is_handover) {
        if (parseInt(this.state.total_page) >= parseInt(this.state.page+1)){
          this._fetchListHandover("",this.state.status_id);
        }

      }
    }
  }

  _fetchListHandover = async (code,status_id) => {
    this.setState({ isloading: true, status_id : status_id});
    const response = await getListHandover({
      from_time: this.state.from_time,
      to_time: this.state.to_time,
      q: code,
      status_id : status_id,
      page: this.state.page,
      page_size: 10,
    });
    if (response.status === 200) {
      this.setState({

        list_data: response.data.results,
        total_page:response.data.total_page,
        isloading: false });
    }
    this.setState({ isloading: false });
  };

  _fetchReportHandover = async () => {
    this.setState({ isloading: true});
    const response = await getReportHandover({});
    if (response.status === 200) {
      this.setState({
        isloading: false,
        awaiting_handover : response.data.results.awaiting_handover,
        done_handover : response.data.results.done_handover
      });
    }
    this.setState({ isloading: false });
  };

  _fetchListRMA = async (code) => {
    this.setState({ isloading: true, list_data: [] });
    const response = await getListRMA({
      from_time: this.state.from_time,
      to_time: this.state.to_time,
      q: code,
      page: this.state.page,
      is_pda : 1
    });
    if (response.status === 200) {
      this.setState({
        list_data : this.state.page === 1 ?  response.data.results : [...this.state.list_data, ...response.data.results] , isloading: false });
    }
    this.setState({ isloading: false });
  };


  _openModelTime = async (code) => {
    this.setState((prev) => ({
      isDatePickerVisible: !prev.isDatePickerVisible,
      isLoadTime: code,
    }));
  };

  _onConfirmTime = async (from_time,to_time) => {
    if (!this.state.typeLoad) {
      await this.setState({from_time : from_time,to_time:to_time});
      if (this.state.is_handover) {
        this._fetchListHandover("",2);
        this._fetchOrderHandoverHandler();
      } else {
        this._fetchListRMA("");
      }
    }
    this._openModelTime();

  };

  _searchCameraBarcode = async (code) => {
    if (code) {
      if (this.state.is_handover) {
        this._fetchListHandover(code,2);
      } else {
        this._fetchListRMA(code);
      }
    }
  };

  isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    if (contentSize.height < layoutMeasurement.height){
      return false
    };
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
  }

  findOrderByCarrier = (carrier_name) => {
    const orders = this.state.listOrderhandover;
    const order = orders.find((o) => o.carrier_name === carrier_name);
    return order ? order.totals_orders : 0;
  };



  render() {
    const { navigation } = this.props;
    const {
      isloading,
      isDatePickerVisible,
      list_data,
      from_time,
      to_time,
      is_handover,
      listOrderhandover,
      scrollY,
      awaiting_handover,
      done_handover
    } = this.state;
    const shuffleRange = device.web ? [40, 80] : [40, 80];
    const opacityShuffleBottom = scrollY.interpolate({
      inputRange: shuffleRange,
      outputRange: [0, 1],
      extrapolate: "clamp",
    });

    return (
      <React.Fragment>
        <KeyboardAvoidingView
        style={{ height: '100%', width: '100%' }}
        behavior="padding"
        keyboardVerticalOffset={0}>
          <View style={[gStyle.container]}>
          <View
            style={{ position: "absolute", top: 0, width: "100%", zIndex: 100}}
          >
            <ScreenHeader
              title={is_handover ? translate("screen.module.handover.header") : translate("screen.module.handover.rma_text")}
              showBack={true}
              showInput = {true}
              inputValueSend ={null}
              autoFocus={false}
              onPressCamera={this._searchCameraBarcode}
              onSubmitEditingInput= {this._searchCameraBarcode}
              textPlaceholder={translate("screen.module.handover.text_search")}
             navigation={navigation}/>
          </View>
          <Animated.ScrollView
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: false }
            )}
            refreshControl={
              <RefreshControl
                refreshing={isloading}
                onRefresh={this._onRefresh}
              />
            }
            onMomentumScrollEnd={({nativeEvent}) => {
              if (this.isCloseToBottom(nativeEvent)) {
                this._handleLoadMore();
              }
            }}
            scrollEventThrottle={100}
            showsVerticalScrollIndicator={false}
            stickyHeaderIndices={[1]}
            style={[gStyle.container]}
          >
            <View style={is_handover ? styles.containerBottomScroll:styles.containerScroll}>
            {listOrderhandover && is_handover && !isloading && (
              <View style={{marginLeft:10}}>
                <OrderHandoverHorizontal
                  data={listOrderhandover}
                  heading={translate("screen.module.handoverd.header_text")}
                  on_view={true}
                  tagline=""
                 navigation={navigation}/>
              </View>
            )}
            {isloading && <View style={[gStyle.flexCenter,{marginTop:"30%"}]}><ActivityIndicator animating={true}  style={{opacity:1}} color={colors.white} /></View>}
            {list_data.length === 0 && !isloading &&(
              <EmptySearch />
            )}
            {list_data &&
              list_data.map((item, index) => (
                <ListHandoverItem
                    key={index.toString()}
                    navigation={navigation}
                    logo_carrier={item.courier_logo}
                    warehouse_name = {item.warehouse_id.name}
                    code={item.outbound_code ? item.outbound_code : item.rma_code}
                    is_approved={item.outbound_code ? item.is_approved : true}
                    type_handover={!!item.outbound_code}
                    order_pending = {this.findOrderByCarrier(item.carrier_name)}
                    carrier_name = {item.carrier_name}
                    driver_vehicle={item.driver_vehicle}
                    driver_phone={item.driver_phone}
                    driver_name={item.driver_name}
                    is_verify ={parseInt(item.is_verify)}
                    order_confirm_error = {item?.summary_order_error?.order_confirm}
                    order_not_confirm_error = {item?.summary_order_error?.order_not_confirm}
                    summary_order_error_list = {item.outbound_code ? item?.summary_order_error?.list_tracking : []}
                    total_refuse={item.total_refuse}
                    staff_email={item.created_by.fullname ? item.created_by.fullname :item.created_by}
                    quantity={item.total_items}
                    updated_date = {item.outbound_code ? item.updated_date:item.created_date}
                    time_created={item.created_date}
                  />
              ))
            }
          </View>
          <View style={gStyle.spacer11} />

          </Animated.ScrollView>
          {!is_handover ? (
            <View style={styles.iconRight}>
              <TouchIcon
                icon={<FontAwesome5 name="plus" size={14} color={colors.white}  />}
                onPress={() => navigation.navigate("ModalListCarrier", {})}
                iconSize={18}
              />
            </View>
          ):<View style={styles.iconRight}>
              <TouchIcon
                icon={<Feather color={colors.white} name="filter" />}
                onPress={() => this._openModelTime()}
                iconSize ={20}
              />
            </View>}
          {is_handover && <Animated.View
              style={[gStyle.flexRow,
              {
                marginHorizontal:10,
                position:"absolute",
                bottom:0,
                opacity: opacityShuffleBottom,
                backgroundColor:colors.borderLight
              }]}
            >

              <View style={{width:'100%'}}>

                <TouchableOpacity
                  style={[styles.blockText,{borderTopLeftRadius:3,borderTopRightRadius:3}]}
                  onPress={() => this._fetchListHandover("",0)}
                >
                  {isloading ? <ActivityIndicator animating={true}  style={{opacity:1}} color={colors.white}/>:
                  (<Text style={styles.blockTextLeft}>{awaiting_handover.toLocaleString()}</Text>)}
                  <Text style={styles.blockTextRight}>
                    {translate("screen.module.handoverd.await_handover_status")}
                  </Text>
                </TouchableOpacity>

              </View>
            </Animated.View>}
          <ModelDate
              isVisible = {isDatePickerVisible}
              onClose = {this._openModelTime}
              onSelect = {this._onConfirmTime}
              fromTime = {from_time}
              toTime = {to_time}
          />
          <ActionButton buttonColor={colors.boxmeBrand}
            renderIcon={() => <FontAwesome5 name="plus" size={14} color={colors.white} />}
            buttonTextStyle={{...gStyle.textBoxme26}}
            onPress={() => navigation.navigate("ModalListCarrier", {"handover_type" : is_handover ? 2 : 1})}
          />
        </View>
      </KeyboardAvoidingView>
      </React.Fragment>
    );
  }
}

ListHandover.propTypes = {
  // required
  navigation: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  blockText :{
    padding:13,
    backgroundColor:colors.borderLight,
    flexDirection:"row",
    alignItems:"center",
  },
  blockTextLeft :{
      ...gStyle.textBoxmeBold16,
      color:colors.boxmeBrand
  },
  blockTextRight :{
      marginLeft:5,
      ...gStyle.textBoxme14,
      color:colors.boxmeBrand
  },
  containerLoading: {
    marginTop: 50,
  },
  containerScroll: {
    paddingTop: device.iPhoneNotch ? 105:100,
  },
  containerBottomScroll: {
    paddingTop: device.iPhoneNotch ? 100:100,
    paddingBottom:50
  },
  iconRight: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: 15,
    top: device.iPhoneNotch ? 75 : 55,
    zIndex: 100,
  },
});

export default ListHandover;
