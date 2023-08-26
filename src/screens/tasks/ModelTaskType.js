import React, { useState, useEffect } from "react";
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import { Feather,AntDesign } from "@expo/vector-icons";
import { 
    colors, 
    gStyle 
} from "../../constants";


const ModelTaskType = (props) => {

  const listData = [
        {
            'id': 1,
            'value': `${props.t('screen.module.taks.add.task_inbound')}`,
        },
        {
            'id': 2,
            'value': `${props.t('screen.module.taks.add.task_cycle')}`,
        },
        {
            'id': 3,
            'value': `${props.t('screen.module.taks.add.task_outbound')}`,
        },
        {
            'id': 4,
            'value': `${props.t('screen.module.taks.add.task_moving')}`,
        },
        {
            'id': 5,
            'value': `${props.t('screen.module.taks.add.task_other')}`,
        },
        {
            'id': 6,
            'value': `${props.t('screen.module.taks.add.task_box')}`,
        }
    ]

    const [takstype,settakstype] = useState(null);

    const onSelect = async (id,val) =>{
        settakstype(id);
        if(id === 6){
            props.onAddBox(true);
        }else {
            props.onAddBox(false)
        }
        props.onSelect(val);
        props.onClose(1);
    };


    const renderTaskType = (obj) => {
        return (
            <TouchableOpacity
                activeOpacity={gStyle.activeOpacity}
                onPress={()=>onSelect(obj.id,obj.value)}
                style={{
                    flexDirection: "row",
                    marginHorizontal:10,
                    marginVertical:6
                }}
            >
                <View style={[gStyle.flexRow,{
                        paddingHorizontal:10,
                        paddingVertical:8,
                        borderRadius:6,
                        backgroundColor:takstype ===obj.id ? colors.brandPrimary:colors.white}]}>
                    <View style={[gStyle.flexCenter]}>
                        <Feather color={takstype ===obj.id ? colors.white:colors.black70} 
                            name={takstype ===obj.id ?  'check-circle':obj.icon} size={14}/>
                    </View>
                    <View style={{paddingVertical:6,marginLeft:5}}>
                        <Text style={[styles.textValue,{color:takstype ===obj.id ? colors.white:colors.black}]}>{obj.value}</Text>
                        
                    </View>
                    
                </View>
                
            </TouchableOpacity>
        )
    };

    return (
        <Modal 
        animationType="slide"
        presentationStyle="formSheet"
        visible={true}
        >
        <TouchableWithoutFeedback style={gStyle.flex1}>
        <View style={[gStyle.container]}>
            <View
                style={{
                height: Dimensions.get("window").height,
                width: Dimensions.get("window").width,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                backgroundColor: "#f0f1f6",
                }}
            >
                <View
                style={[
                    gStyle.flexRowSpace,
                    {
                    paddingVertical: 15,
                    paddingHorizontal: 10,
                    borderBottomColor: "#f0f1f6",
                    borderBottomWidth: 1.5,
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                    backgroundColor: colors.whiteBg,
                    },
                ]}
                >
                    <Text>
                        Chọn loại task
                    </Text>
                    <TouchableOpacity
                    onPress={() => props.onClose(1)}
                    activeOpacity={gStyle.activeOpacity}
                    style={gStyle.flexCenter}
                    >
                        <AntDesign name="closecircle" size={22} color={colors.greyInactive} />
                    </TouchableOpacity>
                </View>
                
                <View style={[gStyle.flexRow, { paddingBottom: 50,marginTop:20 }]}>
                    <FlatList
                        numColumns={Math.ceil(listData.length / 3)}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        data={listData}
                        keyExtractor={(item, index) => item +index.toString()}
                        renderItem={({ item }) => (
                            renderTaskType(item)
                        )}
                    />
                </View>
            </View>
            </View>
        </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
});
export default ModelTaskType;
