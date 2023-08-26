import React from "react";
import { Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome,Entypo } from '@expo/vector-icons';
import { 
    colors,
  } from "../../constants";

const TaskScrollList = props => {
    const list_menu = [
        {
            status_id : 400,
            status_name : `${props.t('screen.module.taks.status_400')}`,
            icon : 'back-in-time'
        },
        {
            status_id : 401,
            status_name : `${props.t('screen.module.taks.status_401')}`,
            icon : 'new-message'

        },
        {
            status_id : 402,
            status_name : `${props.t('screen.module.taks.status_402')}`,
            icon : 'hour-glass'

        },
        {
            status_id : 405,
            status_name :`${props.t('screen.module.taks.status_405')}`,
            icon : 'pin'

        },

    ]

    const [statusid, setstatusid] = React.useState(400);

    const onPressMenu = (status_id) =>{
        setstatusid(status_id)
        props.onSelect(status_id)
    }

    return (
        <ScrollView
            horizontal
            style={styles.root}
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
        >
            {list_menu.map((item, index) => (
                <TouchableOpacity key={item.status_id} onPress={() => onPressMenu(item.status_id)} 
                style={{backgroundColor:statusid === item.status_id ? colors.boxmeBrand : colors.cardLight,padding:4,borderRadius:4,marginLeft:2}}>
                    <Text style={{color:colors.white,padding:4}}>
                      <Entypo name={item.icon} size={14} color={colors.white} /> {item.status_name}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
}
 const styles = StyleSheet.create({
   root: { flexGrow: 0 },
   container: {
     flex: 0,
     marginBottom: 10
   },
 });
 
 export default TaskScrollList;
