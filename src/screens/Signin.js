import * as React from 'react';
import axios from 'axios';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity,
  Alert,
  Linking,
  Dimensions} from 'react-native';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-community/async-storage';
import {
  KeyboardAwareScrollView
} from 'react-native-keyboard-aware-scrollview';
import {
  responsiveSize
} from '../helpers/device-height';
import {
  saveStaffLogin
} from '../helpers/async-storage';
import loginService from '../services/auth/login';
import updateTokenApp from '../services/auth/update';
import ComponentButton from '../components/Button';
import TextAnimator from '../components/TextAnimator';
import { 
  colors, 
  device, 
  gStyle

} from '../constants';

export default class SignInScreen extends React.Component {

  constructor(props) {
      super(props);
      this.state = {
          email: null, 
          password: null,
          token_app : null,
          isloading: false, 
          error: false
      };
      this._signInHandler = this._signInHandler.bind(this);
  };

  UNSAFE_componentWillMount = async () =>{
    let hind_email = await AsyncStorage.getItem('staff_email');
    this.setState({email:hind_email});
    let password_hind = await AsyncStorage.getItem('password_hind');
    this.setState({password:password_hind});
    let token_app = await AsyncStorage.getItem('staff_token_notify');
    this.setState({token_app:token_app});
    this._fetchToken();
  }

  _fetchToken = async () => {
    let staff_token = null;
    staff_token = await AsyncStorage.getItem('staff_token');
    axios.defaults.headers = {
      'Authorization' : staff_token
      ? staff_token
      : null,
      'Content-Type': 'application/json'
    };
    this.props.navigation.navigate(staff_token ? 'App' : 'Auth');
  }

  _openBoxmeInfo = async () =>{
    Linking.openURL('https://cloud.ahamove.com/share-order/22CTM1D0/84815903635');
  };

  _openAppUpdate = async () =>{
    if(Device.osName === 'iOS'){
      Linking.openURL('https://apps.apple.com/vn/app/boxmewms/id1567729849?l=en');
    }else{
      Linking.openURL('market://details?id=id=asia.boxme.wms');
    }
      
  };

  _signInHandler = async () =>{
    const {t,setLocale} = this.props.screenProps;
    this.loadingButtonLogin.showLoading(true);
    const { email, password } = this.state;
    const response = await loginService({
      'email' : email,
      'password' : password,
      'is_pda' : true,
      'os_version' : Device.osVersion,
      'os_name' : Device.osName,
      'app_version' : device.version_release,
    });
    let data_login = null;
    if (response.status === 200){
      if (response.data.token){
        data_login = response.data;
      }else{
        this.props.navigation.navigate('ModelWarehouseOption',{
             list_warehoue :response.data.results,
             staff_email : email,
             staff_pass : password,
             token_app : this.state.token_app
        });
      }
    }
    else if (response.status === 400){
      if (response.data.error_code === 3){
        Alert.alert(
          '',
          t('screen.module.authen.text_update'),
          [
            {
              text: t('screen.module.authen.btn_update'),
              onPress: () => this._openAppUpdate(),
            },
          ],
          {cancelable: false},
        );
      }else{
        Alert.alert(
          '',
          t('screen.module.authen.error_wrong_info'),
          [
            {
              text: t('base.confirm'),
              onPress: async () => {
                this.props.navigation.goBack();
              },
            },
          ],
          {cancelable: false},
        );
      }
      
    }
    else {
      Alert.alert(
        '',
        t('screen.module.authen.error_wrong_info'),
        [
          {
            text: t('base.confirm'),
            onPress: async () => {
              this.props.navigation.goBack();
            },
          },
        ],
        {cancelable: false},
      );
    }
    this.loadingButtonLogin.showLoading(false);
    if (data_login){
        axios.defaults.headers = {
          'Authorization' : data_login.token
          ? response.data.token
          : null,
          'Content-Type': 'application/json'
        };
        await saveStaffLogin(data_login);
        await AsyncStorage.setItem('password_hind', password);
        const token_check = await AsyncStorage.getItem('staff_token');
        if(!data_login.token_app){
          await updateTokenApp({
            type : 3,
            token_code : this.state.token_app,
            os_version : Device.osVersion,
            os_name : Device.osName,
            app_version : device.version_release,
          })
        }
        if(token_check){
          this.props.navigation.navigate('App',{ screen: 'HomeScreen',initial: true});
        }
    }
  };

