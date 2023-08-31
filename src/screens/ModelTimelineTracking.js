import * as React from "react";
import PropTypes from "prop-types";
import moment from 'moment';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Animated,
  TouchableOpacity
} from "react-native";
import LottieView from 'lottie-react-native';
import { SvgUri } from "react-native-svg";
import {
  FontAwesome5
} from "@expo/vector-icons";
import Timeline from "react-native-timeline-flatlist";
import { colors, gStyle } from "../constants";
// components
import ScreenHeader from "../components/ScreenHeader";
import getJourneyOrder from "../services/handover/journey-order";
import {handleSoundScaner,permissionDenied} from '../helpers/async-storage';
import {translate} from "../i18n/locales/IMLocalized";


class ModelTimelineTracking extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      code_scan: null,
      scrollY: new Animated.Value(0),
      is_loading: false,
      is_show: false,
      order_info: {},
      boxme_sync : {},
      order_items: [],
      order_sla : [],
      data: []
    };
  }
  _onSubmitEditingInput = async (code) => {
    if (code) {
      this.setState({ code_scan: code });
      this._fetchJourneyOrder(code);
    }
  };

  UNSAFE_componentWillMount = async () => {
    const { params } = this.props?.route;
    this.setState({
      code_scan: params.tracking_code,
      is_show: params.is_show,
    });
    if (params.tracking_code) {
      await this._fetchJourneyOrder(params.tracking_code);
    }

  };

  _fetchJourneyOrder = async (code) => {
    this.setState({ is_loading: true, data: [], order_info: {}, order_items: [] });
    const response = await getJourneyOrder(code);
    if (response.status === 200) {
      const list_datas = response.data?.results?.journey_list.map((element, index) => ({
        time: element.status_id,
        code: element.carrier_tracking_code,
        is_show_table: element?.is_show_table ?? false,
        title: element.staff_email,
        description: element.created_date,
        circleColor: index === 0 ? colors.boxmeBrand : undefined,
        is_show_image : element?.status_code === 116,
        text_show_image: translate("screen.module.handover.btn_photo_handover")
      }));
      this.setState({
        data: list_datas,
        boxme_sync: response.data.results.boxme_sync,
        order_info: response.data.results.order_info,
        order_items: response.data.results.order_items,
      });
    } else if (response.status === 403) {
      permissionDenied(this.props.navigation);
    } else {
      this.setState({ code_scan: null });
      handleSoundScaner();
    }
    this.setState({ is_loading: false });
  };


  openHandoverImage = async () => {
    let handover_code =null;
    this.state.data.forEach((element,i) => {
      if(
        element?.is_show_image
      ){
        handover_code = element?.code
      }
    })
    this.props.navigation.navigate("HandoverImages",{handover_code : handover_code,load_local : false})
  };


  renderDetail(rowData) {
    return (
      <View style={[gStyle.flex1,{marginTop:-10}]}>
        <View style={gStyle.flexRowSpace}>
          <Text style={{...gStyle.textBoxmeBold14,color:colors.white}}>{rowData.time}</Text>
          {rowData.is_show_table &&
          <Text style={{...gStyle.textBoxme14,color:colors.greyInactive}}>{rowData.code}</Text>}
        </View>
        <View stylest={gStyle.flexRowSpace}>
          <View>
            <Text style={{...gStyle.textBoxme14,color:colors.greyInactive}}>
              {rowData.title}</Text>
            <Text style={{...gStyle.textBoxme14,color:colors.greyInactive}}>{rowData.description}</Text>
          </View>
        </View>
        {rowData.is_show_image && <View stylest={gStyle.flexRowSpace}>
            <View style={[gStyle.flexRowSpace,{marginVertical:1}]}>
            <Text style={{...gStyle.textBoxme14,color:colors.darkgreen}}>{rowData.text_show_image}</Text>
          </View>
        </View>}
      </View>
    )
  }


  render() {
    const {
      data,
      is_loading
    } = this.state;
    const { navigation } = this.props;

    return (
      <React.Fragment>
        <KeyboardAvoidingView
          style={{ flex:1,height: "100%", width: "100%"}}
          behavior="padding"
          keyboardVerticalOffset={0}
        >
          <View style={gStyle.container}>
            <ScreenHeader
                title={translate("screen.module.putaway.list")}
                showBack={true}
                isOpenCamera={false}
                iconLeft={"chevron-down"}
                showInput={true}
                autoFocus={false}
                inputValueSend={null}
                onPressCamera={this._onSubmitEditingInput}
                onSubmitEditingInput={this._onSubmitEditingInput}
                textPlaceholder={translate("screen.module.camera.tracking_code")}
               navigation={navigation}/>
            <SafeAreaView>
                {is_loading && <ActivityIndicator />}
                {data.length === 0  ? <View style={[gStyle.flexCenter]}><LottieView style={{
                            width: 150,
                            height: 100,
                          }} source={require('../assets/icons/qr-scan')} autoPlay loop />
                        <Text style={{...gStyle.textBoxmeBold14,color:colors.white}}>{translate('screen.module.pickup.detail.find_tracking')}</Text>
                    <Text style={{...gStyle.textBoxmeBold14,color:colors.white}}>{translate('screen.module.pickup.detail.find_fnsku')}</Text>
                    <Text style={{...gStyle.textBoxmeBold14,color:colors.white}}>{translate('screen.module.pickup.detail.find_location')}</Text>
                </View>
                : (
                  <View style={[{
                    paddingHorizontal: 10}]}>
                    <View style={gStyle.flexRowSpace}>
                      <Text style={[styles.sectionHeading]}>
                        {translate("screen.module.journey.info")}
                      </Text>
                    </View>


                    {this.state.data.length > 0 && (
                      <View style={[gStyle.flexRow,{
                        backgroundColor :colors.transparent,paddingHorizontal:5,paddingVertical:10,borderRadius:6}]}>
                        <View style={styles.image}>
                          <SvgUri
                            width={45}
                            height={45}
                            uri={this.state.order_info.image_courier}
                          />
                        </View>
                        <View style={[styles.blockInfo]}>
                          <View style={gStyle.flexRowSpace}>
                            <Text
                              style={[styles.textCode]}
                              numberOfLines={1}
                              ellipsizeMode="tail"
                            >
                              {this.state.order_info.carrier_name}
                            </Text>
                            <View>
                              <Text style={styles.textRight}>
                                {this.state.order_info.quantity} pcs
                              </Text>
                            </View>
                          </View>
                          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
                            <FontAwesome5 name="barcode" size={16} color={colors.white} />{" "}{this.state.order_info.carrier_tracking_code}
                          </Text>
                        </View>

                      </View>

                    )}
                    <Text style={[styles.sectionHeading]}>
                      {translate("screen.module.journey.header")}
                    </Text>
                    <View style={[gStyle.flexRow, { marginTop: 5,backgroundColor:colors.transparent,padding:5}]}>
                      <Timeline
                        data={this.state.data}
                        titleStyle={{
                          color: colors.greyInactive,
                          marginTop: -10,
                          ...gStyle.textBoxme14,
                        }}
                        onEventPress={this.openHandoverImage}
                        circleColor={colors.greyInactive}
                        lineColor={colors.greyInactive}
                        circleSize={12}
                        innerCircle={"dot"}
                        timeContainerStyle={{ minWidth: 100, flexDirection: "row" }}
                        renderDetail={this.renderDetail}
                        descriptionStyle={{
                          color: colors.white,
                          marginTop: 3,
                          minHeight: 30,
                        }}
                        showTime={false}
                        options={{
                          style: { paddingTop: 5 },
                        }}
                      />
                    </View>
                  </View>
                )}
              </SafeAreaView>
          </View>
          </KeyboardAvoidingView>
      </React.Fragment>
    );
  }
}

ModelTimelineTracking.propTypes = {
  // required
  navigation: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  blockInfo: {
    width: "85%",
    marginLeft: 10,
  },
  sectionHeading: {
    alignItems: "flex-start",
    ...gStyle.textBoxmeBold14,
    color: colors.white,
    marginVertical:8
  },
  textCode: {
    ...gStyle.textBoxmeBold14,
    color: colors.white,
  },
  textValue: {
    ...gStyle.textBoxme16,
    color: colors.white,
    paddingLeft: 10,
  },
  textLabel: {
    ...gStyle.textBoxme14,
    color: colors.greyInactive,
  },
  title: {
    ...gStyle.textBoxme14,
    color: colors.greyInactive,
  },
  textRight: {
    ...gStyle.textBoxmeBold14,
    color: colors.white,
  },
});

export default ModelTimelineTracking;
