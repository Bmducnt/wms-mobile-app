import React from "react";
import {Alert, Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome,Entypo } from '@expo/vector-icons';
import { 
    colors, 
    gStyle,
    device,
    fonts
  } from "../../constants";
import Badge from "../../components/Badge";
import moment from 'moment';
import updateStatusTask from "../../services/tasks/status-task";

const TaksItem = props => {


    const updateStatusTasksClose = async (task_code,status_id) =>{
        const response = await updateStatusTask(task_code,JSON.stringify({
          status_id:status_id
      }));
        if (response.status === 200){
            Alert.alert(
                '',
                props.t("base.success"),
                [
                    {
                    text: props.t("base.confirm"),
                    onPress: () => props.onPress(400),
                    },
                ],
                {cancelable: false},
            );
        }
      };


    return (
        <View style={[{
              marginHorizontal:5,
              padding:5,
              paddingVertical:10,
            }]}>
        {Object.keys(props.list_tasks).map((index) => {
            const item = props.list_tasks[index];
            return (
                <TouchableOpacity key={item.task_code} onPress={() =>props.navigation.navigate("DetailTask",{task_code : item.task_code})} style={[{
                    backgroundColor:colors.cardLight,
                    paddingVertical:6,
                    marginVertical:3,
                    borderRadius:3
                }]}>
                <View style={{paddingHorizontal:5}}>
                    <Text style={{...gStyle.textBoxme16,color:colors.greyInactive}}>
                        {props.t('screen.module.taks.add.task_name')}
                    </Text>
                    <Text style={{...gStyle.textBoxme16,color:colors.white,paddingVertical:4}}>
                        {item.task_name}
                    </Text>
                    <Text style={{...gStyle.textBoxme16,color:colors.greyInactive}}>
                        {props.t('screen.module.taks.add.task_note')}
                    </Text>
                    <Text style={{...gStyle.textBoxme14,color:colors.white,paddingVertical:3}}>
                        {item.task_detail.task_notes}
                    </Text>
                    <View style={{height:1,backgroundColor:colors.borderLight,marginHorizontal:10,marginVertical:6}} />
                    <View style={gStyle.flexRowSpace}>
                        <Text style={{...gStyle.textBoxme14,color:colors.greyInactive}}>
                            {props.t('screen.module.taks.detail.created_by')}
                        </Text>
                        <Text style={{...gStyle.textBoxme14,color:colors.white,paddingTop:3}}>
                            {item.created_by.staff_name}
                        </Text>
                    </View>
                    <View style={gStyle.flexRowSpace}>
                        <Text style={{...gStyle.textBoxme14,color:colors.greyInactive}}>
                            {props.t('screen.module.taks.detail.assigner_by')}
                        </Text>
                        <Text style={{...gStyle.textBoxme14,color:colors.white,paddingTop:3}}>
                            {item.assigner_by.staff_name}
                        </Text>
                    </View>
                    <View style={gStyle.flexRowSpace}>
                        <Text style={{...gStyle.textBoxme14,color:colors.greyInactive}}>
                            {props.t('screen.module.taks.detail.created_at')}
                        </Text>
                        <Text style={{...gStyle.textBoxme14,color:colors.white,paddingTop:3}}>
                        {moment(item.created_date).fromNow()} 
                        </Text>
                    </View>
                    <View style={{height:1,backgroundColor:colors.borderLight,marginHorizontal:5,marginVertical:5}} />
                </View>
                
                <View style={[gStyle.flexRowSpace,{marginHorizontal:5}]}>
                    <View style={[gStyle.flexRow,{marginTop:4}]}>
                    <Text style={{...gStyle.textBoxme14,color:colors.white}}>
                    {item.task_detail.total_video} <Entypo name="video-camera" size={18} color={colors.white} />
                    </Text>
                    <TouchableOpacity onPress={() => item.task_detail.total_images > 0 ? 
                        props.navigation.navigate("ImagesViewList",{task_code : item.task_code}) : null}>
                        <Text style={{...gStyle.textBoxme14,color:colors.white,paddingLeft:6}}>
                        {item.task_detail.total_images} <Entypo name="images" size={18} color={colors.white} />
                        </Text>
                    </TouchableOpacity>
                    <Text style={{...gStyle.textBoxme14,color:colors.white,paddingLeft:6}}>
                    {item.task_detail.total_comment} <Entypo name="chat" size={18} color={colors.white} />
                    </Text>
                    </View>
                    {props.status_id === 400 && <TouchableOpacity
                        onPress={() =>updateStatusTasksClose(item.task_code,401)}
                        style={[gStyle.flexRow,{
                            marginTop:3,
                            paddingHorizontal:6,
                            paddingVertical:10,
                            borderRadius:3,
                            backgroundColor:colors.boxmeBrand
                        }]}
                        >
                        <Text style={{ color: colors.white,...gStyle.textBoxme14,paddingLeft:4 }}>
                            {props.t('screen.module.taks.detail.btn_received')}
                        </Text>
                        </TouchableOpacity>}
                    {props.status_id === 401 && <TouchableOpacity
                        onPress={() =>updateStatusTasksClose(item.task_code,402)}
                        style={[gStyle.flexRow,{
                            marginTop:3,
                            paddingHorizontal:6,
                            paddingVertical:10,
                            borderRadius:3,
                            backgroundColor:colors.boxmeBrand
                        }]}
                        >
                        <Text style={{ color: colors.white,...gStyle.textBoxme14,paddingLeft:4 }}>
                            {props.t('screen.module.taks.detail.btn_start')}
                        </Text>
                        </TouchableOpacity>}
                    {(props.status_id === 402 || props.status_id === 405) && <TouchableOpacity
                        onPress={() =>props.navigation.navigate("DetailTask",{task_code : item.task_code})}
                        style={[gStyle.flexRow,{
                            marginTop:3,
                            paddingHorizontal:6,
                            paddingVertical:10,
                            borderRadius:3,
                            backgroundColor:colors.darkgreen
                        }]}
                        >
                        <Text style={{ color: colors.white,...gStyle.textBoxme14,paddingLeft:4 }}>
                            {props.t('screen.module.taks.detail.btn_doing')}
                        </Text>
                        </TouchableOpacity>
                    }
                </View>
                </TouchableOpacity>
            );
            })}
    </View>
    );
}
 const styles = StyleSheet.create({
 });
 
 export default TaksItem;