import * as React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import {
  Text,
  View,
  TouchableWithoutFeedback,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator
} from 'react-native';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { device, gStyle,colors ,images} from '../constants';
import loginService from '../services/auth/login';
import updateTokenApp from '../services/auth/update';
import {saveStaffLogin} from '../helpers/async-storage';
// components
import LineWarehouse from '../components/LineWarehouse';
import {translate} from "../i18n/locales/IMLocalized";

const ModelWarehouseOption = ({route, navigation}) => {
  const list_warehoue = route.params?.list_warehoue;
  const staff_email =  route.params?.staff_email;
  const staff_pass =  route.params?.staff_pass;
  const token_app =  route.params?.token_app;
  const [loading, setLoading] = React.useState(false);

  const adminReLogin = async (warehouse_code) => {
    await setLoading(true);
    const response = await loginService({
      'email' : staff_email,
      'password' : staff_pass,
      'is_pda' : true,
      'os_version' : Device.osVersion,
      'os_name' : Device.osName,
      'app_version' : device.version_release,
      'warehouse_code' :warehouse_code
    });
    if (response.status === 200){
      await saveStaffLogin(response.data);
      await AsyncStorage.setItem('password_hind', staff_pass);
      await setLoading(false);
      axios.defaults.headers = {
        'Authorization' : response.data.token
        ? response.data.token
        : null,
        'Content-Type': 'application/json'
      };
      if(!response.data.token_app){
        await updateTokenApp({
          'type' : 3,
          'token_code' : token_app,
          'os_version' : Device.osVersion,
          'os_name' : Device.osName,
          'app_version' : device.version_release,
        })
      }
      navigation.navigate('App',{ screen: 'TabNavigation',initial: true});
    }else{
      Alert.alert(
        '',
        translate('screen.module.authen.error_wrong_info'),
        [
          {
            text: 'ok',
            onPress: async () => {
              navigation.goBack();
            },
          },
        ],
        {cancelable: false},
      );
    };
  };

  return (
    <React.Fragment>
      <SafeAreaView style={styles.containerSafeArea}>

        <TouchableWithoutFeedback
          onPress={() => {
            navigation.goBack();
          }}
        >
          <View style={styles.containerButton}>
          {
            loading ? (
            <ActivityIndicator />
          ):<Text style={styles.buttonText}>Cancel</Text>
          }

          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>

      <ScrollView
        contentContainerStyle={[gStyle.flex1]}
        contentInset={{bottom: 80}}
        showsVerticalScrollIndicator={true}
        style={[gStyle.container, { backgroundColor: colors.blackBlur }]}
      >
        <View style={styles.container}>
          <View style={styles.containerImage}>
            <Image source={images['user']} style={styles.image} />
          </View>
          <View style={gStyle.flexRowCenterAlign}>

          </View>
        </View>
        <View style={{marginHorizontal:10,marginTop:10}}>
          {Object.keys(list_warehoue).map((index) => {
            const item = list_warehoue[index];
            return (
              <LineWarehouse
                key={item.warehouse_id}
                icon={item.country_flag}
                onPress={() => adminReLogin(item.code)}
                title={item.name}
                country_code={item.country_code}
                province={item.province}
                phone={item.phone}
              />
            );
          })}


        </View>
        <View style={gStyle.spacer11} />
        <View style={gStyle.spacer11} />
        <View style={gStyle.spacer11} />
        <View style={gStyle.spacer11} />
      </ScrollView>
    </React.Fragment>
  );
};

ModelWarehouseOption.propTypes = {
  // required
  navigation: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  containerSafeArea: {
    ...gStyle.containerAbsolute,
    backgroundColor: colors.blackBlur
  },
  containerButton: {
    ...gStyle.flexCenter,
    ...gStyle.spacer6
  },
  buttonText: {
    color: colors.white,
    fontSize: 18
  },
  container: {
    paddingTop: device.iPhoneNotch ? 80 : 40,
    alignItems: 'center'
  },
  containerImage: {
    shadowColor: colors.black,
    shadowOffset: { height: 8, width: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6
  },
  image: {
    height: device.iPhoneNotch ? 65 : 45,
    marginBottom: 5,
    width: device.iPhoneNotch ? 65 : 45,
  },
  titleEmail: {
    color: colors.white,
    ...gStyle.textBoxmeBold14 ,
    paddingLeft: 5,
  },
  titleRole: {
    color: colors.boxmeBrand,
    ...gStyle.textBoxme16,
    paddingBottom : device.iPhoneNotch ? 20 : 0,
  }
});

export default ModelWarehouseOption;
