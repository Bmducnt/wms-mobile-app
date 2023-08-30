import * as React from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
  Image as Imagecompressor
} from "react-native-compressor";
import { Feather,Entypo,AntDesign } from "@expo/vector-icons";
import {
  colors,
  gStyle
} from "../../constants";
import ModalHeader from "../../components/ModalHeader";
import TextInputComponent from "../../components/TextInputComponent";
import DatetimeDue from "./DatetimeDue";
import {permissionDenied} from '../../helpers/async-storage';
import {_getDatetimeToTimestampFull,_getTimeDefaultTo} from '../../helpers/device-height';


// API
import { serviceUploadAsset } from "../../helpers/upload-base";

import getListStaff from "../../services/tasks/list-staff";
import addNewTask from "../../services/tasks/add";
import ModelTaskType from "./ModelTaskType";
import ModelStaffList from './ModelStaffList';
import ModelBoxList from './ModelBoxList';
import {translate} from "../../i18n/locales/IMLocalized";



class AddTasks extends React.PureComponent {

  constructor() {
    super();

    this.state = {
      task_type : null,
      task_note : null,
      box_code : [],
      list_staff : [],
      is_loading : false,
      assigner_by : null,
      list_asset : [],
      task_name : null,
      due_date : _getTimeDefaultTo(),
      is_box_req : false,
      open_due_date_time : false,
      open_task_model : false,
      open_task_model_staff : false,
      open_task_box_model : false,

    };
  }



  UNSAFE_componentWillMount = async () => {
    await this.fetchListStaff();
  };


  onSelectTasks = async (task_type) => {
    await this.setState({task_type:task_type})
  }

  onSelectStaff = async (assigner_by) => {
    await this.setState({assigner_by:assigner_by})
  }

  onSelectBox = async (code) => {
    await this.setState({box_code : code})
  }

  fetchListStaff = async () => {
    const response = await getListStaff({});
    if (response.status === 200){
      const list_staff_tmp = response.data.results
        .filter(element => this.state.is_box_req ?  element.role === 8 : element.role > 2)
        .map((element, i) => ({
          key: element.staff_id,
          value: element.email,
          role_id: element.role,
          fullname: element.fullname,
          avatar: element.avatar,
          by_avatar: Array.from(element.fullname)[0],
          is_avatar: !!element.avatar
        }));
      this.setState({list_staff: list_staff_tmp});
    } else if (response.status === 403){
      permissionDenied(this.props.navigation);
    }
  };

  // imageCompress = async (path) => {
  //   const resultcompress = await Imagecompressor.compress(path, {
  //     compressionMethod: "auto",
  //   });
  //   this.commitAssetToServer(resultcompress);
  // };

