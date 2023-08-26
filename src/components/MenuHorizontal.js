import * as React from "react";
import PropTypes from "prop-types";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { NavigationContainer } from '@react-navigation/native';
import { colors, gStyle, images, device } from "../constants";
const MenuHorizontal = (props) => {
  const [data, setdata] = React.useState(props.data);
  const [navigation, setnavigation] = React.useState(props.navigation);
  const onPressMenu = (action, parram) => {
    props.onClose(false);
    navigation.navigate(action, parram);
  };

  const renderMenu = (data) => {
    return (
      <View
        style={[
          gStyle.flexRow,
          {
            paddingVertical: 5,
          },
        ]}
      >
        {Object.keys(data).map((index) => {
          const item = data[index];
          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={gStyle.activeOpacity}
              hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
              onPress={() => onPressMenu(item.action, item.parram)}
              style={[styles.menu, gStyle.flexCenter]}
            >
              <View style={[styles.menuIcon]}>
                <Image source={images[item.icon]} style={styles.imageIcon} />
              </View>
              <Text
                style={styles.menuText}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {props.trans(`${item.title}`)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      onRequestClose={() => props.onClose(false)}
      visible={props.isVisible}
    >
      <TouchableWithoutFeedback>
        <View
          style={{
            flex: 1,
            position: "absolute",
            bottom: 0,
          }}
        >
          <View
            style={{
              height: device.iPhoneNotch
                ? 350
                : Dimensions.get("window").height / 2,
              width: Dimensions.get("window").width,
              borderTopLeftRadius: 3,
              borderTopRightRadius: 3,
              backgroundColor: colors.whiteBg,
            }}
          >
            <View
              style={[
                gStyle.flexRowSpace,
                {
                  paddingVertical: 13,
                  paddingHorizontal: 15,
                  borderBottomColor: "#f0f1f6",
                  borderBottomWidth: 1,
                },
              ]}
            >
              <Text>{props.trans("screen.module.home.menu")}</Text>
              <TouchableOpacity
                onPress={() => props.onClose(false)}
                style={gStyle.flexCenter}
                activeOpacity={gStyle.activeOpacity}
              >
                <Feather color={colors.black70} name="chevron-down" size={20} />
              </TouchableOpacity>
            </View>
            <View styles={{ marginHorizontal: 10 }}>
              {renderMenu(data.slice(0, 4))}
              {renderMenu(data.slice(4, 8))}
              {renderMenu(data.slice(8, 12))}
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

MenuHorizontal.propTypes = {
  // required
  data: PropTypes.array.isRequired,
  navigation: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  menu: {
    paddingVertical: 3,
    width: Dimensions.get("window").width / 4,
  },
  imageIcon: {
    width: 28,
    height: undefined,
    resizeMode: "contain",
    aspectRatio: 1,
    borderRadius: 6,
  },
  menuIcon: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f0f1f6",
    padding: 6,
    borderRadius: 12,
  },
  menuText: {
    ...gStyle.textBoxme10,
    paddingTop: 4,
    paddingHorizontal: 10,
    textAlign: "center",
  },
});

export default NavigationContainer(MenuHorizontal);
