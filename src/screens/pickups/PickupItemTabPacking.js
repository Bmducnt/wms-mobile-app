import * as React from 'react';
import {
  View,
  ActivityIndicator,
  FlatList
} from 'react-native';
import {
    colors,
    gStyle
} from '../../constants';

import ListPickupItems from '../../components/ListPickupItems';
import {
    _getTimeDefaultFrom,
    _getTimeDefaultTo
} from '../../helpers/device-height';
import {permissionDenied} from '../../helpers/async-storage';

// mock
import EmptySearch from "../../components/EmptySearch";
//service api
import getListPickup from '../../services/pickup/list';


class PickupItemTabPacking extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            list_pickup : []
        };
        this._isMounted = false;
        this._fetchListPickupHandler = this._fetchListPickupHandler.bind(this);
    };

    componentDidMount() {
        this._isMounted = true;
    }

    UNSAFE_componentWillMount = async () =>{
        this._fetchListPickupHandler({
            'status' : this.props.status_id,
            'q' : this.props.code !== null ? this.props.code : '',
            'is_error' : 0})
    };

    componentWillUnmount() {
        this._isMounted = false;
    }

    _fetchListPickupHandler = async  (parram) =>{
        this.setState({isloading:true,list_pickup:[]});
        const response = await getListPickup(parram);
        if (response.status === 200){
            this.setState({list_pickup:response.data.results});
        }else if (response.status === 403){
            permissionDenied(this.props.navigation);
        }
        this.setState({isloading:false});
    };

    _onRefresh = async () =>{
        this.setState({isloading: true,},() =>
        {
            this._fetchListPickupHandler({
                'status' : this.props.status_id,
                'q' : this.props.code !== null ? this.props.code : '',
                'is_error' : 0})
        });
    }

    render() {
        const {
            list_pickup,
            isloading,
            tab_value
        } = this.state;
        const {t,navigation} = this.props;
        return (
            <View style={[gStyle.container]}>
                {isloading && <View style={[gStyle.flexCenter,{marginTop:"20%"}]}><ActivityIndicator animating={true}  style={{opacity:1}} color={colors.white} /></View>}
                <View>
                    {list_pickup.length === 0  &&  !isloading &&
                        <EmptySearch/> }
                    {list_pickup.length > 0 && <FlatList
                    data={list_pickup}
                    onRefresh={() => this._onRefresh()}
                    refreshing={isloading}
                    keyExtractor={({ pickupbox_id }) => pickupbox_id.toString()}
                    renderItem={({ item }) => (
                        <ListPickupItems
                            navigation = {navigation}
                            itemInfo={{
                                'time_created': item.created_date,
                                'assigner_by' :item.assigner_by.email,
                                'assigner_by_avatar': item.assigner_by.avatar,
                                'assigner_by_img': item.assigner_by.is_image,
                                'created_by': item.created_by.email,
                                'created_by_avatar': item.created_by.avatar,
                                'created_by_img': item.created_by.is_image,
                                'pickup_code': item.pickup_id.pickup_code,
                                'pickup_type':item.pickup_id.pickup_type.toLowerCase(),
                                'pickup_xe' : item.pickup_id.pickup_xe,
                                'quantity' : item.pickup_id.total_items,
                                'total_items_pick' : item?.part_quantity > 0 ? item?.part_quantity : item.total_items_pick,
                                'part_id': item.part_id,
                                'is_vas': item?.is_vas ? item?.is_vas : 0,
                                'pickup_box_id' : item.pickupbox_id,
                                'quantity_tracking' : item.list_order_id__tracking_code,
                                'quantity_bin' : item.list_bin_id,
                                'quantity_fnsku' : item.list_product_id__bsin,
                                'tab_value' : 1,
                                'is_open_model':false,
                                'total_orders_sla':item.total_orders_sla,
                                'time_process':item.time_process,
                                'zone_picking' :item.pickup_id.zone_picking,
                                'status_id' : item.status_id.status_id,
                                'pickup_kpi_flat' : item.pickup_kpi.is_kpi,
                                'pickup_kpi_left' : item.pickup_kpi.time_left,
                            }}
                            onPress ={this._onUpdate}
                            disableRightSide={true}
                        />
                    )}
                    />}
                </View>
            </View>
        );
    }
}


export default React.memo(PickupItemTabPacking);
