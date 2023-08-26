import * as React from 'react';
import {
  Animated,
  View,
  ActivityIndicator,
  FlatList
} from 'react-native';
import { 
  colors, 
  gStyle
} from '../../constants';

// components
import ListItemsPutaway from '../../components/ListItemsPutaway';
import {_getTimeDefaultFrom,_getTimeDefaultTo} from '../../helpers/device-height';
import {permissionDenied} from '../../helpers/async-storage';
//service api
import getListFNSKURollback from '../../services/putaway/rollback-bin';
import EmptySearch from "../../components/EmptySearch";

class RollbackList extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      scrollY: new Animated.Value(0),
      isloading: false,
      list_rollbacks : [],
      code_scan : null,
      from_time : _getTimeDefaultFrom(),
      to_time : _getTimeDefaultTo(),
    };
    this._fetchListRollbackHandler = this._fetchListRollbackHandler.bind(this)
  };

  UNSAFE_componentWillMount = async () =>{
    this._fetchListRollbackHandler({
        'q' : this.props.code
    })
  };

  _fetchListRollbackHandler = async  (parram) =>{
    this.setState({isloading:true,list_rollbacks:[]});
    const response = await getListFNSKURollback(parram);
    if (response.status === 200){
      this.setState({list_rollbacks:response.data.results});
    }else if (response.status === 403){
      permissionDenied(this.props.navigation);
    }
    this.setState({isloading:false});
  };

  render() {
    const {list_rollbacks,isloading} = this.state;
    const {t,navigation} = this.props;
    return (
      <View style={[gStyle.container]}>
            {isloading && 
            <View style={[gStyle.flexCenter,{marginTop:"20%"}]}><ActivityIndicator animating={true}  style={{opacity:1}} color={colors.white} /></View>}
            {list_rollbacks.length === 0 ? 
              <EmptySearch t={t}/>:
              <View>
                  <FlatList
                    data={list_rollbacks}
                    keyExtractor={(item, index) => item.toString()+index}
                    renderItem={({ item }) => (
                        <ListItemsPutaway
                        navigation = {navigation}
                        translate ={t}
                        itemInfo={{
                            'time_created': item.created_date,
                            'created_by': item.staff_id,
                            'box_code': item.box_code,
                            'type_putaway' : true,
                            'tab_id' : 'ROLLBACK',
                            'putaway_id' : String(item.shipment_id),
                            'quantity_box' : item.quantity,
                            'image_product' : item.image_info ? item.image_info.urls : null,
                            'status_code':1,
                            'is_rollback':true,
                            'condition_goods' :'A',
                            'zone_code':'N/A',
                            
                            'status_name' :null,
                            'fnsku_name' : item.fnsku_info.name,
                            'fnsku_barcode' : item.fnsku_info.barcode ? item.fnsku_info.barcode  : item.fnsku_info.bsin 
                        }}
                        disableRightSide={true}
                        />
                    )}
                    />
              </View>}
            <View style={gStyle.spacer11} />
            <View style={gStyle.spacer11} />
      </View>
    );
  }
}

export default RollbackList;
