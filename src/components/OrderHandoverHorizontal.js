import * as React from 'react';
import PropTypes from 'prop-types';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import {SvgUri} from 'react-native-svg';
import { withNavigation } from 'react-navigation';
import { colors, gStyle, images } from '../constants';

const OrderHandoverHorizontal = ({ data, heading, navigation, tagline,t,on_view,image_size}) => {
  const onPressView = (item) => {
    if (on_view){
      navigation.navigate('ListOrderHandover', { 
        carrier_name: item.tracking_code__carrier_name,
        carrier_logo : item.carrier_logo,
        totals_orders : item.totals_orders
     })
    }else{
      navigation.navigate('CreatedHandoverList',{
        carrier_name: item.tracking_code__carrier_name,
        carrier_logo : item.carrier_logo,
        handover_type : 2
      })
    }
  };
  return (
    <React.Fragment>
      <View style={styles.container}>
        {heading && <Text style={styles.heading}>{heading}</Text>}
        <FlatList
          data={data}
          horizontal
          keyExtractor={({ id }) => id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={gStyle.activeOpacity}
              hitSlop={{ top: 10, left: 5, bottom: 10, right: 5 }}
              onPress={() => onPressView(item)}
              style={styles.item}
            >
              <View style={styles.notification}>
                <TouchableOpacity
                  style={styles.buttonRound}
                >
                  <Text style={{color: colors.white}}>{item.totals_orders}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.image}>
                {item.is_svg ? (<SvgUri
                  width={image_size}
                  height={image_size}
                  uri={item.carrier_logo}
                />):(
                  <Image source={{uri:item.carrier_logo}} style={styles.image} />
                )}
              </View>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </React.Fragment>
)};

OrderHandoverHorizontal.defaultProps = {
  heading: null,
  tagline: null,
  on_view : true,
  image_size : 60
};

OrderHandoverHorizontal.propTypes = {
  // required
  data: PropTypes.array.isRequired,
  navigation: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  on_view : PropTypes.bool.isRequired,
  image_size : PropTypes.number,
  // optional
  heading: PropTypes.string,
  tagline: PropTypes.string
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    width: '100%'
  },
  heading: {
    ...gStyle.textBoxme16,
    color: colors.greyInactive,
    marginBottom: 8,
    marginTop: 16
  },
  tagline: {
    ...gStyle.textboxme14,
    color: colors.greyInactive,
    paddingBottom: 6,
    marginBottom: 5,
    marginLeft: 24
  },
  item: {
    marginRight: 5,
    width: 70
  },
  image: {
    marginTop:10
  },
  title: {
    ...gStyle.textBoxmeBold12,
    color: colors.white,
    marginTop: 6,
    paddingTop:10,
    textAlign: 'center'
  },
  notification :{
    alignItems: 'center',
    zIndex:101,
    justifyContent: 'center',
    position: 'absolute',
    right: -3
  },
  buttonRound:{
    borderWidth:1,
    borderColor:'#fd0d37',
    alignItems:'center',
    justifyContent:'center',
    width:35,
    height:35,
    backgroundColor:'#fd0d37',
    borderRadius:35/2
  }
});

export default withNavigation(OrderHandoverHorizontal);
