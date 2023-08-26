import * as React from 'react';
import {
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import moment from 'moment';
import { 
  colors, 
  gStyle
} from '../constants';

const ListTopStaff = props => {
  const [data, setdata] = React.useState(props.data);
  return (
    <React.Fragment>
      <View style={[gStyle.container,{marginLeft:5}]}>
        <FlatList
          data={data.slice(0,8)}
          horizontal
          keyExtractor={({ task_id }) => task_id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={[styles.containerRef]}
              disabled={item.is_click}
              activeOpacity={gStyle.activeOpacity}
              hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
              onPress={() => props.navigation.navigate(item.action,item.parram)}
            >
                <View style={[gStyle.flexRowSpace,{marginHorizontal:10}]}>
                    
                    <Text style={{
                        ...gStyle.textBoxmeBold12,
                        color:item.task_color
                    }}>{item.task_status}</Text>
                </View>
                <View style={{paddingHorizontal:10}}>
                    
                    <Text style={{
                            ...gStyle.textBoxme14,
                            color:colors.greyLight,
                        }}>{item.task_name}</Text>
                    <Text style={{
                        paddingTop : 3,
                        ...gStyle.textBoxmeBold18,
                        color:colors.white
                    }}>{item.task_value}</Text>
                    <Text style={{
                        paddingTop : 3,
                        ...gStyle.textBoxme12,
                        color:colors.greyInactive
                    }}>{item.task_text}</Text>
                    <Text style={{
                        ...gStyle.textBoxme12,
                        color:colors.greyLight
                    }}>{moment(item.last_fetch).fromNow()}</Text>

                </View>
              </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </React.Fragment>
)};

const styles = StyleSheet.create({
    imageAvatar :{
        width: 25, 
        height: 25,
        borderRadius : 10
    },
    containerRef :{
      backgroundColor:colors.cardLight,
      marginHorizontal:4,
      marginVertical:3,
      paddingVertical:8,
      borderRadius:6,
    }
  
});

export default React.memo(ListTopStaff);
