import * as React from 'react';
import {
  Text,
  View,
  TouchableOpacity
} from 'react-native';
import { 
  colors,
  gStyle ,
} from '../../constants';

import { 
    Entypo
  } from '@expo/vector-icons';

import getReportTask from "../../services/tasks/report-task";

import ModelTasksRc from '../../components/ModelTasksRc';


const TaskReceived = props => {


    const [totalTask, settotalTask] = React.useState(0);

    fetchTask = async () => {
        const response = await getReportTask();
        if (response.status === 200) {
            settotalTask(response?.data?.results)
        }
    };

    React.useEffect(() => {
        fetchTask();     
    }, []);


    return (
        <React.Fragment>
            <TouchableOpacity 
                style={[gStyle.flexRowSpace,{
                    paddingVertical:13,
                    marginTop:1,
                    paddingHorizontal:10,
                    marginHorizontal:10,
                    borderRadius:3,
                    backgroundColor:colors.cardLight,
                    minHeight : 70
                }]}
                onPress={() => props.navigation.navigate("ListTasks",{})}
            >
            
            <View>
              <Text style={{color:colors.white,...gStyle.textBoxme16}} numberOfLines={2}>
                {props.t('screen.module.taks.home1')}{" "}
                {totalTask}{" "}{props.t('screen.module.taks.home2')} </Text>
                <Text style={{color:colors.white,...gStyle.textBoxme12}} numberOfLines={2}>
                {props.t('screen.module.home.handover_text_urgent')}
                </Text>
            </View>
            
            <TouchableOpacity 
              onPress={() => props.navigation.navigate("ListTasks",{})}
              style={[gStyle.flexRowCenter,{height:30,width:30,borderRadius:30/2,backgroundColor:colors.transparent}]}
            >
                <Entypo name="chevron-thin-right" size={16} color={colors.white} />
            </TouchableOpacity>

          </TouchableOpacity>
          {totalTask > 0 && <ModelTasksRc modalVisible={true} navigation={props.navigation} t={props.t} total = {totalTask} />}
        </React.Fragment>
        );
    }
export default React.memo(TaskReceived);
