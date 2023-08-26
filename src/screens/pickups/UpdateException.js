import * as React from "react";
import PropTypes from "prop-types";
import {
  Alert,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors, gStyle } from "../../constants";

// components
import ModalHeader from "../../components/ModalHeader";
import {
  _getTimeDefaultFrom,
  _getTimeDefaultTo,
} from "../../helpers/device-height";
import {
  handleSoundScaner,
  permissionDenied,
  handleSoundOkScaner,
} from "../../helpers/async-storage";
import FNSKUItems from "../../components/ListFNSKUPickup";

//service api
import getDetailOrderExceptionPickup from "../../services/pickup/exception-detail";
import putItemOutBound from "../../services/pickup/update";
import confirmOrderException from "../../services/pickup/exception";
import { TouchableOpacity } from "react-native-gesture-handler";

class UpdateException extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bin_code: null,
      pickup_box_id: true,
      isloading: false,
      is_show_btn: true,
      tracking_code: null,
      list_fnsku_outbound: [],
    };
    this._fetchBinOutBoundtHandler = this._fetchBinOutBoundtHandler.bind(this);
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.setState({
      tracking_code: navigation.getParam("tracking_code"),
      is_show_btn: navigation.getParam("is_show_btn"),
      pickup_box_id: navigation.getParam("pickup_box_id"),
    });
  }

  UNSAFE_componentWillMount = async () => {
    const { navigation } = this.props;
    this._fetchBinOutBoundtHandler({
      tracking_code: navigation.getParam("tracking_code"),
    });
  };
  _putOrderException = async () => {
    this.setState({ isloading: true });
    const response = await confirmOrderException(
      JSON.stringify({
        tracking_code: this.state.tracking_code,
        pickupbox_id: this.state.pickup_box_id,
        is_confirm: 1,
      })
    );
    if (response.status === 200) {
      handleSoundOkScaner();
      this.props.navigation.goBack(null);
      this.setState({ isloading: false });
    } else if (response.status === 403) {
      permissionDenied(this.props.navigation);
    } else {
      handleSoundScaner();
      this.setState({ isloading: false });
    }
  };

  _onRefresh = async () => {
    this.props.navigation.goBack(null);
  };
  _fetchBinOutBoundtHandler = async (body) => {
    this.setState({ isloading: true });
    const response = await getDetailOrderExceptionPickup(body);
    if (response.status === 200) {
      this.setState({
        list_fnsku_outbound: response.data.results,
      });
    } else if (response.status === 403) {
      permissionDenied(this.props.navigation);
    } else {
      handleSoundScaner();
    }
    this.setState({ isloading: false });
  };

  render() {
    const { navigation } = this.props;
    const { list_fnsku_outbound, isloading, is_show_btn } = this.state;
    const { t } = this.props.screenProps;

    return (
      <View style={gStyle.container}>
        <ModalHeader
          left={<Feather color={colors.greyLight} name="chevron-down" />}
          leftPress={() => this._onRefresh()}
          text={navigation.getParam("tracking_code")}
        />
        {isloading && (
          <View style={gStyle.p3}>
            <ActivityIndicator />
          </View>
        )}
        <Text style={styles.sectionHeading}>
          {t("screen.module.pickup.detail.list_order_return")}
        </Text>
        <View style={styles.containerScroll}>
          <FlatList
            data={list_fnsku_outbound}
            keyExtractor={(item, index) => `${item[0]}` + index}
            renderItem={({ item }) => (
              <FNSKUItems
                navigation={navigation}
                textLabelLeft = {t('screen.module.pickup.detail.fnsku_code')}
                textLabelRight = {t('screen.module.pickup.list.sold')}
                fnsku_info={{
                  code: item.bsin_info.fnsku_barcode
                    ? item.bsin_info.fnsku_barcode
                    : item.bsin_info.fnsku_code,
                  quantity_oubound: item.quantity,
                  fnsku_name: item.bsin_info.fnsku_name,
                  quantity_pick: item.quantity_pick,
                  is_pick: item.quantity_pick === item.quantity ? true : false,
                  activebg: item.activebg ? item.activebg : colors.blackBg,
                  expire_date: null,
                  total_product: 0,
                  bin_id: item.bin_id,
                  box_code: item.box_id,
                }}
                trans={t}
                disableRightSide={true}
              />
            )}
          />
        </View>
        {is_show_btn && (
          <View style={styles.containerBottom}>
            <TouchableOpacity
              style={styles.bottomButton}
              onPress={() => this._putOrderException()}
            >
              <Text style={styles.textButton}>
                {t("screen.module.pickup.detail.status_confirm_order_fail")}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
}

UpdateException.propTypes = {
  // required
  navigation: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  sectionHeading: {
    ...gStyle.textBoxme14,
    color: colors.greyInactive,
    marginBottom: 5,
    marginLeft: 20,
    marginTop: 16,
  },
  containerScroll: {
    paddingBottom: 220,
  },
  containerBottom:{
    position: 'absolute',
    width:'100%',
    bottom: 20
  },
  bottomButton :{
    justifyContent: 'center',
    alignContent:'center',
    width:'92%',
    paddingVertical:13,
    borderRadius:3,
    marginHorizontal:15,
    backgroundColor:colors.boxmeBrand
  },
  textButton :{
      textAlign:'center',
      color:colors.white,
      ...gStyle.textBoxme14,
  }
});
export default UpdateException;