  _forgotPass = () =>{
    const { t } = this.props.screenProps;
    Alert.alert(
      '',
      t('screen.module.authen.text_fogot_pass'),
      [
        {
          text: t('base.confirm'),
          onPress: null,
        },
      ],
      {cancelable: false},
    );
  };
  
  render(){
    const { t } = this.props.screenProps;
    const {is_text}  = this.state;
    return (
      <KeyboardAwareScrollView
        style={gStyle.container}
        behavior="height"
        keyboardVerticalOffset={0}
        scrollEnabled={true}
        enableOnAndroid={true}
        showsVerticalScrollIndicator={true}
        enableAutomaticScroll={true}>
          <View style={[styles.container]}>
            <View style={{width:Dimensions.get("window").width-60}}>
              
              <Text style={[styles.textLogo,{marginBottom:0}]}>{t('screen.module.authen.welcome')}</Text>
              <Text style={styles.textLogo}>{t('screen.module.authen.back')}</Text>
              <TextAnimator 
                content={t('screen.module.authen.welcome_text')}
                textStyle={{
                  ...gStyle.textBoxmeBold14,
                  color:colors.white,
                  marginBottom:4,
                  
                }}
                style={{
                  paddingLeft:device.iPhoneNotch ? 5:8,
                  marginBottom:15
                }}
                timing={500}
                onFinish={null}
              />
            </View>
            <View style={{alignItems:"center",justifyContent:"center",}}>
              <View style={styles.inputView} >
                <TextInput  
                  style={styles.inputText}
                  value={this.state.email}
                  placeholder={t('screen.module.authen.placeholder_email')}
                  placeholderTextColor="#003f5c"
                  autoCapitalize="none"
                  onChangeText={text => this.setState({email:text})}/>
              </View>
              <View style={styles.inputView} >
                <TextInput  
                  secureTextEntry
                  value={this.state.password}
                  style={styles.inputText}
                  placeholder={t('screen.module.authen.placeholder_password')}
                  placeholderTextColor="#003f5c"
                  onChangeText={text => this.setState({password:text})}/>
              </View>
              <TouchableOpacity onPress={() => this._forgotPass()}>
                <Text style={styles.forgot}>{t('screen.module.authen.text_forgot')}</Text>
              </TouchableOpacity>

              <View style={styles.loginBtn}>
                <ComponentButton
                  ref={c => (this.loadingButtonLogin = c)}
                  width={Dimensions.get("window").width-60}
                  height={50}
                  title={t('screen.module.authen.btn')}
                  titleFontSize={16}
                  titleColor="rgb(255,255,255)"
                  backgroundColor={colors.boxmeBrand}
                  borderRadius={6}
                  onPress={this._signInHandler.bind(this)}
                />
              </View>
              <TouchableOpacity
                onPress={() => this._openBoxmeInfo()}
              >
                <Text style={styles.loginText}>© 2022 Boxme v{device.version_release } by boxme.asia</Text>
              </TouchableOpacity>
            </View>
          </View>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: responsiveSize(30),
    marginTop: responsiveSize(device.iPhoneNotch ? 120 : 70),
  },
  textLogo:{
    ...gStyle.textBoxmeBold30,
    color:colors.white,
    marginBottom:20,
    marginLeft:device.iPhoneNotch ? 3:8
  },
  inputView:{
    width:Dimensions.get("window").width-60,
    backgroundColor:colors.whiteBg,
    borderRadius:6,
    height:50,
    marginBottom:20,
    justifyContent:"center",
    padding:20
  },
  inputText:{
    height:50,
  },
  forgot:{
    color:colors.white,
    fontSize:15
  },
  loginBtn:{
    width:Dimensions.get("window").width-60,
    alignItems:"center",
    justifyContent:"center",
    marginTop:30,
    marginBottom:10
  },
  loginText:{
    color:colors.white
  }
});
