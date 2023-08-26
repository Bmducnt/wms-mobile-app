import * as React from 'react';
import PropTypes from 'prop-types';
import { BottomTabBar } from 'react-navigation-tabs';
import {
  Alert,
  Vibration
} from "react-native";
// components
import getListNotifyByWarehouse from '../services/reports/notify';
import putErrorOrderFF from '../services/reports/put_order_ff';
import createPickupByStaff from '../services/pickup/create-pickup';
import BarOrderFFNOW from './BarOrderFFNOW';
import {permissionDenied} from '../helpers/async-storage';

const CustomTabBar = (props) => {
  const [ orderffNow, setorderffNow ] = React.useState(0);
  const [ loading, setloading ] = React.useState(false);
  const [ timeRequest, settimeRequest ] = React.useState(new Date());

  _rejectOrder = async () =>{
      re = await putErrorOrderFF(JSON.stringify({
          total_orders: orderffNow
      }));
  }

  _submitPickupCreated = async () =>{
    setorderffNow(0);
    props.navigation.navigate("ModelListStaff", {is_ff_now : true});
  }

  _createdPickupHandler = async () =>{
    setloading(true);
    const { t } = props.screenProps;
    const response = await createPickupByStaff(JSON.stringify({
        arr_orders: [],
        is_pda:1,
        option_add : 'ff_now',
        assigner_by : 4143,
        zone_picking : ""
    }));
    if (response.status === 200){
        Alert.alert(
            '',
            t('screen.module.pickup.create.ok'),
            [
                {
                text: t("base.confirm"),
                onPress: () => {setorderffNow(0)},
                },
            ],
            {cancelable: false},
        );
    }else{
        Alert.alert(
            '',
            t('screen.module.handover.list_driver_empty'),
            [
              {
                text: t("base.confirm"),
                onPress: null,
              }
            ],
            {cancelable: false},
        );
    }
    setloading(false)
  };
  
  _fetchOrderFF = async  () =>{
    const { t } = props.screenProps;
    const response = await getListNotifyByWarehouse({
      status_code:'order_ff_now'
    });
    if (response.status === 200){
      setorderffNow(response.data.results.total_order_now)
      settimeRequest(response.data.results.request_time)
      if(response.data.results.total_order_now >0){
        Vibration.vibrate();
        // Alert.alert(
        //   "",
        //   `${t('screen.module.home.handover_total')} ${response.data.results.total_order_now} ${t('screen.module.home.report_order.ff_now')}`,
        //   [
        //     {
        //       text: t('screen.module.home.report_order.tab_create_pk'),
        //       onPress: () =>_submitPickupCreated(),
        //     },
        //     {
        //       text: t('screen.module.home.report_order.btn_reject'),
        //       onPress: () => _rejectOrder(),
        //     },
        //   ],
        //   { cancelable: false }
        // );
      }
    }else if (response.status === 403){
      permissionDenied(props.navigation);
    };
  };

  React.useEffect(() => {
    _fetchOrderFF();
  }, []);

  React.useEffect(() => {
    const intervalCall = setInterval(() => {
      _fetchOrderFF();
    }, 600000);
    return () => {
      clearInterval(intervalCall);
    };
  }, []);

  return (
    <React.Fragment>
      {orderffNow > 0 &&<BarOrderFFNOW 
        {...props} 
        orderffNow={orderffNow} 
        timeRequest={timeRequest} 
        createPickupFF={_createdPickupHandler} 
        loading={loading}
      />}
      <BottomTabBar {...props} />
    </React.Fragment>
  );
};

CustomTabBar.propTypes = {
  // required
  navigation: PropTypes.object.isRequired,
  screenProps: PropTypes.object.isRequired
};

export default CustomTabBar;