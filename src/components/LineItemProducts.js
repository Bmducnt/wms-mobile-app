import * as React from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
} from "react-native";
import { Feather,FontAwesome5} from "@expo/vector-icons";
import { colors, gStyle, device,images } from "../constants";
import Badge from "./Badge";
import {translate} from "../i18n/locales/IMLocalized";


const LineItemProducts = ({
  navigation,
  fnsku_info,
  disableRightSide,
  iconLibrary,
  id,
}) => {
  const [imageError, setimageError] = React.useState(false);
  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={gStyle.activeOpacity}
        onPress={() =>
          navigation.navigate("DetailsProducts", {
            list_images: fnsku_info.images,
            total_stock: fnsku_info.total_stock,
            fnsku_code: fnsku_info.bsin,
          })
        }
        style={styles.container}
      >
        <View style={gStyle.flex5}>
          <View style={gStyle.flexRow}>
            {fnsku_info.images.length === 0 ? (
              <View style={{ width: 70, marginTop: 5 }}>
                <Image
                  style={styles.imageProduct}
                  source={images['no_image_available']}
                />
              </View>
            ) : (
              <View style={{ width: 70, marginTop: 5 }}>
                <Image
                  style={styles.imageProduct}
                  source={
                    !imageError
                      ? { uri: fnsku_info.images[0].urls }
                      : images['no_image_available']
                  }
                  onError={() => setimageError(true)}
                />
              </View>
            )}
            <View
              style={{
                width: Dimensions.get("window").width - 75,
                marginLeft: 5,
              }}
            >
              <Text
                style={[styles.textCode]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                FNSKU:{" "}{fnsku_info.bsin}
              </Text>
              <Text
                style={[
                  styles.textValue,
                  { color: colors.greyInactive, width: '90%' },
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {fnsku_info.name}
              </Text>
              <View style={styles.containerInfo}>
                {fnsku_info.total_hold !== 0 && (
                  <Badge
                    name={`${translate("screen.module.product.onhand")} ${
                      fnsku_info.total_hold
                    }`}
                    style={{
                      backgroundColor: colors.borderLight,
                      color: colors.boxmeBrand,
                      borderRadius: 6,
                    }}
                  />
                )}
                <Badge
                  name={
                    fnsku_info.storage_type === 1
                      ? translate("screen.module.product.detail.stock_standard")
                      : translate("screen.module.product.detail.stock_cold")
                  }
                  style={{
                    backgroundColor: colors.borderLight,
                    color: colors.white,
                    borderRadius: 6,
                  }}
                />
              </View>
              <View>
                <Text
                  style={{color:colors.white,...gStyle.textBoxme14}}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  <FontAwesome5 name="barcode" size={14} color={colors.white} /> {fnsku_info.barcode}
                </Text>
              </View>
            </View>
          </View>
          <View style={[styles.percentBar,{marginLeft:75}]}></View>
          <View style={gStyle.flexRow}>
            <View style={{ width: 70, marginTop: 5 }}>
              <View style={gStyle.flexCenter}>
                <Text style={[styles.textValue,{...gStyle.textBoxmeBold16}]}>{fnsku_info.total_stock}</Text>
                <Text style={styles.textLabel}>{translate("screen.module.product.stock")}</Text>
              </View>
            </View>
            <View
              style={{
                width: Dimensions.get("window").width - 75,
                marginLeft: 5,
                marginTop:5
              }}
            >
              <View style={[gStyle.flexRowSpace,{paddingRight:20}]}>
                <Text style={[styles.textLabel]}>
                  {translate("screen.module.product.detail.weight")}
                </Text>
                <Text style={[styles.textValue]} numberOfLines={1}>
                  {fnsku_info.weight} (gram)
                </Text>
              </View>
              <View style={[gStyle.flexRowSpace,{paddingRight:20}]}>
                <Text style={[styles.textLabel]}>
                  {translate("screen.module.product.detail.volume")}
                </Text>
                <Text style={[styles.textValue]} numberOfLines={1}>
                  {fnsku_info.volume}
                </Text>
              </View>
              <View style={[gStyle.flexRowSpace,{paddingRight:20}]}>
                <Text style={[styles.textLabel]}>
                  {translate("screen.module.product.detail.outbound_strange")}
                </Text>
                <Text style={[styles.textValue]} numberOfLines={1}>
                  {fnsku_info.outbound_type === 0 && 'fifo'}
                  {fnsku_info.outbound_type === 1 && 'lifo'}
                  {fnsku_info.outbound_type === 2 && 'fefo'}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.containerRight}>
          <Feather color={colors.greyInactive} name="chevron-right" size={20} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

LineItemProducts.defaultProps = {
  disableRightSide: null,
  iconLibrary: "Feather",
};

LineItemProducts.propTypes = {
  id: PropTypes.number.isRequired,
  fnsku_info: PropTypes.object.isRequired,
  disableRightSide: PropTypes.bool.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 5,
    marginVertical: 5,
    width: "100%",
    backgroundColor: colors.cardLight,
  },
  percentBar: {
    height: 1,
    marginTop: 8,
    width: `100%`,
    backgroundColor: colors.borderLight,
  },
  textCode: {
    ...gStyle.textBoxmeBold14,
    color: colors.white,
  },
  textValue: {
    ...gStyle.textBoxme14,
    color: colors.white,
  },
  textLabel: {
    ...gStyle.textBoxme14,
    color: colors.greyInactive,
  },
  containerInfo: {
    marginTop: 5,
    flexDirection: "row",
  },
  containerRight: {
    alignItems: "flex-end",
    position: "absolute",
    right: 5,
    top: 25,
  },
  imageProduct: {
    width: 65,
    height: 65,
    borderRadius: 10,
  },
});

export default LineItemProducts;
