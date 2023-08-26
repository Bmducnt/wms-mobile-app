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
import { Feather, AntDesign } from "@expo/vector-icons";
import { colors, gStyle, device } from "../../constants";
import addRulePickup from "../../services/pickup/add-rule";
import getListRulePickup from "../../services/pickup/list-rule";
import removeRulePickup from "../../services/pickup/remove_rule";

const BySourceConfig = (props) => {
  const t = props.t;

  const [listSource, setlistSource] = React.useState([
    {
      source_name: "Boxme",
      active: false,
    },
    {
      source_name: "facebook",
      active: false,
    },
    {
      source_name: "haravan",
      active: false,
    },
    {
      source_name: "lazada",
      active: false,
    },
    {
      source_name: "sapo",
      active: false,
    },
    {
      source_name: "shopee_v2",
      active: false,
    },
    {
      source_name: "shopify",
      active: false,
    },
    {
      source_name: "tiki",
      active: false,
    },
    {
      source_name: "tiktok",
      active: false,
    },
    {
      source_name: "hsv-lazada",
      active: false,
    },
    {
      source_name: "onpoint-lazada",
      active: false,
    },
  ]);
  const [sourceSelect, setsourceSelect] = React.useState(null);
  const [source, setsource] = React.useState(null);

  fetchConfig = async () => {
    const response = await getListRulePickup({ key: "by_source" });
    if (response?.status === 200) {
      setsource(response?.data?.results);
    }
  };

  removeSourceConfig = async () => {
    await removeRulePickup(JSON.stringify({ rule_type: "by_source" }));
    setsource(null);
  };

  onClose = async () => {
    props.onClose(false);
    props.onReload();
  };

  addRuleSource = async () => {
    if (sourceSelect) {
      const response = await addRulePickup(
        JSON.stringify({
          rule_type: "by_source",
          source_name: sourceSelect,
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
    let updatedList = listSource.map((item) => {
      if (item.source_name === source) {
        if (!item.active) {
          is_submmit = true;
        }
        return { ...item, active: !item.active };
      }
      return { ...item, active: false };
    });
    if (is_submmit) {
      setsourceSelect(source);
    } else {
      setsourceSelect(null);
    }
    setlistSource(updatedList);
  };

  React.useEffect(() => {
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
            <Text>{t("screen.module.pickup_rule.by_source_title")}</Text>
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
              {t("screen.module.pickup_rule.by_source_title_sub")}
            </Text>
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
              <Text>{t("screen.module.pickup_rule.by_source_list")}</Text>
              {source && (
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
                      onPress={() => removeSourceConfig()}
                    >
                      <Text
                        style={{
                          color: colors.darkgreen,
                          ...gStyle.textBoxmeBold14,
                          paddingRight: 8,
                        }}
                      >
                        {source}
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
                  marginTop: source ? 1 : 5,
                }}
              >
                {listSource &&
                  listSource.map((track, index) => (
                    <TouchableOpacity
                      onPress={() => onSelectSource(track.source_name)}
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
                        {track.source_name}
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
              onPress={() => addRuleSource()}
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

export default React.memo(BySourceConfig);
