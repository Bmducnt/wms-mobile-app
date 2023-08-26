import * as React from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  View,
  Dimensions,
  StyleSheet
} from 'react-native';
import * as Device from 'expo-device';
import { Feather} from "@expo/vector-icons";
import { TabView, SceneMap,TabBar } from 'react-native-tab-view';
import { colors, device, gStyle } from '../../constants';
import TouchIcon from "../../components/TouchIcon";
import ModelDate from '../../screens/packed/ModelDate';
// components
import ScreenHeader from '../../components/ScreenHeader';
import InboundList from './InboundList';
import RMAList from './RMAList';
import RollbackList from './RollbackList';
import {_getTimeDefaultFrom,_getTimeDefaultTo} from '../../helpers/device-height';

class PutawayLists extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      codescan: null,
      from_time: _getTimeDefaultFrom(),
      to_time: _getTimeDefaultTo(),
      isDatePickerVisible: false,
      index:0,
      routes : [
        
      ]
    };
  };

  UNSAFE_componentWillMount = async () =>{
    const { t } = this.props.screenProps;
    this.setState({
      routes :[
        { key: 'inbound', title: t('screen.module.putaway.tab_inbound') },
        { key: 'rma', title: t('screen.module.putaway.tab_rma') },
        { key: 'binrollback', title:t('screen.module.putaway.tab_rollback') }
      ]
    })
  }

  setIndex = async (index_tab) =>{
    this.setState({index : index_tab})
  }

  codescan = async (code) =>{
    this.setState({codescan : code})
  }
  
  _openModelTime = async (code) => {
    this.setState((prev) => ({
      isDatePickerVisible: !prev.isDatePickerVisible
    }));
  };

  _onConfirmTime = async (from_time,to_time) => {
      await this.setState({from_time : from_time,to_time:to_time});
      this._openModelTime();
  }

  render() {
    const {
      navigation
    } = this.props;
    const {
      codescan,
      isDatePickerVisible,
      from_time,
      to_time
    } = this.state;
    const {t} = this.props.screenProps;
    return (
      <View style={[gStyle.container]}>
        <View>
          <ScreenHeader 
            title={t('screen.module.putaway.list')}
            showBack={true}
            showInput = {true}
            inputValueSend ={null}
            bgColor = {colors.cardLight}
            autoFocus={Device.osName === 'Android' ? true : false}
            onPressCamera={this.codescan}
            onSubmitEditingInput= {this.codescan}
            textPlaceholder={t('screen.module.putaway.text_search_input')}
          />
        </View>
        <TabView
            lazy
            navigationState={this.state}
            renderScene={SceneMap({
              inbound: () => <InboundList t={t} navigation={navigation} code={codescan} fromTime ={from_time} toTime ={to_time}/>,
              rma: () => <RMAList t={t} navigation={navigation} code={codescan} fromTime ={from_time} toTime ={to_time}/>,
              binrollback: () => <RollbackList t={t} navigation={navigation} code={codescan} fromTime ={from_time} toTime ={to_time}/>,
            })}
            onIndexChange={this.setIndex}
            initialLayout={{ width: Dimensions.get("window").width }}
            renderTabBar={props =>
              <TabBar
              scrollEnabled={true}
              bounces={true}
                  {...props}
                  indicatorStyle={{ backgroundColor: colors.transparent}}
                  style={{ backgroundColor:colors.transparent,
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 0,}}
                  tabStyle={{ backgroundColor: colors.transparent, marginTop: -16,
                    width: Dimensions.get("window").width/3}} // here
                  activeColor ={colors.white}
                  renderLabel={({ route, focused, color }) => (
                    <View style={[gStyle.flexCenter,]}>
                  
                      <Text
                        style={{ color : focused ? colors.white :colors.greyInactive, ...gStyle.textBoxmeBold14}}
                        numberOfLines={1}
                      >
                        {route.title}
                      </Text>
                      {focused && (
                        <View
                          style={{
                            height:4,
                            marginTop:3,
                            width:20,
                            backgroundColor: colors.yellow,
                            borderTopLeftRadius:50,
                            borderTopRightRadius:50,
                          }}
                        />
                      )}
                    </View>
                  )}/>
                  }
          />
        <View style={styles.iconRight}>
            <TouchIcon
              icon={<Feather color={colors.white} name="filter" />}
              onPress={() => this._openModelTime()}
              iconSize ={20}
            />
        </View>
        <ModelDate
            t={t}
            isVisible = {isDatePickerVisible}
            onClose = {this._openModelTime} 
            onSelect = {this._onConfirmTime}
            fromTime = {from_time}
            toTime = {to_time}
        />
      </View>
    );
  }
}

PutawayLists.propTypes = {
  // required
  navigation: PropTypes.object.isRequired,
  screenProps: PropTypes.object.isRequired
};
const styles = StyleSheet.create({
  iconRight: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: 15,
    top: device.iPhoneNotch ? 70 : 60,
    zIndex: 100,
  },
});
export default PutawayLists;
