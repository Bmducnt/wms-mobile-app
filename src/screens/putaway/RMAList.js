import * as React from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  View,
  ActivityIndicator,
  FlatList,
  Text,
  Alert,
  TouchableOpacity
} from 'react-native';
import { colors, device, gStyle } from '../../constants';

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
import getListPutawayRMA from '../../services/putaway/rma';
import EmptySearch from "../../components/EmptySearch";
import ModelException from "./ModelException";

class RMAList extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      scrollY: new Animated.Value(0),
      isloading: false,
      open_model :false,
      list_rmas : [],
      code_scan : null,
      from_time: _getTimeDefaultFrom(),
      to_time: _getTimeDefaultTo(),
      tab_id : 3,
      tracking_code:null,
      bsin:null,
      box:null,
      reports : {
        goods_a: 0, goods_d: 0
      }
    };
    this._fetchListRMAHandler = this._fetchListRMAHandler.bind(this);
  };

  UNSAFE_componentWillMount = async () =>{
    this.setState({from_time : this.props.fromTime,to_time : this.props.toTime})
    this._fetchListRMAHandler({
      'status_id':this.state.tab_id === 3? 0: 1,
      'q' : this.props.code,
      'from_time' : this.state.from_time,
      'to_time' : this.state.to_time
    },this.state.tab_id)
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.willFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      () => {
        this._fetchListRMAHandler({
          'status_id':this.state.tab_id === 3? 0: 1,
          'q' : this.props.code,
          'from_time' : this.state.from_time,
          'to_time' : this.state.to_time
      },this.state.tab_id)
      }
    );
  }

  componentWillUnmount() {
    this.willFocusSubscription.remove();
  };
  
  _fetchListRMAHandler = async  (parram,tab_id) =>{
    await this.setState({isloading:true,list_rmas:[]
      ,tab_id : tab_id,code_scan : parram.q});
    const response = await getListPutawayRMA(parram);
    if (response.status === 200){
        this.setState({list_rmas:response.data.results,reports :response.data.reports});
    }else if (response.status === 403){
      permissionDenied(this.props.navigation);
    };
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

  onchangeTab =async (code) =>{
    if (code === 3){
      this._fetchListRMAHandler({
        'status_id':0,
        'q' : this.props.code,
        'from_time' : this.state.from_time,
        'to_time' : this.state.to_time,
        'v2':1
      },code)
    }
    if (code === 5){
      this._fetchListRMAHandler({
        'q' : this.props.code,
        'status_id':3,
        'stock_level':'D1',
        'from_time' : this.state.from_time,
        'to_time' : this.state.to_time,
        'v2':1
      },code)
    }
    if (code === 6){
      this._fetchListRMAHandler({
        'q' : this.props.code,
        'status_id':3,
        'stock_level':'D2',
        'from_time' : this.state.from_time,
        'to_time' : this.state.to_time,
        'v2':1
      },code)
    }

    if (code === 7){
      this._fetchListRMAHandler({
        'q' : this.props.code,
        'status_id':3,
        'stock_level':'D3',
        'from_time' : this.state.from_time,
        'to_time' : this.state.to_time,
        'v2':1
      },code)
    }
    
  }
  render_sticky_header = ()=>{
    const {t} = this.props;
    return (
        <View style={[gStyle.flexRow,{position:"absolute",bottom:0,backgroundColor:colors.borderLight,zIndex:100}]}>
            <TouchableOpacity
              onPress={() => this.onchangeTab(3)} 
              activeOpacity={gStyle.activeOpacity} 
              style={[gStyle.flexRowSpace,{paddingVertical:17,width:'25%',paddingHorizontal:10}]}
          >
                <Text style={{color:this.state.tab_id===3 ?colors.boxmeBrand:colors.greyInactive,...gStyle.textBoxme14}}>{t('screen.module.putaway.report_stock_level')} A</Text>
                <Text style={{color:this.state.tab_id===3 ?colors.boxmeBrand:colors.greyInactive,...gStyle.textBoxme14}}>{this.state.reports.goods_a}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.onchangeTab(5)}  
              activeOpacity={gStyle.activeOpacity} style={[gStyle.flexRowSpace,{
                paddingVertical:17,width:'25%',paddingHorizontal:10
                  }]}>
                <Text style={{color:this.state.tab_id===5 ?colors.boxmeBrand:colors.greyInactive,...gStyle.textBoxme14}}>{t('screen.module.putaway.report_stock_level')} D1</Text>
                <Text style={{color:this.state.tab_id===5 ?colors.boxmeBrand:colors.greyInactive,...gStyle.textBoxme14}}>{this.state.reports.goods_d1}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.onchangeTab(6)}  
              activeOpacity={gStyle.activeOpacity} style={[gStyle.flexRowSpace,{
                paddingVertical:17,width:'25%',paddingHorizontal:10
                  }]}>
                <Text style={{color:this.state.tab_id===6 ?colors.boxmeBrand:colors.greyInactive,...gStyle.textBoxme14}}>{t('screen.module.putaway.report_stock_level')} D2</Text>
                <Text style={{color:this.state.tab_id===6 ?colors.boxmeBrand:colors.greyInactive,...gStyle.textBoxme14}}>{this.state.reports.goods_d2}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.onchangeTab(7)}  
              activeOpacity={gStyle.activeOpacity} style={[gStyle.flexRowSpace,{
                paddingVertical:17,width:'25%',paddingHorizontal:10
                  }]}>
                <Text style={{color:this.state.tab_id===7 ?colors.boxmeBrand:colors.greyInactive,...gStyle.textBoxme14}}>{t('screen.module.putaway.report_stock_level')} D3</Text>
                <Text style={{color:this.state.tab_id===7 ?colors.boxmeBrand:colors.greyInactive,...gStyle.textBoxme14}}>{this.state.reports.goods_d3}</Text>
            </TouchableOpacity>
        </View>
    )
}
  render() {
    const {
      list_rmas,
      isloading,
      open_model,
      from_time,
      to_time
    } = this.state;
    const {t,navigation} = this.props;
    return (
      <View style={[gStyle.container]}>
            {isloading && 
            <View style={[gStyle.flexCenter,{marginTop:"20%"}]}><ActivityIndicator animating={true}  style={{opacity:1}} color={colors.white} /></View>}
            {list_rmas.length === 0 ? 
              <EmptySearch t={t}/>:
              <View>
              <FlatList
                data={list_rmas}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <ListItemsPutaway
                      navigation = {navigation}
                      translate ={t}
                      itemInfo={{
                          'time_created': item.created_date,
                          'created_by': item.staff_id,
                          'box_code': item.pa_code,
                          'putaway_id' : item.pa_code,
                          'type_putaway' : false,
                          'condition_goods' :'N/A',
                          'image_product' : null,
                          'tab_id' : this.state.tab_id===3 ? 'RMA_A' : this.state.tab_id===5 ? 'RMA_D1' : this.state.tab_id===6 ? 'RMA_D2':'RMA_D3',
                          'total_damageds' : item.total_damageds,
                          'total_accepts' : item.total_accepts,
                          'total_losts' : item.total_losts,
                          'zone_code':'N/A',
                          'quantity_box' : item.total_damageds+item.total_accepts+item.total_losts+item.total_destroys,
                          'quantity_putaway':item.total_putaway,
                          'status_code':item.is_active,
                          'status_name' :'',
                          'location_code' : null,
                          'update_by' : null,
                          'fnsku_name' : null,
                          'fnsku_barcode' : null
                      }}
                      onPressModel = {this.onSelectBoxError}
                      disableRightSide={false}
                    />
                )}
                /></View>}
                
                {this.render_sticky_header()}
              <ModelException onClose={this.onPressModel} visible ={open_model} t={t} navigation={navigation} onSubmit={this._putErrorLostItem}/>
            
            <View style={gStyle.spacer11} />
            <View style={gStyle.spacer11} />
      </View>
    );
  }
}

export default RMAList;
