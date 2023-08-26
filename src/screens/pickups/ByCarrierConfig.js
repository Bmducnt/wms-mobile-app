import * as React from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";

import { Feather, AntDesign } from "@expo/vector-icons";
import { colors, gStyle, device } from "../../constants";
import getListCarrier from "../../services/handover/courier";
import addRulePickup from "../../services/pickup/add-rule";
import getListRulePickup from "../../services/pickup/list-rule";
import removeRulePickup from "../../services/pickup/remove_rule";

const ByCarrierConfig = (props) => {
  const t = props.t;

  const [listCarrier, setlistCarrier] = React.useState([]);
  const [carrierSelelct, setcarrierSelelct] = React.useState(null);
  const [carrier, setcarrier] = React.useState(null);

  fetchListCarrierHandler = async () => {
    const response = await getListCarrier({});
    if (response.status === 200) {
      setlistCarrier(response?.data?.results);
    }
  };

  fetchConfig = async () => {
    const response = await getListRulePickup({ key: "by_carrier" });
    if (response?.status === 200) {
      setcarrier(response?.data?.results);
    }
  };

  removeCarrierConfig = async () => {
    await removeRulePickup(JSON.stringify({ rule_type: "by_carrier" }));
    setcarrier(null);
  };

  addRuleCarrier = async () => {
    if (carrierSelelct) {
      const response = await addRulePickup(
        JSON.stringify({
          rule_type: "by_carrier",
          carrier_name: carrierSelelct,
        })
      );
      if (response?.status === 200) {
        Alert.alert(
          "",
          t("screen.module.pickup_rule.add_ok"),
          [
            {
              text: t("base.confirm"),
              onPress: () => onClose(),
            },
          ],
          { cancelable: false }
        );
      }
    } else {
      onClose();
    }
  };

  onSelectSource = async (source) => {
    let is_submmit = false;
    let updatedList = listCarrier.map((item) => {
      if (item.courier_name === source) {
        if (!item.active) {
          is_submmit = true;
        }
        return { ...item, active: !item.active };
      }

      return { ...item, active: false };
    });
    if (is_submmit) {
      setcarrierSelelct(source);
    } else {
      setcarrierSelelct(null);
    }

    setlistCarrier(updatedList);
  };

  React.useEffect(() => {
    fetchListCarrierHandler();
    fetchConfig();
  }, []);

  onClose = async () => {
    props.onClose(false);
    props.onReload();
  };

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
            <Text>{t("screen.module.pickup_rule.by_carrier_title")}</Text>
            <TouchableOpacity
              onPress={() => onClose()}
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
          <View>
            <Text style={{ paddingHorizontal: 15, paddingVertical: 13 }}>
              {t("screen.module.pickup_rule.by_carrier_title_sub")}
            </Text>
          </View>

          <View
            style={{
              paddingHorizontal: 10,
              paddingVertical: 13,
              marginHorizontal: 10,
              marginVertical: 5,
            }}
          >
            <Text>{t("screen.module.pickup_rule.by_carrier_list")}</Text>
            {carrier && (
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
                    {t("screen.module.pickup_rule.prioritize")}
                  </Text>
                  <TouchableOpacity
                    style={gStyle.flexRowCenterAlign}
                    onPress={() => removeCarrierConfig()}
                  >
                    <Text
                      style={{
                        color: colors.darkgreen,
                        ...gStyle.textBoxmeBold14,
                        paddingRight: 8,
                      }}
                    >
                      {carrier}
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
                marginTop: carrier ? 1 : 5,
                paddingBottom: 200,
              }}
            >
              <FlatList
                data={listCarrier}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                keyExtractor={({ courier_name }) => courier_name.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => onSelectSource(item.courier_name)}
                    key={item}
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
                    <View style={gStyle.flexRowCenterAlign}>
                      {/* <SvgUri width={25} height={25} uri={item.courier_logo} /> */}
                      <Text style={{ paddingLeft: 5 }}>
                        {item.courier_name}
                      </Text>
                    </View>
                    <Feather
                      name={item.active ? "check-circle" : "circle"}
                      size={16}
                      color={
                        item.active ? colors.darkgreen : colors.greyInactive
                      }
                    />
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
          <View style={styles.containerBottom}>
            <TouchableOpacity
              style={[styles.bottomButton]}
              onPress={() => addRuleCarrier()}
            >
              <Text style={styles.textButton}>
                {t("screen.module.pickup_rule.btn_submit")}
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

export default React.memo(ByCarrierConfig);
