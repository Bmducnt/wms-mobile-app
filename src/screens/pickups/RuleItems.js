import * as React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

import { 
    SimpleLineIcons,
    AntDesign,
} from '@expo/vector-icons'; 
import { 
  colors, 
  gStyle ,
} from '../../constants';
import TouchIcon from "../../components/TouchIcon";




const RuleItems = props => {


    React.useEffect(() => {
    }, []);


    return (
        <React.Fragment>
            <TouchableOpacity
                key={props.ruleType}
                onPress={() => props.onPressConfig(true)}
                style={[gStyle.flexRowSpace,{paddingHorizontal : 10,backgroundColor : colors.borderLight,paddingVertical :13,marginTop:5,borderRadius : 6}]}
            >
                <View style={gStyle.flexRowCenterAlign}>
                    <SimpleLineIcons name={props.icon} size={18} color={props.iconColor} />
                    <View style={{paddingLeft : 8}}>
                        <Text style={{...gStyle.textBoxme16,color:colors.white}}>{props.textRule}</Text>
                        <Text style={{...gStyle.textBoxme12,color:colors.greyInactive}}>{props.textRuleActive}</Text>
                    </View>
                </View>
                <View style={gStyle.flexRowCenterAlign}>
                    
                    <TouchIcon
                        icon={<AntDesign name="pushpino"  color={colors.white} />}
                        onPress={() => null}
                        iconSize={16}
                        style={{
                            backgroundColor:colors.brandPrimary,
                            padding: 8,
                            borderRadius:50
                        }}
                    />
                    <TouchIcon
                        icon={<AntDesign name="edit"  color={colors.greyInactive} />}
                        onPress={() => null}
                        iconSize={18}
                        style={{paddingLeft:5}}
                    />
                </View>
            </TouchableOpacity>
            
        </React.Fragment>
      );
}

export default React.memo(RuleItems);
