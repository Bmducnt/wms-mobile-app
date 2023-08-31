import * as React from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Feather, AntDesign } from "@expo/vector-icons";
import { colors, gStyle, device } from "../../constants";
import addRulePickup from "../../services/pickup/add-rule";
import getListRulePickup from "../../services/pickup/list-rule";
import removeRulePickup from "../../services/pickup/remove_rule";
import {translate} from "../../i18n/locales/IMLocalized";

const BySLAconfig = (props) => {

  const [listSLAPack, setlistSLAPack] = React.useState([]);
  const [slaSelect, setslaSelect] = React.useState(null);
  const [sla, setsla] = React.useState(null);

  const fetchConfig = async () => {
    const response = await getListRulePickup({ key: "by_sla" });
    if (response?.status === 200) {
      setsla(response?.data?.results);
    }
  };

  const removeSLAConfig = async () => {
    await removeRulePickup(JSON.stringify({ rule_type: "by_sla" }));
    setsla(null);
  };

  const addRuleSLA = async () => {
    if (slaSelect) {
      const response = await addRulePickup(
        JSON.stringify({
          rule_type: "by_sla",
          sla_date: slaSelect,
        })
      );
      if (response?.status === 200) {
        Alert.alert(
          "",
          translate("screen.module.pickup_rule.add_ok"),
          [
            {
              text: translate("base.confirm"),
              onPress: () => props.onClose(false),
            },
          ],
          { cancelable: false }
        );
      }
    } else {
      props.onClose(false);
    }
  };

  const onSelectSLA = async (sla_date) => {
    let is_submmit = false;

    let updatedList = listSLAPack.map((item) => {
      if (item.sla_date === sla_date) {
        if (!item.active) {
          is_submmit = true;
        }
        return { ...item, active: !item.active };
      }
      return { ...item, active: false };
    });
    if (is_submmit) {
      setslaSelect(sla_date);
    } else {
      setslaSelect(null);
    }
    setlistSLAPack(updatedList);
  };

  React.useEffect(() => {
    async function getSLACache() {
      const listSLA = await AsyncStorage.getItem("sla_pack_order");
      setlistSLAPack(JSON.parse(listSLA));
    }
    getSLACache();
    fetchConfig();
  }, []);

  return (
    <React.Fragment>
      <Modal
        animationType="fade"
        presentationStyle="formSheet"
        visible={props.visible}
      >
        <View style={[gStyle.container, { backgroundColor: "#f6f7f7" }]}>
          <View
            style={[
              gStyle.flexRowSpace,
              {
                paddingVertical: 15,
                paddingHorizontal: 15,
              },
            ]}
          >
            <Text>{translate("screen.module.pickup_rule.by_sla_title")}</Text>
            <TouchableOpacity
              onPress={() => props.onClose(false)}
              style={gStyle.flexRowSpace}
              activeOpacity={gStyle.activeOpacity}
            >
              <AntDesign
                name="closecircle"
                size={22}
                color={colors.greyInactive}
              />
            </TouchableOpacity>
          </View>
          <View style={{ paddingHorizontal: 15, paddingVertical: 13 }}>
            <Text>{translate("screen.module.pickup_rule.by_sla_title_sub")}</Text>
          </View>
          <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
            <View
              style={{
                paddingHorizontal: 10,
                paddingVertical: 13,
                marginHorizontal: 10,
                marginVertical: 5,
              }}
            >
              <Text>{translate("screen.module.pickup_rule.by_sla_list")}</Text>
              {sla && (
                <View
                  style={[
                    ,
                    {
                      backgroundColor: colors.whiteBg,
                      paddingVertical: 5,
                      paddingHorizontal: 10,
                      borderRadius: 3,
                      marginTop: 5,
                    },
                  ]}
                >
                  <View
                    style={[
                      gStyle.flexRowSpace,
                      {
                        padding: 12,
                        backgroundColor: "#f6f7f7",
                        margin: 4,
                        borderRadius: 6,
                        width: "95%",
                      },
                    ]}
                  >
                    <Text
                      style={{ color: colors.darkgreen, ...gStyle.textBoxme14 }}
                    >
                      {translate("screen.module.pickup_rule.prioritize")}
                    </Text>
                    <TouchableOpacity
                      style={gStyle.flexRowCenterAlign}
                      onPress={() => removeSLAConfig()}
                    >
                      <Text
                        style={{
                          color: colors.darkgreen,
                          ...gStyle.textBoxmeBold14,
                          paddingRight: 8,
                        }}
                      >
                        {sla}
                      </Text>
                      <AntDesign
                        name="closecircle"
                        size={16}
                        color={colors.greyInactive}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              <View
                style={{
                  backgroundColor: colors.whiteBg,
                  paddingHorizontal: 10,
                  paddingVertical: 13,
                  marginTop: sla ? 1 : 5,
                }}
              >
                {listSLAPack &&
                  listSLAPack.map((track, index) => (
                    <TouchableOpacity
                      onPress={() => onSelectSLA(track.sla_date)}
                      key={index}
                      style={[
                        gStyle.flexRowSpace,
                        {
                          padding: 12,
                          backgroundColor: "#f6f7f7",
                          margin: 4,
                          borderRadius: 6,
                          width: "95%",
                        },
                      ]}
                    >
                      <Text key={track} style={{ paddingRight: 15 }}>
                        {track.sla_date}
                      </Text>
                      <Feather
                        name={track.active ? "check-circle" : "circle"}
                        size={16}
                        color={
                          track.active ? colors.darkgreen : colors.greyInactive
                        }
                      />
                    </TouchableOpacity>
                  ))}
              </View>
            </View>
          </ScrollView>
          <View style={styles.containerBottom}>
            <TouchableOpacity
              style={[styles.bottomButton]}
              onPress={() => addRuleSLA()}
            >
              <Text style={styles.textButton}>
                {translate("screen.module.pickup_rule.btn_submit")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  containerBottom: {
    position: "absolute",
    width: "100%",
    backgroundColor: "#f6f7f7",
    bottom: device.iPhoneNotch ? 10 : 0,
  },
  bottomButton: {
    justifyContent: "center",
    alignContent: "center",
    width: "92%",
    paddingVertical: 15,
    marginHorizontal: 15,
    borderRadius: 6,
    backgroundColor: colors.boxmeBrand,
  },
  textButton: {
    textAlign: "center",
    color: colors.white,
    ...gStyle.textBoxme16,
  },
});

export default React.memo(BySLAconfig);
