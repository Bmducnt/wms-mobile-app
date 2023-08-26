import * as React from 'react';
import PropTypes, { any } from 'prop-types';
import {
  StyleSheet,
  View,
  SafeAreaView, 
  ScrollView,
  Text,
  RefreshControl,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { 
  Entypo
 } from '@expo/vector-icons';

import { colors, device, gStyle } from '../constants';
//Mock
// components
import ScreenHeader from '../components/ScreenHeader';
// icons
import ChartModule from '../components/ChartModule';
import LineChart from '../components/LineChart';
import ListCarrierHandoverDay from '../components/ListCarrierHandoverDay';
import CardInfo from '../components/CardInfo';
import POTReport from './dashboard/POT';


import getAnanlysisHandover from '../services/reports/analysis_handover';
import getAnanlysisCycle from '../services/reports/analysis_cycle';
import getListOrderException from '../services/reports/exception';
import getAnanlysisPickup from '../services/reports/analysis_pickup';
import getAnanlysisPutaway from '../services/reports/analysis_putaway';
import getAnanlysisFFNOW from '../services/reports/analysis_ff_now';

import {_getTimeDefaultFrom,
  _getTimeDefaultTo,
  _getDatetimeToTimestamp,
  _convertDatetimeToTimestamp} from '../helpers/device-height';
  import {permissionDenied} from '../helpers/async-storage';

class Home extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      handover_chart_data :[],
      handover_chart_carrier :[],
      loading : false,
      cycle_by_fnsku : 0,
      cycle_by_bin : 0,
      to_time : _getTimeDefaultTo(),
      total_fnsku_error_stock : 0,
      total_order_error_stock : 0,
      picking_time :0,
      picking_total : 0,
      picking_chart : [],
      total_putaway_awaiting : 0,
      total_putaway_done : 0,
      total_shipment_awaiting : 0,
      total_shipment_overdue : 0,
      total_order_ff : 0,
      total_order_ff_time : 0,
    }
  }

  UNSAFE_componentWillMount = async () =>{
    this.onRefresh()
  };

  
  onRefresh = async () => {
    const promises = [
      this.fetchReportHandoverAnalysis({ to_time: _getTimeDefaultTo() }),
      this.fetchReportCycleAnalysis({ to_time: _getTimeDefaultTo() }),
      this.fetchReportPickupAnalysis({ to_time: _getTimeDefaultTo(), type_load: 0 }),
      this.fetchReportPickupAnalysis({ to_time: _getTimeDefaultTo(), type_load: 1 }),
      this.fetchReportException(),
      this.fetchReportPutaway({ to_time: _getTimeDefaultTo() }),
      this.fetchReportFFNOW({ to_time: _getTimeDefaultTo() })
    ];
  
    await Promise.all(promises);
  };

  fetchReportPutaway = async (parram) => {
    const response = await getAnanlysisPutaway(parram);
    if (response.status === 200){
      this.setState({
        total_putaway_awaiting : response.data.results.by_putaway.awaiting_putaway,
        total_putaway_done : response.data.results.by_putaway.done_putaway,
        total_shipment_awaiting : response.data.results.by_shipment.total_shipment_in+response.data.results.by_shipment.total_shipment_inspection,
        total_shipment_overdue : response.data.results.by_shipment.total_shipment_overdue});
    }else if (response.status === 403){
      this.setState({isFetchAPI : false});
      permissionDenied(this.props.navigation);
    };
  };
  

  fetchReportFFNOW = async (parram) => {
    const response = await getAnanlysisFFNOW(parram);
    if (response.status === 200){
      this.setState({
        total_order_ff : response.data.results.total_order_ff_now,
        total_order_ff_time : response.data.results.total_time_process});
    }else if (response.status === 403){
      this.setState({isFetchAPI : false});
      permissionDenied(this.props.navigation);
    };
  };

  fetchReportHandoverAnalysis = async (parram) => {
    this.setState({loading : true});
    const { t } = this.props.screenProps;
    const response = await getAnanlysisHandover(parram);
    if (response.status === 200){
      this.setState({
        handover_chart_data : [
          {
            id: 1,
            name: t('screen.module.analysis.outbound_done'),
            color: colors.brandPrimary,
            expenses: [
                {
                    total: response.data.results.by_handover.total_handover,
                    status: "C"
                }
            ]
          },
          {
            id: 2,
            name: t('screen.module.analysis.outbound_awaiting'),
            color: colors.boxmeBrand,
            expenses: [
                {
                    total: response.data.results.by_handover.total_awaiting_handover,
                    status: "C"
                }
            ]
          },
          {
            id: 4,
            name: t('screen.module.analysis.outbound_reject'),
            color: colors.red,
            expenses: [
                {
                    total: response.data.results.by_handover.total_refuses,
                    status: "C"
                }
            ]
          },
          {
            id: 3,
            name: t('screen.module.analysis.outbound_rts'),
            color: colors.purple,
            expenses: [
                {
                    total: response.data.results.by_handover.total_orders_rts,
                    status: "C"
                }
            ]
          },
        ],
        handover_chart_carrier : response.data.results.by_carrier_name
      });
    }else if (response.status === 403){
      permissionDenied(this.props.navigation);
    };
    this.setState({loading : false});
  };

  fetchReportCycleAnalysis = async (parram) => {
    this.setState({loading : true});
    const response = await getAnanlysisCycle(parram);
    if (response.status === 200){
      this.setState({
        cycle_by_fnsku : response.data.results.by_fnsku,
        cycle_by_bin : response.data.results.by_bin
      });
    }else if (response.status === 403){
      permissionDenied(this.props.navigation);
    };
    this.setState({loading : false});
  };

  fetchReportException = async () => {
    const response = await getListOrderException({});
    if (response.status === 200){
      this.setState({
        total_fnsku_error_stock : response.data.total_fnsku_error_stock,
        total_order_error_stock : response.data.total_items});
    }else if (response.status === 403){
      this.setState({loading : false});
      permissionDenied(this.props.navigation);
    };
  };

  fetchReportPickupAnalysis = async (parram) => {
    const response = await getAnanlysisPickup(parram);
    if (response.status === 200){
      if (parram.type_load === 0){
        this.setState({
          picking_time : response.data.results.total_time_pickup_per_order,
          picking_total : response.data.results.total_pickup_by_day});
      }else{
        this.setState({
          picking_chart : response.data.results});
      }
      
    }else if (response.status === 403){
      this.setState({loading : false});
      permissionDenied(this.props.navigation);
    };
  };


  render() {
    const { t } = this.props.screenProps;
    const {
      handover_chart_data,
      handover_chart_carrier,
      cycle_by_fnsku,
      cycle_by_bin,
      total_fnsku_error_stock,
      total_order_error_stock,
      to_time,
      picking_time,
      picking_total,
      picking_chart,
      total_putaway_awaiting,
      total_putaway_done,
      total_shipment_awaiting,
      total_shipment_overdue,
      total_order_ff,
      total_order_ff_time,
      loading
    } = this.state;
    
    const picking_chart_pk = picking_chart.map((point) => {
      const y = point.y1
      return { ...point, y };
    });
    const width = Dimensions.get("window").width -50;
    return (
      <SafeAreaView style={[gStyle.container]} >
        <View style={{ position: 'absolute', top: 0, width: '100%', zIndex: 10 }}>
          <ScreenHeader title={t('screen.module.staff_report.header_text')} bgColor={colors.cardLight} textAlign={'center'} />
        </View>
        <ScrollView style={{paddingTop:device.iPhoneNotch ? 40 : 60 }}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={this.onRefresh}
            />
          }
        >
          {loading && <View style={[gStyle.flexCenter,{marginTop:"10%"}]}><ActivityIndicator animating={true}  style={{opacity:1}} color={colors.white} /></View>}
          <View style={gStyle.flexRowSpace}>
            <Text style={styles.sectionHeading}>{t('screen.module.analysis.outbound')}</Text>
            <Text style={styles.sectionHeadingRight}>{_getDatetimeToTimestamp(to_time)}</Text>
          </View>
          {handover_chart_data.length > 0 && <View style={[gStyle.flexRow,styles.containerCard]}>
            <ChartModule
              data={handover_chart_data}
              trans ={t}
              bg={colors.cardLight}
              text_info = {t("screen.module.staff_report.unit_item")}
            />
          </View>}
          {handover_chart_carrier.length > 0 && <View style={[gStyle.flexRow,styles.containerCard]}>
              <ListCarrierHandoverDay data={handover_chart_carrier} t={t}/>
          </View>}
          
          
          <CardInfo t={t} value ={cycle_by_bin} icon={"add-location"}  bg={colors.boxmeBrand} top={5} name ={t('screen.module.analysis.cycle_bin')} />
          <CardInfo t={t} value ={cycle_by_fnsku} icon={"beenhere"}  bg={colors.brandPrimary} top={0.5} name ={t('screen.module.analysis.cycle_fnsku')} />
          
          <CardInfo t={t} value ={total_fnsku_error_stock} icon={"message"}  bg={colors.purple} top={0.5} 
              name ={t('screen.module.analysis.lost_stock_order')} 
              unit={t('screen.module.analysis.lost_stock_order_unit')}/>
          
          <CardInfo t={t} value ={total_order_error_stock} icon={"block"}  bg={colors.boxmeBrand} top={0.5} 
              name ={t('screen.module.analysis.lost_stock_fnsku')} 
              unit={t('screen.module.analysis.lost_stock_fnsku_unit')}/>
          <View style={{marginTop:5}}/>
          {/* <POTReport t={t} /> */}
          <View style={gStyle.flexRowSpace}>
            <Text style={styles.sectionHeading}>{t('screen.module.analysis.pickup')}</Text>
            <Text style={styles.sectionHeadingRight}>{_getDatetimeToTimestamp(to_time)}</Text>
          </View>
          <View style={[gStyle.flexRow,styles.containerCard,{borderRadius:3}]}>
            <View style={[gStyle.flexCenter,{width:Dimensions.get("window").width/2}]}>
              <Entypo name="back-in-time" size={22} color={colors.white}/>
              <Text style={{...gStyle.textBoxme14,color:colors.white,paddingTop:5}}>
                {picking_time} {t('screen.module.analysis.pickup_minute')} / {t('screen.module.analysis.pickup_code')}</Text>
            </View>
            <View style={[gStyle.flexCenter,{width:Dimensions.get("window").width/2,paddingVertical:5}]}>
              <Entypo name="shopping-cart" size={22} color={colors.white}/>
              <Text style={{...gStyle.textBoxme14,color:colors.white,paddingTop:5}}>{picking_total} {t('screen.module.analysis.pickup_code')}</Text>
            </View>
          </View>
          <View style={gStyle.flexRowSpace}>
            <Text style={styles.sectionHeading}>{t('screen.module.analysis.pickup_7')}</Text>
          </View>
          <View style={[gStyle.flexCenter,{marginTop:5}]}>
            {picking_chart.length > 0 && <LineChart t={t} data1={picking_chart.slice(6,14)} data2={picking_chart_pk.slice(6,14)}/>}
          </View>
          <View style={gStyle.flexRowSpace}>
            <Text style={styles.sectionHeading}>{t('screen.module.analysis.order_ff')}</Text>
            <Text style={styles.sectionHeadingRight}>{_getDatetimeToTimestamp(to_time)}</Text>
          </View>
          <View style={[gStyle.flexRow,styles.containerCard]}>
            <View style={[gStyle.flexCenter,{width:Dimensions.get("window").width/2}]}>
              <Entypo name="flag" size={22} color={colors.white}/>
              <Text style={{...gStyle.textBoxme14,color:colors.white,paddingTop:5}}>{total_order_ff.toLocaleString()}  {t('screen.module.analysis.order_unit')}</Text>
            </View>
            <View style={[gStyle.flexCenter,{width:Dimensions.get("window").width/2,minHeight:55}]}>
              <Entypo name="back-in-time" size={22} color={colors.white}/>
              <Text style={{...gStyle.textBoxme14,color:colors.white,paddingTop:5}}>{total_order_ff_time}  {t('screen.module.analysis.pickup_minute')} /  {t('screen.module.analysis.order_unit')}</Text>
            </View>
          </View>
          
          <View style={gStyle.flexRowSpace}>
            <Text style={styles.sectionHeading}>{t('screen.module.analysis.inbound')}</Text>
            <Text style={styles.sectionHeadingRight}>{_getDatetimeToTimestamp(to_time)}</Text>
          </View>

          <CardInfo t={t} value ={total_putaway_done} icon={"radio-button-checked"}  bg={colors.brandPrimary} top={0.5} 
              name ={t('screen.module.analysis.inbound_putaway')} unit={'pcs'} />
          
          <CardInfo t={t} value ={total_putaway_awaiting} icon={"approval"}  bg={colors.boxmeBrand} top={0.5} 
              name ={t('screen.module.analysis.inbound_putaway_todo')} unit={'pcs'}/>

          <CardInfo t={t} value ={total_shipment_awaiting} icon={"fact-check"}  bg={colors.purple} top={0.5} 
              name ={t('screen.module.analysis.inbound_shipment_todo')}/>
          
          <CardInfo t={t} value ={total_shipment_overdue} icon={"error"}  bg={colors.red} top={0.5} 
              name ={t('screen.module.analysis.inbound_shipment_overdue')}/> 

          <View style={gStyle.spacer11} />
          <View style={gStyle.spacer11} />
        </ScrollView>
      </SafeAreaView>
    );
  }
}

Home.propTypes = {
  // required
  navigation: PropTypes.object.isRequired,
  screenProps: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
  containerScroll: {
    marginBottom: device.iPhoneNotch ? 130:125,
  },
  containerCard :{
    backgroundColor:colors.cardLight,
    paddingVertical:5,
    marginHorizontal:10
  },
  blockInfo :{
    paddingVertical:2,
    borderBottomColor:colors.cardLight,
  },
  sectionHeading: {
    ...gStyle.textBoxme16,
    color: colors.white,
    marginVertical:8,
    marginLeft: 10
  },
  sectionHeadingRight: {
    ...gStyle.textBoxme14,
    color: colors.greyInactive,
    marginRight:10
  },
  textLabel :{
    ...gStyle.textBoxme14,
    color:colors.greyInactive,
    marginVertical:10,
    paddingLeft:10
  }
});

export default Home;
