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
import { Feather } from "@expo/vector-icons";
import { colors, device, gStyle } from "../../constants";

// components
import ScreenHeader from "../../components/ScreenHeader";
import TouchIcon from "../../components/TouchIcon";
import {_getTimeDefaultFrom,
  _getTimeDefaultTo,
  _getDatetimeToTimestamp,
  _convertDatetimeToTimestamp} from '../../helpers/device-height';
import { permissionDenied } from "../../helpers/async-storage";
import ItemInbound from "./ItemInbound";
//service api

import getListInbound from "../../services/inbound/list";


class ListInbound extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollY: new Animated.Value(0),
      isloading: false,
      list_data: [],
      from_time: _getTimeDefaultFrom(),
      to_time: _getTimeDefaultTo(),
      page : 1,
      isDatePickerVisible: false,
    };
  }

  componentDidMount = async () => {
  };

  UNSAFE_componentWillMount = async () => {
    await this._fetchGetListInbound()
  };

  _fetchGetListInbound = async () => {
    this.setState({ isloading: true });
    const response = await getListInbound({
        q: null,
        page: this.state.page,
        status: 0,
        from_time: this.state.from_time,
        to_time: this.state.to_time,
    });
    if (response.status === 200) {
        this.setState({ list_data: response.data.results });
    } else if (response.status === 403) {
        permissionDenied(this.props.navigation);
    }
    this.setState({ isloading: false });
  };

  render() {
    const { navigation } = this.props;
    const {
      isloading,
      isDatePickerVisible,
      scrollY,
      list_data
    } = this.state;
    const { t } = this.props.screenProps;
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
        behavior="height"
        keyboardVerticalOffset={20}>
          <View style={[gStyle.container]}>
          <View
            style={{ position: "absolute", top: 0, width: "100%", zIndex: 100}}
          >
            <ScreenHeader 
              title={'Scan mã nhập kho'} 
              showBack={true}
              showInput = {true}
              inputValueSend ={null}
              autoFocus={false}
              onPressCamera={this._searchCameraBarcode}
              onSubmitEditingInput= {this._searchCameraBarcode}
              textPlaceholder={t("screen.module.handover.text_search")}
            />
          </View>
          <Animated.ScrollView
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: false }
            )}
            scrollEventThrottle={100}
            showsVerticalScrollIndicator={false}
            stickyHeaderIndices={[1]}
            style={[gStyle.container]}
          >
            <View style={styles.containerScroll}>
                {isloading && <ActivityIndicator />}
                {list_data &&
                list_data.map((item, index) => (
                    <ItemInbound
                        key={index.toString()}
                        navigation={navigation}
                        translate={t}
                        inboundItem = {{
                            'time_created': item.time_created,
                            'inspection_type': item.inspection_type,
                            'received_date': item.received_date,
                            'quantity' : item.quantity,
                            'tracking_code' : item.tracking_code,
                            'from_user_name' : item.address.from_user_name,
                            'from_user_phone' : item.address.from_user_phone,
                            'status_id' : item.status__status_id,
                            'weight' : item.weight
                        }}
                    />
                ))
                }
            </View>
          </Animated.ScrollView>
        </View>
      </KeyboardAvoidingView>
      </React.Fragment>
    );
  }
}

ListInbound.propTypes = {
  // required
  navigation: PropTypes.object.isRequired,
  screenProps: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
    containerScroll: {
        paddingTop: device.iPhoneNotch ? 105:80,
    },
});

export default ListInbound;
