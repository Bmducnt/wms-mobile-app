import * as React from 'react';
import PropTypes from 'prop-types';
import { 
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { colors, gStyle } from '../constants';
import Avatar from './Avatar';

import { LinearGradient } from 'expo-linear-gradient';

const ListCard = ({
  action,
  parram, 
  title,
  value,
  status,
  color,
  navigation,
  task_id,
  is_click,
  sla,
  sla_val,
  last_fetch,
  list_staff
}) => (
  <View style={styles.listCard}>
    <TouchableOpacity
        key ={task_id}
        disabled={!is_click}
        activeOpacity={gStyle.activeOpacity}
        onPress={() => navigation.navigate(action,parram)}
        style={gStyle.flexRowSpace}
      >
        <View >
          <Text style={{...gStyle.textBoxme16,color:color,width:'90%'}} numberOfLines={2}>{title}</Text>
          <View style={[gStyle.flexRow,{marginTop:5,marginLeft:10}]}>
            {Object.keys(list_staff.slice(0,5)).map((index) => {
              const item = list_staff[index];
              return (
                <Avatar key={item.key} left={index === 0 ? 0 : -10} image={item.is_avatar} value={item.is_avatar ? item.avatar:item.by_avatar} />
              );
            })}
            {list_staff.length > 5 && 
              <Text style={{paddingTop:5,color:colors.greyInactive,paddingLeft:2,...gStyle.textBoxme14}}>+{list_staff.length - 5}</Text>
            }
          </View>
        </View>
        <View style={gStyle.flexRowSpace}>
          <View style={{alignItems: 'flex-end'}}>
            <Text style={styles.cardValue}>{value.toLocaleString()}</Text>
            {sla && <View style={{
                padding:2,
                marginLeft:3,
                borderRadius:0,
                backgroundColor:colors.boxmeBrand
              }}>
                  <Text  style={{...gStyle.textBoxme10,color:colors.white}}>
                      Miss SLA {sla_val}
                  </Text>
              </View>}
          </View>
          <TouchableOpacity
            activeOpacity={gStyle.activeOpacity}
            disabled={!is_click}
            onPress={() => navigation.navigate(action,parram)}
          >
            <Entypo name="chevron-thin-right" size={16} color={is_click ? colors.white : colors.transparent} />
          </TouchableOpacity>
        </View>
    </TouchableOpacity>
  </View>
);


ListCard.propTypes = {
  // required
  bgColor: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  
};

const styles = StyleSheet.create({
  listCard: {
    paddingVertical:6,
    paddingHorizontal:10,
    backgroundColor:colors.cardLight,
    marginVertical:1,
    marginHorizontal:3,
    borderRadius:3
  },
  textHeader: {
    ...gStyle.textBoxme12,
    paddingTop: 8,
    color: colors.white
  },
  cardValue: {
    ...gStyle.textBoxmeBold16,
    color: colors.white,
  }

});

export default React.memo(ListCard);
