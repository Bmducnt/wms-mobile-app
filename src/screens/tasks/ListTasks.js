import * as React from "react";
import PropTypes from "prop-types";
import {
  Text,
  View,
  StyleSheet,
  Animated,
  ActivityIndicator
} from "react-native";
import {
  FontAwesome
} from '@expo/vector-icons';
import Avatar from '../../components/Avatar';
import {
  colors,
  gStyle,
  device
} from "../../constants";

import ScreenHeader from "../../components/ScreenHeader";
import {
  _getTimeDefaultFrom,
  _getTimeDefaultTo,
} from "../../helpers/device-height";
import TouchIcon from "../../components/TouchIcon";
import EmptySearch from "../../components/EmptySearch";
import TaskScrollList from './TaskScrollList';
import TaksItem from './TaksItem';
import {permissionDenied} from '../../helpers/async-storage';
// API
import getListStaff from "../../services/tasks/list-staff";
import getListTask from "../../services/tasks/list-tasks";
import {translate} from "../../i18n/locales/IMLocalized";



class ListTasks extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      scrollY: new Animated.Value(0),
      list_staff : [],
      list_tasks : [],
      total_task_pending : 0,
      status_id : 400,
      is_loading :false
    };
  }

  UNSAFE_componentWillMount = async () => {
    await this.fetchListStaff();
    await this.fetchListTasks(400);

  };

  fetchListTasks = async (status_id) => {
    this.setState({is_loading:true,list_tasks : [],status_id :status_id})
    const response = await getListTask({
      'status_id' :status_id,
      'from_time' :  _getTimeDefaultFrom(),
      'to_time' : _getTimeDefaultTo()
    });
    if (response.status === 200){
      this.setState({list_tasks:response.data.results,total_task_pending : response.data.total_task_awaiting});
    }else if (response.status === 403){
      await permissionDenied(this.props.navigation);
    }
    this.setState({is_loading:false})

  };

  fetchListStaff = async () => {
    const response = await getListStaff({});
    if (response.status === 200){
      let list_staff_tmp = []
      response.data.results.forEach((element,i) => {
        list_staff_tmp.push({
          key: element.staff_id,
          value: element.email,
          avatar: element.avatar,
          by_avatar: Array.from(element.fullname)[0],
          is_avatar : !!element.avatar
        })
        });
      this.setState({list_staff:list_staff_tmp});
    }else if (response.status === 403){
      await permissionDenied(this.props.navigation);
    }
  };



  render() {
    const { navigation } = this.props;
    const {
      scrollY,
      list_staff,
      total_task_pending,
      list_tasks,
      is_loading,
      status_id,

    } = this.state;
    return (
      <View style={[gStyle.container]}>
        <View >
          <ScreenHeader
            title={translate('screen.module.taks.header_text')}
            showBack={false}
            isFull={true}
            showInput={false}
            inputValueSend={null}
            autoFocus={false}
            bgColor={colors.cardLight}
            onPressCamera={this._searchCameraBarcode}
            onSubmitEditingInput={this._searchCameraBarcode}
            textPlaceholder={translate("screen.module.pickup.list.search_text")}
           navigation={navigation}/>
        </View>
        <Animated.ScrollView
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          style={[gStyle.container]}
        >
            <View style={[gStyle.flexRow,{
              marginHorizontal:5,
              marginTop:2,
              padding:5,
              paddingVertical:10,
              backgroundColor:colors.transparent
            }]}>
                <View style={[gStyle.flexCenter,{paddingHorizontal:10}]}>
                    <Text style={{...gStyle.textBoxmeBold24,color:colors.white}}>
                      {total_task_pending}
                    </Text>
                    <Text style={{...gStyle.textBoxme12,color:colors.greyInactive}}>
                      {translate('screen.module.taks.status_await')}
                    </Text>
                </View>
                <View style={{backgroundColor:colors.greyInactive,width:3,marginHorizontal:8,marginVertical:15}}></View>
                <View style={{marginLeft:5}}>
                    <View style={[gStyle.flexRow,{marginTop:5,marginLeft:10}]}>
                      {Object.keys(list_staff.slice(0,5)).map((index) => {
                        const item = list_staff[index];
                        return (
                          <Avatar key={item.key} left={index === 0 ? 0 : -10} image={item.is_avatar} value={item.is_avatar ? item.avatar:item.by_avatar} />
                        );
                      })}
                      <Text style={{paddingTop:5,color:colors.greyInactive,paddingLeft:5,}}>+{list_staff.length - 5} {translate('screen.module.taks.unit_staff')}</Text>
                    </View>
                </View>
            </View>
            <View style={[gStyle.flexRow,{
              marginHorizontal:5,
              marginTop:5
            }]}>
                <TaskScrollList onSelect = {this.fetchListTasks} />
            </View>
            {is_loading && <ActivityIndicator />}
            {list_tasks.length > 0 ?
              <TaksItem
                  navigation={navigation}
                  list_tasks={list_tasks}
                  status_id={status_id}
                  onPress = {this.fetchListTasks}
              />
             : <EmptySearch/>}

        </Animated.ScrollView>
        <View style={gStyle.iconRight}>
              <TouchIcon
                icon={<FontAwesome color={colors.white} name="plus" />}
                onPress={() =>navigation.navigate("AddTasks",{})}
                iconSize ={14}
              />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  iconRight: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: 15,
    width:35,
    height:35,
    borderRadius:35/2,
    backgroundColor:colors.borderLight,
    top: device.iPhoneNotch ? 40 : 20,
    zIndex: 100,
  },
});

ListTasks.propTypes = {
  // required
  navigation: PropTypes.object.isRequired,
};

export default ListTasks;
