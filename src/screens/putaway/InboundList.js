import * as React from 'react';
import {
  Animated,
  Alert,
  View,
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity
} from 'react-native';
import { colors, gStyle } from '../../constants';

// components
import ListItemsPutaway from '../../components/ListItemsPutaway';
import {_getTimeDefaultFrom,
  _getTimeDefaultTo,
  _getDatetimeToTimestamp,
  _convertDatetimeToTimestamp,
  handleSoundScaner
} from '../../helpers/device-height';
import {permissionDenied} from '../../helpers/async-storage';
//service api
import putErrorPutawayInbound from '../../services/putaway/error-check';
import getListPutawayInbound from '../../services/putaway/inbound';
import EmptySearch from "../../components/EmptySearch";
import ModelException from "./ModelException";



class InboundList extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      scrollY: new Animated.Value(0),
      isloading: false,
      list_inbounds : [],
      code_scan : null,
      open_model :false,
      from_time: _getTimeDefaultFrom(),
      to_time: _getTimeDefaultTo(),
      tab_id : 0,
      tracking_code:null,
      bsin:null,
      box:null,
      reports : {
        goods_a: 0, goods_d: 0
      }
    };
    this._fetchListPutawayHandler = this._fetchListPutawayHandler.bind(this);
  };

  UNSAFE_componentWillMount = async () =>{
    this.setState({from_time : this.props.fromTime,to_time : this.props.toTime})
    this._fetchListPutawayHandler({
      'status':this.state.tab_id,
      'q' : this.props.code,
      'v2':1
    },this.state.tab_id)
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.willFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      () => {
        this._fetchListPutawayHandler({
          'status':this.state.tab_id,
          'q' : this.props.code,
          'v2':1
        },this.state.tab_id)
      }
    );
  }

  componentWillUnmount() {
    this.willFocusSubscription.remove();
  };

  _fetchListPutawayHandler = async  (parram,tab_id) =>{
    this.setState({isloading:true,list_rmas:[],list_rollbacks:[],tab_id : tab_id});
    const response = await getListPutawayInbound(parram);
    if (response.status === 200){
      this.setState({list_inbounds:response.data.results,reports :response.data.reports});
    }else if (response.status === 403){
      permissionDenied(this.props.navigation);
    }
    this.setState({isloading:false});
  };

  _putErrorLostItem = async (quantity,error_code) =>{
    this.setState({isloading:true});
    const {t} = this.props;
    const response = await putErrorPutawayInbound(JSON.stringify({
        bsin: this.state.bsin,
        tracking_code: this.state.tracking_code,
        quantity_error : quantity,
        box: this.state.box,
        status_code: error_code
    }));
    if (response.status === 200){
        Alert.alert(
          '',
          t('screen.module.putaway.text_ok'),
          [
            {
              text: t("base.confirm"),
              onPress: () => {this.onPressModel(false)},
            }
          ],
          {cancelable: false},
      );
    }else if (response.status === 403){
        permissionDenied(this.props.navigation);
    }else{
        handleSoundScaner();
    }
    this.setState({isloading:false});
};

  
  onchangeTab =async (code) =>{
    this._fetchListPutawayHandler({
        'status':code,
        'q' : this.props.code,
        'v2':1
      },code)
  }

  onPressModel = async (code) => {
    this.setState({open_model :code});
  };

  onSelectBoxError = async (tracking_code,bsin,box) =>{
    this.setState({
      tracking_code:tracking_code,
      bsin:bsin,
      box:box,
    })
    this.onPressModel(true)
  };

  render_sticky_header = ()=>{
      const {t} = this.props;
      return (
        <View style={[gStyle.flexRow,{position:"absolute",bottom:0,zIndex:100,backgroundColor:colors.borderLight}]}>
              <TouchableOpacity
                onPress={() => this.onchangeTab(0)} 
                activeOpacity={gStyle.activeOpacity} 
                style={[gStyle.flexRowSpace,{paddingVertical:17,width:'50%',paddingHorizontal:10,
                }]}
            >
                  <Text style={{color:this.state.tab_id==0 ?colors.boxmeBrand:colors.greyInactive,...gStyle.textBoxme14}} numberOfLines={1}>
                    {t('screen.module.putaway.report_a')}
                  </Text>
                  <Text style={{color:this.state.tab_id==0 ?colors.boxmeBrand:colors.greyInactive,...gStyle.textBoxme14}}>{this.state.reports.goods_a}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.onchangeTab(1)}  
                activeOpacity={gStyle.activeOpacity} style={[gStyle.flexRowSpace,{
                    paddingVertical:17,width:'50%',paddingHorizontal:10,
                    }]}>
                  <Text style={{color:this.state.tab_id==1 ?colors.boxmeBrand:colors.greyInactive,...gStyle.textBoxme14}} numberOfLines={1}>
                    {t('screen.module.putaway.report_d')}
                  </Text>
                  <Text style={{color:this.state.tab_id==1 ?colors.boxmeBrand:colors.greyInactive,...gStyle.textBoxme14}}>{this.state.reports.goods_d}</Text>
              </TouchableOpacity>
          </View>
      )
  }

  render() {
    const {
      list_inbounds,
      isloading,
      open_model,
    } = this.state;
    const {t,navigation} = this.props;
    return (
      <View style={[gStyle.container,{marginTop:0}]}>
          
          {isloading && 
          <View style={[gStyle.flexCenter,{marginTop:"20%"}]}>
            <ActivityIndicator animating={true}  style={{opacity:1}} color={colors.white} /></View>}
          {list_inbounds.length === 0 && 
            <EmptySearch t={t}/>}
          {list_inbounds.length > 0 &&<FlatList
            data={list_inbounds}
            keyExtractor={({ dr_id }) => dr_id.toString()}
            renderItem={({ item }) => (
              <ListItemsPutaway
                navigation = {navigation}
                translate ={t}
                itemInfo={{
                  'time_created': item.created_date,
                  'created_by': item.staff_id,
                  'box_code': item.dr_code,
                  'type_putaway' : true,
                  'tab_id' : item.condition_goods,
                  'putaway_id' : item.shipment_id,
                  'quantity_box' : item.quantity,
                  'condition_goods' :item.condition_goods,
                  'status_code':item.is_active,
                  'expire_date' : item.expire_date,
                  'image_product' : item.images ? item.images.urls : null,
                  'status_name' :item.status.description,
                  'fnsku_name' : item.fnsku_info.name,
                  'fnsku_uom' : item?.fnsku_info?.uom,
                  'tracking_code':item.tracking_code,
                  'zone_code':this.state.tab_id ==0 ? item.zone_code:'N/A',
                  'box_po' : item.box_po,
                  'storage_type' : item.fnsku_info.storage_type,
                  'location_code' : item.location_code,
                  'update_by' : item.update_by,
                  'fnsku_barcode' : item.fnsku_info.barcode ? item.fnsku_info.barcode  : item.fnsku_info.bsin 
                }}
                onPressModel = {this.onSelectBoxError}
                disableRightSide={false}
              />
            )}
          />}
          {this.render_sticky_header()}
          <ModelException onClose={this.onPressModel} visible ={open_model} t={t} navigation={navigation} onSubmit={this._putErrorLostItem}/>
      </View>
    );
  }
}

export default InboundList;
