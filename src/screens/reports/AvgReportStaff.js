import * as React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SectionList,
  Modal,
  TouchableOpacity
} from 'react-native';
import {
    AntDesign,
    FontAwesome5,
  } from '@expo/vector-icons';
import {
  colors,
  gStyle ,
} from '../../constants';
import getInboundStaff from '../../services/staff/inbound';
import getOutboundStaff from '../../services/staff/outbound';
import getRMAStaff from '../../services/staff/rma';
import {_getTimeDefaultFrom,
    _getTimeDefaultTo,
    _getDatetimeToTimestamp,
    _getTimeDefaultFromOneDay,
    _convertDatetimeToTimestamp} from '../../helpers/device-height';
import {translate} from "../../i18n/locales/IMLocalized";

const AvgReportStaff = props => {
    const [dataKPI, setdataKPI] = React.useState([]);
    const [totalReceived, settotalReceived] = React.useState(0);
    const [totalPutaway, settotalPutaway] = React.useState(0);
    const [totalPacked, settotalPacked] = React.useState(0);
    const [totalPicked, settotalPicked] = React.useState(0);
    const [totalHandover, settotalHandover] = React.useState(0);
    const [totalPackedB2b, settotalPackedB2b] = React.useState(0);
    const [totalPackedOsm, settotalPackedOsm] = React.useState(0);
    const [totalPickB2b, settotalPickB2b] = React.useState(0);
    const [totalPickOsm, settotalPickOsm] = React.useState(0);

    const [totalInboundBarcode, settotalInboundBarcode] = React.useState(0);
    const [totalInboundSticker, settotalInboundSticker] = React.useState(0);
    const [totalInboundStickerALL, settotalInboundStickerALL] = React.useState(0);
    const [totalInbound, settotalInbound] = React.useState(0);

    React.useEffect( () => {
        async function fetchDataByStaff() {
          await fetchOutbound(props.staff_id);
          await fetchInbound(props.staff_id);
          await fetchRMA(props.staff_id);
          setdataKPI([
            {
              title:translate('screen.module.staff_report.inbound_text'),
              data: [
                {
                  key : translate('screen.module.staff_report.barcode'),
                  value : totalInboundBarcode,
                  icon : 'barcode',
                  color: colors.boxmeBrand
                },
                {
                  key : translate('screen.module.staff_report.sticker'),
                  value : totalInboundSticker,
                  icon : 'sticky-note',
                  color: colors.brandPrimary
                },
                {
                  key : translate('screen.module.staff_report.sticker_barcode'),
                  value : totalInboundStickerALL,
                  icon : 'random',
                  color: colors.purple

                },
                {
                  key : translate('screen.module.staff_report.no_barcode'),
                  value : totalInbound,
                  icon : 'pallet',
                  color: colors.blue
                }
              ]
            },
            {
              title: translate('screen.module.staff_report.pickup'),
              data: [
                {
                  key : translate('screen.module.staff_report.b2b'),
                  value : totalPickB2b,
                  icon : 'archive',
                  color: colors.primary
                },
                {
                  key : translate('screen.module.staff_report.b2c'),
                  value : totalPicked,
                  icon : 'gifts',
                  color: colors.brandPrimary
                },
                {
                  key : translate('screen.module.staff_report.osm'),
                  value : totalPickOsm,
                  icon : 'bullhorn',
                  color: colors.purple
                },
              ]
            },
            {
              title: translate('screen.module.staff_report.text_packed'),
              data: [
                {
                  key : translate('screen.module.staff_report.b2b'),
                  value : totalPackedB2b,
                  icon : 'archive',
                  color: colors.primary
                },
                {
                  key : translate('screen.module.staff_report.b2c'),
                  value : totalPacked,
                  icon : 'gifts',
                  color: colors.brandPrimary
                },
                {
                  key : translate('screen.module.staff_report.osm'),
                  value : totalPackedOsm,
                  icon : 'bullhorn',
                  color: colors.boxmeBrand
                },
              ]
            },
            {
              title: translate('screen.module.staff_report.kpi_rma'),
              data: [
                {
                  key : translate('screen.module.staff_report.rma_received'),
                  value : totalReceived,
                  icon : 'cart-arrow-down',
                  color: colors.purple
                },
                {
                  key : translate('screen.module.staff_report.putaway'),
                  value : totalPutaway,
                  icon : 'check-double',
                  color: colors.brandPrimary
                },
              ]
            },
            {
              title: translate('screen.module.staff_report.handover'),
              data: [
                {
                  key : translate('screen.module.staff_report.text_handover'),
                  value : totalHandover,
                  icon : 'truck',
                  color: colors.brandPrimary
                },
              ]
            }
          ]);
        };
        fetchDataByStaff();

      }, []);


    const fetchInbound = async (staff_id) =>{
        const response = await getInboundStaff(staff_id,{
          'from_time' : _getTimeDefaultFromOneDay(),
          'to_time' : _getTimeDefaultTo(),
          'is_cache' : false
        });
        if (response.status === 200){
          settotalInboundBarcode(response.data.results.total_barcode)
          settotalInboundBarcode(response.data.results.total_label);
          settotalInboundStickerALL(response.data.results.total_label_and_barcode)
          settotalInbound(response.data.results.total_qualified);
        }else if (response.status === 403){
          permissionDenied(navigation);
        };
    };

    const fetchOutbound = async (staff_id) => {
        const response = await getOutboundStaff(staff_id, {
          'from_time': _getTimeDefaultFromOneDay(),
          'to_time': _getTimeDefaultTo(),
          'is_cache': false,
        });

        if (response.status !== 200) {
          if (response.status === 403) {
            permissionDenied(navigation);
          }
          return;
        }
        const { results } = response.data;
        settotalPacked(results.packed_summary_total);
        settotalPicked(results.picking_summary_total);
        settotalHandover(results.handover_summary_total);
        settotalPackedB2b(results.packed_b2b_summary);
        settotalPackedOsm(results.packed_osm_summary);
        settotalPickB2b(results.picking_b2b_summary);
        settotalPickOsm(results.picking_osm_summary);

      };



    const fetchRMA = async (staff_id) =>{
        const response = await getRMAStaff(staff_id,{
          'from_time' : _getTimeDefaultFromOneDay(),
          'to_time' : _getTimeDefaultTo(),
          'is_cache' : false
        });
        if (response.status === 200){
          settotalReceived(response.data.results.received)
          settotalPutaway(response.data.results.putaway)
        }else if (response.status === 403){
          permissionDenied(navigation);
        };
    };

    return (
      <React.Fragment>
        <Modal
            animationType="fade"
            presentationStyle="formSheet"
            visible={props.visible}
        >
            <View style={[gStyle.container,{backgroundColor:'#f6f7f7'}]}>
                <View style={[gStyle.flexRowSpace,{
                    paddingVertical:15,
                    paddingHorizontal:15,
                }]}>

                    <Text >
                        Báo cáo chi tiết
                    </Text>
                    <TouchableOpacity
                        onPress={() => props.onClose(false)}
                        style={gStyle.flexRowSpace}
                        activeOpacity={gStyle.activeOpacity}
                    >
                        <AntDesign name="closecircle" size={22} color={colors.greyInactive} />
                    </TouchableOpacity>

                </View>
                <View >
                    <SectionList
                        sections={dataKPI}
                        keyExtractor={(item, index) => item + index}
                        renderItem={({ item }) =>
                        <View key ={item.key} style={gStyle.flex1}>
                            <View style={[gStyle.flexRowSpace,{
                                paddingVertical:5,
                                paddingHorizontal:15,
                                backgroundColor:colors.transparent,
                            }]}>
                                <View style={gStyle.flexRowCenterAlign}>
                                    <View style={[gStyle.flexRowCenterAlign,gStyle.flexCenter,{height:30,width:30,borderRadius:8,backgroundColor:item.color}]}>
                                    <FontAwesome5 name={item.icon} size={14} color={colors.white} />
                                    </View>
                                    <Text style={{...gStyle.textBoxme14,color:colors.black,paddingLeft:5}}>{item.key}</Text>
                                </View>
                                    <Text style={{...gStyle.textBoxmeBold16,color:colors.black}}>{item.value.toLocaleString()}</Text>
                            </View>
                        </View>
                    }
                        renderSectionHeader={({ section: { title } }) => (
                        <View style={{paddingVertical:15,paddingLeft:10,borderRadius:3,backgroundColor:'#f6f7f7'}}>
                            <Text style={{...gStyle.textBoxmeBold14,color:colors.black70}}>{title}</Text>
                        </View>
                        )}
                    />
                </View>
            </View>
        </Modal>

      </React.Fragment>
    );
  }

const styles = StyleSheet.create({
});

export default React.memo(AvgReportStaff);
