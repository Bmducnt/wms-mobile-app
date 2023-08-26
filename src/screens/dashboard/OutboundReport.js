import * as React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
} from 'react-native';
import { 
  colors, 
  device, 
  gStyle ,
} from '../../constants';
import { AntDesign } from '@expo/vector-icons';
import { SvgUri } from "react-native-svg";



const OutboundReport = props => {

  function findSLAday(list_sla, day) {
    const sla = list_sla.find((element) => element.name === day);
    return sla ? sla.sla_value_fail : 0;
  }
  

  return (
      <React.Fragment>
       {props.kpi_reports && <View style={gStyle.flexRowSpace}>
            <Text style={[styles.sectionHeading]} numberOfLines={1}>{props.t('screen.module.home.report_order.text_header_sub')}</Text>
            <Text style={{color:colors.white,...gStyle.textBoxmeBold14,paddingRight:15}}>
                {props.kpi_total.toLocaleString()}
             </Text>
          </View>}
          <View style={[{marginHorizontal:10,backgroundColor:colors.cardDark,borderRadius:3}]}>
            <FlatList
              data={props.kpi_reports}
              horizontal
              keyExtractor={(item, index) => 'key'+index}
              renderItem={({ item }) => (
                <View style={[gStyle.flexRowCenterAlign,{
                  marginHorizontal:5,marginVertical:5,paddingVertical:10}]} key={item.carrier_name}>
                  <View><SvgUri width={35} height={35} uri={item.courier_logo} /></View>
                  <View style={{paddingHorizontal:6,width:Dimensions.get("window").width/3}}>
                      
                      <View style={[gStyle.flexRowSpace]}>
                          <Text style={{...gStyle.textBoxme14,color:colors.white}} numberOfLines={1}>
                              {item.courier_name}
                          </Text>
                      </View>
                      <View style={gStyle.flexRowSpace}>
                          <Text style={{...gStyle.textBoxme12,color:colors.greyInactive}}>{props.t('screen.module.home.report_order.awaiting')}</Text>
                          <Text style={{...gStyle.textBoxme14,color:colors.white}}>
                          {item.total_awaiting_pickup.toLocaleString()}
                          </Text>
                      </View>
                  </View>
              </View>)}
              showsHorizontalScrollIndicator={false}
            />
            <FlatList
              data={props.slaSync}
              horizontal
              keyExtractor={(item, index) => 'key'+index}
              renderItem={({ item }) => (
                <View key = {item.days} style={[gStyle.flexCenter,{
                  paddingHorizontal:10,
                  paddingVertical:6,
                  marginHorizontal:1,
                  backgroundColor:colors.borderLight,
                  width:Dimensions.get("window").width/3.2
                  }]}>
                      <Text  style={{...gStyle.textBoxme12,color:colors.white}}>
                        {item.days}
                      </Text>
                      <View style={gStyle.flexRowCenter}>
                        <Text  style={{...gStyle.textBoxmeBold14,color:colors.white,marginHorizontal:5}}>
                            {item.totals.toLocaleString()}{" "}/
                        </Text>
                        <View style={{
                          padding:2,
                          borderRadius:0,
                          backgroundColor:colors.boxmeBrand
                        }}>
                            <Text  style={{...gStyle.textBoxme10,color:colors.white}}>
                                Miss SLA {findSLAday(props.slaPack,item.days)}
                            </Text>
                        </View>
                  </View>
              </View>)}
              showsHorizontalScrollIndicator={false}
            />
          </View>
      </React.Fragment>
    );
  }

const styles = StyleSheet.create({
    sectionHeading: {
        ...gStyle.textBoxme16,
        color: colors.white,
        marginVertical:6,
        marginLeft: 10
      },
});
export default React.memo(OutboundReport);
