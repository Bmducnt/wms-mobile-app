import * as React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors, gStyle, device } from "../../constants";
import {translate} from "../../i18n/locales/IMLocalized";

const ItemList = (props) => {
  const [listData, setlistData] = React.useState(props.data);

  return (
    <React.Fragment>
      <ScrollView>
        <View
          style={{
            backgroundColor: colors.whiteBg,
            paddingHorizontal: 10,
            paddingVertical: 13,
          }}
        >
          {listData.length > 0 ? (
            listData.map((track, index) => (
              <TouchableOpacity
                onPress={() =>
                  props.onSubmit(
                    !props.isCombo ? track.quantity : track.combo_name
                  )
                }
                key={index}
                style={[
                  gStyle.flexRowSpace,
                  {
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                    backgroundColor: "#f6f7f7",
                    margin: 2,
                    borderRadius: 6,
                  },
                ]}
              >
                <View>
                  <Text key={track} style={{ paddingRight: 15 }}>
                    {!props.isCombo
                      ? `${translate(
                          "screen.module.pickup_rule.by_seller_quantity_text"
                        )} ${track.quantity} pcs`
                      : `${translate(
                          "screen.module.pickup_rule.by_seller_combo_name"
                        )} ${track.combo_name}`}
                  </Text>
                  {track.dcount && (
                    <View style={gStyle.flexRowCenterAlign}>
                      <Text style={{ color: colors.boxmeBrand }}>
                        {translate("screen.module.pickup_rule.have")} {track.dcount}{" "}
                        {translate(
                          "screen.module.pickup_rule.by_seller_quantity_text_1"
                        )}
                      </Text>
                    </View>
                  )}
                </View>
                <Feather
                  name={track.active ? "check-circle" : "circle"}
                  size={16}
                  color={track.active ? colors.darkgreen : colors.greyInactive}
                />
              </TouchableOpacity>
            ))
          ) : (
            <View style={gStyle.flexCenter}>
              <Text style={{ color: colors.greyInactive, paddingVertical: 12 }}>
                {translate("screen.module.pickup_rule.by_seller_empty")}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
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

export default React.memo(ItemList);
