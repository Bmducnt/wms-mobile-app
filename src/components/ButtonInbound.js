import React from 'react';
import { 
    StyleSheet, 
    Text, 
    TouchableOpacity, 
    View 
} from 'react-native';

import { 
    AntDesign, 
    Feather 
  } from "@expo/vector-icons";

import { 
    gStyle,
    colors 
} from '../constants';


const ButtonInbound = props => 
    <View
        style={styles.container}
        >
        <TouchableOpacity
            onPress={() => props.onPress()}
            style={[
                gStyle.flexRowSpace,
                {
                paddingVertical: 13,
                paddingHorizontal: 10,
                width: "100%",
                },
            ]}
        >
            <View style={gStyle.flexRowCenterAlign}>
                <Feather color={colors.white} name={props.icon} size={22} />
                <View style={{ marginLeft: 6 }}>
                    <Text
                        style={{
                        color: colors.white,
                        ...gStyle.textBoxme14,
                        }}
                        numberOfLines={1}
                    >
                        {props.main_text}
                    </Text>
                    <Text
                        style={{
                        color: colors.greyInactive,
                        ...gStyle.textBoxme12,
                        }}
                    >
                        {props.sub_text}
                    </Text>
                </View>
            </View>
            <AntDesign name="arrowright" size={16} color={colors.white} />
        </TouchableOpacity>
    </View>

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.cardLight,
    marginHorizontal: 6,
    marginVertical: 5,
    borderRadius: 3,
  }
});

export default React.memo(ButtonInbound);