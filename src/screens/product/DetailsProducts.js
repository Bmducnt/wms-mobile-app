import * as React from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  Image,
  StyleSheet,
  Switch,
  Text,
  View,
  ActivityIndicator
} from 'react-native';
import { FontAwesome5} from "@expo/vector-icons";
import {
  colors,
  device,
  gStyle,images } from '../../constants';

// components
import ScreenHeader from '../../components/ScreenHeader';
import LineTransactionInventory from '../../components/LineTransactionInventory';
import LineBinStock from '../../components/LineBinStock';
import {_getTimeDefaultFrom,_getTimeDefaultTo} from '../../helpers/device-height';


//service api
import getDetailFnsku from '../../services/products/detail';
import getBinFnsku from '../../services/products/bin';
import {translate} from "../../i18n/locales/IMLocalized";


class DetailsProducts extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      view_bin_stock: true,
      scrollY: new Animated.Value(0),
      fadeAnimation: new Animated.Value(0),
      isloading: false,
      image_product : null,
      total_stock : null,
      fnsku_code : null,
      fnsku_info : {},
      transaction_list : [],
      location_list : [],
    };
    this.toggleViewByBin = this.toggleViewByBin.bind(this);
  }

  fadeOutBrand = () => {
    Animated.timing(this.state.fadeAnimation, {
      toValue: 0,
      duration: 5,
      useNativeDriver: true
    }).start();
  };

  fadeInBrand = () => {
    Animated.timing(this.state.fadeAnimation, {
      toValue: 1,
      duration: 5,
      useNativeDriver: true

    }).start();
  };

  componentDidMount() {
    const { params } = this.props;
    let avatar = null
    if (params?.list_images.length > 0){
      avatar = params?.list_images[0].urls
    }
    this.setState({
      image_product: avatar,
      fnsku_code: params?.fnsku_code,
      total_stock: params?.total_stock
    });
    this.fadeInBrand()
    this.state.scrollY.addListener(({ value }) => {
      if (value > 100){
        this.fadeOutBrand()
      }else{
        this.fadeInBrand()
      }
    });
  }

  UNSAFE_componentWillMount = async () =>{
    const { params } = this.props;
    await this._fetchDetailProductHandler(params?.fnsku_code,{
      'from_time': _getTimeDefaultFrom(),
      'to_time': _getTimeDefaultTo()
    })
    await this._fetchBinProductHandler(params?.fnsku_code)
  }

  _fetchDetailProductHandler = async  (code,parram) =>{
    this.setState({isloading:true});
    const response = await getDetailFnsku(code,parram);
    if (response.status === 200){
      this.setState({
        fnsku_info:response.data.results,
        transaction_list : response.data.reports})
    }
    this.setState({isloading:false});
  };

  _fetchBinProductHandler = async  (code) =>{
    this.setState({isloading:true});
    const response = await getBinFnsku(code,{is_sugget_location:0});
    if (response.status === 200){
      this.setState({
        location_list:response.data.results})
    }
    this.setState({isloading:false});
  };

  toggleViewByBin(val, fnsku_code) {
    if (val === false) {
      this.setState({
        view_bin_stock: val
      });
    } else {
      this._fetchBinProductHandler(fnsku_code);
      this.setState({
        view_bin_stock: val
      });
    }
  }

  render() {
    const { navigation } = this.props
    const {scrollY,
      image_product,
      total_stock,
      isloading,
      view_bin_stock,
      transaction_list,
      fnsku_info,
      location_list
    } = this.state;
    const stickyArray = device.web ? [] : [0];
    return (
      <View style={gStyle.container}>
        <View style={{ position: 'absolute', top: 0, width: '100%', zIndex: 10 }}>
          <ScreenHeader
              title={translate('screen.module.product.detail.text_header')}
              showBack={true} textAlign={'center'}
              navigation={navigation}/>
          {isloading && <ActivityIndicator/>}
        </View>
        <View style={styles.containerFixed}>
            <Image  style={styles.imageReview}
              source={image_product ?
                {uri:image_product}:
                images['no_image_available']
              }
            />
            <View style={[gStyle.flexRowSpace,{marginTop:5}]}>
              <Text style={{...gStyle.textBoxme14,color:colors.greyInactive}}>
                {translate('screen.module.product.detail.fnsku_code')} (fnsku)
              </Text>
              <Text style={{...gStyle.textBoxme14,color:colors.greyInactive}}>
              {translate('screen.module.product.detail.barcode')}(barcode)
              </Text>
            </View>
            <View style={[gStyle.flexRowSpace,{paddingTop:3}]}>
              <Text style={{
                ...gStyle.textBoxmeBold14,
                color:colors.white
              }}>
                {fnsku_info.bsin}
              </Text>
              <Text style={{
                ...gStyle.textBoxmeBold14,
                color:colors.white
              }}>
                <FontAwesome5 name="barcode" size={14} color={colors.white} />{" "}{fnsku_info.barcode}
              </Text>
            </View>
            <Text ellipsizeMode="tail" numberOfLines={3} style={styles.titleProduct}>
                {fnsku_info.name}
            </Text>
            <View style={{height:1,backgroundColor:colors.borderLight,marginVertical:8}}></View>
            <View style={gStyle.flexRowSpace}>
              <Text style={styles.fnskuInfo}>
                {translate('screen.module.product.detail.weight')}
              </Text>
                <Text style={styles.fnskuInfo}>
                {fnsku_info.weight} (gram)
              </Text>
            </View>
            <View style={gStyle.flexRowSpace}>
              <Text style={styles.fnskuInfo}>
                {translate('screen.module.product.detail.volume')}
              </Text>
                <Text style={styles.fnskuInfo}>
                {fnsku_info.volume} (cm)
              </Text>
            </View>
            <View style={gStyle.flexRowSpace}>
                <Text style={[styles.fnskuInfo]}>
                  {translate("screen.module.product.detail.outbound_strange")}
                </Text>
                <Text style={[styles.fnskuInfo]} numberOfLines={1}>
                  {fnsku_info.outbound_type === 0 && 'fifo'}
                  {fnsku_info.outbound_type === 1 && 'lifo'}
                  {fnsku_info.outbound_type === 2 && 'fefo'}

                </Text>
              </View>
            <View style={{height:1,backgroundColor:colors.borderLight,marginVertical:8}}></View>

        </View>

        <Animated.ScrollView
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          stickyHeaderIndices={stickyArray}
          style={styles.containerScroll}
        >
          <View style={styles.containerSticky}>
          </View>
          <View style={styles.containerInfo}>

            <View style={[gStyle.flexRow,{
                  backgroundColor:colors.boxmeBrand,
                  borderBottomLeftRadius:15,
                  borderBottomRightRadius:15
                  }]}>
                <Text style={
                  {
                    paddingVertical:10,
                    paddingHorizontal:15,
                    ...gStyle.textBoxmeBold18,
                    color:colors.white}
                  }>
                    {`${translate('screen.module.product.stock')} ${total_stock}- ${translate('screen.module.product.onhand')} · ${fnsku_info.total_hold}`}
                </Text>
            </View>
            <View style={[styles.row]}>

              <Text style={styles.stockText}>
                {view_bin_stock ? translate('screen.module.product.detail.list_bin'):translate('screen.module.product.detail.list_transaction')}
              </Text>
              <Switch
                onValueChange={(val) => this.toggleViewByBin(val)}
                value={view_bin_stock}
              />
            </View>
            {transaction_list && !view_bin_stock &&
              transaction_list.map((track, index) => (
                <LineTransactionInventory
                  key={index.toString()}
                  row={track}
                />
              ))}
            {location_list && view_bin_stock &&
              location_list.map((track, index) => (
                <LineBinStock
                  key={index.toString()}
                  row={track}
                />
              ))}
          </View>
          <View style={gStyle.spacer16} />
        </Animated.ScrollView>
      </View>
    );
  }
}

DetailsProducts.propTypes = {
  // required
  navigation: PropTypes.object.isRequired,

};

const styles = StyleSheet.create({
  containerFixed: {
    paddingTop: device.iPhoneNotch ? 120 : 100,
    marginHorizontal:10,
    position: 'absolute',
    width: '95%'
  },
  imageReview: {
    width: device.width - 20,
    alignContent:"center",
    alignItems: 'center',
    resizeMode: 'contain',
    aspectRatio: 1,
    marginBottom:3
  },
  titleProduct: {
    ...gStyle.textBoxme14,
    paddingTop:3,
    color: colors.white,
  },
  fnskuInfo: {
    ...gStyle.textBoxme14,
    color: colors.white
  },
  containerScroll: {
    paddingTop: 85,
  },
  containerSticky: {
    marginTop: device.iPhoneNotch ? 500 : 480,
  },
  containerShuffle: {
    alignItems: 'center',
    shadowRadius: 20,
  },
  containerInfo: {
    alignItems: 'center',
    borderTopRightRadius:20,
    borderTopLeftRadius:20,
    backgroundColor: colors.borderLight
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    width: '100%'
  },
  stockText: {
    ...gStyle.textBoxme18,
    color: colors.white
  }
});

export default DetailsProducts
