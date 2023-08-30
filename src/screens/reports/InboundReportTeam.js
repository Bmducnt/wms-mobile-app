import * as React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  colors,
  gStyle ,
} from '../../constants';
import getKPIIboundReport from '../../services/reports/kpi_inbound';
import {_getTimeDefaultFrom,
    _getTimeDefaultTo,
    _getDatetimeToTimestamp,
    _getTimeDefaultFromOneDay,
    _convertDatetimeToTimestamp} from '../../helpers/device-height';
import {translate} from "../../i18n/locales/IMLocalized";

const InboundReportTeam = props => {
    const [data, setdata] = React.useState({});

    React.useEffect( () => {
        fetchReport()

      }, [data]);


    const fetchReport = async () =>{
        const response = await getKPIIboundReport({
        });

        if (response.status === 200){
            setdata(response.data.results)
        }
    };

    return (
        <React.Fragment>
            <View style ={[gStyle.flexRow,{marginTop:10}]}>
                <View style={{
                    backgroundColor:colors.borderLight,
                    borderRadius:8,
                    paddingHorizontal:10,
                    paddingVertical:6,
                    minHeight:80,
                    width:"48%"
                }}>
                    <View style={gStyle.flexCenter}>
                        <Text style={{...gStyle.textBoxme14,color:colors.white}}>{translate('screen.module.staff_report.inbound_text')}</Text>
                    </View>
                    <View style={[gStyle.flexCenter,{paddingVertical:5}]}>
                        <Text style={{...gStyle.textBoxmeBold20,color:colors.brandPrimary}}>{data?.po}%</Text>
                    </View>
                    <View style={gStyle.flexRowCenter}>
                        <Text style={{...gStyle.textBoxme14,color:colors.greyInactive}}>{translate('screen.module.staff_report.minimum_percent')}</Text>
                        <Text style={{...gStyle.textBoxme14,color:colors.boxmeBrand,paddingLeft:4}}>95%</Text>
                    </View>
                </View>
                <View style={{width:"2%"}} />
                <View style={{
                    backgroundColor:colors.borderLight,
                    borderRadius:8,
                    padding:4,
                    minHeight:80,
                    width:"50%"
                }}>
                <View style={gStyle.flexCenter}>
                        <Text style={{...gStyle.textBoxme14,color:colors.white}}>{translate('screen.module.staff_report.inbound_text')} (now)</Text>
                    </View>
                    <View style={[gStyle.flexCenter,{paddingVertical:5}]}>
                        <Text style={{...gStyle.textBoxmeBold20,color:colors.brandPrimary}}>{data?.po_now}%</Text>
                    </View>
                    <View style={gStyle.flexRowCenter}>
                    <Text style={{...gStyle.textBoxme14,color:colors.greyInactive}}>{translate('screen.module.staff_report.minimum_percent')}</Text>
                    <Text style={{...gStyle.textBoxme14,color:colors.boxmeBrand,paddingLeft:4}}>95%</Text>
                    </View>
                </View>
            </View>
        </React.Fragment>
    );
  }

const styles = StyleSheet.create({
});

export default React.memo(InboundReportTeam);
