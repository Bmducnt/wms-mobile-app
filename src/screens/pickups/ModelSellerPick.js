import * as React from "react";
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { Feather, AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import getListRulePickup from "../../services/pickup/list-rule";
import { colors, gStyle } from "../../constants";

const ModelSellerPick = (props) => {
  const [listData, setlistData] = React.useState([]);

  fetchListEmailConfig = async () => {
    const response = await getListRulePickup({ key: "by_email" });
    if (response?.status === 200) {
      setlistData(response?.data?.results);
    }
  };
  React.useEffect(() => {
    fetchListEmailConfig();
  }, []);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      onRequestClose={() => props.onClose(false)}
    >
      <TouchableWithoutFeedback>
        <View
          style={{
            flex: 1,
            position: "absolute",
            bottom: 0,
            marginHorizontal: 10,
          }}
        >
          <LinearGradient
            colors={["#ff9966", "#ff5e62"]}
            style={{
              height: Dimensions.get("window").height - 150,
              width: Dimensions.get("window").width - 40,
              borderTopLeftRadius: 3,
              borderTopRightRadius: 3,
              marginHorizontal: 10,
              marginBottom: 30,
              borderTopLeftRadius: 6,
              borderRadius: 6,
            }}
          >
            <View
              style={[
                gStyle.flexRowSpace,
                {
                  padding: 15,
                  borderBottomWidth: 0.5,
                  borderBottomColor: colors.white,
                },
              ]}
            >
              <Text style={{ color: colors.white }}>
                Chọn người bán cần tạo
              </Text>
              <TouchableOpacity
                onPress={() => props.onClose(false)}
                style={gStyle.flexCenter}
                activeOpacity={gStyle.activeOpacity}
              >
                <AntDesign name="closecircle" size={22} color={colors.white} />
              </TouchableOpacity>
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
                <View
                  style={{
                    backgroundColor: colors.whiteBg,
                    marginTop: 5,
                    borderRadius: 3,
                  }}
                >
                  {listData &&
                    listData.map((track, index) => (
                      <TouchableOpacity
                        onPress={() => props.onSubmit(track.email)}
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
                        <View>
                          <Text style={{ paddingRight: 15 }}>
                            Người bán {track.email}
                          </Text>
                          <Text style={{ paddingRight: 15 }}>
                            Tổng đơn {track.total_order_aw_pick}
                          </Text>
                        </View>
                        <Feather
                          name={"circle"}
                          size={14}
                          color={colors.darkgreen}
                        />
                      </TouchableOpacity>
                    ))}
                </View>
              </View>
            </ScrollView>
            <View styles={{ marginHorizontal: 10 }}></View>
          </LinearGradient>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ModelSellerPick;
