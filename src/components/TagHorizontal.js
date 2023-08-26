import * as React from 'react';
import PropTypes from 'prop-types';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { colors, gStyle } from '../constants';

const TagHorizontal = props  => {

  const [tabActive, settabActive] = React.useState(props.tab_id);

  return(
      <View style={styles.container}>
        <FlatList
          data={props.data}
          horizontal
          keyExtractor={({ id }) => id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              disabled={props.onLoading}
              activeOpacity={gStyle.activeOpacity}
              hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
              onPress={() =>{ settabActive(item.id); props.onPress(item.tab);}}
              style={styles.tabBlock}
            >
              {tabActive ===item.id && <View style={styles.dot}></View> }
              <Text style={[styles.title,{color: tabActive ===item.id ? colors.white:colors.greyInactive }]}>{props.t(`${item.title}`)}</Text>
              <View></View>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
        />
      </View>
  )
};

TagHorizontal.defaultProps = {
  colorActive : colors.boxmeBrand,
  onLoading: false,
};

TagHorizontal.propTypes = {
  data: PropTypes.array.isRequired,
  onPress: PropTypes.func.isRequired,
  onLoading : PropTypes.bool,
  colorActive : PropTypes.string.isRequired

};

const styles = StyleSheet.create({
  container: {
    height: 40,
    marginLeft:20,
    width: '100%'
  },
  tabBlock: {
    flexDirection:'row',
    alignItems:'center',
    justifyContent: 'center',
    marginHorizontal:8,
  },
  title: {
    ...gStyle.textBoxme14,
    color: colors.greyInactive,
  },
  dot :{
    height:8,
    width:8,
    backgroundColor : colors.yellow,
    borderRadius:8/2,
    marginRight:5
  }
});
export default TagHorizontal;
