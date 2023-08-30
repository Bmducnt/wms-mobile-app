import * as React from "react";
import PropTypes from "prop-types";
import {
  Text,
  View,
  StyleSheet,
} from "react-native";
import ActionButton from "react-native-action-button";
import { FontAwesome5 } from "@expo/vector-icons";
import {
  TabView,
  SceneMap,
  TabBar
} from "react-native-tab-view";
import {
  colors,
  gStyle,
  device
} from "../../constants";
import ScreenHeader from "../../components/ScreenHeader";
import PickupItemTabAwaiting from "./PickupItemTabAwaiting";
import PickupItemTabTodo from "./PickupItemTabTodo";
import PickupItemTabPacking from "./PickupItemTabPacking";
import PickupItemTabException from "./PickupItemTabException";
import {translate} from "../../i18n/locales/IMLocalized";

class PickupsLists extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      routes: [],
      isloading: false,
      pickup_code: null
    };
    this._searchCameraBarcode = this._searchCameraBarcode.bind(this);
  }

  setIndex = async (index_tab) => {
    this.setState({ index: index_tab });
  };

  UNSAFE_componentWillMount = async () => {
    this.setState({
      routes: [
        {
          key: "pickup_await",
          title: translate("screen.module.pickup.list.status_await"),
        },
        {
          key: "pickup_doing",
          title: translate("screen.module.pickup.list.status_doing"),
        },
        {
          key: "pickup_packing",
          title: translate("screen.module.packed.status_awaiting"),
        },
        {
          key: "pickup_done",
          title: translate("screen.module.pickup.list.status_done"),
        },
      ],
    });
  };

  _searchCameraBarcode = async (code) => {
    this.setState({ pickup_code: code ? code : null });
  };

  render() {
    const { navigation } = this.props;
    const { pickup_code} = this.state;
    return (
      <View style={[gStyle.container]}>
        <View >
          <ScreenHeader
            title={translate("screen.module.pickup.list.header")}
            showBack={false}
            isFull={true}
            showInput={true}
            inputValueSend={null}
            autoFocus={false}
            bgColor={colors.cardLight}
            onPressCamera={this._searchCameraBarcode}
            onSubmitEditingInput={this._searchCameraBarcode}
            textPlaceholder={translate("screen.module.pickup.list.search_text")}
           navigation={navigation}/>
        </View>
        <TabView
          lazy
          navigationState={this.state}
          renderScene={SceneMap({
            pickup_await: () => (
              <PickupItemTabAwaiting
                navigation={navigation}
                code={pickup_code}
                status_id={400}
              />
            ),
            pickup_doing: () => (
              <PickupItemTabTodo
                navigation={navigation}
                code={pickup_code}
                status_id={402}
              />
            ),
            pickup_packing: () => (
              <PickupItemTabPacking
                navigation={navigation}
                code={pickup_code}
                status_id={407}
              />
            ),
            pickup_done: () => (
              <PickupItemTabException
                navigation={navigation}
                code={pickup_code}
                status_id={0}
              />
            ),
          })}
          onIndexChange={this.setIndex}
          renderTabBar={(props) => (
            <TabBar
              scrollEnabled={true}
              bounces={true}
              {...props}
              indicatorStyle={{ backgroundColor: colors.transparent }}
              style={{
                backgroundColor:colors.transparent,
                elevation: 0,
                shadowOpacity: 0,
                borderBottomWidth: 0,
               }}
              tabStyle={{
                backgroundColor: colors.transparent,
                marginTop: -16,
                width: 95,
              }}
              activeColor={colors.white}
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
              )}
            />
          )}
        />
        <ActionButton
          buttonColor={colors.boxmeBrand}
          renderIcon={() => (
            <FontAwesome5 name="plus" size={14} color={colors.white} />
          )}
          onPress={() =>
            navigation.navigate("ModelListStaff", { is_ff_now: false })
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  iconRight: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: 15,
    width:35,
    height:35,
    borderRadius:35/2,
    backgroundColor:colors.borderLight,
    top: device.iPhoneNotch ? 40 : 20,
    zIndex: 100,
  },
});

PickupsLists.propTypes = {
  // required
  navigation: PropTypes.object.isRequired,
};

export default PickupsLists;
