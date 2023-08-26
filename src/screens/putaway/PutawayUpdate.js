import * as React from 'react';
import PropTypes from 'prop-types';
import { Alert, StyleSheet, Text, View,ActivityIndicator,TouchableOpacity } from 'react-native';
import { Feather,MaterialIcons} from '@expo/vector-icons';
import { colors, gStyle } from '../../constants';
// components
import ModalHeader from '../../components/ModalHeader';
import TextInputComponent from '../../components/TextInputComponent';
import Badge from '../../components/Badge';
import {_getTimeDefaultFrom,_getTimeDefaultTo} from '../../helpers/device-height';
import {handleSoundScaner,permissionDenied,handleSoundOkScaner} from '../../helpers/async-storage';

//service api
import getBinFnsku from '../../services/products/bin';
import postPutawayInbound from '../../services/putaway/update_inbound';
import postPutawayPA from '../../services/putaway/update_rma';
import getListPutawayRMA from '../../services/putaway/rma';
import confirmRollbackBinException from '../../services/putaway/reback-bin-put';

class ModalPutawayUpdate extends React.Component {

    //type_putaway
    // putaway ? true : rma
    constructor(props) {
        super(props);
        this.state = {
            box_code: null,
            box_id : null,
            type_putaway: true,
            isloading : false,
            sugget_list_bin : [],
            summary_expire_date :[],
            list_id_commit : [],
            box_info : {},
            fnsku_code : null,
            fnsku_fefo_urgent : false,
            bin_scan : null,
            from_time : _getTimeDefaultFrom(),
            to_time : _getTimeDefaultTo(),
            is_rollback : false,
            storage_type : 0,
            tab_id : null
        };
        this._fetchPostInboundStock = this._fetchPostInboundStock.bind(this);
        this._fetchBinProductHandler = this._fetchBinProductHandler.bind(this);
        this._searchCameraBarcode = this._searchCameraBarcode.bind(this);
        this._onSubmitEditingInput = this._onSubmitEditingInput.bind(this);
        this._fetchPostBinExeption = this._fetchPostBinExeption.bind(this);
    };

    componentDidMount() {
        const { navigation } = this.props;
        this.setState({
            box_code: navigation.getParam('box_code'),
            tab_id: navigation.getParam('tab_id'),
            box_id: navigation.getParam('putaway_id'),
            type_putaway: navigation.getParam('type_putaway'),
            box_info: navigation.getParam('box_info'),
            storage_type: navigation.getParam('storage_type'),
            is_rollback : navigation.getParam('is_rollback'),
            fnsku_code : navigation.getParam('box_info').fnsku_barcode ? navigation.getParam('type_putaway') : null
        });
    };

    componentWillUnmount() {
	};


    UNSAFE_componentWillMount = async () =>{
        const { navigation } = this.props;
        if(navigation.getParam('type_putaway')){
            this._fetchBinProductHandler(navigation.getParam('box_info').fnsku_barcode,navigation.getParam('tab_id'))
        }
    }

    _fetchBinProductHandler = async  (code,type_damaged) =>{
        const response = await getBinFnsku(
            code,{is_sugget_location :1,type_damaged : type_damaged});
        if (response.status === 200){
          this.setState({
            sugget_list_bin:response.data.results,
            fnsku_fefo_urgent : response.data.is_sugget_location
        })
        }else if (response.status === 403){
            permissionDenied(this.props.navigation);
        }else {
            handleSoundScaner();
        };
    };

    _fetchPostInboundStock = async (code,body) =>{
        this.setState({
            isloading : true,
            bin_scan : code
        })
        const { t } = this.props.screenProps;
        const response = await postPutawayInbound(code,body);
        if (response.status === 200){
            handleSoundOkScaner();
            Alert.alert(
                '',
                t('screen.module.putaway.text_ok'),
                [
                  {
                    text: t("base.confirm"),
                    onPress: () => {this.props.navigation.goBack(null)},
                  }
                ],
                {cancelable: false},
            );
        }else if (response.status === 403){
            permissionDenied(this.props.navigation);
        }else {
            this.setState({bin_scan : null});
            handleSoundScaner();
            if (response.data.error_code === 2){
                Alert.alert(
                    '',
                    t('screen.module.putaway.location_fail'),
                    [
                      {
                        text: t("base.confirm"),
                        onPress: null,
                      }
                    ],
                    {cancelable: false},
                );
            }else{
                Alert.alert(
                    '',
                    t('screen.module.putaway.fnsku_fail'),
                    [
                      {
                        text: 'ok',
                        onPress: null,
                      }
                    ],
                    {cancelable: false},
                );
            }
        };
        this.setState({isloading:false});
    };

