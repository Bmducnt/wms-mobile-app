import * as React from "react";
import PropTypes from "prop-types";
import {
  Animated,
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import Timeline from 'react-native-timeline-flatlist'
import { 
  FontAwesome,
  Ionicons,
  Entypo 
} from "@expo/vector-icons";
import { 
  colors, 
  device, 
  gStyle 
} from "../../constants";
import * as ImagePicker from "expo-image-picker";
import { 
  Image as Imagecompressor 
} from "react-native-compressor";
// components
import ScreenHeader from "../../components/ScreenHeader";
import TextInputComponent from "../../components/TextInputComponent";

import {
  _getTimeDefaultFrom,
  _getTimeDefaultTo,
} from "../../helpers/device-height";
import {
  permissionDenied
} from "../../helpers/async-storage";

//API

import { serviceUploadAsset } from "../../helpers/upload-base";
import getDetailTask from "../../services/tasks/detail";
import getCommentTask from "../../services/tasks/list_comment";
import addCommentTask from "../../services/tasks/chat";
import updateStatusTask from "../../services/tasks/status-task";


class DetailTask extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      scrollY: new Animated.Value(0),
      list_asset : [],
      data_detail : [],
      is_loading :false,
      task_code : null,
      comment_text : null,
      data_comment_task : []
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.setState({
        task_code: navigation.getParam("task_code")
      });
    
  }

  UNSAFE_componentWillMount = async () => {
    this.fetchDetailTask(this.props.navigation.getParam("task_code"));
    this.fetchCommentTask(this.props.navigation.getParam("task_code"));
  };

  fetchDetailTask= async (code) => {
    this.setState({
        is_loading: true,
        data_detail: {}
    });
    const response = await getDetailTask(code);
    if (response.status === 200) {
        if(response.data.results.length > 0){
          this.setState({ data_detail: response.data.results[0] });
        }
        
    } else if (response.status === 403) {
      permissionDenied(this.props.navigation);
    }
    this.setState({ is_loading: false });
  };

  fetchCommentTask= async (code) => {
    this.setState({
        is_loading: true,
        data_comment_task: {}
    });
    const response = await getCommentTask(code);
    if (response.status === 200) {
        this.setState({ data_comment_task: response.data.results });
        
    } else if (response.status === 403) {
      permissionDenied(this.props.navigation);
    }
    this.setState({ is_loading: false });
  };

  addCommentTasks = async () =>{
    const { t } = this.props.screenProps;
    this.setState({is_loading : true});
    const response = await addCommentTask(this.state.task_code,JSON.stringify({
        comment_text : this.state.comment_text,
        list_asset:this.state.list_asset
    }));
    if (response.status === 200){
        Alert.alert(
            '',
            t("base.success"),
            [
                {
                text: t("base.confirm"),
                onPress: () => {this.fetchCommentTask(this.state.task_code);},
                },
            ],
            {cancelable: false},
        );
    }else if (response.status === 403){
      permissionDenied(this.props.navigation);
    }
    this.setState({is_loading : false});
  };

  updateStatusTasksClose = async () =>{
    const { t } = this.props.screenProps;
    this.setState({is_loading : true});
    const response = await updateStatusTask(this.state.task_code,JSON.stringify({
      status_id:405
  }));
    if (response.status === 200){
        Alert.alert(
            '',
            t("base.success"),
            [
                {
                text: t("base.confirm"),
                onPress: () => {this.fetchCommentTask(this.state.task_code);},
                },
            ],
            {cancelable: false},
        );
    }else if (response.status === 403){
      permissionDenied(this.props.navigation);
    }
    this.setState({is_loading : false});
  };



  pickImageorVideo = async () => {
    const { t } = this.props.screenProps;
    this.setState({ is_loading: true });
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      const resultcompress = await Imagecompressor.compress(result.assets[0].uri, {
        compressionMethod: "auto",
      });
      this.commitAssetToServer(resultcompress);
    }
    this.setState({ is_loading: false });
  };

  commitAssetToServer = async (assetPath) => {
    this.setState({ is_loading: true });
    req = await serviceUploadAsset(assetPath, null, null, 3,0,false);
    this.setState({
      list_asset: [
        {
          type_upload: "image",
          index: this.state.list_asset.length + 1,
          path: req.results.path_upload,
        },
        ...this.state.list_asset,
      ],
      is_loading: false,
    });
  };

  onSubmitEditingInputComment = async (code) => {
    if (code){
      await this.setState({comment_text : code})
    }
  }

  render() {
    const { navigation } = this.props;
    const { 
        list_asset,
        is_loading,
        data_detail,
        data_comment_task,
        task_code
    } = this.state;
    const { t } = this.props.screenProps;
    return (
        <View style={gStyle.container}>
            <View>
                <ScreenHeader
                    title={`${t('screen.module.taks.detail.header')} ${task_code}`}
                    showBack={true}
                    showInput={false}
                    inputValueSend={null}
                    autoFocus={false}
                    bgColor={colors.cardLight}
                    onPressCamera={null}
                    onSubmitEditingInput={null}
                    textPlaceholder={t("screen.module.pickup.detail.box_master")}
                />
            </View>
            <ScrollView nestedScrollEnabled={true}>
                <View style={[{marginHorizontal:15,marginTop:10}]}>
                    <View>
                        <Text style={{...gStyle.textBoxme18,color:colors.white}}>
                        {t('screen.module.taks.detail.task_name')} - {data_detail.task_name}
                        </Text>
                    </View>
                    <View style={[{marginTop:5}]}>
                        <Text style={{...gStyle.textBoxme14,color:colors.greyInactive}}>{t('screen.module.taks.detail.task_type')} : {data_detail.task_group}</Text>
                        <Text style={{...gStyle.textBoxme14,color:colors.greyInactive}}>{t('screen.module.taks.detail.created_by')} : {data_detail?.created_by?.staff_name}</Text>
                        <Text style={{...gStyle.textBoxme14,color:colors.greyInactive}}>{t('screen.module.taks.detail.due_date')} : {data_detail.due_date}</Text>
                    </View>
                    <View style={[{
                        marginTop:5,
                    }]}>
                    <View 
                        style={[gStyle.flexRowSpace,{
                          backgroundColor:colors.cardLight ,
                          paddingHorizontal:4,
                          paddingVertical:13,
                          borderRadius:4
                    }]}>
                        <Text style={{color:colors.white,padding:4}}>
                            <Entypo name="video-camera" size={20} color={colors.white} />  Video
                        </Text>
                        <Text style={{color:colors.white,padding:4,...gStyle.textBoxme18}}>
                            {data_detail?.task_detail?.total_video}
                        </Text>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate("ImagesViewList",{task_code : task_code})}
                                  style={[gStyle.flexRowSpace,{paddingHorizontal:4,
                                    paddingVertical:13,borderRadius:4,backgroundColor:colors.cardLight,marginTop:5}]}
                    >
                        <Text style={{color:colors.white,padding:4}}>
                          <Entypo name="images" size={20} color={colors.white} /> Images
                        </Text>
                        <Text style={{color:colors.white,padding:4,...gStyle.textBoxme18}}>
                          {data_detail?.task_detail?.total_images} <Entypo name="chevron-thin-right" size={14} color={colors.white} />
                        </Text>
                    </TouchableOpacity>
                    <View 
                      style={[gStyle.flexRowSpace,{backgroundColor:colors.cardLight,paddingHorizontal:4,
                      paddingVertical:13,borderRadius:4,marginTop:5}]}>
                        <Text style={{color:colors.white,padding:4}}>
                            <Entypo name="chat" size={20} color={colors.white} /> Comment
                        </Text>
                        <Text style={{color:colors.white,padding:4,...gStyle.textBoxme18}}>
                            {data_detail?.task_detail?.total_comment}
                        </Text>
                    </View>
                    {data_detail?.task_material_req > 0 && <TouchableOpacity onPress={() => navigation.navigate("UpdateTasks",{task_code : task_code})}
                                  style={[gStyle.flexRowSpace,{paddingHorizontal:4,
                                    paddingVertical:13,borderRadius:4,backgroundColor:colors.cardLight,marginTop:5}]}
                    >
                        <Text style={{color:colors.white,padding:4}}>
                          <Entypo name="shopping-cart" size={20} color={colors.white} /> {t('screen.module.taks.detail.box_have')}  
                          {data_detail?.task_material_req} {t('screen.module.taks.detail.box_move')} 
                        </Text>
                        <Text style={{color:colors.white,padding:4}}>
                           <Entypo name="chevron-thin-right" size={14} color={colors.white} />
                        </Text>
                    </TouchableOpacity>
                  }
                  </View>
                    
                </View>
                <View style={{marginTop:8}}>
                    <TextInputComponent
                        navigation={navigation}
                        labeView={true}
                        autoFocus={false}
                        showSearch={false}
                        showScan={false}
                        multiline={true}
                        numberOfLines={6}
                        heightInput={60}
                        autoChange={true}
                        onPressCamera={this.onSubmitEditingInputComment}
                        onSubmitEditingInput={this.onSubmitEditingInputComment}
                        textPlaceholder={t('screen.module.taks.detail.comment')}
                        textLabel={t('screen.module.taks.detail.comment')}
                    />
                </View>
                <View style={[gStyle.flexRowSpace,{marginVertical:5,marginHorizontal:15}]}>
                    <TouchableOpacity onPress={() => this.pickImageorVideo()}>
                        <Ionicons name="attach" size={18} color={colors.darkgreen} />
                        {list_asset.length > 0 && 
                      <Text style={[styles.textLabel,{color:colors.white}]}>{list_asset.length} {t('screen.module.taks.add.file_sub')}</Text> }
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.addCommentTasks()} style={{paddingHorizontal:10,
                                  paddingVertical:8,
                                  borderRadius:3,
                                  backgroundColor:colors.darkgreen}}>
                        <Text style={{ color: colors.white,...gStyle.textBoxme14,paddingLeft:4 }}>
                            Send{" "}<FontAwesome name="send-o" size={14} color={colors.white} />
                        </Text>
                    </TouchableOpacity>
                </View>
                <Text style={{paddingHorizontal:15,color:colors.greyInactive,...gStyle.textBoxme16}}>{t('screen.module.taks.detail.comment_list')} ({data_comment_task.length})</Text>
                <ScrollView horizontal={true} style={{ flex:1}}>
                    {data_comment_task.length > 0 && <View style={[gStyle.flexRow,{marginTop:10,marginHorizontal:15}]}>
                    <Timeline
                        data={data_comment_task}
                        titleStyle={{
                            color: colors.greyInactive,
                            ...gStyle.textBoxme14,
                            backgroundColor:colors.cardLight,
                            paddingHorizontal:6,
                            paddingTop:6,
                            borderRadius:6
                        }}
                        innerCircle={'dot'}
                        isUsingFlatlist={false}
                        circleColor={colors.cardLight}
                        lineColor={colors.greyInactive}
                        circleSize={16}
                        dotSize={8}
                        timeContainerStyle={{ minWidth: 10, flexDirection: "row" }}
                        timeStyle={{
                            color: colors.white,
                            ...gStyle.textBoxme12,
                        }}
                        descriptionStyle={{
                            color: colors.white,
                            marginTop: -1,
                            minHeight: 30,
                            paddingHorizontal:6,
                            backgroundColor:colors.cardLight
                        }}
                        
                    />
                </View>}
                </ScrollView>
            </ScrollView>
            {data_detail?.status?.status_id === 402  && <View style={styles.iconRight}>
            <TouchableOpacity style={{
                    backgroundColor:colors.borderLight,
                    paddingVertical:4,
                    paddingHorizontal:4,
                    borderRadius:4
                  }} 
                      onPress={() => this.updateStatusTasksClose()}>
                      {!is_loading ? <Text style={styles.textButton}>
                      {t('screen.module.taks.detail.btn_done')}
                      </Text>:<ActivityIndicator/>}
                  </TouchableOpacity>
              </View>}

            
      </View>
    );
  }
}

DetailTask.propTypes = {
  // required
  navigation: PropTypes.object.isRequired,
  screenProps: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
    containerBottom:{
        position: 'absolute',
        width:'100%',
        bottom: device.iPhoneNotch ? 0 : 0
    },
    bottomButton :{
        justifyContent: 'center',
        alignContent:'center',
        width:'92%',
        paddingVertical:15,
        marginHorizontal:15,
        borderRadius:6,
        backgroundColor:colors.darkgreen
    },
    textButton :{
        textAlign:'center',
        color:colors.boxmeBrand,
        ...gStyle.textBoxme12,
    },
    iconRight: {
      alignItems: "center",
      justifyContent: "center",
      position: "absolute",
      right: 15,
      top: device.iPhoneNotch ? 65 : 30,
      zIndex: 100,
    },
});

export default DetailTask;
