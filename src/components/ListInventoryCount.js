import * as React from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { Feather} from '@expo/vector-icons';
import moment from 'moment';
import { colors, gStyle} from "../constants";
import Badge from './Badge';


const ListInventoryCount = ({
  data,
  navigation,
  trans,
  staff_role
}) => {

  return (
    <View style={[styles.container]}>
      <TouchableOpacity
        activeOpacity={gStyle.activeOpacity}
        style={styles.container}
        onPress={() => navigation.navigate('DetailResquest',{
          'tracking_code' : data.bin_request,
          'status_id' : data.status_id,
          'cycle_code' : data.cycle_code,
          'cycle_type' : data.cycle_type,
          'estimated_kpi':data.estimated_kpi
        })}
      >
        <View style={gStyle.flex5}>
          <View style={gStyle.flexRowSpace}>
            <View style={gStyle.flexCenter}>
                <Text style={styles.textLabel}>{trans('screen.module.cycle_check.detail.detail_code')}</Text>
                
            </View>
            <View style={gStyle.flexCenter}>
              <Text style={styles.textLabel}>{trans('screen.module.cycle_check.list.quantity_fnsku')}</Text>
            </View>
          </View>
          <View style={gStyle.flexRowSpace}>
            <View style={gStyle.flexCenter}>
                <Text selectable={true} style={[styles.textCode]} numberOfLines={1} ellipsizeMode="tail">
                  {data.bin_request}</Text>
            </View>
            <View style={gStyle.flexCenter}>
                <Text style={[styles.textCode]}>
                {data.total_fnsku}</Text>
            </View>
          </View>
          <View style={[gStyle.flexRow,{marginTop:5}]}>
              
              {[1, 2].includes(staff_role) && <Badge
                name={`${data.quantity_stock} ${trans('screen.module.cycle_check.list.quantity_fnsku_stock')}`}
                style={{
                  backgroundColor: colors.borderLight,
                  color: colors.white,
                  borderRadius: 3
                }}
              />}
              <Badge
                name={`${data.quantity_check} ${trans('screen.module.cycle_check.list.quantity_fnsku_check')}`}
                style={{
                  backgroundColor: colors.borderLight,
                  color: colors.white,
                  borderRadius: 3
                }}
              />
          </View>

          <View style={styles.percentBar}/>
          <View style={[gStyle.flexRowSpace]}>
            <Text style={[styles.textLabel]}>{trans('screen.module.putaway.inspection_by')}</Text>
            <Text style={[styles.textValue,{...gStyle.textBoxme14}]} numberOfLines={1}>{data.created_by}</Text>
          </View>
          <View style={[gStyle.flexRowSpace]}>
            <Text style={[styles.textLabel]}>{trans('screen.module.putaway.update_by')}</Text>
            <Text style={[styles.textValue,{...gStyle.textBoxme14}]} numberOfLines={1}>{data.assigner_by}</Text>
          </View>
          <View style={[gStyle.flexRowSpace]}>
              <Text style={styles.textLabel}>{trans('screen.module.pickup.list.time')}</Text>
              <Text style={[styles.textValue,{...gStyle.textBoxme16,color:colors.white}]} numberOfLines={1} >
              {moment(data.created_date).fromNow()}</Text>
          </View>
          <View style={styles.percentBar}/>
          <View style={[gStyle.flexRowSpace]}>
            <View style={gStyle.flexRowCenterAlign}>
              <View
                  style={{
                      width: 6,
                      height: 6,
                      backgroundColor: data.status_color,
                      borderRadius: 4,
                      marginRight:4
                  }}
              />
                <Text style={{ color: data.status_color,...gStyle.textboxme14}}>
                  {data.status_name}
              </Text>
            </View>
            <View
                style={[gStyle.flexRow,{
                  marginTop:3,
                  paddingHorizontal:6,
                  paddingVertical:10,
                  borderRadius:3,
                  backgroundColor:data.estimated_kpi ? colors.darkgreen : colors.grey3
                }]}
              >
                <Text style={{ color: colors.white,...gStyle.textBoxme14,paddingLeft:4}}>
                  {trans('screen.module.putaway.error_text_btn')}
                </Text>
              </View>
          </View>
          {data.estimated_kpi && <View style={[gStyle.flexRowCenterAlign]}>
              <Feather name="clock" size={14} color={colors.white} />
              <View style={{paddingHorizontal:4}}>
                <Text style={{ color: colors.white,...gStyle.textBoxme14}}>
                  {trans('screen.module.pickup.detail.kpi_text_ok')} {data.estimated_time_now} {trans('screen.module.pickup.detail.kpi_text_unit')}.
                </Text>
                
              </View>
          </View> }
        </View>
      </TouchableOpacity>
      
    </View>
  );
};

ListInventoryCount.defaultProps = {
};

ListInventoryCount.propTypes = {
  staff_role: PropTypes.number.isRequired,
  data : PropTypes.shape({
    quantity_stock : PropTypes.number,
    total_fnsku : PropTypes.number,
    quantity_check : PropTypes.number,
    percent : PropTypes.number,
    created_by : PropTypes.string,
    status_id : PropTypes.number,
    bin_request : PropTypes.string,
    cycle_code : PropTypes.string,
    status_name : PropTypes.string,
    status_color : PropTypes.string,
    created_date : PropTypes.string,
    assigner_by : PropTypes.string

  })
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal:5,
    marginVertical:5,
    width: "100%",
    backgroundColor:colors.cardLight
  },
  textCode: {
    ...gStyle.textBoxmeBold14,
    color:colors.white,
  },
  textValue: {
    ...gStyle.textBoxmeBold14,
    color: colors.white,
  },
  textLabel :{
    ...gStyle.textBoxme14,
    color:colors.greyInactive
  },
  percentBar:{
    height:1,
    marginVertical:5,
    width:`100%`,
    backgroundColor:colors.borderLight
  }
});

export default ListInventoryCount;
