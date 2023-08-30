import React, { useState } from "react";
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { colors, device, gStyle } from "../../constants";
import {translate} from "../../i18n/locales/IMLocalized";

const ModelFilter = (props) => {
  const [listData] = useState(props.data);
  const [tabSelect, settabSelect] = useState(null);

  const renderObjDate = (obj) => {
    return (
      <TouchableOpacity
        activeOpacity={gStyle.activeOpacity}
        onPress={() => settabSelect(obj.tab)}
        style={{
          flexDirection: "row",
          marginHorizontal: 10,
          marginVertical: 6,
        }}
      >
        <View
          style={[
            gStyle.flexRow,
            {
              paddingHorizontal: 10,
              paddingVertical: 10,
              borderRadius: 6,
              backgroundColor:
                tabSelect === obj.tab ? colors.brandPrimary : colors.white,
            },
          ]}
        >
          <View style={[gStyle.flexCenter]}>
            <Feather
              color={tabSelect === obj.tab ? colors.white : colors.black70}
              name={tabSelect === obj.tab ? "check-circle" : obj.icon}
              size={14}
            />
          </View>
          <View style={{ paddingVertical: 6, marginLeft: 5 }}>
            <Text
              style={[
                styles.textValue,
                { color: tabSelect === obj.tab ? colors.white : colors.black },
              ]}
            >
              {translate(obj.title)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <Modal
      animationType="slide"
      transparent={false}
      presentationStyle="formSheet"
      visible={props.isVisible}
    >
      <View style={[gStyle.container, { backgroundColor: "#f0f1f6" }]}>
        <View
          style={{
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
        >
          <View
            style={[
              {
                paddingVertical: 15,
                paddingHorizontal: 10,
                borderBottomColor: "#f0f1f6",
                borderBottomWidth: 1,
                backgroundColor: colors.whiteBg,
              },
            ]}
          >
            <View style={gStyle.flexRowSpace}>
              <TouchableOpacity
                onPress={() => props.onClose(false)}
                activeOpacity={gStyle.activeOpacity}
              >
                <Ionicons color={colors.black70} name="close" size={24} />
              </TouchableOpacity>
              <Text style={[styles.textValue, { ...gStyle.textBoxme16 }]}>
                {translate("screen.module.pickup.detail.filter_detail_status")}
              </Text>
              <Text style={[styles.textLabel]}></Text>
            </View>
          </View>
          <Text
            style={[
              styles.textLabel,
              {
                marginVertical: 15,
                paddingHorizontal: 10,
                ...gStyle.textBoxmeBold14,
              },
            ]}
          >
            {translate("screen.module.pickup.detail.filter_detail_status_sub")}
          </Text>

          <View>
            <FlatList
              numColumns={Math.ceil(listData.length / 2)}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              data={listData}
              keyExtractor={(item, index) => item + index.toString()}
              renderItem={({ item }) => renderObjDate(item)}
            />
          </View>
        </View>
        <View style={[gStyle.flexCenter, styles.containerBottom]}>
          <TouchableOpacity
            style={[styles.bottomButton]}
            onPress={() => props.onCofirm(tabSelect)}
          >
            {!props.isLoading ? (
              <Text style={styles.textButton}>{translate("base.search")}</Text>
            ) : (
              <ActivityIndicator />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  containerBottom: {
    position: "absolute",
    width: "100%",
    bottom: device.iPhoneNotch ? 10 : 0,
  },
  bottomButton: {
    justifyContent: "center",
    alignContent: "center",
    width: "90%",
    paddingVertical: 15,
    borderRadius: 6,
    backgroundColor: colors.darkgreen,
  },
  textButton: {
    textAlign: "center",
    color: colors.white,
    ...gStyle.textBoxmeBold14,
  },
  textLabel: {
    ...gStyle.textBoxme14,
    color: colors.black70,
  },
  textValue: {
    ...gStyle.textBoxme14,
    color: colors.black,
  },
});
export default ModelFilter;
