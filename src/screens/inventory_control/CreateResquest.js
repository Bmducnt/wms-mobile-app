import * as React from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import LottieView from 'lottie-react-native';
import { 
  colors, 
  gStyle, 
  device 
} from "../../constants";
import ListFnskuInventoryBin from "../../components/ListFnskuInventoryBin";
import {
  handleSoundScaner,
  permissionDenied,
  handleSoundOkScaner
} from '../../helpers/async-storage';

// components
import ScreenHeader from "../../components/ScreenHeader";

//service
import getStockBin from "../../services/rack/stock-bin";
import addNewInventoryCheck from "../../services/rack/add-bin-check";

class CreateResquest extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      code_scan: null,
      type_cycle : 2,
      is_loading: false,
      bin_info: {},
      bin_item_stock: [],
    };
    this._fetchDetailLocation = this._fetchDetailLocation.bind(this);
    this._postRequestCheckLocation = this._postRequestCheckLocation.bind(this);
  }

  UNSAFE_componentWillMount = async () =>{
    if (this.props.navigation.getParam("fnsku_code")){
      await this.setState({code_scan : this.props.navigation.getParam("fnsku_code")});
      this._fetchDetailLocation(this.props.navigation.getParam("fnsku_code"));
    };
  }

  _onSubmitEditingInput = async (code) => {
    if (code) {
      this.setState({ code_scan: code });
      this._fetchDetailLocation(code);
    }
  };

  _fetchDetailLocation = async (code) => {
    this.setState({ is_loading: true ,bin_info :{},type_cycle : 2});
    const { t } = this.props.screenProps;
    const response = await getStockBin(JSON.stringify({ location: code }));
    if (response.status === 200) {
      handleSoundOkScaner();
      this.setState({
        bin_info: response.data.results,
        type_cycle : response.data.results.type_cycle,
        bin_item_stock: response.data.results.list_items,
      });
    } else if (response.status === 400) {
      handleSoundScaner();
      if (response.data.error_code === 1){
        Alert.alert(
          "",
          t('screen.module.cycle_check.add.alert_block'),
          [
            {
              text: t("base.confirm"),
              onPress: () => null,
            },
          ],
          { cancelable: false }
        );
      }if (response.data.error_code === 3){
        Alert.alert(
          "",
          t('screen.module.cycle_check.add.alert_block_staff'),
          [
            {
              text: t("base.confirm"),
              onPress: () => null,
            },
          ],
          { cancelable: false }
        );
      }else{
        Alert.alert(
          "",
          t('screen.module.cycle_check.add.alert_empty_bin'),
          [
            {
              text: t("base.confirm"),
              onPress: () => null,
            },
          ],
          { cancelable: false }
        );
      }
      
    } else if (response.status === 403) {
      permissionDenied(this.props.navigation);
    }

    this.setState({ is_loading: false });
  };

  _postRequestCheckLocation = async () => {
    this.setState({ is_loading: true });
    const { t } = this.props.screenProps;
    const response = await addNewInventoryCheck(
      JSON.stringify({
        location: this.state.code_scan,
        type_cycle : this.state.type_cycle,
        cycel_items: this.state.bin_item_stock,
        quantity_stock: this.state.bin_info.total_items,
        total_fnsku: this.state.bin_info.total_fnsku,
      })
    );
    if (response.status === 200) {
      handleSoundOkScaner();
      this.props.navigation.navigate('DetailResquest',{
        'tracking_code' : response.data.results.tracking_code,
        'status_id' : response.data.results.status_id,
        'cycle_code' : response.data.results.cycle_code,
        'cycle_type' : response.data.results.cycle_type,
        'estimated_kpi':response.data.results.estimated_kpi
      });
    } else if (response.status === 403) {
      permissionDenied(this.props.navigation);
    }
    this.setState({ is_loading: false });
  };

  render() {
    const { navigation } = this.props;
    const { bin_info, is_loading, bin_item_stock,type_cycle} = this.state;
    const { t } = this.props.screenProps;
    return (
      <React.Fragment>
        <View style={gStyle.container}>
          <ScreenHeader 
            title={t('screen.module.cycle_check.add.header')}
            showBack={true}
            iconLeft={"chevron-down"}
            autoFocus={true}
            showInput = {true}
            inputValueSend ={null}
            onPressCamera={this._onSubmitEditingInput}
            onSubmitEditingInput= {this._onSubmitEditingInput}
            textPlaceholder={t("screen.module.cycle_check.add.input_location_text")}
          />
          {is_loading && <ActivityIndicator />}
          {type_cycle === 2 && (<View style={[gStyle.flexCenter,{marginHorizontal:15}]}>
                  <LottieView    style={{
                        width: 150,
                        height: 200,
                      }} source={require('../../assets/icons/check-list.json')} autoPlay loop />
                  <View style={[gStyle.flexCenter,{paddingHormarizontal:15}]}>
                    <Text style={{...gStyle.textBoxme14,color:colors.white}}>{t('screen.module.cycle_check.add.helper_text1')}</Text>
                    <Text style={{...gStyle.textBoxme14,color:colors.white}}>{t('screen.module.cycle_check.add.helper_text2')}</Text>
                    <Text style={{...gStyle.textBoxme14,color:colors.white}}>{t('screen.module.cycle_check.add.helper_text3')}</Text>
                  </View>
              </View>
          )}
          {type_cycle !== 2 &&<View style={styles.containerScroll}>
            <View style={[gStyle.flexRowSpace,{marginHorizontal:10}]}>
                <Text
                    style={[
                      styles.sectionHeading,
                      
                    ]}
                    numberOfLines={1}
                  >
                    {t('screen.module.cycle_check.detail.text_list_product')}
                </Text>
            </View>
            {bin_item_stock.length > 0 ?<FlatList
              data={bin_item_stock}
              keyExtractor={(item, index) => `${item[0]}` + index}
              renderItem={({ item }) => (
                <ListFnskuInventoryBin
                  navigation={navigation}
                  fnsku_info={{
                    fnsku_code: item.fnsku_code,
                    fnsku_name: item.fnsku_name,
                    fnsku_uom: item.fnsku_uom,
                    fnsku_image :item.fnsku_image,
                    fnsku_stock_bin: item.fnsku_stock_bin,
                    expire_date: item.expire_date,
                    batch_lot_code: item.batch_lot_code,
                    fnsku_is_batch_control: item.fnsku_is_batch_control,
                    manufacturing_date : item.manufacturing_date,
                    stock_level : item?.stock_level,
                    fnsku_stock_check : 0
                  }}
                  staff_role={1}
                  trans={t}
                  disableRightSide={true}
                />
              )}
            />:
            <View style={styles.helperBox}>
              <Text style={{...gStyle.textBoxme16,color:colors.white}}>
                {t('screen.module.cycle_check.add.alert_empty1')} </Text>
              <Text style={{...gStyle.textBoxme16,color:colors.white}}>
                {t('screen.module.cycle_check.add.alert_empty2')}
              </Text>
              </View>
            }
          </View>}
          {type_cycle !== 2 && (
            <View style={styles.containerBottom}>
              <TouchableOpacity
                style={[styles.bottomButton]}
                onPress={() => this._postRequestCheckLocation()}
              >
                <Text style={styles.textButton}>{t('screen.module.cycle_check.add.btn_add')}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </React.Fragment>
    );
  }
}

CreateResquest.propTypes = {
  // required
  navigation: PropTypes.object.isRequired,
  screenProps: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  helperBox:{
    borderLeftColor:colors.cardLight,
    padding:10,
    marginHorizontal: 10,
    borderLeftWidth:4,
  },
  helperBoxText:{
    color:colors.white,
    ...gStyle.textBoxmeBold14,
  },
  sectionHeading: {
    alignItems: "flex-start",
    paddingVertical: 5,
    color:colors.white,
    ...gStyle.textBoxmeBold14
  },
  containerBody: {
    marginTop: 3,
    borderRadius:6,
    marginHorizontal: 10
  },
  containerScroll: {
    paddingBottom: device.iPhoneNotch ? 220: 180,
    marginHorizontal:3
  },
  stockCard: {
    width: "30%",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal:5,
  },
  stockCardText: {
    ...gStyle.textboxme14,
    color: colors.greyInactive,
  },
  stockCardValue: {
    ...gStyle.textBoxmeBold14,
    color: colors.white,
    paddingTop:5
  },
  containerBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    width: "100%",
    bottom: device.iPhoneNotch ? 25 : 0,
  },
  bottomButton: {
    width: "88%",
    paddingVertical: 13,
    borderRadius: 3,
    backgroundColor: colors.darkgreen,
  },
  textButton: {
    textAlign: "center",
    paddingHorizontal: 5,
    color: colors.white,
    ...gStyle.textBoxmeBold14,
  },
});

export default CreateResquest;
