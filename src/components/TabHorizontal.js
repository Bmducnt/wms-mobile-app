import * as React from 'react';
import PropTypes from 'prop-types';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions
} from 'react-native';
import { colors, gStyle } from '../constants';

const TabHorizontal = props  => {

  const [tabActive, settabActive] = React.useState(props.tab_id);

  return(
    <View style={[gStyle.container]}>
        <FlatList
          data={props.data}
          horizontal
          keyExtractor={({ id }) => id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={gStyle.activeOpacity}
              hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
              onPress={() =>{ settabActive(item.id); props.onPress(item.tab);}}
              style={[gStyle.flexRowCenter,{paddingHorizontal:10,height:35,width:Dimensions.get("window").width/3}]}
              disabled={props.onLoading}
            >
              
              <Text style={[styles.title,{color : tabActive ===item.id ? colors.white:colors.greyInactive}]} numberOfLines={1}>
                {props.t(`${item.title}`)}</Text>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
        />
      </View>
      
  )
};

TabHorizontal.defaultProps = {
  colorActive : colors.boxmeBrand
};

TabHorizontal.propTypes = {
  data: PropTypes.array.isRequired,
  onPress: PropTypes.func.isRequired,
  colorActive : PropTypes.string.isRequired

};

const styles = StyleSheet.create({
  title: {
    ...gStyle.textBoxme14,
    color: colors.greyInactive
  }
});

export default TabHorizontal;
