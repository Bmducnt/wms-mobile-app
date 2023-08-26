import * as React from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
  Share,
  Dimensions,
  ActivityIndicator
} from "react-native";
import moment from 'moment';
import { Feather} from "@expo/vector-icons";
import { SvgUri } from "react-native-svg";
import * as Print from "expo-print";
import { 
  colors, 
  gStyle,
  device
} from "../constants";
import {PDF_QR_PICKUP} from '../services/endpoints';
import confirmOBSend from '../services/handover/approved-ob';
import Badge from './Badge';
import LineOrderError from  './LineOrderError';


const ListHandoverItem = ({
  logo_carrier,
  code,
  quantity,
  staff_email,
  time_created,
  type_handover,
  is_approved,
  driver_vehicle,
  driver_name,
  driver_phone,
  navigation,
  warehouse_name,
  carrier_name,
  total_refuse,
  trans,
  is_verify,
  updated_date,
  order_pending,
  order_not_confirm_error,
  order_confirm_error,
  summary_order_error_list
}) => {
  const path_pdf = type_handover ? 'https://wms.boxme.asia/api/handover/pdf/' : 'https://wms.boxme.asia/api/rma/pdf/';



  const [isLoading, setisLoading] = React.useState(false);
  const [openModel, setopenModel] = React.useState(false);


  const _printPdf = async (code) => {
    setisLoading(true);
    try {
      await Print.printAsync({
        uri: PDF_QR_PICKUP + code + "?quantity=" + quantity,
      });
    } catch (error) {
      console.log("error:", error);
    }
    setisLoading(false);
  };
   
  const _shareInfoOb = async (fileUri) => {
    setisLoading(true);
    const localUri = fileUri + code;
    try {
      await Share.share({
        message: `${trans("screen.module.handover.mess_sub")} ${code}\n${trans("screen.module.handover.mess_time")} ${time_created} \n`+
                `${trans("screen.module.handover.mess_warehouse_name")} ${warehouse_name} \n`+
                `${trans("screen.module.handover.mess_carrier_name")} ${carrier_name} \n`+
                `${trans("screen.module.handover.driver_vehicle")} ${driver_vehicle} \n`+
                `${trans("screen.module.handover.mess_qt")} ${quantity}\n${trans("screen.module.handover.mess_rollback")} ${total_refuse} \n`+
                `${trans("screen.module.handover.driver_name")} ${driver_name} - ${driver_phone} \n`+
                `${trans("screen.module.handover.mess_body")} ${localUri}`
      });
      await confirmOBSend(code,JSON.stringify({
        is_verify_send : 1,
        is_verify : 1
      }));
    } catch (error) {
      await confirmOBSend(code,JSON.stringify({
        is_verify_send : 1,
        is_verify : 0
      }));
    }
    setisLoading(false);
  };

  return (
    <View style={[styles.container]}>
      <TouchableOpacity
        activeOpacity={gStyle.activeOpacity}
        onPress={() => type_handover ? navigation.navigate('DetailScreen',
        {
          'code' :code,
          'quantity':quantity,
          'is_approved':is_approved,
          'carrier_name': carrier_name,
          'carrier_logo': logo_carrier,
      }):_printPdf(code)}
        style={styles.container}
      >
        <View style={[gStyle.flex5]}>
          <View style={gStyle.flexRow}>
            <View style={styles.image}>
              <SvgUri width={60} height={60} uri={logo_carrier} />
            </View>
            <View style={styles.blockOb}>
              <View style={gStyle.flexRowSpace}>
                <Text style={{...gStyle.textBoxme14,color:colors.greyInactive}}>{type_handover ? trans("screen.module.handover.code") : trans("screen.module.handover.code_rma")}</Text>
                <Text
                  style={[styles.textCode]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {code}
                </Text>
                
              </View>
              <View style={[gStyle.flexRowSpace]}>
                <Text
                  style={styles.textInfo}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {trans("screen.module.handover.created_by")}
                </Text>
                <Text
                  style={styles.textRight}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {staff_email}
                </Text>
              </View>
              <View style={[gStyle.flexRowSpace]}>
                  <Text style={[styles.textInfo]} numberOfLines={1} >
                    {trans("screen.module.handover.created_at")}
                  </Text>
                  <Text
                  style={styles.textRight}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {moment(time_created).fromNow()}
                </Text>
              </View>
            </View>
          </View>
          <View style={[styles.percentBar,{marginLeft:70}]}></View>
          <View style={gStyle.flexRow}>
            <View style={[gStyle.flexRowCenterAlign,{ width: 65}]}>
              <Text style={[styles.textRight,{...gStyle.textBoxmeBold16}]} numberOfLines={1}>
                {quantity}</Text>
              <Text style={{...gStyle.textboxme10,color:colors.white}} numberOfLines={1}>{" "}{trans("screen.module.handover.unit_order")}</Text>
            </View>
            <View style={styles.blockDriver}>
              <View style={gStyle.flexRowSpace}>
                <Text
                  style={styles.textInfo}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {trans("screen.module.handover.driver_name")}
                </Text>
                <Text style={{color:colors.brandPrimary}}>{" "}{driver_name} - {driver_vehicle}</Text>
              </View>
              <View style={gStyle.flexRowSpace}>
                  <Text style={[styles.textInfo]} numberOfLines={1}
                  >{trans("screen.module.handover.driver_phone")}</Text>
                  <Text onPress={()=>{Linking.openURL('tel:'+driver_phone);}} 
                      style={{color:colors.white}}>{" "}{driver_phone}{" "}
                      <Feather color={colors.white} name="phone-forwarded" size={18} /></Text>
              </View>
            </View>
          </View>
          
          {type_handover && <View style={{width:"100%"}}>
            <View style={[gStyle.flexRow,{paddingTop:3}]}>
            <Badge
                name={`${trans("screen.module.handover.mess_rollback")} ${total_refuse}`}
                style={{
                  backgroundColor: colors.borderLight,
                  color: colors.boxmeBrand,
                  borderRadius: 6,
                }}
                width ={Dimensions.get("window").width/3-10}
              />
              
              <Badge
                name={`${trans("screen.module.handover.order_confirm_error")} ${order_confirm_error} `}
                style={{
                  backgroundColor: colors.borderLight,
                  color: colors.brandPrimary,
                  borderRadius: 6,
                }}
                width ={Dimensions.get("window").width/3-10}
              />
              <Badge
                name={`${trans("screen.module.handover.order_not_confirm_error")} ${order_not_confirm_error}`}
                showIcon ={true}
                onPress = {() => setopenModel(true)}
                style={{
                  backgroundColor: colors.borderLight,
                  color: colors.white,
                  borderRadius: 6,
                }}
              />
            </View>
          </View>}
          <View style={[styles.percentBar,{marginTop:5}]}></View>
          <TouchableOpacity style={[gStyle.flexRowSpace,{marginVertical:5}]}
            onPress={() => navigation.navigate("HandoverImages",{handover_code : code,load_local : false})}
            
          >
                  <Text style={[styles.textInfo,{color:colors.white}]} numberOfLines={1}
                  >{trans("screen.module.handover.btn_photo_handover")}</Text>
                  <Feather color={colors.white} name="chevron-right" size={18} />
           </TouchableOpacity>
          <View style={{width:"100%"}}>
            <View style={[styles.percentBar,{marginTop:5}]}></View>
            {!is_approved&& ( <View style={gStyle.flexRowSpace}>
                <View style={gStyle.flexRow}>
                  <Text style={[styles.textInfo,{width:'60%'}]} numberOfLines={4}>
                    {order_pending} {trans("screen.module.handover.pending")}
                  </Text>
                </View>
                <TouchableOpacity
                  style={[styles.btnConfirm]}
                  onPress={() =>
                    navigation.navigate("SignatureScreenBase", { 
                      ob_code: code,
                      warehouse_name:warehouse_name,
                      carrier_name:carrier_name, 
                      time_created:time_created, 
                      quantity:quantity,
                      quantity_rollback :total_refuse
                    })
                  }
                > 
                
                <Text style={{ color: colors.white,...gStyle.textBoxme14}}>
                  {trans("screen.module.handover.btn_approved_again")}
                </Text>
              </TouchableOpacity>
            </View>)}
            {is_approved && ( <View style={gStyle.flexRowSpace}>
                  <View style={{width:"60%"}}>
                    <Text style={[styles.textInfo,{color:colors.greyInactive}]} numberOfLines={1}>
                    {trans("screen.module.handover.updated_at")} {moment(updated_date).fromNow()}
                    </Text>
                    {is_verify === 0 && <Text style={{ color: colors.greyInactive,...gStyle.textBoxme14}} numberOfLines={4}>
                    {trans("screen.module.handover.share_not_ok")}
                    </Text>}
                    {is_verify === 1 && 
                      <Text style={{ color: colors.greyInactive,...gStyle.textBoxme14}} numberOfLines={4}>
                      {trans("screen.module.handover.share_ok")}
                    </Text>}
                  </View>
                  <View style={gStyle.flexRow}>
                    <TouchableOpacity
                      style={[styles.btnShare]}
                      onPress={() => _shareInfoOb(path_pdf)}
                    >
                      {!isLoading ? (<Text style={{ color: colors.white,...gStyle.textBoxme14}}>
                        
                          
                          {trans("screen.module.handover.btn_send_file")}
                        </Text>):<ActivityIndicator/>}
                    </TouchableOpacity>
                  </View>
            </View>)}
          </View>
          
        </View>
      </TouchableOpacity>
      {openModel && <LineOrderError data={summary_order_error_list} onClose={setopenModel} trans={trans}/>}
    </View>
  );
};

ListHandoverItem.defaultProps = {
  is_approved: true,
  driver_name : 'N/A',
  driver_vehicle : 'N/A',
  driver_phone:null,
  warehouse_name:null,
  carrier_name:null,
  updated_date : null,
  total_refuse :0,
  order_pending : 0
};

ListHandoverItem.propTypes = {
  logo_carrier: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired,
  quantity: PropTypes.number.isRequired,
  staff_email: PropTypes.string.isRequired,
  time_created: PropTypes.string.isRequired,
  updated_date : PropTypes.string,
  driver_phone: PropTypes.string,
  driver_name: PropTypes.string,
  driver_vehicle: PropTypes.string,
  is_verify : PropTypes.number,
  type_handover: PropTypes.bool.isRequired,
  is_approved: PropTypes.bool.isRequired,
  warehouse_name: PropTypes.string,
  order_pending : PropTypes.number,
  carrier_name: PropTypes.string,
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal:5,
    paddingVertical:3,
    marginVertical:5,
    backgroundColor:colors.cardLight
  },
  blockDriver :{
    width : Dimensions.get("window").width - 90,
    marginLeft:device.iPhoneNotch ? 5 : 4,
  },
  blockOb:{
    width : Dimensions.get("window").width - 90,
    marginTop:-2,
    marginLeft:device.iPhoneNotch ? 5 : 4,
  },
  textCode: {
    ...gStyle.textBoxmeBold14,
    color: colors.white,
  },
  textInfo: {
    ...gStyle.textBoxme14,
    color: colors.greyInactive,
  },
  percentBar:{
    height:1,
    marginBottom:3,
    width:'100%',
    backgroundColor:colors.borderLight
  },
  containerRight: {
    alignItems: "flex-end",
    position: "absolute",
    right: 15,
    top: 11,
  },
  image: {
    width: 65,
    height: 65,
    borderRadius: 10,
  },
  textRight: {
    ...gStyle.textBoxme16,
    color: colors.white,
  },
  btnConfirm: {
    marginTop:3,
    paddingHorizontal:6,
    paddingVertical:10,
    zIndex: 10,
    backgroundColor:colors.boxmeBrand,
    borderRadius: 3,
  },
  btnShare: {
    marginTop:3,
    paddingHorizontal:6,
    paddingVertical:10,
    zIndex: 10,
    backgroundColor: colors.darkgreen,
    borderRadius: 3,
  },
});

export default React.memo(ListHandoverItem);
