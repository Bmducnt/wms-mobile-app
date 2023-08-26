import React, { useState, useEffect } from "react";
import { 
  Modal, 
  Text, 
  TouchableOpacity, 
  View,
  StyleSheet 
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { 
  colors, 
  gStyle } from "../constants";
import { Camera } from "expo-camera";

const CameraModule = (props) => {

  const [cameraRef, setCameraRef] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);
  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={true}
      onRequestClose={() => {
        props.setModalVisible();
      }}
    >
      <Camera
        style={{ flex: 1 }}
        ratio="4:3"
        flashMode={Camera.Constants.FlashMode.off}
        type={type}
        ref={(ref) => {
          setCameraRef(ref);
        }}
      >
        <View style={styles.container}>
          <View style={styles.blockFooter}>
            <TouchableOpacity
              disabled={props?.allowClose ? props?.allowClose : false}
              style={[gStyle.flexRowCenter,styles.blockLeft]}
              onPress={() => {
                props.setModalVisible();
              }}
            >
              <Feather color={colors.white} name="x" size={25} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async () => {
                if (cameraRef) {
                  let photo = await cameraRef.takePictureAsync();
                  props.setImage(photo);
                  props.setModalVisible();
                }
              }}
            >
              <View style={styles.btnWrap}>
                <View style={styles.btnRoundCapture}></View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[gStyle.flexRowCenter,styles.btnRight]}
              onPress={() => {
                setType(
                  type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back
                );
              }}
            >
              <Feather color={colors.white} name="refresh-ccw" size={20} />
            </TouchableOpacity>
          </View>
        </View>
      </Camera>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "flex-end",
  },
  blockFooter: {
    backgroundColor: colors.black,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom:20
  },
  textMenu: {
    color: colors.white,
    ...gStyle.textBoxme20,
    paddingLeft: 5,
  },
  blockLeft: {
    backgroundColor:colors.cardLight,
    width:45,
    height:45,
    borderRadius:45/2,
    marginLeft:5,
  },
  btnRight: {
    backgroundColor:colors.cardLight,
    width:45,
    height:45,
    borderRadius:45/2,
    marginRight:5,
  },
  btnWrap: {
    borderWidth: 2,
    borderRadius: 50,
    borderColor: colors.white,
    height: 50,
    width: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 16,
  },
  btnRoundCapture: {
    borderWidth: 2,
    borderRadius: 50,
    borderColor: colors.white,
    height: 40,
    width: 40,
    backgroundColor: colors.white,
  },
});
export default CameraModule;