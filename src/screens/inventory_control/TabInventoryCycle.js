import * as React from "react";
import {
  Animated,
  StyleSheet,
  View,
  RefreshControl,
} from "react-native";
import { colors, gStyle } from "../../constants";
import AsyncStorage from '@react-native-async-storage/async-storage';

// components
import EmptySearch from "../../components/EmptySearch";
import ListInventoryCount from "../../components/ListInventoryCount";
import {
  _getTimeDefaultFrom,
  _getTimeDefaultTo,
  _getDatetimeToTimestamp,
  _convertDatetimeToTimestamp,
} from "../../helpers/device-height";
import { permissionDenied } from "../../helpers/async-storage";

//service api
import getListCycle from "../../services/rack/list-bin";
import {translate} from "../../i18n/locales/IMLocalized";


class TabInventoryCycle extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            scrollY: new Animated.Value(0),
            isloading: false,
            staff_role:3,
            from_time: _getTimeDefaultFrom(),
            to_time: _getTimeDefaultTo(),
            list_cycle_report : []
        };
        this._fetchListCycleHandler = this._fetchListCycleHandler.bind(this);
    }

    componentDidMount() {
        this.willFocusSubscription = this.props.navigation.addListener(
        'willFocus',
        () => {
            this._fetchListCycleHandler().then(r => {});
        }
        );
    }

    componentWillUnmount() {
        this.willFocusSubscription();
    };

    UNSAFE_componentWillMount = async () => {
      let email_login = await AsyncStorage.getItem('staff_profile');
      this.setState({staff_role:JSON.parse(email_login).role});
      this._fetchListCycleHandler();
    };


    sortColorLabel = (status_id, estimated_kpi) => {
      const statusLabels = {
        901: {
          label_color: estimated_kpi ? '#f99f00' : colors.red,
          label_name: estimated_kpi ? translate('screen.module.cycle_check.status_new') : translate('screen.module.cycle_check.status_cancel'),
        },
        902: {
          label_color: estimated_kpi ? colors.boxmeBrand : colors.red,
          label_name: estimated_kpi ? translate('screen.module.cycle_check.status_todo') : translate('screen.module.cycle_check.status_cancel'),
        },
        903: {
          label_color: colors.boxmeBrand,
          label_name: translate('screen.module.cycle_check.status_verify'),
        },
        904: {
          label_color: colors.brandPrimary,
          label_name: translate('screen.module.cycle_check.status_done'),
        },
        905: {
          label_color: colors.cardLight,
          label_name: translate('screen.module.cycle_check.status_cancel'),
        },
      };
      return statusLabels[status_id];
    };


    _fetchListCycleHandler = async () => {
      this.setState({ isloading: true,list_cycle_report:[]});
      const response = await getListCycle({
        status_id: this.props.status_id,
        is_report : 1,
        page : 1
      });
      if (response.status === 200) {

        const list_cycle_report_temp = response.data.results.map((result) => {
          return {
              'quantity_stock': result.quantity_stock,
              'quantity_check': result.quantity_check,
              'bin_request': result.tracking_code,
              'cycle_code': result.cycle_code,
              'cycle_type': result.cycle_type,
              'total_fnsku': result.total_fnsku,
              'total_fnsku_check': 0,
              'estimated_time_now': result.estimated_time.estimated_time_now,
              'estimated_kpi': result.estimated_time.estimated_kpi,
              'created_by': result.created_by.fullname,
              'assigner_by': result.assigner_by.fullname,
              'status_id': result.status_id.status_id,
              'status_name': this.sortColorLabel(result.status_id.status_id, result.estimated_time.estimated_kpi).label_name,
              'status_color': this.sortColorLabel(result.status_id.status_id, result.estimated_time.estimated_kpi).label_color,
              'created_date': result.created_date,
            };
          });

          this.setState({ list_cycle_report: list_cycle_report_temp });

      } else if (response.status === 403) {
        permissionDenied(this.props.navigation);
      }
      this.setState({ isloading: false });
    };

    render() {
      const {
        isloading,
        scrollY,
        list_cycle_report,
        staff_role
      } = this.state;
      const {navigation} = this.props;
      return (
        <React.Fragment>
          <View style={[gStyle.container]}>
            <Animated.ScrollView
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                { useNativeDriver: false }
              )}
              refreshControl={
                <RefreshControl
                  refreshing={isloading}
                  onRefresh={this._onRefresh}
                />
              }
              scrollEventThrottle={16}
              showsVerticalScrollIndicator={false}
              stickyHeaderIndices={[1]}
              style={[gStyle.container]}
            >
              <View>
                  {list_cycle_report &&
                    list_cycle_report.map((item, index) => (
                      <ListInventoryCount
                          key={index.toString()}
                          data ={
                            item
                          }
                          staff_role ={staff_role}
                          navigation={navigation}
                        />
                    ))
                  }
                  {list_cycle_report.length === 0 && (
                    <EmptySearch/>
                  )}
              </View>
            </Animated.ScrollView>
          </View>
        </React.Fragment>
      );
    }
}
const styles = StyleSheet.create({
});

export default TabInventoryCycle;
