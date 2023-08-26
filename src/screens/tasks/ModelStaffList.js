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
  Image
} from "react-native";
import { Feather,AntDesign } from "@expo/vector-icons";
import { 
    colors, 
    device, 
    gStyle,
    images
} from "../../constants";
import TextInputComponent from "../../components/TextInputComponent";


const ModelStaffList = (props) => {
    const [listData,setlistData] = useState(props.data);
    const [listStaff,setlistStaff] = useState(props.data);

    const onSelect = async (val) =>{
        props.onSelect(val);
        props.onClose(2);
    };

    const findEmail = async (val) => {
        if(val){
            setlistStaff(listData.filter((film) => film.value.includes(val.toLowerCase())));
        }
    }


    const renderTaskStaff = (obj) => {
        return (
            <View >
                <TouchableOpacity
                    activeOpacity={gStyle.activeOpacity}
                    onPress={() => onSelect(obj.value)}
                    style={[styles.container,{
                            backgroundColor:colors.whiteBg,
                            paddingVertical:8,
                            borderRadius:3,
                    }]}
                >
                    <View style={gStyle.flex5}>
                        <View style={gStyle.flexRow}>
                            {!obj.avatar ? <Image source={images['user']} style={styles.imageAvatar} /> : 
                            <Image source={{uri:obj.avatar}} style={styles.imageAvatar} />}
                            <View >
                            <Text style={[styles.textCode, { ...gStyle.textBoxmeBold14 }]} 
                                numberOfLines={1} ellipsizeMode="tail">
                                {obj.fullname}
                            </Text>
                            <View style={[styles.containerStatus]}>
                                <Text style={[styles.textRight, { ...gStyle.textBoxme14,color:colors.black }]} numberOfLines={1}>
                                    {obj.value}
                                </Text>
                                
                            </View>
                            {obj.role_id ===2 && <Text style={[styles.textRight, 
                                { paddingLeft:10,...gStyle.textBoxme14,color:colors.greyInactive }]} numberOfLines={1}>
                                Manager warehouse
                            </Text>}
                            {obj.role_id ===3 && <Text style={[styles.textRight, 
                                { paddingLeft:10,...gStyle.textBoxme14,color:colors.greyInactive }]} numberOfLines={1}>
                                Senior 
                            </Text>}
                            {obj.role_id ===4 && <Text style={[styles.textRight, 
                                { paddingLeft:10,...gStyle.textBoxme14,color:colors.greyInactive }]} numberOfLines={1}>
                                Inbound
                            </Text>}
                            {obj.role_id ===5 && <Text style={[styles.textRight, 
                                { paddingLeft:10,...gStyle.textBoxme14,color:colors.greyInactive }]} numberOfLines={1}>
                                Outbound
                            </Text>}
                            {obj.role_id ===6 && <Text style={[styles.textRight, 
                                { paddingLeft:10,...gStyle.textBoxme14,color:colors.greyInactive }]} numberOfLines={1}>
                                Staff rma
                            </Text>}
                            {obj.role_id ===8 && <Text style={[styles.textRight, 
                                { paddingLeft:10,...gStyle.textBoxme14,color:colors.greyInactive }]} numberOfLines={1}>
                                Controller
                            </Text>}
                            {obj.role_id ===9 && <Text style={[styles.textRight, 
                                { paddingLeft:10,...gStyle.textBoxme14,color:colors.greyInactive }]} numberOfLines={1}>
                                    Handover
                            </Text>}
                            </View>
                        </View>
                    </View>
                    <View style={styles.containerRight}>
                        <Feather color={colors.greyInactive} name="circle" size={14} />
                    </View>
                </TouchableOpacity>
            </View>
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
                    {props.t('screen.module.taks.add.model_add_staff')}
                    </Text>
                    <TouchableOpacity
                    onPress={() => props.onClose(2)}
                    activeOpacity={gStyle.activeOpacity}
                    style={gStyle.flexCenter}
                    >
                        <AntDesign name="closecircle" size={22} color={colors.greyInactive} />
                    
                    </TouchableOpacity>
                </View>
                <View style={{marginTop : 5}}>
                    <TextInputComponent
                        navigation={props.navigation}
                        textLabel = {props.t('screen.module.taks.add.model_add_staff')}
                        autoChange = {true}
                        ediTable={true}
                        autoFocus={true}
                        showSearch = {false}
                        showScan = {false}
                        onPressCamera = {findEmail}
                        onSubmitEditingInput = {findEmail}
                        textPlaceholder={''}>
                    </TextInputComponent>
                </View>
                <View style={[gStyle.flexRow, { paddingBottom: 100,marginTop:10,marginHorizontal:15}]}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        data={listStaff}
                        keyExtractor={(item, index) => item +index.toString()}
                        renderItem={({ item }) => (
                            renderTaskStaff(item)
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
    container: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 10,
      marginVertical: 0.5,
      width: '100%'
    },
    containerStatus: {
      marginLeft: 10,
      flexDirection: 'row'
    },
    percentBar: {
      height: 1,
      width: `100%`,
      marginLeft: device.iPhoneNotch ? '20%' : '22%',
      backgroundColor: colors.borderLight
    },
    textCode: {
      ...gStyle.textBoxme14,
      color: colors.black70,
      marginTop: 2,
      marginLeft: 10,
    },
    containerRight: {
      alignItems: 'flex-end',
      flex: 1
    },
    imageAvatar: {
      width: 45,
      height: 50,
      borderRadius:45
    },
    blockRight: {
      alignItems: 'flex-end',
      position: 'absolute',
      top: 60,
      right: 15,
    },
    textRight: {
      ...gStyle.textBoxme14,
      color: colors.black70
    }
  });
export default ModelStaffList;
