import * as React from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  FlatList
} from "react-native";
import { colors, gStyle, device } from "../../constants";
import AsyncStorage from '@react-native-community/async-storage';

import {
  permissionDenied,
  handleSoundOkScaner} from '../../helpers/async-storage';
import ListFnskuInventoryBin from "../../components/ListFnskuInventoryBin";
// components
import ScreenHeader from "../../components/ScreenHeader";

//service
import getDetailBinInventory from "../../services/rack/detail-bin";
import putDetailBinInventory from "../../services/rack/update-bin";

class DetailResquest extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      tracking_code: null,
      cycle_code: null,
      is_loading: false,
      cycle_type: false,
      staff_role:3,
      estimated_kpi:true,
      bin_item_stock: [],
    };
    this._fetchDetailLocationService =this._fetchDetailLocationService.bind(this);
    this._putStatusRequestCheckLocation = this._putStatusRequestCheckLocation.bind(this);
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.setState({
      tracking_code: navigation.getParam("tracking_code"),
      cycle_type: navigation.getParam("cycle_type"),
      estimated_kpi : navigation.getParam("estimated_kpi"),
      cycle_code : navigation.getParam("cycle_code")
    });
    this.willFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      () => {
        this._fetchDetailLocationService(
          this.props.navigation.getParam("cycle_code")
        );
      }
    );
  }

  componentWillUnmount() {
    this.willFocusSubscription.remove();
  };

  UNSAFE_componentWillMount = async () => {
    let email_login = await AsyncStorage.getItem('staff_profile');
    this.setState({staff_role:JSON.parse(email_login).role});
  };

  _fetchDetailLocationService = async (code) => {
    this.setState({ is_loading: true });
    const response = await getDetailBinInventory(code, {});
    if (response.status === 200) {
        this.setState({ bin_item_stock:response.data.results});
    } else if (response.status === 403) {
        permissionDenied(this.props.navigation);
    }

    this.setState({ is_loading: false });
  };

  _putStatusRequestCheckLocation = async (code,is_cancel) => {
    this.setState({ is_loading: true });
    const { t } = this.props.screenProps;
    const response = await putDetailBinInventory(code,
      JSON.stringify({
        status_id: 903,
        is_cancel : is_cancel
      })
    );
    if (response.status === 200) {
      handleSoundOkScaner();
      this.props.navigation.goBack(null);
    } else if (response.status === 403) {
      permissionDenied(this.props.navigation);
    }
    this.setState({ is_loading: false });
  };

  render() {
    const { navigation } = this.props;
    const { 
      cycle_code, 
      is_loading, 
      bin_item_stock,
      cycle_type,
      tracking_code,
      estimated_kpi,
      staff_role
    } = this.state;
    const { t } = this.props.screenProps;
    return (
      <React.Fragment>
        <View style={gStyle.container}>
          <View style={styles.containerHeader}>
            <ScreenHeader
              title={ ` ${t('screen.module.cycle_check.detail.detail_code')} ${navigation.getParam("tracking_code")}` }
              showBack={true}
            />
          </View>
          <View style={styles.container}>
            {is_loading && <ActivityIndicator />}
            
          </View>
          <View style={styles.containerScroll}>
            { bin_item_stock.length > 0? <FlatList
              data={bin_item_stock}
              keyExtractor={(item, index) => `${item[0]}` + index}
              renderItem={({ item }) => (
                <ListFnskuInventoryBin
                  navigation={navigation}
                  fnsku_info={{
                    fnsku_code: item.fnsku_id.fnsku_barcode ? item.fnsku_id.fnsku_barcode : item.fnsku_id.fnsku_code,
                    fnsku_location: item.location_id,
                    fnsku_name: item.fnsku_id.fnsku_name,
                    fnsku_uom: item.fnsku_id.fnsku_uom,
                    fnsku_stock_check : item.quantity_check,
                    fnsku_stock_bin: item.quantity,
                    expire_date: item.expire_date,
                    batch_lot_code: item.batch_lot_code,
                    fnsku_is_batch_control: item.fnsku_id.fnsku_is_batch_control,
                    fnsku_image : item.path,
                    stock_level : item?.stock_level,
                    manufacturing_date: item.manufacturing_date,
                  }}
                  staff_role={staff_role}
                  cycle_type = {cycle_type}
                  cycle_code = {cycle_code}
                  cycle_item = {item}
                  tracking_code = {navigation.getParam("tracking_code")}
                  trans={t}
                  disableRightSide={!estimated_kpi ?  false: true}
                />
              )}
            />:
              <View style={styles.helperBox}>
                  <Text style={{...gStyle.textBoxme16,color:colors.white}}>
                  {t('screen.module.cycle_check.add.alert_empty1')} </Text>
              </View>
            }
            </View>
            {estimated_kpi && <View style={styles.containerBottom}>
              <TouchableOpacity
                style={[styles.bottomButton,{backgroundColor:colors.boxmeBrand,width:'20%'}]}
                onPress={() => this._putStatusRequestCheckLocation(this.state.cycle_code,1)}
              >
                <Text style={styles.textButton} numberOfLines={1}>{t('screen.module.cycle_check.detail.btn_reject')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.bottomButton,{marginLeft:3}]}
                onPress={() => this._putStatusRequestCheckLocation(this.state.cycle_code,0)}
              >
                <Text style={styles.textButton} numberOfLines={1}>{t('screen.module.cycle_check.detail.btn_confirm')}</Text>
              </TouchableOpacity>
            </View>}
            {estimated_kpi  && <View style={styles.iconRight}>
                <TouchableOpacity
                  activeOpacity={gStyle.activeOpacity}
                  onPress={() => navigation.navigate('UpdateRequest',{
                    'cycle_code' :cycle_code,
                    'tracking_code' :tracking_code,
                    'cycle_type' : cycle_type,
                    'location_code' : cycle_type ? null : 'N/A',
                    'bin_item_stock' : bin_item_stock
                  })}
                  style={{
                    backgroundColor:colors.borderLight,
                    padding:5
                  }}
                >
                  <Text style={{color:colors.boxmeBrand,...gStyle.textBoxme14}}>{t('screen.module.cycle_check.detail.btn_inspection')}</Text>
                </TouchableOpacity> 
              </View>}
        </View>
      </React.Fragment>
    );
  }
}

