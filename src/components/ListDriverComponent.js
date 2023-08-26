import * as React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, TouchableOpacity, View,Image} from 'react-native';
import { colors, gStyle } from '../constants';

const ListDriverComponent = props => {
    return (
        <TouchableOpacity
          activeOpacity={gStyle.activeOpacity}
          onPress={()=>props.onSelect(props.driver_name,props.driver_phone,props.driver_vehicle)}
          style={[gStyle.flexRowCenter,styles.container]}
        >
             <View style={gStyle.flexRow}>
                <Image source={require('../assets/images/user.png')} style={styles.imageAvarta} />
                <View style={{width:'100%'}}>
                  <Text style={[styles.textCode]} numberOfLines={1} ellipsizeMode="tail">
                    {props.driver_name}
                  </Text>
                  <View style={styles.containerStatus}>
                    <Text style={styles.textRight}>{`${props.driver_phone} - ${props.driver_vehicle}`}</Text>
                  </View>
                  <View style={[styles.percentBar]}></View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginVertical: 3,
    width: '98%'
  },
  percentBar:{
    height:1,
    marginLeft:'5%',
    width:`100%`,
    marginTop:5,
    backgroundColor:colors.borderLight
  },
  containerStatus : {
    marginLeft:10,
    flexDirection:'row'
  },
  textCode :{
    ...gStyle.textBoxmeBold14,
    color: colors.white,
    marginTop:2,
    marginLeft: 10,
  },
  imageAvarta :{
    width: 40, 
    height: 40,
    borderRadius : 10
  },
  textRight:{
    ...gStyle.textBoxme14,
    color:colors.greyInactive
  }
});

export default ListDriverComponent;
