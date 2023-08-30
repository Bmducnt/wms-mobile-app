import * as React from 'react';
import {
  colors,
} from '../../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

import SLAPack from './SLAPack';
import OutboundReport from './OutboundReport';


import getReportOrderKPI from '../../services/reports/order_kpi';

const OrderPending = props => {


    const [slaPack, setslaPack] = React.useState([]);
    const [slaSync, setslaSync] = React.useState([]);
    const [dataReportCarrier, setdataReportCarrier] = React.useState([]);
    const [totalOrder, settotalOrder] = React.useState(0);

    const fetchOrderPeding = async () => {
        const response = await getReportOrderKPI({
            'is_pda' : 2,
            'v2':1
        });
        if (response.status === 200){
            const slaPack = response.data.results.report_sla_pack.map((element, i) => ({
                id: i,
                name: element.name,
                value: element.value,
                sla_value_fail: element.sla_value_fail,
                color: colors.cardLight,
                expenses: [
                {
                    total: element.value,
                    status: 'C',
                },
                ],
            }));
            setslaPack(slaPack);
            const kpiTotal = response.data.results.report_by_carrier.reduce(
                (total, element) => total + (element.total_awaiting_pickup || 0),
                0
            );
            settotalOrder(kpiTotal);
            setdataReportCarrier(response?.data?.results?.report_by_carrier);
            await AsyncStorage.setItem('sla_pack_order',  JSON.stringify(response.data.results.report_sla_pack.map(element => ({
                'sla_date' : element.name,
                'active' : false
            }))))
        }
    };

    React.useEffect(() => {
        fetchOrderPeding().then(r => {});
    }, []);


    return (
        <React.Fragment>
            <OutboundReport
                kpi_reports = {dataReportCarrier}
                slaSync = {slaSync}
                slaPack={slaPack}
                kpi_total = {totalOrder}
            />

            {slaPack.length > 0 && <SLAPack slaPack={slaPack} />}
        </React.Fragment>
        );
    }
export default React.memo(OrderPending);
