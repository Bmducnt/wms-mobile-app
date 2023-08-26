import React, { useState, useEffect } from "react";
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from "react-native";
import {
  _getTimeDefaultFrom,
  _getTimeDefaultTo,
} from "../../helpers/device-height";
import ListCarrierName from "../../components/ListCarrierAtWarehouse";
import { 
    colors, 
    device, 
    gStyle 
} from "../../constants";

//API
import getListStaffPickup from "../../services/pickup/list-staff";

const ModelUpdateStaff = (props) => {
  const [openListStaff, setopenListStaff] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const _fetchListStaffHandler = async () => {
    setisLoading(true);
    const response = await getListStaffPickup({
      from_time: _getTimeDefaultFrom(),
      to_time: _getTimeDefaultTo(),
    });
    if (response.status === 200) {
      setopenListStaff(response.data.results);
    }
    setisLoading(false);
  };
  useEffect(() => {
    (async () => {
      _fetchListStaffHandler();
    })();
  }, []);

  return (
    <Modal
      animationType="slide"
      transparent={false}
      presentationStyle="formSheet"
      visible={true}
    >
      <View style={[gStyle.container]}>
        <View
          style={[
            gStyle.flexRowSpace,
            {
              paddingVertical: 18,
              paddingHorizontal: 15,
              backgroundColor: colors.cardLight,
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => props.onClose(false)}
            activeOpacity={gStyle.activeOpacity}
          >
            <Text style={[styles.textValue, { ...gStyle.textBoxme16 }]}>
              {props.t("base.back")}
            </Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={gStyle.flexRowCenter}>
            <ActivityIndicator />
          </View>
        ) : (
          <View style={[gStyle.flexRow, { marginTop: 10, paddingBottom: 110 }]}>
            <FlatList
              data={openListStaff}
              keyExtractor={({ staff_id }) => staff_id.toString()}
              renderItem={({ item }) => (
                <ListCarrierName
                  navigation={props.navigation}
                  carrier_name={item.staff_email}
                  courier_id={item.staff_id}
                  quantity={item.total_pickups}
                  avarta={true}
                  text_note1={"screen.module.pickup.create.text_1"}
                  text_note2={"screen.module.pickup.create.text_2"}
                  is_select={props.staff_id}
                  trans={props.t}
                  onPress={props.onSelect}
                />
              )}
            />
          </View>
        )}
        <View style={styles.containerBottom}>
          <TouchableOpacity
            style={[styles.bottomButton]}
            onPress={() => props.onPress()}
          >
            {!props.isLoading ? (
              <Text style={styles.textButton}>
                {props.t("screen.module.pickup.list.btn_update")}
              </Text>
            ) : (
              <ActivityIndicator color={colors.white}/>
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
    backgroundColor: colors.blackBg,
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
  textValue: {
    ...gStyle.textBoxmeBold16,
    color: colors.white,
  },
});
export default ModelUpdateStaff;
