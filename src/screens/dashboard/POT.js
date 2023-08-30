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
import CircularProgress from '../../components/CircularProgress';
import getReportPOT from '../../services/reports/pot';
import {translate} from "../../i18n/locales/IMLocalized";

const POTReport = props => {


    const [data, setdata] = React.useState([]);

    const fetchPOT = async () => {
        const response = await getReportPOT({});
        if (response.status === 200) {
            setdata(response.data.results.summary_chart)
        }
    };

    function percentage (a,b) {
        return parseFloat(((a) / (a+b)) * 100).toFixed(1)
    }

    React.useEffect(() => {
        fetchPOT();
    }, []);


    return (
        <React.Fragment>
            <View style={{backgroundColor:colors.cardLight,marginHorizontal:10,marginVertical:5}}>
                <View style={gStyle.flexRowSpace}>
                    <Text style={[styles.sectionHeading]} numberOfLines={1}>{translate('screen.module.home.pot')}</Text>
                </View>
                <View style={[gStyle.flexRow,{backgroundColor:colors.cardDark,borderRadius:3}]}>
                <FlatList
                    data={data}
                    horizontal
                    keyExtractor={(item, index) => 'key'+index}
                    renderItem={({ item }) => (
                        <View style={[gStyle.flexCenter,{marginHorizontal:10}]}>
                            <Text style={{...gStyle.textBoxme12,color:colors.white,paddingBottom:5}}>{item.sla_ok.toLocaleString()}</Text>
                            <CircularProgress radius={18} percent={percentage(item.sla_ok,item.sla_fail)} bgRingWidth={4} ringColor={colors.darkgreen} />
                            <View  style={{width:2,height:8,marginTop:5,backgroundColor:colors.greyInactive}} />
                            <Text style={{...gStyle.textBoxme12,color:colors.white}}>{item.name.slice(-2)}</Text>
                            <Text style={{...gStyle.textBoxme12,color:colors.white,paddingBottom:5}}>{percentage(item.sla_ok,item.sla_fail)}%</Text>
                        </View>
                    )}
                    showsHorizontalScrollIndicator={false}
                    />
                </View>
            </View>
        </React.Fragment>
        );
    }

const styles = StyleSheet.create({
    sectionHeading: {
        ...gStyle.textBoxmeBold14,
        color: colors.white,
        marginVertical:6,
        marginLeft: 10
      },
});
export default React.memo(POTReport);
