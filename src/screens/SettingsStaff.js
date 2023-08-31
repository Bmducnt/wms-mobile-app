import * as React from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  ActivityIndicator,
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  StatusBar
} from 'react-native';
import RNRestart from 'react-native-restart';
import {
  MaterialIcons,
  FontAwesome5,
} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from "expo-image-picker";
import {
  Image as Imagecompressor
} from "react-native-compressor";
import {
  device,
  gStyle,
  images,
  colors
} from '../constants';
// components
import TouchIcon from "../components/TouchIcon";

import ScreenHeader from '../components/ScreenHeader';
import AvgReportStaff from './reports/AvgReportStaff';
import InboundReportTeam from './reports/InboundReportTeam';
import OutboundReportTeam from './reports/OutboundReportTeam';
import HandoverReportTeam from './reports/HandoverReportTeam';
import ControllerReportTeam from './reports/ControllerReportTeam';
import { serviceUploadAsset } from "../helpers/upload-base";
import {removeStaffLogout} from '../helpers/async-storage';
import {clearAsyncStorage} from '../helpers/wrap-api';
import {translate} from "../i18n/locales/IMLocalized";

const SettingsStaff = ({navigation}) => {
  const [staffInfo, setstaffInfo] = React.useState(null);
  const [staffID, setstaffID] = React.useState(0);
  const [avarta, setAvarta] = React.useState(null);
  const [openModel, setopenModel] = React.useState(false);


  const staffLogout = async () => {
    await clearAsyncStorage();
    removeStaffLogout();
    RNRestart.restart();
  };

  const pickAvartar = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing : true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      const resultcompress = await Imagecompressor.compress(result.assets[0].uri, {
        compressionMethod: "auto",
      });
      setAvarta(resultcompress)
      await serviceUploadAsset(resultcompress, null, null, 3,1,false);
    }
  };

  React.useEffect( () => {
    async function fetchDataStaff() {
      const staff_profile = await AsyncStorage.getItem('staff_profile');
      await setAvarta(JSON.parse(staff_profile).avatar)
      await setstaffID(JSON.parse(staff_profile).staff_id);
      await setstaffInfo(JSON.parse(staff_profile));

    }
    fetchDataStaff();
  }, []);


  return (
    <View style={gStyle.container}>
      <View style={{ position: 'absolute', top: 0, width: '100%', zIndex: 10 }}>
        <ScreenHeader title={translate('screen.module.settings.info')} bgColor={colors.cardLight} textAlign={"center"} navigation={navigation}/>
      </View>
      <Animated.ScrollView
            style={[gStyle.container,{flex: 1,
              paddingTop: StatusBar.currentHeight,
            marginHorizontal:15}]}

            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
        >
        {!staffInfo ? <ActivityIndicator/> :
        <View style={[gStyle.flexCenter,styles.containerFlatlist]}>
          <TouchableOpacity onPress= {() => navigation.navigate("HandoverImages",
            {handover_code : null,load_local : true,path :[{uri:avarta},images['user']]})}>
            {!avarta ? <Image source={images['user']} style={styles.image} /> : <Image source={{uri:avarta}} style={styles.image} />}
            <View style={{
                position:"absolute",
                bottom:0,
                right: 0,
                zIndex:10,

              }}>
              <MaterialIcons name="verified" size={25} color="#bafe01" />
            </View>
          </TouchableOpacity>
          <View style={gStyle.flexCenter}>
            <TouchableOpacity
              activeOpacity={gStyle.activeOpacity}
              style={[gStyle.flexCenter,{marginTop:5}]}
            >
              <Text style={{...gStyle.textBoxmeBold14,color:colors.white,paddingRight:5}}>{staffInfo.fullname}</Text>
            </TouchableOpacity>
            <Text style={{...gStyle.textBoxme14,color:colors.greyInactive,paddingTop:2}}>{staffInfo.role_detail.description} , {staffInfo.warehouse_id.name}</Text>
            <Text style={{...gStyle.textBoxme14,color:colors.greyInactive,paddingTop:3}}>{staffInfo.os_name} - {staffInfo.os_version} - {device.version_release}</Text>
          </View>
          <View style={[gStyle.flexRow,{marginTop:15}]}>
            <TouchableOpacity
                style={{
                paddingHorizontal:8,
                paddingVertical:8,
                borderRadius:6,
                marginRight:5,
                backgroundColor:colors.boxmeBrand
                }}
                onPress={() =>setopenModel(true)}
            >
                <Text style={{...gStyle.textBoxme14,color:colors.white}}>
                <FontAwesome5 name="chart-bar" size={14} color={colors.white} />{" "}
                {translate('screen.module.staff_report.btn_kpi')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                activeOpacity={gStyle.activeOpacity}
                onPress={pickAvartar}
                style={{
                paddingHorizontal:8,
                paddingVertical:8,
                borderRadius:6,
                backgroundColor:colors.borderLight
                }}
            >
                <Text style={{...gStyle.textBoxme14,color:colors.white}}>{translate('screen.module.settings.avatar')}
                {" "}<FontAwesome5 name="cloud-upload-alt" size={14} color={colors.white} />
                </Text>
            </TouchableOpacity>
          </View>
        </View>}
        <AvgReportStaff  staff_id = {staffID} visible = {openModel} onClose ={setopenModel} />
        <View style={{marginTop:10}}>
          <View >
                <Text style={{...gStyle.textBoxme16,color:colors.white}}>
                {translate('screen.module.staff_report.over_view')}
                </Text>
                <View style={gStyle.flexRow}>
                    <Text style={{...gStyle.textBoxme14,color:colors.greyInactive}}>{translate('screen.module.staff_report.over_view_filter')}</Text>
                    <Text style={{...gStyle.textBoxme14,color:colors.white,paddingLeft:2}}>{translate('screen.module.staff_report.over_view_month')}</Text>
                </View>
          </View>

          {/* Inbound */}

          <InboundReportTeam  />
          {/* Packed */}

          <OutboundReportTeam  />

          {/* Handover */}

          <HandoverReportTeam  />


          {/* WH Controller */}

          <ControllerReportTeam   />


        </View>
        <View style={gStyle.spacer11} />
      </Animated.ScrollView>
      <View style={gStyle.iconRight}>
          <TouchIcon
            icon={<FontAwesome5 name="sign-out-alt" size={14} color={colors.white} />}
            onPress={() => staffLogout()}
            iconSize ={14}
          />
      </View>
    </View>
  )
};


SettingsStaff.propTypes = {
  // required
  navigation: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  containerFlatlist: {
    marginTop: device.iPhoneNotch ? 100 : 65
  },
  image: {
    height: device.iPhoneNotch ? 65 : 65,
    width: device.iPhoneNotch ? 65 : 65,
    borderRadius:65/2,
    borderWidth:3,
    borderColor:colors.whiteBg
  },

});

export default SettingsStaff;
