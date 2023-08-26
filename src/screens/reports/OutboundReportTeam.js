import * as React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator
} from 'react-native';
import { 
  colors, 
  gStyle ,
} from '../../constants';
import getKPIPackReport from '../../services/reports/kpi_outbound';

import {_getTimeDefaultFrom,
    _getTimeDefaultTo,
    _getDatetimeToTimestamp,
    _getTimeDefaultFromOneDay,
    _convertDatetimeToTimestamp} from '../../helpers/device-height';

const OutboundReportTeam = props => {
    const t = props.t;
    
    const [data, setdata] = React.useState({});
    const [loading, setloading] = React.useState(false);
    
    React.useEffect( () => {
        fetchReport()
        
      }, []);
    

    const fetchReport = async () =>{
        setloading(true);
        const response = await getKPIPackReport({
        });
        if (response.status === 200){
            setdata(response.data.results)
        }
        setloading(false);

    };


    return (
        <React.Fragment>
            <View style ={[{marginTop:10}]}>
                <View >
                    <Text style={{...gStyle.textBoxme16,color:colors.white}}>
                        {t('screen.module.staff_report.packed')}
                    </Text>
                </View>
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
                        <Text style={{...gStyle.textBoxme14,color:colors.white}}>{t('screen.module.staff_report.kpi_pass')}</Text>
                    </View>
                    <View style={[gStyle.flexCenter,{paddingVertical:5}]}>
                        {loading ? <ActivityIndicator />: <Text style={{...gStyle.textBoxmeBold20,color:colors.brandPrimary}}>{data?.b2c}%</Text> }
                    </View>
                    <View style={gStyle.flexRowCenter}>
                        <Text style={{...gStyle.textBoxme14,color:colors.greyInactive}}>{t('screen.module.staff_report.minimum_percent')}</Text>
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
                        <Text style={{...gStyle.textBoxme14,color:colors.white}}>{t('screen.module.staff_report.b2b_unit')}</Text>
                </View>
                    <View style={[gStyle.flexCenter,{paddingVertical:5}]}>
                    {loading ? <ActivityIndicator />: <Text style={{...gStyle.textBoxmeBold20,color:colors.brandPrimary}}>{data?.b2b}%</Text> }
                    </View>
                    <View style={gStyle.flexRowCenter}>
                        <Text style={{...gStyle.textBoxme14,color:colors.greyInactive}}>{t('screen.module.staff_report.minimum_percent')}</Text>
                        <Text style={{...gStyle.textBoxme14,color:colors.boxmeBrand,paddingLeft:4}}>96%</Text>
                    </View>
                </View>
                </View>
            </View>
        </React.Fragment>
    );
  }

const styles = StyleSheet.create({
});

export default React.memo(OutboundReportTeam);
