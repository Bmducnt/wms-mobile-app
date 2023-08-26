import * as React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather} from '@expo/vector-icons';
import { colors, gStyle } from '../../constants';

// components
import ModalHeader from '../../components/ModalHeader';
import BottomModal from '../../components/BottomModal';
import TextInputComponent from '../../components/TextInputComponent';
import {_getTimeDefaultFrom,_getTimeDefaultTo} from '../../helpers/device-height';
import {handleSoundScaner,permissionDenied,handleSoundOkScaner} from '../../helpers/async-storage';
import FNSKUItems from '../../components/ListFNSKUPickup';

//service api
import putDetailBinInventory from "../../services/rack/update-bin";
import getInfoBinStockCycle from "../../services/rack/find-bsin-cycle";
import findDetailFnskuMove from '../../services/products/find';

class UpdateRequest extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            isloading : false,
            fnsku_code : null,
            tracking_code : null,
            cycle_code : null,
            location_code : null,
            batch_lot_code : null,
            expire_date : 0,
            outbound_type : 0,
            is_batch_control : 0,
            manufacturing_date : 0,
            cycle_type : false,
            openModel : false,
            fnsku_stock_bin : 0,
            email_login : 3,
            fnsku_quantity_scan : 0,
            list_fnsku_outbound : []
        };
        this._putStatusRequestCheckLocation = this._putStatusRequestCheckLocation.bind(this);
        this._findBarcodeService = this._findBarcodeService.bind(this)
    };

    componentDidMount() {
        const { navigation } = this.props;
        this.setState({
          cycle_code: navigation.getParam('cycle_code'),
          tracking_code: navigation.getParam('tracking_code'),
          cycle_type: navigation.getParam('cycle_type'),
          location_code: navigation.getParam('location_code'),
          list_fnsku_outbound : navigation.getParam('bin_item_stock')
        });
    };

    UNSAFE_componentWillMount = async () => {
      let email_login = await AsyncStorage.getItem('staff_profile');
      this.setState({staff_role:JSON.parse(email_login).role});
    };

    _fetchListProductsHandler = async  (code) =>{
      this.setState({isloading:true});
      const response = await getInfoBinStockCycle(code,{
        'cycle_code' : this.state.cycle_code
      });
      if (response.status === 200){
        handleSoundOkScaner();
        this.setState({
          openModel:true,
          fnsku_code :response.data.results.fnsku_bsin,
          outbound_type : response.data.results.outbound_type,
          is_batch_control : response.data.results.is_batch_control,
        });
      }else{
        handleSoundScaner();
      }
      this.setState({isloading:false});
    };

    _findBarcodeService = async  (code,parram) =>{
      const { t } = this.props.screenProps;
      this.setState({isloading:true});
      const response = await findDetailFnskuMove(code,parram);
      if (response.status === 403){
        permissionDenied(this.props.navigation);
      };
      if (response.status === 200){
        handleSoundOkScaner();
        this.setState({location_code:code})
      }else {
        handleSoundScaner();
      }
      this.setState({isloading:false,fnsku_code:null});
    };

    _putStatusRequestCheckLocation = async (code) => {
        this.setState({ is_loading: true });
        const response = await putDetailBinInventory(this.state.cycle_code,
          JSON.stringify({
            status_id: 901,
            fnsku_code : code,
            cycle_type : this.state.cycle_type ? 1 : 0,
            location_code : this.state.location_code,
            quantity_scan : this.state.fnsku_quantity_scan,
            expire_date : this.state.expire_date !== null? this.state.expire_date : 0,
            batch_lot_code : this.state.batch_lot_code,
            manufacturing_date : null,
          })
        );

        if (response.status === 200) {
            handleSoundOkScaner();
            this.props.navigation.goBack(null);
        }
        else if (response.status === 400) {
            handleSoundScaner();
        }
        else if (response.status === 403) {
          permissionDenied(this.props.navigation);
        }
        this.setState({ is_loading: false });
    };

    _onSubmitEditingInputLocation = async (code) => {
      if (code){
        this._findBarcodeService(code,{"location" : code,"is_check_location":1})
      };
    };

    _searchCameraBarcode = async (code) => {
        if (code){
          this._fetchListProductsHandler(code);
        };
    };

    _onSubmitEditingInput = async (code) => {
        const { t } = this.props.screenProps;
        if (code){
            if (code < 0){
              Alert.alert(
                "",
                t('screen.module.cycle_check.add.alert_empty3'),
                [
                  {
                    text: t("base.confirm"),
                    onPress: () => {
                      this.setState({fnsku_quantity_scan : 0})
                    },
                  },
                ],
                { cancelable: false }
              );
            }else{
              await this.setState({fnsku_quantity_scan : code});
            }

        };
    };

    _renderLocationScaner(t,navigation){
      return (
        <View style={gStyle.flexRowCenter}>
            <TextInputComponent
                navigation={navigation}
                autoFocus={true}
                showSearch = {true}
                textLabel = {t('screen.module.cycle_check.update.label_bin_check')}
                onPressCamera = {this._onSubmitEditingInputLocation}
                onSubmitEditingInput = {this._onSubmitEditingInputLocation}
                textPlaceholder={t('screen.module.cycle_check.update.label_bin_check_input')} />
        </View>
      )
    }

    _oncloseModel = async () =>{
      this.setState({openModel:false})
    };

    _onSubmitmodel = async (expire_date,batch_lot_code) =>{
      await this.setState({
        expire_date:expire_date,
        batch_lot_code : batch_lot_code
      });
      const { t } = this.props.screenProps;
      this._oncloseModel();
      if (this.state.fnsku_quantity_scan < 0){
        Alert.alert(
          "",
          t('screen.module.cycle_check.add.alert_empty3'),
          [
            {
              text: t("base.confirm"),
              onPress: () => {
                this.setState({fnsku_quantity_scan : 0})
              },
            },
          ],
          { cancelable: false }
        );
      }else{
        this._putStatusRequestCheckLocation(this.state.fnsku_code);
      }

    }
    _renderHeaderScanner(t,navigation){
      return (
        <View style={gStyle.flexRowCenter}>
            <View style={{width:'100%'}}>
                <TextInputComponent
                    navigation={navigation}
                    autoFocus={true}
                    showSearch = {true}
                    textLabel = {t('screen.module.pickup.detail.fnsku_code')}
                    onPressCamera = {this._searchCameraBarcode}
                    onSubmitEditingInput = {this._searchCameraBarcode}
                    textPlaceholder={t('screen.module.pickup.detail.fnsku_scan')}>
                </TextInputComponent>
            </View>
        </View>
      )
    }
    render() {
        const { navigation } = this.props;
        const {
          list_fnsku_outbound,
          is_loading,
          location_code,
          cycle_type,
          openModel,
          fnsku_code,
          outbound_type,
          staff_role,
          is_batch_control
        } = this.state;
        const { t } = this.props.screenProps;
        return (
            <View style={gStyle.container}>
                <ModalHeader
                left={<Feather color={colors.greyLight} name="chevron-down" />}
                leftPress={() => navigation.goBack(null)}
                text={cycle_type ? location_code : navigation.getParam('tracking_code')}
                />
                {location_code === null && cycle_type ? this._renderLocationScaner(t,navigation) : this._renderHeaderScanner(t,navigation)}
                {is_loading && <View style={gStyle.p3}><ActivityIndicator/></View>}
                <View style={styles.containerScroll}>
                    {list_fnsku_outbound.length > 0 ? <FlatList
                        data={list_fnsku_outbound}
                        keyExtractor={(item, index) => `${item[0]}` + index}
                        renderItem={({ item }) => (
                            <FNSKUItems
                                navigation = {navigation}
                                textLabelLeft = {cycle_type ? t('screen.module.pickup.detail.fnsku_code') :t('screen.module.pickup.list.location')}
                                textLabelRight = {t('screen.module.cycle_check.update.label_quantity')}
                                fnsku_info={{
                                    code: item.fnsku_id.fnsku_barcode ? item.fnsku_id.fnsku_barcode : item.fnsku_id.fnsku_code,
                                    quantity_oubound: [2, 2].includes(staff_role) ? item.quantity : 0,
                                    fnsku_name : item.fnsku_id.fnsku_name,
                                    quantity_pick: item.quantity_check,
                                    total_product : 0,
                                    is_pick : false,
                                    condition_goods : item?.stock_level,
                                    activebg : item.activebg,
                                    expire_date : item.expire_date.substring(0,10),
                                    box_code : null
                            }}
                            trans ={t}
                            disableRightSide={true}
                            />
                        )}
                        />:
                        <View style={{marginHorizontal:15}}>
                          <Text style={{...gStyle.textBoxme16,color:colors.white}}>
                          {t('screen.module.cycle_check.add.alert_empty1')} </Text>
                      </View>}
                </View>
                {openModel && (
                  <BottomModal
                    navigation ={navigation}
                    outboundType ={outbound_type}
                    batchControl ={is_batch_control}
                    t={t}
                    onSetQuantity ={this._onSubmitEditingInput}
                    trackingCode = {fnsku_code}
                    onCloseModel={this._oncloseModel}
                    onSubmit={this._onSubmitmodel}
                    isLoading = {is_loading}
                  />
                )}
            </View>
        );
    }
}

UpdateRequest.propTypes = {
  // required
  navigation: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
  containerDetails: {
    marginBottom: 3
  },
  containerProduct: {
    flex:5,
    alignItems:'center',
    textAlign:'center'
  },
  sectionHeading: {
    ...gStyle.textBoxme14,
    color: colors.greyInactive,
    marginVertical:10,
    marginLeft: 15,
  },
  textLabel:{
    color:colors.greyInactive,
    ...gStyle.textBoxme16,
  },
  searchPlaceholderText: {
    ...gStyle.textBoxme16,
    color: colors.blackBg
  },
  separator:{
    borderLeftWidth:2,
    borderColor:colors.white,
    height:20,
    marginTop:5
  },
  containerScroll: {
    marginTop:20,
    marginHorizontal:10,
    paddingBottom: 220
  }
});
export default UpdateRequest;
