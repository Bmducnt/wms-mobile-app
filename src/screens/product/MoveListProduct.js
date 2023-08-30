import * as React from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  StyleSheet,
  Text,
  ActivityIndicator,
  View,
  TouchableOpacity
} from 'react-native';
import { colors, device, gStyle } from '../../constants';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';

// components
import ScreenHeader from '../../components/ScreenHeader';
import {_getTimeDefaultFrom,_getTimeDefaultTo} from '../../helpers/device-height';
import {handleSoundScaner,permissionDenied,handleSoundOkScaner} from '../../helpers/async-storage';
import ModelLocationSugget from './ModelLocationSugget';
//service
import findDetailFnskuMove from '../../services/products/find';
import getBinFnsku from '../../services/products/bin';
import {translate} from "../../i18n/locales/IMLocalized";


class MoveListProduct extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        isloading: false,
        fnsku_code : null,
        fnsku_put : null,
        fnsku_info : null,
        location_move : null,
        bin_stock_info : null,
        list_fnsku_move :[],
        sugget_list_bin : [],
        is_model : false

    }
    this._findProductMove = this._findProductMove.bind(this)
  }

  componentDidMount() {
    this.willFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      () => {
        if(this.state.location_move){
          this._findProductMove(this.state.location_move,{"location" : this.state.location_move,"is_check_location":1,'find_list_fnsku':1});
        };
      }
    );
  }

  componentWillUnmount() {
    this.willFocusSubscription();
  };

  _findProductMove = async  (code,parram) =>{
    this.setState({isloading:true});
    const response = await findDetailFnskuMove(code,parram);
    if (response.status === 403){
      permissionDenied(this.props.navigation);
    };
    if (response.status === 200){
      handleSoundOkScaner();
      this.setState({
        list_fnsku_move:response.data.results,
        isloading:false})

    }else {
      await handleSoundScaner();
      if (response.data.error_code === 1){
        Alert.alert(
          '',
          translate('screen.module.product.move.bin_fail'),
          [
            {
              text: t("base.confirm"),
              onPress: null,
            },
          ],
          {cancelable: false},
        );
      }else {
        Alert.alert(
          '',
          translate('screen.module.product.move.fnsku_fail'),
          [
            {
              text: t("base.confirm"),
              onPress: null,
            },
          ],
          {cancelable: false},
        );
      };
    }
    this.setState({isloading:false,fnsku_code:null});
  };

  _onSubmitEditingInputLocation = async (code) => {
    if (code){
      this.setState({
        location_move:code
      });
      this._findProductMove(code,{"location" : code,"is_check_location":1,'find_list_fnsku':1});
    };
  };

  _fetchBinProductHandler = async  (code) =>{
      this.setState({isloading:true});
      const response = await getBinFnsku(code,{is_sugget_location:1});
      if (response.status === 200){
        let list_bin_temp = []
        response.data.results.forEach(element => {
          if(element.location.location !== this.state.location_move){
            list_bin_temp.push(element)
          }
        });
        this.setState({
          sugget_list_bin:list_bin_temp})
      }else if (response.status === 403){
          permissionDenied(this.props.navigation);
      }
      this.setState({isloading:false});
  };

  _onOpenModel = async (code,fnsku_code = null)=>{
    if (code){
      await this._fetchBinProductHandler(fnsku_code);
    }
    await this.setState({is_model:code})
  }
  _render_item = (item,index)=>{
    const { navigation } = this.props;
    return (
        <View style={styles.sectionHeading} key={index}>
            <View style={[gStyle.flexRowSpace]}>
                <View style={gStyle.flexRow}>
                    <Text style={styles.textLabel}>{translate('screen.module.product.move.barcode')}</Text>
                </View>
                <View style={gStyle.flexRow}>
                    <Text style={styles.textLabel}>{translate('screen.module.product.move.fnsku')}</Text>
                </View>
            </View>
            <View style={gStyle.flexRowSpace}>
                <View style={[gStyle.flexRow,{width:"60%"}]}>
                    <Text style={[styles.textCode,{...gStyle.textBoxme14}]} numberOfLines={3} ellipsizeMode="tail">
                    {item.fnsku_name}</Text>
                </View>
                <View style={gStyle.flexRowCenter}>
                    <Text style={[styles.textCode]}>
                    {item.fnsku_code}</Text>
                </View>
            </View>
            <View style={[gStyle.flexRowSpace,{marginTop:4}]}>
                <View style={gStyle.flexRow}>
                    <Text style={styles.textLabel}>{translate('screen.module.product.move.bsin_current')}</Text>

                </View>
                <View style={gStyle.flexRow}>
                    <Text style={styles.textLabel}>{translate('screen.module.product.move.quantity_move')}</Text>
                </View>
            </View>
            <View style={[gStyle.flexRowSpace,{marginVertical:4}]}>
                <View style={gStyle.flexRow}>
                    <Text style={[styles.textCode]} numberOfLines={1} ellipsizeMode="tail">
                    {this.state.location_move}</Text>
                </View>
                <View style={gStyle.flexRowCenter}>
                    <Text style={[styles.textCode,{color:colors.boxmeBrand}]}>
                    {item.fnsku_stock_bin}</Text>
                </View>
            </View>
            <View style={[gStyle.flexRowSpace]}>
                <Text style={styles.textLabel}>{translate('screen.module.pickup.detail.expire_date')}</Text>
                <Text style={[styles.textValue]} numberOfLines={1} >
                  {item.expire_date.substring(0,10)}
                </Text>
            </View>
            <View style={[gStyle.flexRowSpace,{paddingVertical:8}]}>
              <TouchableOpacity
                onPress={() => navigation.navigate("CreateResquest",{fnsku_code : item.fnsku_code})}
                style={{
                  paddingHorizontal:6,
                  paddingVertical:8,
                  borderRadius:3,
                  borderWidth:1,
                  backgroundColor:colors.brandPrimary,
                  borderColor:colors.brandPrimary
                }}
              >
                <Text style={{ color: colors.white,...gStyle.textboxme14 }}>
                {translate('screen.module.product.move.btn_cycle')}
                </Text>
              </TouchableOpacity>
              <View style={gStyle.flexRow}>
                <TouchableOpacity
                  onPress={() => this._onOpenModel(true,item.fnsku_code)}
                  style={{
                    paddingHorizontal:6,
                    paddingVertical:8,
                    borderRadius:3,
                    borderWidth:1,
                    backgroundColor:colors.primary,
                    borderColor:colors.primary
                  }}
                >
                  <Text style={{ color: colors.white,...gStyle.textboxme14 }}>
                  {translate('screen.module.product.move.btn_view_location')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate("MoveProducts",{
                    location_code : this.state.location_move,
                    fnsku_code : item.fnsku_code
                  })}
                  style={{
                    paddingHorizontal:6,
                    paddingVertical:8,
                    borderRadius:3,
                    borderWidth:1,
                    marginLeft:10,
                    backgroundColor:colors.boxmeBrand,
                    borderColor:colors.boxmeBrand
                  }}
                >
                  <Text style={{ color: colors.white,...gStyle.textboxme14 }}>
                    {translate('screen.module.product.move.btn_move')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
        </View>
    )
  };

  render() {
    const { isloading,location_move,list_fnsku_move,is_model,sugget_list_bin} = this.state;
    return (
        <View style={[gStyle.container]}>
          <View style={{ position: 'absolute', top: 0, width: '100%', zIndex: 10 }}>
            <ScreenHeader
              title={translate('screen.module.product.move.text_header')}
              showBack={true}
              showInput = {true}
              inputValueSend ={null}
              autoFocus={true}
              onPressCamera={this._onSubmitEditingInputLocation}
              onSubmitEditingInput= {this._onSubmitEditingInputLocation}
              textPlaceholder={t("screen.module.product.move.textplaceholder_current_bin")}
            />
          </View>
          <KeyboardAwareScrollView
            style={styles.containerMove}
            scrollEnabled={true}
            enableOnAndroid={true}
            showsVerticalScrollIndicator={false}
            enableAutomaticScroll={true}
          >
          <View style={styles.containerMoveForm}>
           { isloading && <ActivityIndicator/>}
            {list_fnsku_move.length > 0 && <Text style={{
                ...gStyle.textBoxme16,color:colors.white,
                paddingVertical:10
            }}>
                {translate('screen.module.product.move.text_sub_move')} {location_move}
            </Text>}
            {Object.keys(list_fnsku_move).map((index) => {
              const item = list_fnsku_move[index];
              return (
                this._render_item(item,index.toString())
              );
            })}
          </View>
          {is_model &&
            <ModelLocationSugget
              listData = {sugget_list_bin}
              onClose = {this._onOpenModel}
            />}
         </KeyboardAwareScrollView>
        </View>
    );
  }
}

MoveListProduct.propTypes = {
  // required
  navigation: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
  containerMove: {
    flex:1,
    marginTop:device.iPhoneNotch ? 70 : 40
  },
  containerMoveForm: {
    marginTop:30,
    marginHorizontal:8
  },
  sectionHeading: {
    marginVertical:8,
    borderBottomColor:colors.borderLight,
    borderBottomWidth:1
  },
  textCode: {
    ...gStyle.textBoxmeBold16,
    color:colors.white,
  },
  textValue: {
    ...gStyle.textBoxme16,
    color: colors.white,
    paddingLeft: 10,
  },
  textLabel :{
    ...gStyle.textBoxme14,
    color:colors.greyInactive
  }
});
export default MoveListProduct;
