import * as React from "react";
import PropTypes from "prop-types";
import {
  Animated,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from "react-native";
import { TabView, SceneMap,TabBar } from 'react-native-tab-view';
import ActionButton from 'react-native-action-button';
import {FontAwesome5 } from "@expo/vector-icons";
import { colors, device, gStyle } from "../../constants";

// components
import TabInventoryCycle from './TabInventoryCycle';
import ScreenHeader from "../../components/ScreenHeader";
import TouchIcon from "../../components/TouchIcon";
import {
  _getTimeDefaultFrom,
  _getTimeDefaultTo,
  _getDatetimeToTimestamp,
  _convertDatetimeToTimestamp,
} from "../../helpers/device-height";


class ListInventory extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      index:0,
      routes : []
    };
  }

  UNSAFE_componentWillMount = async () => {
    const { t } = this.props.screenProps;
    this.setState({
      routes :[
        { key: 'cycle_await', title: t('screen.module.cycle_check.status_new') },
        { key: 'cycle_doing', title: t('screen.module.cycle_check.status_todo') },
        { key: 'cycle_verify', title: t('screen.module.cycle_check.status_verify') },
        { key: 'cycle_done', title:t('screen.module.cycle_check.status_done') },
        { key: 'cycle_cancel', title:t('screen.module.cycle_check.status_cancel') }
      ]
    })
  };

  setIndex = async (index_tab) =>{
    this.setState({index : index_tab})
  }

  render() {
    const { navigation } = this.props;
    const { t } = this.props.screenProps;
    return (
      <React.Fragment>
        <View style={[gStyle.container]}>
          <View
          >
            <ScreenHeader
              title={t('screen.module.cycle_check.header_list')}
              showBack={false}
              bgColor = {colors.cardLight}
              textAlign={'center'}
            />
          </View>
          <TabView
            lazy
            navigationState={this.state}
            renderScene={SceneMap({
              cycle_await: () => <TabInventoryCycle t={t} navigation={navigation}  status_id={901}/>,
              cycle_doing: () => <TabInventoryCycle t={t} navigation={navigation} status_id={902}/>,
              cycle_verify: () => <TabInventoryCycle t={t} navigation={navigation} status_id={903}/>,
              cycle_done: () => <TabInventoryCycle t={t} navigation={navigation} status_id={904}/>,
              cycle_cancel: () => <TabInventoryCycle t={t} navigation={navigation} status_id={905}/>,
            })}
            onIndexChange={this.setIndex}
            initialLayout={{ width: Dimensions.get("window").width }}
            renderTabBar={props =>
            <TabBar
                scrollEnabled={true}
                bounces ={true}
                {...props}
                indicatorStyle={{ backgroundColor: colors.transparent}}
                style={{ 
                  backgroundColor:colors.transparent,
                  elevation: 0,
                  shadowOpacity: 0,
                  borderBottomWidth: 0,
                }}
                tabStyle={{ 
                  backgroundColor: colors.transparent, 
                  marginTop:-16,
                  width: Dimensions.get("window").width/4
                }}
                activeColor ={colors.white}
                renderLabel={({ route, focused, color }) => (
                  <View style={[gStyle.flexCenter]}>
                    <Text style={{ color ,...gStyle.textBoxmeBold14}} numberOfLines={1}>
                        {route.title}
                    </Text>
                    {focused && 
                    <View style={{
                        height:4,
                        marginTop:3,
                        width:20,
                        backgroundColor: colors.yellow,
                        borderTopLeftRadius:50,
                        borderTopRightRadius:50,
                    }}/>}
                  </View>
                )}/>
            }
          />
          <ActionButton buttonColor={colors.boxmeBrand} buttonTextStyle={{...gStyle.textBoxme26}}
            renderIcon={() => <FontAwesome5 name="plus" size={14} color={colors.white} />}
            onPress={() => navigation.navigate("CreateResquest",{})}
          />
          <View style={gStyle.iconRight}>
            <TouchIcon
              icon={<FontAwesome5 name="plus" size={14} color={colors.white} />}
              onPress={() => navigation.navigate("CreateResquest",{})}
              iconSize={18}
            />
          </View>
        </View>
      </React.Fragment>
    );
  }
}

ListInventory.propTypes = {
  // required
  navigation: PropTypes.object.isRequired,
  screenProps: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  iconRight: {
    alignItems: "center",
    height: 28,
    justifyContent: "center",
    position: "absolute",
    right: 24,
    top: device.iPhoneNotch ? 45 : 20,
    width: 28,
    zIndex: 100,
  },
});

export default ListInventory;
