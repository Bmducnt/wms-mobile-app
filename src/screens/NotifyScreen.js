import * as React from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Image,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import { colors, images, gStyle } from '../constants';

// components
import ScreenHeader from '../components/ScreenHeader';
import {_getTimeDefaultFrom,_getTimeDefaultTo,permissionDenied} from '../helpers/device-height';

//api
import getListNotifyByWarehouse from '../services/reports/notify';

class NotifyScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      scrollY: new Animated.Value(0),
      list_notify : [],
      isloading:false

    };
  };

  componentDidMount() {
  }

  UNSAFE_componentWillMount = async () =>{
    this._fetchNotify()
  };

  componentWillUnmount() {
  }

  _fetchNotify = async  () =>{
    this.setState({isloading : true})
    const response = await getListNotifyByWarehouse({
    });
    if (response.status === 200){
      this.setState({list_notify:response.data.results});
    }else if (response.status === 403){
      permissionDenied(this.props.navigation);
    };
    this.setState({isloading : false})
  };

  render() {
    const {
      navigation
    } = this.props;
    const {isloading,scrollY,list_notify} = this.state;
    const {t} = this.props.screenProps;
    const opacityIn = scrollY.interpolate({
        inputRange: [0, 128],
        outputRange: [0, 1],
        extrapolate: 'clamp'
    });
    return (
      <View style={[gStyle.container]}>
        <Animated.View style={{ position: 'absolute', top: 0, width: '100%', zIndex: 10 ,opacity: opacityIn}}>
          <ScreenHeader 
            title={t('base.notify')}
            showBack={true}
            showInput = {false}
          />
        </Animated.View>
        <Animated.ScrollView
            onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                { useNativeDriver: true }
            )}
            refreshControl={
              <RefreshControl
                refreshing={isloading}
                onRefresh={this._fetchNotify}
              />
            }
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            style={[gStyle.container,{marginHorizontal:10}]}
        >
            <View style={gStyle.spacer11} />
            <Animated.View style={[gStyle.flexRow,{marginHorizontal:10}]}>
                <Text style={{color:colors.white,...gStyle.textBoxmeBold26}}>{t('base.notify')}</Text>
            </Animated.View>
            {isloading && <View style={gStyle.flexCenter}>
              <ActivityIndicator/>
            </View>}

            {list_notify.length === 0 && !isloading && <View style={[gStyle.flexCenter,{marginTop:'20%'}]}>
                <Ionicons name="ios-notifications-off-outline" size={28} color={colors.white} />
                <Text style={{...gStyle.textBoxme16,color:colors.white}}>
                  {t('base.empty')}
                </Text>
            </View>}
            {list_notify.length > 0 && (<View >
            {Object.keys(list_notify).map((index) => {
              const item = list_notify[index];
              return (
                <View key={index} style={styles.container}>
                    <TouchableOpacity
                      activeOpacity={gStyle.activeOpacity}
                      onPress={() => null}
                      style={styles.container}
                    >
                      <View style={gStyle.flexRow}>
                        <Image source={images['iconMotify']} style={styles.notifyImage} />
                        <View style={{width:Dimensions.get("window").width-65,marginHorizontal:5}} selectable={true}>
                            <Text style={{...gStyle.textBoxme14,color:colors.white}}>
                              {item.nofity_body}
                            </Text>
                            <Text style={{...gStyle.textBoxme12,color:colors.boxmeBrand,paddingTop:3}}>
                            {moment(item.request_time).fromNow()}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                </View>
              );
            })}
          </View>)}

        </Animated.ScrollView>
      </View>
    );
  }
}

NotifyScreen.propTypes = {
  // required
  navigation: PropTypes.object.isRequired,
  screenProps: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginVertical:5,
    width: "100%"
  },
  notifyImage : {
    width:35,
    height:35,
    borderRadius:6
  },

});

export default NotifyScreen;