    _fetchPostBinExeption = async (body) =>{
        this.setState({
            isloading : true
        })
        const { t } = this.props.screenProps;
        const response = await confirmRollbackBinException(body);
        if (response.status === 200){
            handleSoundOkScaner();
            Alert.alert(
                '',
                t('screen.module.putaway.text_ok'),
                [
                  {
                    text: t("base.confirm"),
                    onPress: () => {this.props.navigation.goBack(null)},
                  }
                ],
                {cancelable: false},
            );
        }else if (response.status === 403){
            permissionDenied(this.props.navigation);
        }else {
            this.setState({bin_scan : null});
            handleSoundScaner();
            if (response.data.error_code === 2){
                Alert.alert(
                    '',
                    t('screen.module.putaway.location_fail'),
                    [
                      {
                        text: t("base.confirm"),
                        onPress: null,
                      }
                    ],
                    {cancelable: false},
                );
            }else{
                Alert.alert(
                    '',
                    t('screen.module.putaway.fnsku_fail'),
                    [
                      {
                        text: t("base.confirm"),
                        onPress: null,
                      }
                    ],
                    {cancelable: false},
                );
            }
        };
        this.setState({isloading:false});
    };

    _fetchPutawayPA = async (code,body) =>{
        this.setState({
            isloading : true,
            bin_scan : code,
        })
        const { t } = this.props.screenProps;
        const response = await postPutawayPA(body);
        console.log(response)
        if (response.status === 200){
            handleSoundOkScaner();
            this.setState({
                box_info : {},
                fnsku_code : null,
                fnsku_fefo_urgent : false,
                bin_scan : null,
            });
            Alert.alert(
                '',
                t('screen.module.putaway.text_ok'),
                [
                  {
                    text: t("base.confirm"),
                    onPress: () => {this.state.tab_id === 5 ? this.props.navigation.goBack(null) : null},
                  }
                ],
                {cancelable: false},
            );
        }else if (response.status === 403){
            permissionDenied(this.props.navigation);
        }else {
            this.setState({bin_scan : null});
            handleSoundScaner();
            if (response.data.error_code === 2){
                Alert.alert(
                    '',
                    t('screen.module.putaway.location_fail'),
                    [
                      {
                        text: t("base.confirm"),
                        onPress: null,
                      }
                    ],
                    {cancelable: false},
                );
            }else{
                Alert.alert(
                    '',
                    t('screen.module.putaway.fnsku_fail'),
                    [
                      {
                        text: t("base.confirm"),
                        onPress: null,
                      }
                    ],
                    {cancelable: false},
                );
            }
        };
        this.setState({isloading:false});
    };

    _findFnskuByPA = async (params) => {
        this.setState({
            isloading : true
        })
        const { t } = this.props.screenProps;
        const response = await getListPutawayRMA(params);
        if (response.status === 200){
            if (response.data.results.length > 0){
                this.setState({
                    fnsku_code : response.data.results[0].bsin_info.bsin,
                    summary_expire_date : response.data.results[0].summary_expire_date,
                    box_info : {
                        fnsku_barcode : response.data.results[0].bsin_info.barcode ? response.data.results[0].bsin_info.barcode :response.data.results[0].bsin_info.bsin,
                        quantity_box : response.data.results[0].total_accepts !== 0 ? response.data.results[0].total_accepts : response.data.results[0].total_damageds,
                        fnsku_name : response.data.results[0].bsin_info.name
                    }
                });
                if (response.data.results[0].summary_expire_date.length === 0){
                    this._fetchBinProductHandler(response.data.results[0].bsin_info.bsin,this.state.tab_id);
                }
                
            }else{
                handleSoundScaner();
                Alert.alert(
                    '',
                    t('screen.module.putaway.fnsku_fail'),
                    [
                      {
                        text: t("base.confirm"),
                        onPress: null,
                      }
                    ],
                    {cancelable: false},
                );
            }
        }else if (response.status === 403){
            permissionDenied(this.props.navigation);
        }else{
            handleSoundScaner();
            Alert.alert(
                '',
                t('screen.module.putaway.fnsku_fail'),
                [
                  {
                    text: t("base.confirm"),
                    onPress: null,
                  }
                ],
                {cancelable: false},
            );
        }
        this.setState({isloading:false});
    };


