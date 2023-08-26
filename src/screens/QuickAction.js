import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  Alert,
  ActivityIndicator
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

import LottieView from 'lottie-react-native';
import {
  Entypo,
  FontAwesome5,
  Feather,
  FontAwesome,
  Fontisto
} from "@expo/vector-icons";
import QRCode from 'react-native-qrcode-svg';
import {
  colors,
  gStyle,
  device,
  images
} from "../constants";
// components
import {
  handleSoundScaner,
  permissionDenied,
  handleSoundOkScaner
} from '../helpers/async-storage';
import ButtonSwiper from "../components/ButtonSwiper";

import ModelListPart from './pickups/ModelListPart';
import ScreenHeader from "../components/ScreenHeader";
import putErrorPickup from '../services/pickup/log';
import ModelConfirmXE from '../screens/pickups/ModelConfirmXE';


class ModalQickAction extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isloading: false,
      code_scan :null,
      staff_error :null,
      quantity_put:0,
      pickup_info:[],
      pickup_b2b:[],
      isVisible : false,
      isVisibleB2B : false,
      part_id : 1,
      role_id :3
    };
  }


  UNSAFE_componentWillMount = async () => {
    let email_login = await AsyncStorage.getItem('staff_profile');
    this.setState({role_id:JSON.parse(email_login).role});
  };

  _putComfirmError = async (status_code)=>{
    const { t } = this.props.screenProps;
    this.setState({isloading:true,list_pickup:[],isVisible :false});
    const response = await putErrorPickup(this.state.code_scan,JSON.stringify({
        staff_error: this.state.staff_error,
        status_code: status_code,
        quantity_error: this.state.quantity_put
    }));
    if (response.status === 200) {
      handleSoundOkScaner();
      Alert.alert(
          '',
          t('screen.module.putaway.text_ok'),
          [
            {
              text: t('base.confirm'),
              onPress: () => {this.props.navigation.goBack(null)},
            }
          ],
          {cancelable: false},
      );
    }
    this.setState({isloading:false});
  }


  _fetchListPickupHandler = async  (parram) =>{
    this.setState({isloading:true,list_pickup:[]});
    const response = await getListPickup(parram);
    const { t } = this.props.screenProps;
    if (response.status === 200){
      if (response.data.results.length > 0){
        handleSoundOkScaner();
        if(response.data.results[0]?.b2b_part?.length > 0){

          if(response.data.results[0]?.b2b_part?.length > 1){
            this.setState({
              isVisibleB2B:true,
              pickup_b2b:response.data.results[0]?.b2b_part
            });
          }else{
            this.setState({
              pickup_info:response.data.results,
              staff_error:response.data.results[0].assigner_by.email
            });
          }


        }else{
          this.setState({
            pickup_info:response.data.results,
            staff_error:response.data.results[0].assigner_by.email
          });
        }

      }else{

        handleSoundScaner();
      }
    }else if (response.status === 403){
      permissionDenied(this.props.navigation);
    }
    this.setState({isloading:false});
  };

  _putComfirmError = async (status_code)=>{
    const { t } = this.props.screenProps;
    this.setState({isloading:true,list_pickup:[],isVisible :false});
    const response = await putErrorPickup(this.state.code_scan,JSON.stringify({
        staff_error: this.state.staff_error,
        status_code: status_code,
        quantity_error: this.state.quantity_put,
        part_id : this.state.part_id
    }));
    if (response.status === 200) {
      handleSoundOkScaner();
      Alert.alert(
          '',
          t('screen.module.putaway.text_ok'),
          [
            {
              text: t('base.confirm'),
              onPress: () => {this.props.navigation.goBack(null)},
            }
          ],
          {cancelable: false},
      );
    }
    this.setState({isloading:false});
  }



  _confirmPackingByStaff = async ()=>{
    const { t } = this.props.screenProps;
    var role_action = []
    if(this.state.role_id === 8){
      role_action = [
        {
          text: t('screen.module.pickup.detail.exception_btn_fail'),
          onPress: () => {this.setState({isVisible : true})},
        }
    ]
    }else{
      role_action = [
          {
            text: t('screen.module.pickup.detail.exception_btn_ok'),
            onPress: () => {this._putComfirmError('OK')},
          },
          {
            text: t('screen.module.pickup.detail.exception_btn_fail'),
            onPress: () => {this.setState({isVisible : true})},
          }
      ]
    }

    Alert.alert(
      '',
      t('screen.module.pickup.detail.exception_alert'),
      role_action,
      {cancelable: false},
    );
  }


  _searchCameraBarcode = async (code) => {
    if (code){
        await this.setState({code_scan:code})
        this._fetchListPickupHandler({
          'status':407,
          'is_approved_packed':1,
          'q' : code,
          'is_error' : 0
        })
    };
  };

  onSubmit = async (part_id) => {
    if (part_id){
      await this.setState({part_id:part_id})
      this._fetchListPickupHandler({
        'status':407,
        'is_approved_packed':1,
        'q' : this.state.code_scan,
        'part_id' : part_id,
        'is_error' : 0
      })
    };
  };

  onCloseModel = async () =>{
    this.setState({isVisible:false})
  }

  onCloseModelB2B = async (code) =>{
    this.setState({isVisibleB2B:code})
  }

  render() {
    const { t } = this.props.screenProps;
    const {
      isloading,
      isVisible,
      pickup_info,
      pickup_b2b,
      isVisibleB2B
    } = this.state;
    return (
      <React.Fragment>
        <View style={[gStyle.container]}>
          <ScreenHeader
            title={t('screen.module.putaway.list')}
            showBack={true}
            iconLeft={"chevron-down"}
            showInput = {true}
            autoFocus={true}
            inputValueSend ={null}
            onPressCamera={this._searchCameraBarcode}
            onSubmitEditingInput= {this._searchCameraBarcode}
            textPlaceholder={t("screen.module.pickup.list.search_text")}
          />
          {isloading && <ActivityIndicator/>}
          {pickup_info.length === 0 && <View style={[gStyle.flexCenter]}>
              <LottieView style={{
                        width: 150,
                        height: 100,
                      }} source={require('../assets/icons/qr-scan')} autoPlay loop />
              <Text style={{...gStyle.textBoxme14,color:colors.white}}>{t('screen.module.pickup.detail.exception_help_1')}</Text>
              <Text style={{...gStyle.textBoxme14,color:colors.white}}>{t('screen.module.pickup.detail.exception_help_2')}</Text>
              <Text style={{...gStyle.textBoxme14,color:colors.white}}>{t('screen.module.pickup.detail.exception_help_3')}</Text>
          </View>}
          <ScrollView
            contentContainerStyle={[gStyle.flex1, gStyle.pB80]}
            showsVerticalScrollIndicator={true}
            style={[gStyle.container]}
          >
            {pickup_info.length > 0 && <View style={[gStyle.flex1,{marginHorizontal:10}]}>
              <View style={[gStyle.flexCenter,{marginTop:5}]}>
                <Text style={{...gStyle.textBoxme14,color:colors.white}}>
                  {t('screen.module.pickup.detail.exception_detail_text')} {pickup_info[0].pickup_id.pickup_code}
                </Text>
              </View>
              <View style={[gStyle.flexCenter,{marginTop:5}]}>
                  <View style={[gStyle.flexCenter,{
                      marginVertical:10,
                      borderColor:colors.white,
                      borderWidth:6,
                      width:140,
                      borderRadius:12
                    }]}>
                      <QRCode
                          value={pickup_info[0].pickup_id.pickup_code}
                          size={120}
                          logo={images["iconMotify"]}
                          logoSize={32}
                          logoBackgroundColor={colors.transparent}
                      />
                  </View>
                  <View style ={[gStyle.flexCenter,{marginHorizontal:10,paddingTop:5}]}>
                    <Text style={{...gStyle.textBoxmeBold18,color:colors.white}}>{pickup_info[0].pickup_id.total_items}</Text>
                    <Text style={{...gStyle.textBoxme12,color:colors.greyInactive,paddingBottom:10}}>
                        {t('screen.module.pickup.detail.exception_product_text')}
                    </Text>
                    <FontAwesome name="long-arrow-down" size={22} color={colors.white} />
                  </View>
              </View>
              <View style={{height:0.5,backgroundColor:colors.borderLight,marginTop:3}}/>
              <View style={[gStyle.flexRowCenter,{marginTop:12}]}>
                <View style={styles.cardSumary}>
                  <View style={gStyle.flexRowCenterAlign}>
                    <Entypo name="price-tag" size={18} color={colors.white} />
                    <View style={{marginLeft:8}}>
                      <Text style={{...gStyle.textBoxmeBold18,color:colors.white}}>{pickup_info[0].list_product_id__bsin}</Text>
                      <Text style={{...gStyle.textBoxme14,color:colors.white}}>SKU</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.cardSumary}>
                  <View style={gStyle.flexRowCenterAlign}>
                    <Entypo name="back-in-time" size={18} color={colors.white} />
                    <View style={{marginLeft:8}}>
                      <Text style={{...gStyle.textBoxmeBold18,color:colors.white}}>{pickup_info[0].time_process}</Text>
                      <Text style={{...gStyle.textBoxme14,color:colors.white}}>{t('screen.module.pickup.detail.exception_time')}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.cardSumary}>
                  <View style={gStyle.flexRowCenterAlign}>
                    <FontAwesome5 name="location-arrow" size={17} color={colors.white} />
                    <View style={{marginLeft:8}}>
                      <Text style={{...gStyle.textBoxmeBold18,color:colors.white}}>{pickup_info[0].list_bin_id}</Text>
                      <Text style={{...gStyle.textBoxme14,color:colors.white}}>{t('screen.module.pickup.detail.exception_bin')}</Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={[{marginTop:8,borderTopWidth:0.5,borderTopColor:colors.borderLight}]}>
                <View style={[gStyle.flexRowSpace,{marginTop:5}]}>
                  <Text style={{...gStyle.textBoxme14,color:colors.greyInactive}}>{t('screen.module.pickup.list.created_by')}</Text>
                  <Text style={{...gStyle.textBoxme14,color:colors.white}}>{pickup_info[0].created_by.email}</Text>
                </View>
                <View style={[gStyle.flexRowSpace]}>
                  <Text style={{...gStyle.textBoxme14,color:colors.greyInactive}}>{t('screen.module.pickup.detail.exception_picker_by')}</Text>
                  <Text style={{...gStyle.textBoxme14,color:colors.white}}>{pickup_info[0].assigner_by.email}</Text>
                </View>
                <View style={[gStyle.flexRowSpace]}>
                  <Text style={{...gStyle.textBoxme14,color:colors.greyInactive}}>{t('screen.module.packed.packed_by')}</Text>
                  <Text style={{...gStyle.textBoxme14,color:colors.white}}>N/A</Text>
                </View>
                <View style={[gStyle.flexRow,{backgroundColor:colors.cardLight,paddingVertical:12,paddingHorizontal:6,marginTop:10}]}>
                  <Feather name="check-square" size={14} color={colors.white} />
                  <Text style={{...gStyle.textBoxme14,color:colors.white,paddingLeft:5}}>
                    {t('screen.module.handover.sla_text_1')}{" "}{pickup_info[0].total_orders_sla}{" "}
                    {t('screen.module.handover.sla_text_2')}
                  </Text>
                </View>
                <View style={[gStyle.flexRow,{backgroundColor:colors.cardLight,paddingVertical:12,paddingHorizontal:6,marginTop:10}]}>
                  <Feather name="check-square" size={14} color={colors.white} />
                  <Text style={{...gStyle.textBoxme14,color:colors.white,paddingLeft:5}}>{t('screen.module.pickup.detail.exception_confirm_stock')}</Text>
                </View>
              </View>
            </View>}
            {pickup_info.length > 0 &&

            <View style={[gStyle.flexRowCenter,styles.containerBottom]}>
                <ButtonSwiper
                  isLeftToRight={true} // set false to move slider Right to Left
                  childrenContainer={{ backgroundColor: 'rgba(255,255,255,0.0)'}}
                  slideOverStyle={{backgroundColor:'#c4f8e4',
                    borderBottomLeftRadius:0,
                    borderBottomRightRadius: 5,
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 5
                  }}
                  onEndReached={() => this._confirmPackingByStaff(true)}
                  isOpacityChangeOnSlide={true}
                  containerStyle={{
                    margin: 8,
                    backgroundColor: colors.whiteBg,
                    borderRadius: 6,
                    overflow: 'hidden',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width:"90%"
                  }}
                  thumbElement={
                    <View style={{
                      width: 50,
                      margin: 4,
                      borderRadius: 5,
                      height: 50,
                      backgroundColor:colors.darkgreen,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Fontisto name="angle-dobule-right" size={20} color={colors.white} />
                    </View>
                  }
              >
                <Text style={{fontWeight: '600'}}>{t('screen.module.pickup.detail.exception_approved')}</Text>
              </ButtonSwiper>
            </View>}

            {isVisible &&  pickup_info.length > 0 && <ModelConfirmXE
                t={t}
                onClose={this.onCloseModel}
                onSubmit ={null}
                pickup_id ={pickup_info[0].pickupbox_id}
                pickup_code ={pickup_info[0].pickup_id.pickup_code}
                index ={0}
            />}
            {isVisibleB2B && <ModelListPart data={pickup_b2b} onClose={this.onCloseModelB2B} onSubmit={this.onSubmit} t={t} />}
          </ScrollView>
        </View>
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  helperBox:{
    marginTop: 10,
    padding:10,
    marginHorizontal: 15
  },
  helperBoxText:{
    color:colors.white,
    ...gStyle.textBoxmeBold16,
    paddingBottom:5,
  },
  cardSumary:{
    marginHorizontal:3,
    borderRadius:3,
    borderColor:colors.cardLight,
    backgroundColor:colors.cardLight,
    borderWidth:1,
    paddingVertical:3,
    paddingHorizontal:18,
  },
  containerBottom:{
    position: 'absolute',
    width:'100%',
    bottom: device.iPhoneNotch ? 20 : 0
  },
  bottomButton :{
    justifyContent: 'center',
    alignContent:'center',
    width:'92%',
    paddingVertical: 13,
    marginHorizontal:5,
    borderRadius:6,
    backgroundColor: colors.darkgreen,
  },
  textButton :{
      textAlign:'center',
      color:colors.white,
      ...gStyle.textBoxmeBold14,
  },
});

export default ModalQickAction;