  pickImageorVideo = async () => {
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
    const req = await serviceUploadAsset(assetPath, null, null, 3,0,false);
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

  onSubmitEditingInputNote = async (code) => {
    if (code){
      await this.setState({task_note : code})
    }
  };


  onSubmitEditingInputName = async (code) => {
    if (code){
      await this.setState({task_name : code})
    }
  };


  onSubmitEditingInputDue = async (code) => {
    if (code){
      await this.setState({due_date : code})
    }
  };


  onGoback = async () =>{
    this.props.navigation.goBack(null);
  };



  addTasks = async () =>{
    if (!this.state.task_type || !this.state.assigner_by || !this.state.due_date){
      Alert.alert(
        '',
        translate('screen.module.taks.add.alert_text'),
        [
            {
            text: translate("base.confirm"),
            onPress: () => {null},
            },
        ],
        {cancelable: false},
      );
      return;
    }

    this.setState({is_loading : true});
    const response = await addNewTask(JSON.stringify({
        task_group: this.state.task_type,
        task_name: this.state.task_name ? this.state.task_name : translate('screen.module.taks.detail.task_name_default'),
        assigner_by : this.state.assigner_by,
        due_date : this.state.due_date,
        task_notes : this.state.task_note ? this.state.task_note : translate('screen.module.taks.detail.task_note_default'),
        list_asset:this.state.list_asset,
        box_code:this.state.box_code,
    }));
    if (response.status === 200){
        Alert.alert(
            '',
            translate('screen.module.pickup.create.ok'),
            [
                {
                text: translate("base.confirm"),
                onPress: () => {this.onGoback();},
                },
            ],
            {cancelable: false},
        );
    }else if (response.status === 403){
      permissionDenied(this.props.navigation);
    }
    this.setState({is_loading : false});
  };

  onCloseModel = async (type) => {
    if (type === 1){
      this.setState({open_task_model : false})
    }
    if (type === 2){
      this.setState({open_task_model_staff : false})
    }
    if (type === 3){
      this.setState({open_due_date_time : false})
    }
    if (type === 4){
      this.setState({open_task_box_model : false})
    }
  }

  onAddBox = async (code) => {
    await this.setState({
      is_box_req : code

    })
  }

  render() {
    const { navigation } = this.props;
    const {
      list_staff,
      is_loading,
      list_asset,
      open_task_model,
      task_type,
      open_task_model_staff,
      assigner_by,
      due_date,
      open_due_date_time,
      open_task_box_model,
      box_code,
      is_box_req
    } = this.state;
    return (
      <ScrollView style={gStyle.container}>
        <KeyboardAvoidingView
          style={{ flex:1,height: "100%", width: "100%"}}
          behavior="padding"
          keyboardVerticalOffset={0}
        >
            <View >
                <ModalHeader
                    left={<Feather color={colors.white} name="x"/>}
                    leftPress={() => navigation.goBack(null)}
                    text={translate('screen.module.taks.add.header')}
                />
            </View>
            <View style={[gStyle.container,{
                marginHorizontal:10,
                marginTop:10
            }]}>
                <Text style={styles.textLabel}>{translate('screen.module.taks.add.task_type')}</Text>
                <View style={[{marginHorizontal:15}]}>
                    <TouchableOpacity
                      onPress={() => this.setState({open_task_model : true})}
                      style={[
                        gStyle.flexRowSpace,
                        {
                            paddingVertical: 15,
                            backgroundColor: colors.whiteBg,
                            borderRadius:6,
                            paddingHorizontal:10
                        },
                    ]}>
                        <Text style={{ color:task_type ? colors.black:colors.greyInactive, ...gStyle.textBoxme14}}>
                          {task_type ? task_type : `${translate('screen.module.taks.add.task_type')}`}
                        </Text>
                        <Entypo name="chevron-down" size={18} color={colors.greyInactive} />
                    </TouchableOpacity>
                </View>
                {!is_box_req &&<View style={{marginTop:8}}>
                    <TextInputComponent
                    navigation={navigation}
                    labeView={true}
                    autoFocus={false}
                    showSearch={false}
                    showScan={false}
                    multiline={true}
                    numberOfLines={6}
                    heightInput={45}
                    autoChange={true}
                    onPressCamera={this.onSubmitEditingInputName}
                    onSubmitEditingInput={this.onSubmitEditingInputName}
                    textPlaceholder={translate('screen.module.taks.add.task_name')}
                    textLabel={translate('screen.module.taks.add.task_name')}
                    />
                </View>}
                {!is_box_req && <View style={{marginTop:8}}>
                    <TextInputComponent
                    navigation={navigation}
                    labeView={true}
                    autoFocus={false}
                    showSearch={false}
                    showScan={false}
                    multiline={true}
                    numberOfLines={6}
                    heightInput={80}
                    autoChange={true}
                    onPressCamera={this.onSubmitEditingInputNote}
                    onSubmitEditingInput={this.onSubmitEditingInputNote}
                    textPlaceholder={translate('screen.module.taks.add.task_note')}
                    textLabel={translate('screen.module.taks.add.task_note')}
                    />
                </View>}
                <View style={gStyle.flexRowSpace}>
                  <Text style={styles.textLabel}>{translate('screen.module.taks.add.file')}</Text>
                  {list_asset.length > 0 &&
                  <Text style={[styles.textLabel,{color:colors.white}]}>{list_asset.length} {translate('screen.module.taks.add.file_sub')}</Text> }
                </View>
                <TouchableOpacity
                    onPress={() => this.pickImageorVideo()}
                    style={[
                    gStyle.flexRow,
                    {
                        paddingVertical: 12,
                        marginHorizontal: 15,
                        backgroundColor: colors.whiteBg,
                        borderRadius:6
                    },
                    ]}
                >
                    <View style={[gStyle.flexRowCenter, { width: 60 }]}>
                      <Feather color={"#162a53"} name="file-text" size={20} />
                    </View>
                    {!is_loading ? <View style={[{ width: Dimensions.get("window").width - 100 }]}>
                      <Text style={{ color:colors.greyInactive, ...gStyle.textBoxme14 }}>
                        {translate('screen.module.taks.add.file')}
                      </Text>
                      <Text
                          style={{
                          color: colors.greyInactive,
                          ...gStyle.textBoxme12,
                          }}
                      >
                          PNG , JPG or MP4, MOV
                      </Text>

                    </View>: <ActivityIndicator />}
                </TouchableOpacity>
                {is_box_req && <Text style={styles.textLabel}>{translate('screen.module.taks.add.select_box')}</Text>}
                {is_box_req && <View style={[gStyle.flexRow,{marginHorizontal:15}]}>
                    <TouchableOpacity
                      onPress={() => this.setState({open_task_box_model : true})}
                      style={[
                        gStyle.flexRowSpace,
                        {
                            paddingVertical: 15,
                            backgroundColor: colors.whiteBg,
                            borderRadius:6,
                            paddingHorizontal:10,
                            width:'100%'
                        },
                    ]}>
                        <Text style={{ color:box_code.length > 0 ? colors.black :colors.greyInactive, ...gStyle.textBoxme14}}>
                          {box_code.length > 0 ? `${box_code.length} ${translate('screen.module.taks.detail.box_select')}`   :`${translate('screen.module.taks.add.select_box')}`}
                        </Text>
                        <Entypo name="chevron-down" size={18} color={colors.greyInactive} />
                    </TouchableOpacity>
                </View>}

                <Text style={styles.textLabel}>{translate('screen.module.taks.add.label_staff')}</Text>
                <View style={[gStyle.flexRow,{marginHorizontal:15}]}>
                    <TouchableOpacity
                      onPress={() => this.setState({open_task_model_staff : true})}
                      style={[
                        gStyle.flexRowSpace,
                        {
                            paddingVertical: 15,
                            backgroundColor: colors.whiteBg,
                            borderRadius:6,
                            paddingHorizontal:10,
                            width:'100%'
                        },
                    ]}>
                        <Text style={{ color:assigner_by ? colors.black :colors.greyInactive, ...gStyle.textBoxme14}}>
                          {assigner_by ? assigner_by :`${translate('screen.module.taks.add.select_staff')}`}
                        </Text>
                        <Entypo name="chevron-down" size={18} color={colors.greyInactive} />
                    </TouchableOpacity>
                </View>
                <Text style={styles.textLabel}>{translate('screen.module.taks.add.due')}</Text>
                <View style={[gStyle.flexRow,{marginHorizontal:15}]}>
                    <TouchableOpacity
                        onPress={() => this.setState({open_due_date_time : true})}
                        activeOpacity={gStyle.activeOpacity}
                        style={[gStyle.flexRowSpace,
                            {
                                width:'100%',
                                borderRadius:6,
                                marginTop:4,
                                height:50,
                                paddingHorizontal:10,
                                backgroundColor:colors.whiteBg
                            }
                        ]}
                        >
                        <Text style={{
                            color:colors.black,
                            ...gStyle.textBoxme16,
                            paddingLeft:5
                        }}>{_getDatetimeToTimestampFull(due_date)}</Text>
                        <AntDesign color={colors.black70} name="calendar" size={24} />
                    </TouchableOpacity>
                </View>
                <View style={styles.containerBottom}>
                  <TouchableOpacity
                    style={[styles.bottomButton]}
                    onPress={() => this.addTasks()}
                  >
                    <Text style={styles.textButton}>{translate('screen.module.taks.add.btn_add')}</Text>
                  </TouchableOpacity>
                </View>
                {open_due_date_time && <DatetimeDue onSelect={this.onSubmitEditingInputDue} onClose={this.onCloseModel} />}
                {open_task_model && <ModelTaskType onSelect = {this.onSelectTasks} onClose={this.onCloseModel} onAddBox = {this.onAddBox} /> }
                {open_task_model_staff && <ModelStaffList data={list_staff} onSelect={this.onSelectStaff} onClose={this.onCloseModel} />}
                {open_task_box_model && <ModelBoxList onSelect={this.onSelectBox} onClose={this.onCloseModel} onBoxList = {box_code}/>}
            </View>

        </KeyboardAvoidingView>
      </ScrollView>
    );
  }
}

AddTasks.propTypes = {
  // required
  navigation: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
    textLabel:{
        color:colors.greyInactive,
        ...gStyle.textBoxme14,
        marginVertical:5,
        paddingHorizontal:15
    },
    containerBottom: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginVertical:20,
      marginHorizontal:15
    },
    bottomButton: {
      width: "100%",
      paddingVertical: 15,
      borderRadius: 3,
      backgroundColor: colors.darkgreen,
    },
    textButton: {
      textAlign: "center",
      paddingHorizontal: 5,
      color: colors.white,
      ...gStyle.textBoxmeBold14,
    },
});

export default AddTasks;