    _searchCameraBarcode = async (code) => {
        const { t } = this.props.screenProps;
        if (code){
            if (this.state.summary_expire_date.length > 0){
                if (this.state.list_id_commit.length === 0){
                    Alert.alert(
                        '',
                        t('screen.module.putaway.putaway_exp_select'),
                        [
                          {
                            text: t("base.confirm"),
                            onPress: null,
                          }
                        ],
                        {cancelable: false},
                    );
                    return;
                }
            }
            if (this.state.type_putaway){
                if (!this.state.is_rollback){
                    this._fetchPostInboundStock(this.state.box_id,
                        JSON.stringify({
                            bin_id: code,
                            fnsku: this.state.box_info.fnsku_barcode,
                            putaway_code: this.state.box_code
                    }));
                }else{
                    this._fetchPostBinExeption(
                        JSON.stringify({
                            bin_id: code,
                            bin_id_picking: this.state.box_code,
                            pickupbox_id: this.state.box_id,
                            quantity : this.state.box_info.quantity_box
                    }));
                }
                
            }else{
                this._fetchPutawayPA(code,JSON.stringify({
                    bin_id: code,
                    fnsku: this.state.fnsku_code,
                    total_putaway : this.state.box_info.quantity_box,
                    pa_code: this.state.box_code,
                    type_damaged : this.state.tab_id,
                    status_id : this.state.tab_id === 'RMA_A' ?  3: 5,
                    list_id_commit : this.state.list_id_commit
                }));
            }
        };
    };

    _onSubmitEditingInput = async (code) => {
        if (code){
            this._findFnskuByPA({
                'q' : this.state.box_code,
                'fnsku' : code,
                'from_time' : this.state.from_time,
                'to_time' : this.state.to_time,
                'type_damaged' : this.state.tab_id,
                'is_damaged' : this.state.tab_id === 'RMA_A' ?  0: 1,
                'v2': 1
            });
        };
    };

    _onSelectExp = async (list_id_commit ,quantity,fnsku_name,fnsku_barcode) =>{
        await this.setState({
            list_id_commit : list_id_commit,
            box_info : {
                quantity_box : quantity,
                fnsku_name : fnsku_name,
                fnsku_barcode :fnsku_barcode,
            }
        })
        this._fetchBinProductHandler(this.state.fnsku_code,this.state.tab_id);
    };


