import React, { useState, useEffect } from "react";
import { 
    Modal, 
    Text, 
    TouchableOpacity, 
    View,StyleSheet,
    TouchableWithoutFeedback,
    Dimensions
} from "react-native";
import { Feather} from '@expo/vector-icons';
import { colors, device, gStyle } from "../../constants";
import TextInputComponent from "../../components/TextInputComponent"

const ModelAddTracking = props => {
  return (
    <Modal
        animationType="slide"
        transparent={true}
        visible={true}
    >
        <TouchableWithoutFeedback
            >
            <View style={{
                flex: 1, 
                alignItems: 'center', 
                justifyContent: 'center',
                position:'absolute',
                bottom:0,
                
            }}>
                <View style={{
                    height: 200,
                    width: Dimensions.get("window").width ,
                    borderTopLeftRadius:20,
                    borderTopRightRadius:20,
                    backgroundColor:'#f0f1f6'
                }}>
                    <View style={[gStyle.flexCenter,{
                        paddingVertical:10,
                        paddingHorizontal:15,
                        borderTopLeftRadius:20,
                        borderTopRightRadius:20,
                        borderBottomColor:'#f0f1f6',
                        borderBottomWidth:1.5,
                        backgroundColor:colors.whiteBg
                    }]}>
                        <TouchableOpacity 
                            onPress={() => props.onClose()}
                            activeOpacity={gStyle.activeOpacity}
                            style={gStyle.flexCenter}
                        >
                            <Feather color={colors.black70} name='chevron-down' size={26}/>
                            <Text>Nhập mã hãng vẫn chuyển</Text>
                        </TouchableOpacity>
                    
                    </View>
                    
                    <View style={[gStyle.flexRow,{paddingBottom:50,paddingTop:20}]}>
                        <TextInputComponent
							textLabel={'Nhập mã barcode trên bao bì'}
							autoFocus={true}
							is_close={true}
							onPressCamera={null}
							onSubmitEditingInput={null}
							textPlaceholder={"Quét mã barcode trên bao bì"}/>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
    textLabel :{
        ...gStyle.textBoxme14,
        color:colors.black50
      },
    textValue :{
        ...gStyle.textBoxmeBold16,
        color:colors.black70
    },
});
export default ModelAddTracking;