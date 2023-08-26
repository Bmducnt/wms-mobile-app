import * as React from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import { 
  colors, 
  gStyle ,
} from '../../constants';
import getKPIHandoverReport from '../../services/reports/kpi_handover';


const HandoverReportTeam = props => {
    const t = props.t;
    
    const [data, setdata] = React.useState({});
    const [loading, setloading] = React.useState(false);
    
    React.useEffect(() => {
        fetchReport()
        
      }, [data]);
    

    const fetchReport = async () =>{
        setloading(true);
        const response = await getKPIHandoverReport({
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
                {t('screen.module.staff_report.handover')}
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
                    <Text style={{...gStyle.textBoxmeBold20,color:colors.brandPrimary}}>{data?.sla_commit}%</Text>
                </View>
                <View style={gStyle.flexRowCenter}>
                    <Text style={{...gStyle.textBoxme14,color:colors.greyInactive}}>{t('screen.module.staff_report.minimum_percent')}</Text>
                    <Text style={{...gStyle.textBoxme14,color:colors.boxmeBrand,paddingLeft:4}}>99%</Text>
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
                    <Text style={{...gStyle.textBoxme14,color:colors.white}}>{t('screen.module.staff_report.process_correct')}</Text>
                </View>
                <View style={[gStyle.flexCenter,{paddingVertical:5}]}>
                    <Text style={{...gStyle.textBoxmeBold20,color:colors.brandPrimary}}>{data?.percent}%</Text>
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

export default React.memo(HandoverReportTeam);
