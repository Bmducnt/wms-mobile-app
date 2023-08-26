import React, { useRef,memo } from "react";
import {
    View,
    Text,
    ActivityIndicator
} from 'react-native';
import { colors, gStyle } from '../constants';
import  getComplexity from '../services/reports/complexity';


const ReportAdmin = props => {


    const [totalOrder, settotalOrder] = React.useState(0);
    const [isLoading, setisLoading] = React.useState(false);
    const [listOrderComplexity, setlistOrderComplexity] = React.useState([]);
    const [summarySlaPack, setsummarySlaPack] = React.useState([]);

    React.useEffect( () => {
        fetchComplexity();
      }, []);


      async function fetchComplexity() {
        setisLoading(true);
        const response = await getComplexity({'to_time' : props.to_time});
        if (response.status === 200){
            settotalOrder(response?.data?.total_order);
            setlistOrderComplexity(response?.data?.results);
            setsummarySlaPack(response?.data?.summary_sla_pack);
        }
        setisLoading(false)
      };
    return (
        <View style={{ flex: 1,backgroundColor:colors.cardDark,borderRadius:6,marginHorizontal:10,marginTop: 2}}>
            {isLoading ? <View style={{paddingVertical:12}}><ActivityIndicator /></View>:
            <View style={{paddingVertical:10}}>
                
                <View style={[gStyle.flexRowSpace,{paddingHorizontal:10,paddingBottom:3}]}>
                    <Text style={{...gStyle.textBoxme16,color:colors.white}}>{props.t("screen.module.handover.packed_order")}</Text>
                    <View style={gStyle.flexRowCenter}>
                        <Text style={{...gStyle.textBoxme16,color:colors.white}}>{totalOrder.toLocaleString()} / </Text>
                        <View style={{
                        padding:2,
                        marginLeft:3,
                        borderRadius:0,
                        backgroundColor:colors.boxmeBrand
                        }}>
                            <Text  style={{...gStyle.textBoxme10,color:colors.white}}>
                                Miss SLA {summarySlaPack.total_pack_fail_sla}
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={[{marginHorizontal:10,marginVertical:3, backgroundColor:colors.cardLight, paddingHorizontal:5,paddingVertical:6}]}>

                    <View style ={gStyle.flexRowSpace}>
                        <Text style={{...gStyle.textBoxme14,color:colors.white}}>{props.t('screen.module.taks.home1')} {summarySlaPack.total_staff}{" "}{props.t('screen.module.taks.text_report')}</Text>
                        <Text style={{...gStyle.textBoxme14,color:colors.white}}>{summarySlaPack.avg_pack} {props.t('screen.module.taks.unit')}</Text>
                    </View>
                </View>
                <View style={[gStyle.flexRow,{
                    marginHorizontal:10,
                    marginVertical:5,
                }]}>
                    
                    {listOrderComplexity &&
                        listOrderComplexity.map((item, index) => (
                        <View
                            key = {item.complexity_code}
                            style={{
                                height:8,
                                marginHorizontal:0.5,
                                borderRadius:6,
                                backgroundColor:`${item.bg_color}`,
                                width:`${item.percent}%`
                            }}
                        />
                        ))
                    }
                </View>
                <View style={[{
                    marginHorizontal:10,
                    flex: 1,
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                }]}>

                    {listOrderComplexity &&
                        listOrderComplexity.map((item, index) => (
                            <View key = {index} style={[gStyle.flexRowCenterAlign,{
                                marginHorizontal:6,marginVertical:3}]}>
                                <View
                                    
                                    style={{
                                        height:6,
                                        width:6,
                                        borderRadius:4,
                                        backgroundColor:`${item.bg_color}`
                                    }}
                                />
                                <View style={gStyle.flexRowCenterAlign}>
                                    <Text  style={{...gStyle.textBoxme12,color:colors.greyInactive,paddingLeft:3}}>
                                        {props.t("screen.module.handover.unit_order")} {item.complexity_code}
                                    </Text>
                                    <View style={{
                                            backgroundColor:colors.borderLight,
                                            paddingHorizontal:4,
                                            paddingVertical:2,
                                            marginLeft:3,
                                            borderRadius:20, 
                                        }}>
                                        <Text  style={{...gStyle.textBoxme12,color:colors.greyInactive}}>
                                            {item.percent}{" "}%
                                        </Text>
                                    </View>
                                </View> 
                            </View>
                        ))
                    }
                </View>
            </View>}
        </View>
    )
}
export default memo(ReportAdmin);
