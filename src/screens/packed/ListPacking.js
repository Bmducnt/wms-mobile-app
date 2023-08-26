import * as React from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
  Text
} from 'react-native';
import {permissionDenied} from '../../helpers/async-storage';
import { colors, device, gStyle } from '../../constants';
//Mock
import { 
  FontAwesome5,
  Feather
} from '@expo/vector-icons';
// components
import TouchIcon from "../../components/TouchIcon";

import ScreenHeader from '../../components/ScreenHeader';
import {_getTimeDefaultFrom,_getTimeDefaultTo} from '../../helpers/device-height';
import ListPackedItem from './ListPackedItem';
import EmptySearch from "../../components/EmptySearch";
// service
import { LinearGradient } from 'expo-linear-gradient';

import getListPacked from '../../services/packed/list';

class ListPacking extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollY: new Animated.Value(0),
      isloading: false,
      is_search:false,
      status_id :403,
      q : null,
      list_data : [],
      total_items : 0,
      from_time : _getTimeDefaultFrom(),
      to_time : _getTimeDefaultTo(), 
    };
    this._fetchListPacking = this._fetchListPacking.bind(this);
  }

  UNSAFE_componentWillMount = async () =>{
    const { t } = this.props.screenProps;
    this._fetchListPacking();
  }


  _fetchListPacking = async  () =>{
    this.setState({isloading : true,list_data:[]});
    const response = await getListPacked({
      'from_time' : this.state.from_time,
      'to_time' : this.state.to_time,
      'status' : this.state.status_id,
      'page':1,
      'q' : this.state.q,
      'is_b2b' :true
    });
    if (response.status === 200){
      this.setState({
        list_data : response.data.results,
        total_items : response.data.total_items,
      })
    }else if (response.status === 403){
      permissionDenied(this.props.navigation);
    };
    this.setState({isloading : false});
  };

  _searchCameraBarcode = async (code) => {
      await this.setState({q : code})
      this._fetchListPacking()
  };

  render() {
    const {
      navigation
    } = this.props;
    const {
      isloading,
      list_data,
      is_search
    } = this.state;
    const { t } = this.props.screenProps;
    return (
      <View style={[gStyle.container]} >
          <ScreenHeader 
            title={t('screen.menu.packed')}
            showBack={false}
            isFull={true}
            showInput = {is_search}
            inputValueSend ={null}
            autoFocus={false}
            bgColor={colors.cardLight}
            onPressCamera={this._searchCameraBarcode}
            onSubmitEditingInput= {this._searchCameraBarcode}
            textPlaceholder={t('screen.module.packed.tracking_scan')}
          />
          {isloading && 
          <ActivityIndicator animating={true}  style={{opacity:1}} color={colors.white} />}
          <View style={styles.containerScroll}>
              {list_data.length === 0 && !isloading && 
                <EmptySearch t={t}/>}
                
              {list_data.length > 0 && 
              <FlatList
                data={list_data}
                onRefresh={() => this._fetchListPacking()}
                refreshing={isloading}
                keyExtractor={({ pickup_id }) => pickup_id.toString()}
                ListHeaderComponent={()=>
                  <LinearGradient colors={[
                    '#67b26f','#4ca2cd']} style={[gStyle.flexCenter,{paddingVertical : 10,marginHorizontal : 10}]}>
                     <Text style={[gStyle.flexRowCenterAlign,{
                       ...gStyle.textBoxme14,
                       color:colors.white,
                       marginVertical:14
                     }]}><FontAwesome5 name="bullhorn" size={14} color={colors.white} /> {t('screen.module.packed.func')}</Text>
                 </LinearGradient>
                }
                renderItem={({ item }) => (
                  <ListPackedItem
                    translate ={t}
                    navigation={navigation}
                    showBtn ={ true}
                    itemInfo={{
                      'time_created': item.created_date,
                      'created_by': item.created_by.staff_email,
                      'picker_by' : item.picker_email.staff_name,
                      'packer_by' : item.assigner_by.staff_name,
                      'pickup_code': item.pickup_code,
                      'process_percent': item.process_percent,
                      'picker_time': item.picker_time,
                      'quantity' : item.total_items,
                      'pickup_xe' :item.pickup_xe,
                      'total_items_pick' : item.total_items_pick,
                      'warehouse_zone' : item.zone_picking,
                      'status_id' : item.status.status_id,
                    }}
                  />
                )}
              />}
          </View>
          {!is_search && <View style={gStyle.iconRight}>
          <TouchIcon
            icon={<Feather color={colors.white} name="filter" />}
            onPress={() => this.setState({is_search : true})}
            iconSize ={14}
          />
        </View>}
      </View>
    );
  }
}

ListPacking.propTypes = {
  // required
  navigation: PropTypes.object.isRequired,
  screenProps: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
  containerScroll: {
    marginBottom: device.iPhoneNotch ? 130:125,
  },
  textLabel :{
    ...gStyle.textBoxme14,
    color:colors.greyInactive,
    marginVertical:10,
    paddingLeft:10
  },
  iconRight: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: 15,
    width:35,
    height:35,
    borderRadius:35/2,
    backgroundColor:colors.borderLight,
    top: device.iPhoneNotch ? 40 : 20,
    zIndex: 100,
  },
});

export default ListPacking;