    render() {
        const { navigation } = this.props;
        const { 
            box_code, 
            fnsku_code,
            box_info,
            storage_type,
            sugget_list_bin,
            isloading,
            fnsku_fefo_urgent,
            summary_expire_date,
            list_id_commit,
        } = this.state;
        const { t } = this.props.screenProps;
        return (
            <View style={gStyle.container}>
                <ModalHeader
                    right={<Feather color={colors.white} name="x" />}
                    rightPress={() => navigation.goBack(null)}
                    text={box_code}
                />
                {isloading && <View style={gStyle.p3}><ActivityIndicator/></View>}
                {fnsku_code && <View style={gStyle.p3}>
                    {fnsku_fefo_urgent && <View style={[gStyle.flexRowCenterAlign,{marginBottom:8}]}>
                        <MaterialIcons name="notifications-on" size={14} color={colors.boxmeBrand} />
                        <Text style={{color:colors.boxmeBrand,...gStyle.textBoxme14,paddingLeft : 6}}>{t('screen.module.putaway.near_expiration_date')}
                        </Text>
                    </View>}
                    <View style={[gStyle.flexRowSpace, styles.containerDetails]}>
                        <View style={styles.containerProduct}>
                            <View >
                                <Text style={styles.productMore}>{t('screen.module.putaway.text_fnsku_code')}</Text>
                                <Text style={styles.productName}>{box_info.fnsku_barcode}</Text>
                            </View>
                            <Text numberOfLines={3} style={styles.productInfoName}>{box_info.fnsku_name}</Text>
                            
                        </View>
                        <View style={styles.separator}></View>
                        <View style={gStyle.flexCenter}>
                            <Text style={styles.productMore}>{t('screen.module.putaway.text_quantity')}</Text>
                            <Text style={[styles.productName,{color:colors.white}]}>{box_info.quantity_box}</Text>
                        </View>
                    </View>
                    {summary_expire_date.length > 0 && <View style={[{marginTop:5}]}>
                            <Text style={{color:colors.white,...gStyle.textBoxme14,paddingVertical:5}}>
                                {t('screen.module.putaway.putaway_exp_select')}
                            </Text>
                            {summary_expire_date.map((prop,key) => {
                                return (
                                    <TouchableOpacity
                                        onPress={() => this._onSelectExp(prop.list_id_commit,prop.total_putaway,this.state.box_info?.fnsku_name,this.state.box_info?.fnsku_barcode)}
                                        key={`${prop.expire_date}_${key}`}
                                        style={{
                                            backgroundColor: colors.borderLight,
                                            marginVertical:2,
                                            paddingVertical:6,
                                            paddingHorizontal:8,
                                            borderRadius:3
                                        }}
                                    >
                                            <View style={gStyle.flexRowSpace}>
                                                <View>
                                                    <View style={gStyle.flexRow}>
                                                        <Text style={styles.productMore}>{t('screen.module.putaway.putaway_exp_date')} </Text>
                                                        <Text style={styles.productName}>{prop.expire_date}</Text>
                                                    </View>
                                                    <View style={gStyle.flexRow}>
                                                        <Text style={styles.productMore}>{t('screen.module.putaway.putaway_exp_quantity')} </Text>
                                                        <Text style={styles.productName}>{prop.total_putaway}</Text>
                                                    </View>
                                                </View>
                                                <View style={{
                                                    backgroundColor: list_id_commit === prop.list_id_commit ? colors.boxmeBrand:colors.darkgreen,
                                                    padding:4,
                                                    borderRadius:3,
                                                }}>
                                                    <Text style={{color:colors.white,...gStyle.textBoxme14}}>
                                                        {list_id_commit === prop.list_id_commit ? t('screen.module.putaway.putaway_exp_tick') : 
                                                        t('screen.module.putaway.putaway_exp_tick_not') }
                                                    </Text>
                                                </View>
                                            </View>
                                            
                                    </TouchableOpacity >
                                );
                            })} 
                    </View>}
                    <View style={[gStyle.flexRow,{marginTop:5}]}>
                            {storage_type !== 0 && <Badge
                                name={storage_type ===1 ? t('screen.module.putaway.default_room') : t('screen.module.putaway.cold_room')}
                                style={{
                                    backgroundColor: colors.borderLight,
                                    color: colors.white,
                                    borderRadius: 6
                                }}
                            />}
                            {sugget_list_bin.slice(0, 3).map((prop,key) => {
                                return (
                                    <Badge
                                        key = {key}
                                        name={prop?.location?.location}
                                        style={{
                                        backgroundColor: colors.borderLight,
                                        color: colors.boxmeBrand,
                                        borderRadius: 6
                                    }}
                                    />
                                );
                            })}
                    </View>
                </View>}
                {fnsku_code && <View style={[gStyle.flexRowSpace,{marginLeft:7}]}>
                    <TextInputComponent
                        navigation={navigation}
                        autoFocus={true}
                        textLabel = {t('screen.module.putaway.input_bin')}
                        onPressCamera = {this._searchCameraBarcode}
                        onSubmitEditingInput = {this._searchCameraBarcode}
                        textPlaceholder={t('screen.module.putaway.input_bin')}>
                    </TextInputComponent>
                </View>}
                {!fnsku_code && <View style={[gStyle.flexRowSpace,{marginLeft:7}]}>
                    <TextInputComponent
                        navigation={navigation}
                        is_close={true}
                        autoFocus={true}
                        textLabel = {t('screen.module.putaway.input_fnsku')}
                        onPressCamera = {this._onSubmitEditingInput}
                        onSubmitEditingInput = {this._onSubmitEditingInput}
                        textPlaceholder={t('screen.module.putaway.input_fnsku')}>
                    </TextInputComponent>
                </View>}
            </View>
        );
    }
}

ModalPutawayUpdate.propTypes = {
  // required
  navigation: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
  containerDetails: {
    marginBottom: 3
  },
  containerProduct: {
    width:'70%'
  },
  productName: {
    ...gStyle.textBoxmeBold14,
    color: colors.white
  },
  productInfoName: {
    ...gStyle.textBoxme14,
    color: colors.greyInactive,
  },
  productMore: {
    ...gStyle.textBoxme14,
    color: colors.greyInactive
  },
  separator:{
    borderLeftWidth:2,
    borderColor:colors.white,
    height:20,
    marginTop:5
  },
});
export default ModalPutawayUpdate;
