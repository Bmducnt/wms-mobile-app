import * as React from 'react';
import PropTypes from 'prop-types';
import {
    Alert,
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    FlatList,
    KeyboardAvoidingView,
} from 'react-native';
import { Feather} from '@expo/vector-icons';
import { colors, gStyle } from '../../constants';

// components
import ModalHeader from '../../components/ModalHeader';
import TextInputComponent from '../../components/TextInputComponent';
import {handleSoundScaner,permissionDenied,handleSoundOkScaner} from '../../helpers/async-storage';
import FNSKUItems from '../../components/ListFNSKUPickup';

//service api
import getDetailBinPickup from '../../services/pickup/bin';
import putItemOutBound from '../../services/pickup/update';
import confirmOrderException from '../../services/pickup/exception';
import {translate} from "../../i18n/locales/IMLocalized";

class ModalPickupUpdate extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            bin_code : null,
            bin_code_validate : null,
            is_bin_api : 0,
            pickup_box_id: true,
            isloading : false,
            fnsku_code : null,
            is_box : true,
            is_error : 0,
            is_show_button : true,
            fnsku_quantity_scan : 1,
            list_fnsku_outbound :[]
        };
        this._fetchBinOutBoundtHandler = this._fetchBinOutBoundtHandler.bind(this);
    };

    componentDidMount() {
        const { params } = this.props?.route;
        this.setState({
            pickup_box_id: params?.pickup_box_id,
            bin_code_validate: paramsbin_code,
            is_bin_api: paramsis_bin,
            is_error: paramsis_error_rollback
        });
    };

    _putOrderException = async (is_confirm) => {
        this.setState({isloading:true});
        const response = await confirmOrderException(JSON.stringify({
            bin_id: this.state.bin_code,
            pickupbox_id: this.state.pickup_box_id,
            is_confirm : is_confirm
        }));
        if (response.status === 200){
            handleSoundOkScaner();
            this.props.navigation.goBack(null);
        }else if (response.status === 403){
            permissionDenied(this.props.navigation);
        }else if (response.status === 400){
            Alert.alert(
                '',
                translate('screen.module.pickup.detail.text_confirm_lost_403'),
                [
                  {
                    text: translate("base.confirm"),
                    onPress: () => { null;},
                  }
                ],
                {cancelable: false},
            );
        }else {
            handleSoundScaner();
            this.setState({isloading:false});
        }
    };

    _putBinOutBoundtHandler = async (code_scan) => {
        this.setState({ isloading: true });
        const response = await putItemOutBound(this.state.pickup_box_id, JSON.stringify({
            fnsku: code_scan,
            scan_type: 2,
            bin_id: this.state.bin_code,
            quantity: this.state.fnsku_quantity_scan
        }));
        if (response.status === 200) {
            handleSoundOkScaner();
            const total_pick_done = this.state.list_fnsku_outbound.reduce((accumulator, item) => {
                if (item.bsin_info.fnsku_code === response.data.results?.seller_sku) {
                    return accumulator + item.quantity_pick;
                }
                return accumulator;
            }, 0);
            let total_sold_pick = response.data.results.quantity_pick - total_pick_done;
            this.state.list_fnsku_outbound.forEach((item) => {
                if (
                    item.bsin_info.fnsku_code === response.data.results.seller_sku &&
                  parseInt(item.quantity_pick) !== parseInt(item.quantity) &&
                  total_sold_pick > 0
                ) {
                  if (total_sold_pick <= parseInt(item.quantity - item.quantity_pick)) {
                    item.quantity_pick += total_sold_pick;
                    item.activebg = colors.boxmeBrand;
                    item.idx_sort = 0;
                    total_sold_pick = 0;
                  } else {
                    const sold = item.quantity - item.quantity_pick;
                    item.quantity_pick += sold;
                    item.activebg = colors.boxmeBrand;
                    item.idx_sort = 0;
                    total_sold_pick -= sold;
                  }
                } else {
                    if (item.quantity === item.quantity_pick){
                        item.activebg = colors.brandPrimary;
                        item.idx_sort = 2;
                    }else{
                        item.activebg = colors.greyLight;
                        item.idx_sort = 1;
                    }

                }
            });
            this.state.list_fnsku_outbound.sort(function(a, b) {
                return a.idx_sort - b.idx_sort  ||  a.activebg.localeCompare(b.activebg);
             });
            this._goBackAuto();
        } else if (response.status === 403) {
            permissionDenied(this.props.navigation);
        } else {
            handleSoundScaner();
            if (response?.data?.error === 4) {
                Alert.alert(
                    '',
                    translate('screen.module.pickup.detail.text_confirm_cycle'),
                    [
                        {
                            text: translate("base.confirm"),
                            onPress: () => { null; },
                        }
                    ],
                    { cancelable: false },
                );
            }
        }
        this.setState({ isloading: false });
    };


    _checkBinShowButton = async (list_fnsku) => {
        const isError = list_fnsku.some(item => parseInt(item.is_error) === 1);
        this.setState({is_show_button: !isError});
    };

    _goBackAuto = async () => {
        const isDone = this.state.list_fnsku_outbound.every(item => parseInt(item.quantity_pick) === parseInt(item.quantity));
        if (isDone && this.state.is_error !== 3) {
            this.props.navigation.goBack(null);
        }
    };

    _fetchBinOutBoundtHandler = async  (body) =>{
        if(body.is_bin === 1){
            if (body.bin_id !== body.bin_code_validate){
                handleSoundScaner();
                return;
            }
        }
        this.setState({isloading:true});
        const response = await getDetailBinPickup(body);
        if (response.status === 200){
            if (response.data.data.length > 0){
                if (response?.data?.data[0]['box_id'] !== ''){
                    this.setState({is_box : false})
                }
            }
            this._checkBinShowButton(response.data.data);
            this.setState({
            list_fnsku_outbound:response.data.data})
        }else if (response.status === 403){
            permissionDenied(this.props.navigation);
        }else {
            handleSoundScaner();
        }
        this.setState({isloading:false});
    };


    _searchCameraBarcode = async (code) => {
        if (code){
            this._putBinOutBoundtHandler(code);
        }
    };

    _onSubmitEditingInputBin = async (code) => {
        if (code){
            this.setState({bin_code:code})
            this._fetchBinOutBoundtHandler({
                'pickupbox_id' : this.state.pickup_box_id,
                'bin_id' : code,
                'bin_code_validate': this.state.bin_code_validate,
                'is_bin': this.state.is_bin_api,
                'is_error' : this.state.is_error
            });
        }
    };

    _onSubmitEditingInput = async (code) => {
        if (code){
            await this.setState({fnsku_quantity_scan : code});
        }
    };

    _onRefresh = async () => {
        this.props.navigation.goBack(null);
    };

    _onOutOfstock = async () =>{
        Alert.alert(
            '',
            translate('screen.module.pickup.detail.text_confirm_out_stock'),
            [
              {
                text: translate("base.confirm"),
                onPress: () => { this._putOrderException(0);},
              },
              {
                text: translate('screen.module.product.move.btn_cancel'),
                onPress: null,
              },
            ],
            {cancelable: false},
        );
    };



    render() {
        const { navigation } = this.props;
        const { params } = this.props?.route;
        const {
            list_fnsku_outbound,
            isloading,
            is_show_button
        } = this.state;
        return (
            <KeyboardAvoidingView
                style={{ height: '100%', width: '100%' }}
                behavior="height"
                keyboardVerticalOffset={0}>
                <View style={gStyle.container}>
                    <ModalHeader
                        left={<Feather color={colors.greyLight} name="chevron-down" />}
                        leftPress={() => this._onRefresh()}
                        right={is_show_button && list_fnsku_outbound.length > 0? <Text style={{
                            padding: 3,
                            ...gStyle.textBoxme12,
                            backgroundColor : colors.borderLight,
                            color:colors.boxmeBrand
                        }}>{translate('screen.module.pickup.detail.lost_item')}</Text> : null}
                        rightPress={() => this._onOutOfstock()}
                        text={`${params?.bin_code}`}
                    />
                    {list_fnsku_outbound.length > 0 ? <View style={gStyle.flexRow}>
                        <View style={{width:'30%'}}>
                            <TextInputComponent
                                navigation={navigation}
                                textLabel = {translate('screen.module.pickup.detail.quantity_out')}
                                inputValue = {'1'}
                                keyboardType={'numeric'}
                                autoChange = {true}
                                ediTable={true}
                                showSearch = {false}
                                showScan = {false}
                                onPressCamera = {this._onSubmitEditingInput}
                                onSubmitEditingInput = {this._onSubmitEditingInput}
                                textPlaceholder={''}/>
                        </View>
                        <View style={{width:'70%'}}>
                            <TextInputComponent
                                navigation={navigation}
                                autoFocus={true}
                                showSearch = {false}
                                textLabel = {translate('screen.module.pickup.detail.fnsku_code')}
                                onPressCamera = {this._searchCameraBarcode}
                                onSubmitEditingInput = {this._searchCameraBarcode}
                                textPlaceholder={translate('screen.module.pickup.detail.fnsku_scan')}/>
                        </View>
                    </View>:
                    <View style={{width:'100%'}}>
                        <TextInputComponent
                            navigation={navigation}
                            autoFocus={true}
                            showSearch = {true}
                            textLabel = {translate('screen.module.pickup.detail.bin_scan')}
                            onPressCamera = {this._onSubmitEditingInputBin}
                            onSubmitEditingInput = {this._onSubmitEditingInputBin}
                            textPlaceholder={translate('screen.module.pickup.detail.bin_scan')}/>

                    </View>
                    }
                    {isloading && <View style={gStyle.p3}><ActivityIndicator/></View>}
                    <View style={[gStyle.flexRowCenterAlign,{marginTop : 10}]}>
                        <Text style={styles.sectionHeading}>{translate('screen.module.pickup.detail.fnsku_list')} </Text>
                        <Text style={{...gStyle.textBoxme14,color:colors.white,paddingLeft :3}}>{params?.sold}</Text>
                    </View>
                    <View style={styles.containerScroll}>
                        <FlatList
                            data={list_fnsku_outbound}
                            keyExtractor={(item, index) => `${item[0]}` + index}
                            renderItem={({ item }) => (
                                <FNSKUItems
                                    navigation = {navigation}
                                    textLabelLeft = {translate('screen.module.pickup.detail.fnsku_code')}
                                    textLabelRight = {translate('screen.module.pickup.list.sold')}
                                    fnsku_info={{
                                        code: item.bsin_info.fnsku_barcode ? item.bsin_info.fnsku_barcode : item.bsin_info.fnsku_code,
                                        quantity_oubound: item.quantity,
                                        fnsku_name : item.bsin_info.fnsku_name,
                                        pickup_box_id :params?.pickup_box_id,
                                        quantity_pick:item.quantity_pick,
                                        is_pick :item.quantity_pick === item.quantity,
                                        out_of_stock_action : item.is_error,
                                        total_product : 0,
                                        activebg : item.activebg ? item.activebg : colors.greyLight,
                                        expire_date : null,
                                        box_code : item.box_id,
                                        uom : item?.bsin_info?.fnsku_uom,
                                        condition_goods : item.condition_goods,
                                        idx_sort : item?.idx_sort
                                }}
                                disableRightSide={true}
                                />
                            )}
                        />
                    </View>
                </View>
            </KeyboardAvoidingView>
        );
    }
}

ModalPickupUpdate.propTypes = {
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
    marginLeft: 10,
  },
  textLabel:{
    color:colors.greyInactive,
    ...gStyle.textBoxme16,
  },
  searchPlaceholderText: {
    ...gStyle.textBoxme16,
    color: colors.blackBg
  },
  containerScroll: {
    paddingBottom: 220
  }
});
export default ModalPickupUpdate;
