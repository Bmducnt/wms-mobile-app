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
import {_getTimeDefaultFrom,
    _getTimeDefaultTo,
    _getDatetimeToTimestamp,
    _getTimeDefaultFromOneDay,
    _convertDatetimeToTimestamp} from '../../helpers/device-height';

const ControllerReportTeam = props => {
    const t = props.t;
    
    return (
        <React.Fragment>
            <View style ={[{marginTop:10}]}>

                <View >
                    <Text style={{...gStyle.textBoxme16,color:colors.white}}>
                    {t('screen.module.staff_report.wh_controller')}
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
                        <Text style={{...gStyle.textBoxmeBold20,color:colors.brandPrimary}}>0%</Text>
                    </View>
                    <View style={gStyle.flexRowCenter}>
                        <Text style={{...gStyle.textBoxme14,color:colors.greyInactive}}>{t('screen.module.staff_report.minimum_percent')}</Text>
                        <Text style={{...gStyle.textBoxme14,color:colors.boxmeBrand,paddingLeft:4}}>100%</Text>
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
                        <Text style={{...gStyle.textBoxme14,color:colors.white}}>{t('screen.module.staff_report.location_move')}</Text>
                    </View>
                    <View style={[gStyle.flexCenter,{paddingVertical:5}]}>
                        <Text style={{...gStyle.textBoxmeBold20,color:colors.brandPrimary}}>0%</Text>
                    </View>
                    <View style={gStyle.flexRowCenter}>
                        <Text style={{...gStyle.textBoxme14,color:colors.greyInactive}}>{t('screen.module.staff_report.minimum_percent')}</Text>
                        <Text style={{...gStyle.textBoxme14,color:colors.boxmeBrand,paddingLeft:4}}>99%</Text>
                    </View>
                </View>
                </View>
                </View>
        </React.Fragment>
    );
  }

const styles = StyleSheet.create({
});

export default React.memo(ControllerReportTeam);
