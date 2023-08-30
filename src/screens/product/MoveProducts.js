import * as React from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  StyleSheet,
  Text,
  ActivityIndicator,
  View,
} from 'react-native';
import { colors, device, gStyle } from '../../constants';
import Badge from '../../components/Badge';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';

// components
import ScreenHeader from '../../components/ScreenHeader';
import TextInputComponent from '../../components/TextInputComponent';
import {handleSoundScaner,permissionDenied,handleSoundOkScaner} from '../../helpers/async-storage';

//service
import getBinFnsku from '../../services/products/bin';
import findDetailFnskuMove from '../../services/products/find';
import putNewLocationMove from '../../services/products/move';
import {translate} from "../../i18n/locales/IMLocalized";

const initialState = {
    isloading: false,
    is_prioritize: false,
    fnsku_code : null,
    fnsku_put : null,
    fnsku_info : null,
    fnsku_change : 0,
    fnsku_outbound_type : 0,
    barcode_stock : null,
    sugget_list_bin :[],
    bin_stock_info : null,
    bgLocation : ['#fac51c', '#66bd6d', '#faa025', '#29bb9c',
            '#e96b56', '#55acd2', '#afdf09', '#2196f3', '#a7b619']
}
class MoveProducts extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState
    this._putLocationProductMove = this._putLocationProductMove.bind(this)
    this._findProductMove = this._findProductMove.bind(this)
  }

  componentDidMount() {
  }

  UNSAFE_componentWillMount = async () =>{
    const { params } = this.props?.route
    if (params?.location_code){
      await this.setState({barcode_stock : params?.location_code,bin_stock_info :[]})
    }
    if (params?.fnsku_code){
      await this.setState({fnsku_code : params?.fnsku_code})
    }
    if (params?.location_code && params?.fnsku_code){
      await this._findProductMove(params?.fnsku_code,
          {"location": params?.location_code}, 0)
    }

  }

  _fetchBinProductHandler = async  (code) =>{
    this.setState({isloading:true});
    const response = await getBinFnsku(code,{is_sugget_location : 1});
    if (response.status === 200){
      let list_bin_temp = []
      response.data.results.forEach(element => {
        if(element.location.location !== this.state.barcode_stock){
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

  _findProductMove = async  (code,parram,find_id) =>{
    this.setState({isloading:true});
    const response = await findDetailFnskuMove(code,parram);
    if (response.status === 403){
      permissionDenied(this.props.navigation);
    }
    if (response.status === 200){
      handleSoundOkScaner();
      if (find_id === 0){
        this.setState({fnsku_info:response.data.results,
          isloading:false,
          fnsku_outbound_type : response.data.results.outbound_type,
          fnsku_put : response.data.fnsku_code,
          fnsku_change : parseInt(response.data.bin_info.quantity),
          bin_stock_info:response.data.bin_info});
        await this._fetchBinProductHandler(response.data.fnsku_code);
      }else{
        this.setState({bin_stock_info:response.data})
      }

    }else {
      handleSoundScaner();
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
      }
    }
    this.setState({isloading:false,fnsku_code:null});
  };

  _putLocationProductMove = async  (code,parram) =>{
    this.setState({isloading:true});
    const response = await putNewLocationMove(code,parram);
    if (response.status === 403){
      permissionDenied(this.props.navigation);
    }
    if (response.status === 200){
      handleSoundOkScaner();
      Alert.alert(
        '',
        translate('screen.module.product.move.update_ok'),
        [
          {
            text: t("base.confirm"),
            onPress: () => { this.setState(initialState);},
          },
        ],
        {cancelable: false},
      );
    }else {
      handleSoundScaner();
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
    }
    this.setState({isloading:false});
  };

  _onSubmitEditingInput = async (code) => {
    if (code){
      this.setState({
        fnsku_code:code
      });
      this._findProductMove(code,{"location":this.state.barcode_stock},0)
    }
  };

  _onSubmitEditingInputSold = async (code) => {
    if (code){
      await this.setState({fnsku_change : code})
    }

  }
  _onSubmitEditingInputLocation = async (code) => {
    if (code){
      this.setState({
        barcode_stock:code
      });
      this._findProductMove(code,{"location" : code,"is_check_location":1},1);
    }
  };

  _onSubmitEditingInputNewLocation = async (code) => {
    if(parseInt(this.state.fnsku_change) > parseInt(this.state.bin_stock_info.quantity)){
      Alert.alert(
        '',
        `${translate('screen.module.product.move.text_error_1')}`,
        [
          {
            text:translate('base.confirm'),
            onPress: null,
          },
        ],
        {cancelable: false},
      );
    }
    else{
      Alert.alert(
        '',
        `${translate('screen.module.product.move.text_move_1')} ${code}. ${translate('screen.module.product.move.text_move_2')}`,
        [
          {
            text: t("base.confirm"),
            onPress: () => { this._putLocationProductMove(
              this.state.fnsku_put,
              JSON.stringify({
                old_location: this.state.barcode_stock,
                type_tracking: 0 ,
                is_prioritize :this.state.is_prioritize,
                quantity_move : this.state.fnsku_change,
                new_location: code
              })
            );},
          },
          {
            text:translate('screen.module.product.move.btn_cancel'),
            onPress: null,
          },
        ],
        {cancelable: false},
      );
    }
  };

  // toggleViewByStatus(val) {
  //   this.setState({
  //     is_prioritize: val,
  //   });
  // }

  render() {
    const {
      navigation
    } = this.props;
    const {
      fnsku_info,
      bin_stock_info,
      isloading,
      barcode_stock,
      fnsku_change,
      sugget_list_bin,
      bgLocation
    } = this.state;
    return (
        <View style={[gStyle.container]}>
          <View style={{ position: 'absolute', top: 0, width: '100%', zIndex: 10 }}>
            <ScreenHeader title={translate('screen.module.product.move.text_header')} showBack={true} navigation={navigation}/>
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
            {fnsku_info === null && bin_stock_info!= null && <TextInputComponent
              navigation={navigation}
              autoFocus={true}
              textLabel = {translate('screen.module.product.move.label_fnsku')}
              onPressCamera = {this._onSubmitEditingInput}
              onSubmitEditingInput = {this._onSubmitEditingInput}
              textPlaceholder={translate('screen.module.product.move.textplaceholder_fnsku')}>
            </TextInputComponent>}
            {bin_stock_info === null && <TextInputComponent
              navigation={navigation}
              autoFocus={true}
              textLabel = {translate('screen.module.product.move.label_current_bin')}
              onPressCamera = {this._onSubmitEditingInputLocation}
              onSubmitEditingInput = {this._onSubmitEditingInputLocation}
              textPlaceholder={translate('screen.module.product.move.textplaceholder_current_bin')}>
            </TextInputComponent>}
            {bin_stock_info !== null && fnsku_info !== null &&
              <View style={gStyle.flexRow}>
                <View style={{width:'30%'}}>
                  <TextInputComponent
                    navigation={navigation}
                    autoFocus={false}
                    keyboardType={'numeric'}
                    autoChange = {true}
                    inputValue ={`${fnsku_change}`}
                    showSearch = {false}
                    showScan = {false}
                    textLabel = {translate('screen.module.product.move.quantity_move')}
                    onPressCamera = {this._onSubmitEditingInputSold}
                    onSubmitEditingInput = {this._onSubmitEditingInputSold}
                    textPlaceholder={translate('screen.module.product.move.quantity_move')}>
                  </TextInputComponent>
                </View>
                <View style={{width:'70%'}}>
                  <TextInputComponent
                    navigation={navigation}
                    showSearch= {false}
                    autoFocus={true}
                    is_close={true}
                    textLabel = {translate('screen.module.product.move.label_new_bin')}
                    onPressCamera = {this._onSubmitEditingInputNewLocation}
                    onSubmitEditingInput = {this._onSubmitEditingInputNewLocation}
                    textPlaceholder={translate('screen.module.product.move.textplaceholder_new_bin')}>
                  </TextInputComponent>
                </View>

              </View>
            }

          </View>

          { fnsku_info !== null && (
            <View style={styles.sectionHeading}>
              <View style={{
                backgroundColor:colors.borderLight,
                height:1
                ,marginVertical:3
              }}>

              </View>
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
                    <Text style={[styles.textCode,{...gStyle.textBoxme14}]} numberOfLines={1} ellipsizeMode="tail">
                    {fnsku_info.name}</Text>
                </View>
                <View style={gStyle.flexRowCenter}>
                    <Text style={[styles.textCode]}>
                    {fnsku_info.bsin}</Text>
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
              <View style={[gStyle.flexRowSpace,{marginTop:4}]}>
                <View style={gStyle.flexRow}>
                    <Text style={[styles.textCode]} numberOfLines={1} ellipsizeMode="tail">
                    {barcode_stock}</Text>
                </View>
                <View style={gStyle.flexRowCenter}>
                    <Text style={[styles.textCode,{color:colors.boxmeBrand}]}>
                    {fnsku_change}</Text>
                </View>
              </View>
              <View style={{
                backgroundColor:colors.borderLight,
                height:1
                ,marginVertical:3
              }}>

              </View>
              <Text style={[styles.textLabel]}>{translate('screen.module.putaway.recommend')}</Text>
              <View style={[gStyle.flexRow,{marginTop:5}]}>
                {sugget_list_bin.slice(0, 3).map((prop,key) => {
                    return (
                    <Badge
                        key = {key}
                        name={prop.location.location}
                        style={{
                        backgroundColor: colors.borderLight,
                        color: `${bgLocation[Math.floor(Math.random() * 9)]}`,
                        borderRadius: 6
                        }}
                    />
                    );
                })}
              </View>

            </View>
          )}
         </KeyboardAwareScrollView>
        </View>
    );
  }
}

MoveProducts.propTypes = {
  // required
  navigation: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
  containerMove: {
    flex:1,
    marginTop:device.iPhoneNotch ? 80 : 60
  },
  containerMoveForm: {
    marginTop:30,
    marginHorizontal:8
  },
  sectionHeading: {
    marginTop:10,
    marginHorizontal:20
  },
  textCode: {
    ...gStyle.textBoxmeBold14,
    color:colors.white,
  },
  textValue: {
    ...gStyle.textBoxme14,
    color: colors.white,
    paddingLeft: 10,
  },
  textLabel :{
    ...gStyle.textboxme14,
    color:colors.greyInactive
  }
});
export default MoveProducts;
