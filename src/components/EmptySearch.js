import React from 'react';
import {
  Text, 
  View
 } from 'react-native';
import { 
  gStyle,
  colors 
} from '../constants';
import LottieView from 'lottie-react-native';
const EmptySearch = props => 
  <View style={[gStyle.flexCenter,{marginTop:"12%"}]}>
    <LottieView style={{
              width: 160,
              height: 130,
            }} source={require('../assets/icons/empty-search.json')} autoPlay loop={false} />
    <Text style={{
      ...gStyle.textBoxme14,
        color: colors.white
    }}>{props.t("base.empty")}</Text>
</View>

export default React.memo(EmptySearch);