import * as React from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import {
  Entypo,
  Feather
} from '@expo/vector-icons';
import LinearGradient from "../components/LinearGradient";

import ActionButton from 'react-native-action-button';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  colors,
  device,
  gStyle ,
  images
} from '../constants';
// components

import TouchIcon from '../components/TouchIcon';

import MenuHorizontal from '../components/MenuHorizontal';

import {_getTimeDefaultFrom,
  _getTimeDefaultTo,
  _getDatetimeToTimestamp,
  _convertDatetimeToTimestamp} from '../helpers/device-height';



import StaffReport from './dashboard/StaffReport';

import OrderFailSLAHandover from './dashboard/OrderFailSLAHandover';

import TaskReceived from './dashboard/TaskReceived';

import OrderPending from './dashboard/OrderPending';

// icons
import ReportAdmin from '../components/ReportAdmin';


// menu data
import menuApp from '../mockdata/menuApp.json';

class HomeScreen extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      scrollY: new Animated.Value(0),
      email_login : null,
      warehouse_code : null,
      from_time : _getTimeDefaultFrom(),
      to_time : _getTimeDefaultTo(),
      isVisibleMenu :false,
      imageAvartar : null
    };
  };

  UNSAFE_componentWillMount = async () =>{
    let email_login = await AsyncStorage.getItem('staff_profile');
    this.setState({
      email_login: JSON.parse(email_login).fullname,
      imageAvartar: JSON.parse(email_login).avatar,
      warehouse_code: JSON.parse(email_login).warehouse_id.name
    });

  };

  iconActionFind = async () => {
    this.props.navigation.navigate(
      'ModelTimelineTracking',
      {
        'tracking_code' : null,
        "is_show": true
      });
  };

  onLoadMenu = async (code) =>{
    await this.setState({isVisibleMenu : code})
  }


  render() {
    const {
      scrollY,
      email_login,
      isVisibleMenu,
      warehouse_code,
      to_time,
      from_time
    } = this.state;
    const { navigation} = this.props;

    return (
      <React.Fragment>
        <View style={[gStyle.container]}>
          <LinearGradient fill="#3d4c6c" height={device.iPhoneNotch ? 55 : 40} />
          <Animated.View style={[styles.containerSearchBar]}>
              <Animated.View style={gStyle.flexRowSpace}>
                  <View style={[gStyle.flexRowCenterAlign]}>
                    <Image source={images["iconMotify"]} style={styles.notifyImage} />
                    <View style={{marginLeft:6}}>
                        <Text style={{...gStyle.textBoxme18,color:colors.white}}>{warehouse_code}<Entypo name="dot-single" size={22} color={colors.brandPrimary} /></Text>
                        <Text style={{
                        ...gStyle.textBoxme10,
                        color: colors.greyInactive}}>{email_login}</Text>
                    </View>
                  </View>
                  <View style={[gStyle.flexCenter,{
                    backgroundColor:colors.borderLight,
                    borderRadius:50,
                    height:35,
                    width:35,
                  }]}>
                    <TouchIcon
                        icon={<Feather color={colors.white} name="search" />}
                        onPress={() =>this.iconActionFind()}
                        iconSize={20}
                    />
                  </View>
              </Animated.View>
        </Animated.View>
        <Animated.ScrollView
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          style={[gStyle.container]}
        >


          <OrderFailSLAHandover from_time={from_time} to_time ={to_time} navigation={navigation} />


          <StaffReport navigation={navigation} />


          <TaskReceived navigation={navigation} />

          <ReportAdmin to_time ={to_time} />

          <OrderPending />

          <View style={gStyle.spacer11} />
          <View style={gStyle.spacer11} />
        </Animated.ScrollView>
       </View>

        <MenuHorizontal
          navigation={navigation}
          isVisible={isVisibleMenu}
          onClose={this.onLoadMenu}
          data={menuApp}
        />


        <ActionButton buttonColor={colors.borderLight}
            outRangeScale = {0}
            size={50}
            renderIcon={() =><Image source={images["main_menu"]} style={{width:26,height:26,}} />}

            onPress={() => this.onLoadMenu(true)}
        />


      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  containerSearchBar: {
    paddingHorizontal:10,
    paddingBottom:12
  },
  notifyImage : {
    width:50,
    height:50,
    borderRadius:8
  },
});

export default HomeScreen;
