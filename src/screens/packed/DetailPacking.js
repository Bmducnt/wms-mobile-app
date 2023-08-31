import * as React from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator
} from 'react-native';
import {permissionDenied} from '../../helpers/async-storage';
import { colors, device, gStyle } from '../../constants';

import ScreenHeader from '../../components/ScreenHeader';
import {_getTimeDefaultFrom,_getTimeDefaultTo} from '../../helpers/device-height';
// service
import ItemOrderPacked from './ItemOrderPacked';
import ModelOrderItems from './OrderItems';
import getDetailPacked from '../../services/packed/detail';
import {translate} from "../../i18n/locales/IMLocalized";

class DetailPacking extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      scrollY: new Animated.Value(0),
      isloading: false,
      isloadingBox: false,
      openModel : false,
      load_by:false,
      total_page : 1,
      page : 1,
      staff_packed : null,
      total_items : 0,
      tracking_code : null,
      q : null,
      list_label : [],
      order_items : [],
      list_data : [],
      list_data_full : [],
      from_time : _getTimeDefaultFrom(),
      to_time : _getTimeDefaultTo(),
    };
  }

  UNSAFE_componentWillMount = async () =>{
    const {params} = this.props?.route
    await this._fetchDetailPacking(params?.pickup_code)
  }

  _onSelectOrder = async (code,order_items) =>{
    let data = []
    order_items.forEach(element => {
      data.push({
        'fnsku_code' :element.product_bsin,
        'fnsku_name' :element.product_name,
        'quantity_pick' : element.total_pick,
        'sold' : element.total_items,
      })
    });
    await this.setState({tracking_code : code,order_items : data,load_by :false,list_label : order_items[0].label });
    this._setopenModel(true);
  };

  _onGetOrderBox = async (code) => {
    let data = [];
    let list_label = [];
    this.setState({isloadingBox : true});
    const response = await getDetailPacked(code,{is_put:1});
    if (response.status === 200){
      list_label = response.data.results.items[0].label;
      response.data.results.list_box.forEach(element => {
        data.push({
          'overpack_code' :element.overpack_code,
          'overpack_quantity' :element.overpack_quantity,
          'request_time' : element.request_time,
          'label' : `https://wms.boxme.asia/api/pickup/b2b/pdf/`+element.overpack_code+`?tracking_code=`+code,
        })
      });

    }
    await this.setState({order_items : data,load_by :true,isloadingBox:false,list_label : list_label})
    this._setopenModel(true);

  }

  _setopenModel = async(code) =>{
    await this.setState({openModel : code});
  }

  _fetchDetailPacking = async  (packing_code) =>{
    this.setState({isloading : true,list_data:[]});
    const response = await getDetailPacked(packing_code,{});
    if (response.status === 200){
      this.setState({
        list_data_full : response.data.results.by_tracking,
        total_items : response.data.results.data.total_items,
        staff_packed : response.data.results.data.assigner_by.staff_email,
        list_data: response.data.results.by_tracking.slice(0,8),
        total_page : Math.ceil(response.data.results.by_tracking.length/8)
      })
    }else if (response.status === 403){
      permissionDenied(this.props.navigation);
    }
    this.setState({isloading : false});
  };

  handleLoadMore = async () => {
    if(this.state.page+1 > this.state.total_page){ return null; }
    this.state.page = this.state.page + 1
    const offset = (this.state.page-1)*8
    const end_offset =  (this.state.page)*8
    this.setState({
      page: this.state.page + 1,
      list_data: [...this.state.list_data,...this.state.list_data_full.slice(offset,end_offset)]
    });
  };

  render() {
    const {navigation} = this.props;
    const {
      isloading,
      list_data,
      openModel,
      staff_packed,
      total_items,
      order_items,
      load_by,
      isloadingBox,
      list_label
    } = this.state;
    const { params } = this.props?.route;
    return (
      <View style={[gStyle.container]} >
        <View style={{ position: 'absolute', top: 0, width: '100%',zIndex:100}}>
          <ScreenHeader
            title={`${translate('screen.module.packed.detail.text')} ${params?.pickup_code}`}
            showBack={true}
            isFull={false}
            showInput = {false}
            inputValueSend ={null}
            autoFocus={false}
            onPressCamera={null}
            onSubmitEditingInput= {null}
           navigation={navigation}/>
          {isloading &&
          <View >
            <ActivityIndicator />
          </View>}

        </View>
        <View style={styles.containerScroll}>
            {list_data.length > 0 && <FlatList
              data={list_data}
              ListHeaderComponent={
                <View style={[gStyle.flexRowSpace,{backgroundColor:colors.borderLight}]}>
                    <Text style={{
                      ...gStyle.textBoxme14,
                      color:colors.white,
                      marginVertical:14,
                      paddingLeft:10
                    }}>{translate('screen.module.packed.detail.staff')} {staff_packed}</Text>
                    <Text style={{
                      ...gStyle.textBoxme14,
                      color:colors.white,
                      marginVertical:10,
                      paddingRight:10
                    }}>{translate('screen.module.packed.detail.have')}  {total_items} item</Text>
                </View>
              }
              onRefresh={() => this._fetchDetailPacking(params?.pickup_code)}
              refreshing={isloading}
              initialNumToRender={8}
              onEndReachedThreshold={0.5}
              onEndReached={() => {
                this.handleLoadMore();
              }}
              keyExtractor={({ tracking_code__tracking_code }) => tracking_code__tracking_code.toString()}
              renderItem={({ item }) => (
                <ItemOrderPacked
                  navigation={navigation}
                  isloading={isloadingBox}
                  onSelect = {this._onSelectOrder}
                  onListBox = {this._onGetOrderBox}
                  itemInfo={{
                    'time_update': item.data[0].time_update,
                    'tracking_code': item.tracking_code__tracking_code,
                    'tracking_logo' : item.data[0].tracking_code__carrier_logo,
                    'tracking_quantity' : item.data[0].tracking_code__quantity,
                    'tracking_source' : item.data[0].tracking_code__source,
                    'pickup_note' : item.data[0].tracking_code__pickup_note,
                    'total_fnsku' : item.data.length,
                    'status_id':item.data[0].tracking_code__status,
                    'tracking_po' : item.data[0].tracking_code__external_tracking_code,
                    'tracking_packed_done' : item.data[0].is_packed_ok,
                    'quantity' : item.data[0].total,
                    'list_items' : item.data,
                    'tracking_type' : item.data[0].tracking_code__is_osm ? 'OSM' : item.data[0].tracking_code__type_order === 4  ? 'B2B': 'B2C',
                  }}
                />
              )}
            />}
        </View>
        {openModel &&
          <ModelOrderItems
            listData = {order_items}
            load_by = {load_by}
            list_label = {list_label}
            onClose = {this._setopenModel}
          />
        }
      </View>
    );
  }
}

DetailPacking.propTypes = {
  // required
  navigation: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  containerScroll: {
    paddingTop: device.iPhoneNotch ? 90:65,
    marginBottom: device.iPhoneNotch ? 10:10,
  },
});

export default DetailPacking;
