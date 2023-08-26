import React, { useState, useEffect } from "react";
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors, gStyle } from "../../constants";

import TextInputComponent from "../../components/TextInputComponent";
import ModelSellerPick from "./ModelSellerPick";

const ModelOptionPickup = (props) => {
  const [listData, setlistData] = useState(props.listData);
  const [listDataReport, setlistDataReport] = useState(props.listDataReport);
  const [showBytracking, setshowBytracking] = useState(false);
  const [trackingCode, settrackingCode] = useState(null);
  const [openSeller, setopenSeller] = useState(false);

  const onSubmit = async (pickup_type) => {
    if (pickup_type === "customize") {
      setopenSeller(true);
    } else {
      props.onSelect(pickup_type, trackingCode);
    }
  };

  const onSubmitSeller = async (pickup_type) => {
    const pickup_type_map = "customize_" + pickup_type;
    setopenSeller(false);
    props.onSelect(pickup_type_map, trackingCode);
  };

  const renderPickupType = (obj, index) => {
    return (
      <TouchableOpacity
        key={`${obj.tab}_${index}`}
        activeOpacity={gStyle.activeOpacity}
        onPress={() => onSubmit(obj.tab)}
        style={{
          flexDirection: "row",
          paddingVertical: 8,
          backgroundColor: colors.whiteBg,
          marginHorizontal: 10,
          borderBottomWidth: 1,
          borderBottomColor: "#f0f1f6",
        }}
      >
        <View style={gStyle.flexRow}>
          <View style={[gStyle.flexCenter, { width: 60, marginRight: 5 }]}>
            <Feather color={colors.black70} name={obj.icon} size={26} />
          </View>
          <View style={{ width: Dimensions.get("window").width - 90 }}>
            <View style={[gStyle.flexRowSpace]}>
              <Text style={styles.textValue}>{props.t(obj.title)}</Text>
              <TouchableOpacity
                style={{
                  backgroundColor:
                    listDataReport[obj.key_value] > 0
                      ? colors.boxmeBrand
                      : colors.greyLight,
                  paddingVertical: 2,
                  paddingHorizontal: 6,
                  borderRadius: 6,
                  marginTop: 7,
                  marginRight: 10,
                }}
              >
                <Text style={{ color: colors.white }}>
                  {listDataReport[obj.key_value]}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={[gStyle.flexRowSpace]}>
              <Text style={[styles.textLabel, { width: "80%" }]}>
                {props.t(obj.sub)}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderInputTracking = () => {
    return (
      <View style={[gStyle.flex1, { marginTop: 10 }]}>
        <Text
          style={{
            paddingHorizontal: 15,
            marginBottom: -10,
          }}
        >
          {props.t("screen.module.pickup.create.tracking_code")}
        </Text>
        <TextInputComponent
          navigation={props.navigation}
          textLabel={null}
          keyboardType={"default"}
          ediTable={true}
          autoChange={true}
          autoFocus={true}
          showSearch={true}
          showScan={false}
          onPressCamera={settrackingCode}
          onSubmitEditingInput={settrackingCode}
          textPlaceholder={""}
        />
        <View
          style={{
            marginTop: 10,
            marginHorizontal: 15,
          }}
        >
          <TouchableOpacity
            style={[
              styles.bottomButton,
              { backgroundColor: colors.boxmeBrand },
            ]}
            onPress={() => props.onSelect("by_tracking", trackingCode)}
          >
            <Text style={styles.textButton}>
              {props.t("screen.module.pickup.create.btn_create")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <Modal animationType="slide" presentationStyle="formSheet" visible={true}>
      <TouchableWithoutFeedback style={gStyle.flex1}>
        <View style={[gStyle.container]}>
          <View
            style={{
              height: Dimensions.get("window").height,
              width: Dimensions.get("window").width,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              backgroundColor: "#f0f1f6",
            }}
          >
            <View
              style={[
                gStyle.flexRowSpace,
                {
                  paddingVertical: 15,
                  paddingHorizontal: 10,
                  borderBottomColor: "#f0f1f6",
                  borderBottomWidth: 1.5,
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                  backgroundColor: colors.whiteBg,
                },
              ]}
            >
              <Text>
                {props.t("screen.module.pickup.create.text_select_pickup")}
              </Text>
              <TouchableOpacity
                onPress={() => props.onClose()}
                activeOpacity={gStyle.activeOpacity}
                style={gStyle.flexCenter}
              >
                <Feather color={colors.black70} name="chevron-down" size={20} />
              </TouchableOpacity>
            </View>
            <View
              style={[
                gStyle.flexRow,
                {
                  marginHorizontal: 10,
                  marginVertical: 10,
                  backgroundColor: colors.whiteBg,
                  paddingVertical: 8,
                  paddingHorizontal: 8,
                  borderRadius: 6,
                },
              ]}
            >
              <TouchableOpacity
                activeOpacity={gStyle.activeOpacity}
                onPress={() => setshowBytracking(false)}
                style={{
                  width: "50%",
                  backgroundColor: !showBytracking
                    ? colors.darkgreen
                    : "#f0f1f6",
                  paddingVertical: 13,
                  borderTopLeftRadius: 8,
                  borderBottomLeftRadius: 8,
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: !showBytracking ? colors.white : colors.black,
                  }}
                >
                  {props.t("screen.module.pickup.create.by_order_type")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setshowBytracking(true)}
                style={{
                  width: "50%",
                  backgroundColor: showBytracking
                    ? colors.darkgreen
                    : "#f0f1f6",
                  paddingVertical: 13,
                  borderTopRightRadius: 8,
                  borderBottomRightRadius: 8,
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: showBytracking ? colors.white : colors.black,
                  }}
                >
                  {props.t("screen.module.pickup.create.by_tracking_code")}
                </Text>
              </TouchableOpacity>
            </View>
            <ScrollView>
              {showBytracking ? (
                renderInputTracking()
              ) : (
                <View>
                  {listData.map((track, index) => (
                    <View key={index}>
                      <Text
                        style={{
                          ...gStyle.textBoxme16,
                          color: colors.black70,
                          paddingVertical: 8,
                          paddingHorizontal: 10,
                        }}
                      >
                        {props.t(track.title)}
                      </Text>
                      {track.data.map((element, kindex) =>
                        renderPickupType(element, kindex)
                      )}
                    </View>
                  ))}
                </View>
              )}
              <View style={gStyle.spacer11} />
              <View style={gStyle.spacer11} />
            </ScrollView>
          </View>
          {openSeller && (
            <ModelSellerPick
              trans={props.t}
              onClose={setopenSeller}
              onSubmit={onSubmitSeller}
            />
          )}
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  bottomButton: {
    justifyContent: "center",
    alignContent: "center",
    width: "100%",
    paddingVertical: 15,
    borderRadius: 6,
    backgroundColor: colors.boxmeBrand,
  },
  textButton: {
    textAlign: "center",
    color: colors.white,
    ...gStyle.textBoxme18,
  },
  textLabel: {
    ...gStyle.textBoxme14,
    color: colors.black50,
  },
  textValue: {
    ...gStyle.textBoxme16,
    color: colors.black70,
  },
});
export default ModelOptionPickup;