DetailResquest.propTypes = {
  // required
  navigation: PropTypes.object.isRequired,
  screenProps: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  containerHeader: {
    position: "absolute",
    top: 0,
    width: "100%",
    zIndex: 100,
  },
  sectionHeading: {
    ...gStyle.textBoxme16,
    color: colors.greyInactive,
    marginTop: 10,
    marginBottom: 5,
    marginLeft: 10,
  },
  container: {
    marginTop: device.iPhoneNotch ? 100 : 100,
    marginHorizontal: 10,
  },
  containerScroll: {
    paddingBottom: device.iPhoneNotch ? 100 : 160,
  },
  helperBox:{
    backgroundColor:colors.borderLight,
    borderLeftColor:colors.boxmeBrand,
    marginTop: 30,
    padding:10,
    marginHorizontal: 15,
    borderLeftWidth:4,
    borderRadius:3
  },
  containerBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    width: "100%",
    bottom: device.iPhoneNotch ? 0 : 0,
    backgroundColor:colors.cardLight,
    paddingTop:8,
  },
  bottomButton: {
    width: "66%",
    paddingVertical: 15,
    borderRadius:6,
    backgroundColor: colors.darkgreen,
  },
  textButton: {
    textAlign: "center",
    paddingHorizontal: 5,
    color: colors.white,
    ...gStyle.textBoxmeBold14,
  },
  iconRight: {
    alignItems: "center",
    height: 28,
    justifyContent: "center",
    position: "absolute",
    right: 5,
    top: device.iPhoneNotch ? 65 : 65,
    width: 100,
    zIndex: 100,
  },
});

export default DetailResquest;
