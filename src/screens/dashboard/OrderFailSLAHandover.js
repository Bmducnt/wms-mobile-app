import * as React from 'react';
import {
  Text,
  View,
  TouchableOpacity
} from 'react-native';
import {
    Entypo
  } from '@expo/vector-icons';
import {
  colors,
  gStyle ,
} from '../../constants';
import ModelOrderKPI from '../../components/ModelOrderKPI';

import getOrderHandover from "../../services/reports/handover";
import {translate} from "../../i18n/locales/IMLocalized";

const OrderFailSLAHandover = props => {

    const [data, setdata] = React.useState([]);
    const [isVisible, setisVisible] = React.useState(false);
    const [report, setreport] = React.useState([]);
    const [totalOrderMissSla, settotalOrderMissSla] = React.useState(0);

    const fetchOrderHandoverHandler = async () => {
        const response = await getOrderHandover({
          type: 1,
          status: 2,
          page:1,
          kpi:1,
          type_order: 1,
          from_time: props.from_time,
          to_time: props.to_time,
        });
        if (response.status === 200) {
            settotalOrderMissSla(response?.data?.total_item);
            setdata(response?.data?.results);
            setreport(response?.data?.report);
        }
    };

    React.useEffect(() => {
        fetchOrderHandoverHandler().then(r => {});
    }, []);


    return (
        <React.Fragment>
            <TouchableOpacity
                onPress={() => setisVisible(true)}
                style={[gStyle.flexRowSpace,{
                paddingVertical:13,
                paddingHorizontal:10,
                marginHorizontal:10,
                borderRadius:3,
                backgroundColor:colors.cardLight,
                marginBottom:1,
                minHeight : 70
            }]}>
                <View>
                <Text style={{color:colors.white,...gStyle.textBoxme16}} numberOfLines={2}>
                    {translate('screen.module.home.handover_text')}</Text>
                    <Text style={{color:colors.white,...gStyle.textBoxme12}} numberOfLines={2}>
                    {translate('screen.module.home.handover_text_urgent')}
                    </Text>
                </View>
                <TouchableOpacity
                style={[gStyle.flexRowCenter]}
                >
                    <Text style={{color:colors.white,...gStyle.textBoxmeBold16}} numberOfLines={2}>{totalOrderMissSla}</Text>
                    <Entypo name="chevron-thin-right" size={16} color={colors.white} />
                </TouchableOpacity>
            </TouchableOpacity>
            <ModelOrderKPI
                data={data}
                navigation = {props.navigation}
                isVisible={isVisible}
                onClose={()=>setisVisible(false)}
                reports={report}
            />
        </React.Fragment>

    );
}

export default React.memo(OrderFailSLAHandover);
