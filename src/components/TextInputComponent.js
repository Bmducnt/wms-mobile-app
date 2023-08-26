import * as React from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  View,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Device from "expo-device";
import { colors, gStyle } from "../constants";
// components
import ScanQrCode from "./ScanQrCode";
import TouchIcon from "./TouchIcon";

// icons

const TextInputComponent = (props) => {
  const [inputValue, setinputValue] = React.useState(props.inputValue);
  const [textError, settextError] = React.useState(null);
  const [openCamera, setopenCamera] = React.useState(false);

  React.useEffect(() => {
    settextError(props.textError);
  }, [props.textError]);

  const cameraScanHandel = async (code) => {
    if (!props.is_close || code === null) {
      setopenCamera(false);
    }
    props.onPressCamera(code);
    setinputValue(null);
  };

  const onChangeTextSubmit = async (code) => {
    props.onSubmitEditingInput(code);
    setinputValue(null);
  };

  return (
    <React.Fragment>
      <View style={styles.containerSearchBar}>
        <Text style={styles.textLabel}>{props.textLabel}</Text>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => null}
          style={[
            styles.searchPlaceholder,
            {
              height: props.heightInput,
              backgroundColor: props.ediTable ? colors.white : colors.darkgray,
            },
          ]}
        >
          <TextInput
            autoFocus={props.autoFocus}
            blurOnSubmit={false}
            editable={props.ediTable}
            value={inputValue}
            numberOfLines={props.numberOfLines}
            multiline={props.multiline}
            keyboardType={props.keyboardType}
            onChangeText={(text) => {
              props.autoChange ? onChangeTextSubmit(text) : setinputValue(text);
            }}
            onSubmitEditing={(text) => onChangeTextSubmit(inputValue)}
            style={styles.searchPlaceholderText}
            placeholder={props.textPlaceholder}
          />
          {props.showScan && (
            <View
              style={[
                styles.iconRight,
                { marginLeft: !props.showSearch ? -5 : 8 },
              ]}
            >
              <TouchIcon
                icon={
                  <MaterialCommunityIcons
                    color={colors.black}
                    name="barcode-scan"
                  />
                }
                onPress={() => setopenCamera(true)}
                iconSize={20}
              />
            </View>
          )}
        </TouchableOpacity>
        {openCamera && (
          <ScanQrCode
            onPress={cameraScanHandel}
            onClose={setopenCamera}
            textError={textError}
          />
        )}
      </View>
    </React.Fragment>
  );
};

TextInputComponent.defaultProps = {
  labeView: true,
  is_close: false,
  showSearch: true,
  showScan: true,
  keyboardType: "default",
  autoFocus: false,
  ediTable: true,
  autoChange: false,
  textError: null,
  multiline: false,
  heightInput: 50,
  numberOfLines: 1,
};

TextInputComponent.propTypes = {
  onPressCamera: PropTypes.func,
  onSubmitEditingInput: PropTypes.func,
  textLabel: PropTypes.string,
  keyboardType: PropTypes.string,
  labeView: PropTypes.bool,
  showSearch: PropTypes.bool,
  showScan: PropTypes.bool,
  autoChange: PropTypes.bool,
  heightInput: PropTypes.number,
  multiline: PropTypes.bool,
  numberOfLines: PropTypes.number,
  is_close: PropTypes.bool.isRequired,
  textPlaceholder: PropTypes.string,
  autoFocus: PropTypes.bool.isRequired,
  ediTable: PropTypes.bool,
  textError: PropTypes.string,
};

const styles = StyleSheet.create({
  containerSearchBar: {
    paddingHorizontal: 15,
    width: "100%",
  },
  searchPlaceholder: {
    alignItems: "center",
    backgroundColor: colors.whiteBg,
    borderRadius: 6,
    flexDirection: "row",
    paddingLeft: 10,
    width: "100%",
    marginTop: 4,
  },
  searchPlaceholderText: {
    ...gStyle.textBoxme14,
    color: colors.black,
    width: "88%",
    paddingHorizontal: 10,
  },
  textLabel: {
    color: colors.greyInactive,
    ...gStyle.textBoxme12,
  },
  iconRight: {
    zIndex: 100,
  },
});
export default TextInputComponent;
