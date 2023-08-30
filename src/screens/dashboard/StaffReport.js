import * as React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import ListCard from '../../components/ListCard';
import {
  colors,
  gStyle ,
} from '../../constants';
import getReportOverview from '../../services/reports/overview';
import getListStaff from "../../services/tasks/list-staff";
import {translate} from "../../i18n/locales/IMLocalized";

const StaffReport = props => {

    const [data, setdata] = React.useState([]);
    const [listStaff, setListStaff] = React.useState([]);


    React.useEffect(() => {
      fetchListStaff().then(r => {});
      _fetchReportOverview().then(r => {});
    }, []);

    const fetchListStaff = async () => {
      const response = await getListStaff({});
      if (response.status === 200){
        let list_staff_tmp = []
        response.data.results.forEach((element,i) => {
          list_staff_tmp.push({
            key: element.staff_id,
            value: element.email,
            avatar: element.avatar,
            role_id: element.role,
            by_avatar: Array.from(element.fullname)[0],
            is_avatar :!!element.avatar
          })
          });
          setListStaff(list_staff_tmp)
      }
    };

    const _fetchReportOverview = async () => {
        const response = await getReportOverview({});
        if (response.status === 200){
            setdata([{
              'task_id' :1,
              'task_name' :translate('screen.module.home.report_order.putaway_text'),
              'task_text' :translate('screen.module.home.report_order.task_pk'),
              'task_value':response.data.results.inbound_awaiting,
              'task_color' :colors.white,
              'task_status' : translate('screen.module.home.report_order.task_status_1'),
              'action' : 'PutawayLists',
              'parram' : {},
              'sla':false,
              'sla_val':0,
              'role_id': 8,
              'last_fetch' :response.data.results.last_fetch,
              'is_click' :true
            },
            {
              'task_id' :8,
              'task_name' :translate('screen.module.home.report_order.pickup_awaiting_pack'),
              'task_value':response.data.results.pickup_awaiting_packed,
              'task_text' :translate('screen.module.home.report_order.task_pk'),
              'task_color' :colors.white,
              'task_status' :translate('screen.module.home.report_order.task_status_1'),
              'action' : "ModalQickAction",
              'parram' : {},
              'sla':true,
              'sla_val':response.data.results.pickup_awaiting_packed_sla,
              'last_fetch' :response.data.results.last_fetch,
              'is_click' :true,
              'role_id': 5
            },
            {
              'task_id' :7,
              'task_name' :translate('screen.module.home.report_order.pickup_awaiting'),
              'task_value':response.data.results.pickup_awaiting,
              'task_text' :translate('screen.module.home.report_order.task_pk'),
              'task_color' :colors.white,
              'task_status' : translate('screen.module.home.report_order.task_status_2'),
              'action' : null,
              'parram' : {},
              'sla':false,
              'sla_val':0,
              'role_id': 3,
              'last_fetch' :response.data.results.last_fetch,
              'is_click' :false
            },
            {
              'task_id' :2,
              'task_name' :translate('screen.module.home.report_order.order_pick'),
              'task_value':response.data.results.orders_awaiting,
              'last_fetch' :response.data.results.last_fetch,
              'task_text' :translate('screen.module.home.report_order.task_order'),
              'task_color' :colors.white,
              'task_status' : translate('screen.module.home.report_order.task_status_1'),
              'action' : null,
              'parram' : {},
              'sla':true,
              'sla_val':response.data.results.orders_awaiting_sla,
              'is_click' :false,
              'role_id': 2
            }
          ])

        };
    };

    return (
      <React.Fragment>
          {data.length >0 ? (<View style={{flexDirection: 'row',flexWrap: 'wrap',marginHorizontal:7}}>
            {Object.keys(data).map((index) => {
              const item = data[index];
              return (
                <View key={item.task_id} style={styles.containerColumn}>
                  <ListCard
                    bgColor={item.task_color}
                    title={item.task_name}
                    value={item.task_value}
                    sla={item.sla}
                    sla_val={item.sla_val}
                    status={item.task_status}
                    color={item.task_color}
                    navigation={props.navigation}
                    action={item.action}
                    parram={item.parram}
                    is_click ={item.is_click}
                    task_id={item.task_id}
                    last_fetch ={item.last_fetch}
                    list_staff = {listStaff.filter(x => x.role_id === item.role_id)}
                  />
                </View>
              );
            })}
        </View>): (<View style={gStyle.flexRowCenter}><ActivityIndicator/></View>)}

      </React.Fragment>
    );
}

const styles = StyleSheet.create({
    containerColumn: {
        width: '100%'
    },
    sectionHeading: {
        ...gStyle.textBoxme16,
        color: colors.white,
        marginVertical:6,
        marginLeft: 10
    },
});

export default React.memo(StaffReport);
