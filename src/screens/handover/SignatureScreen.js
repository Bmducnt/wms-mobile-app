import * as React from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Share
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import {
  Image as Imagecompressor
} from "react-native-compressor";
import { FontAwesome5 } from '@expo/vector-icons';
import SignatureCapture from 'react-native-signature-capture';
import {
  colors,
  gStyle,
  device,
} from "../../constants";

// components
import ModalHeader from "../../components/ModalHeader";
import CameraModule from "../../components/CameraModule";
import ConfirmHandover from "../../components/ConfirmHandover";
import confirmOBSend from '../../services/handover/approved-ob';
import getReportHandover from "../../services/handover/report";

import { serviceUploadAsset } from "../../helpers/upload-base";
import {translate} from "../../i18n/locales/IMLocalized";

class SignatureScreenBase extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      signature: null ,
      image_path_signature : null,
      image_path : null,
      ob_code : null,
      is_commit : false,
      open_camera: false,
      open_created : false,
      driver_name : null,
      driver_phone : null,
      driver_vehicle : null,
      warehouse_name: null,
      carrier_name :null,
      time_created :null,
      quantity :0,
      quantity_rollback :0,
      list_driver:[]
    };
    this.toggleCamera = this.toggleCamera.bind(this);
  }

  componentDidMount= async () =>{
    const { params } = this.props?.route;
    let time_created = new Date().toLocaleString();
    this.setState({
      ob_code: params?.ob_code,
      warehouse_name: params?.warehouse_name,
      quantity: params?.quantity,
      quantity_rollback :params?.quantity_rollback,
      time_created: time_created,
      carrier_name: params?.carrier_name
    });
    await this._fetchListCarrierDriverHandover(params?.carrier_name)
  }

  _fetchListCarrierDriverHandover = async (carrier_name) => {
    this.setState({ is_loading: true});
    const response = await getReportHandover({carrier_name : carrier_name});
    if (response.status === 200) {
      this.setState({
        list_driver: response.data.results
      });
    }
    this.setState({ is_loading: false });
  };

  _shareInfoOb = async () => {
    const path_pdf = 'https://wms.boxme.asia/api/handover/pdf/' +this.state.ob_code;
    this.setState({ is_loading: true });
    try {
      await Share.share({
        message: `${this.state.ob_code}\n${translate("screen.module.handover.mess_time")} ${this.state.time_created} \n`+
                `${translate("screen.module.handover.mess_warehouse_name")} ${this.state.warehouse_name} \n`+
                `${translate("screen.module.handover.mess_carrier_name")} ${this.state.carrier_name} \n`+
                `${translate("screen.module.handover.driver_vehicle")} ${this.state.driver_vehicle} \n`+
                `${translate("screen.module.handover.mess_qt")} ${this.state.quantity}\n${translate("screen.module.handover.mess_rollback")} ${this.state.quantity_rollback} \n`+
                `${translate("screen.module.handover.driver_name")} ${this.state.driver_name} - ${this.state.driver_phone} \n`+
                `${translate("screen.module.handover.mess_body")} ${path_pdf}`
      });
      await confirmOBSend(this.state.ob_code,JSON.stringify({
        is_verify_send : 1,
        is_verify : 1
      }));
    } catch (error) {
      await confirmOBSend(this.state.ob_code,JSON.stringify({
        is_verify_send : 1,
        is_verify : 0
      }));
    }
    this.setState({ is_loading: false,open_created:false});
    this.props.navigation.goBack(null)
  };

  toggleCamera() {
    this.setState((prev) => ({
      open_camera: !prev.open_camera,
    }));
  };

  _onChangeName = async (code) =>{
    this.setState({driver_name : code})
  };

  _onChangePhone = async (code) =>{
    this.setState({driver_phone : code})
  };

  _onChangeVehicle = async (code) =>{
    this.setState({driver_vehicle : code})
  };

  _onCloseModel = async (code) =>{
    this.setState({open_created : code})
  };

  pickImageorVideoHandover = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      const resultcompress = await Imagecompressor.compress(result.assets[0].uri, {
        compressionMethod: "auto",
      });
      await serviceUploadAsset(
        resultcompress,
        this.state.ob_code,
        null,
        3,
        0,
        false
      );

    }
  };

  onUploadImageByCamera = async (path) => {
    serviceUploadAsset(
      path,
      this.state.ob_code,
      null,
      3,
      0,
      false
    );
    this.setState({ image_path: path })

  }


  _submitImage = async () =>{
    this._fetchApprovedOB(this.state.ob_code);
  };

  _fetchApprovedOB = async (code) => {
    await confirmOBSend(code,JSON.stringify({
      driver_vehicle : this.state.driver_vehicle,
      driver_phone : this.state.driver_phone,
      driver_name : this.state.driver_name
    }));
    this.setState({is_commit : true});
    Alert.alert(
      '',
      translate('screen.module.handover.mess_confirm_text'),
      [
        {
          text: translate("base.confirm"),
          onPress: () => this._shareInfoOb(),
        },
        {
          text: translate('screen.module.product.move.btn_cancel'),
          onPress: () => this._goToListOb(),
        },
      ],
      {cancelable: false},
    );

  };

  _goToListOb = async() =>{
    this.setState({open_created:false})
    this.props.navigation.navigate('ListHandover',{});
  }

  _onSaveEvent = async (signature) => {
    this.setState({image_path_signature : signature.pathName});
    this.toggleCamera();
    serviceUploadAsset(
      signature.pathName,
      this.state.ob_code,
      null,
      3,
      0,
      false
    );
  };

  saveSign() {
      this.refs["sign"].saveImage();
  }

  handleEmpty = () => {
    this.refs["sign"].resetImage();
  };

  render() {
    const { navigation } = this.props;
    const {
      open_camera,
      image_path_signature,
      image_path,
      is_loading,
      is_commit,
      open_created,
      list_driver
    } = this.state;

    return (
      <View style={gStyle.container}>
        <ModalHeader
          left={<Feather color={colors.greyLight} name="chevron-down" />}
          leftPress={() => navigation.goBack(null)}
          text={translate('screen.module.handover.btn_sign')}
        />
        {is_loading && <ActivityIndicator/>}
        {image_path_signature &&
        <TouchableOpacity
        onPress={() => navigation.navigate("HandoverImages",
          {handover_code : null,load_local : true,path :[{ uri: image_path_signature }]})}
        style={[gStyle.flexRowSpace,{
          backgroundColor : colors.whiteBg,
          marginHorizontal:10,
          paddingVertical:16,
          paddingHorizontal:10,
          marginTop:'10%',
          borderRadius:3
        }]}>
            <View style={gStyle.flexRowCenterAlign}>
              <FontAwesome5 name="signature" size={24} color="black" />
              <Text style={{...gStyle.textBoxme14,color:colors.black,paddingLeft:5}}>
                Xem ảnh chữ ký
              </Text>
            </View>
            <FontAwesome5 name="angle-right" size={24} color="black" />
        </TouchableOpacity>}
        {image_path && <TouchableOpacity
          onPress={() => navigation.navigate("HandoverImages",
            {handover_code : null,load_local : true,path :[{ uri: image_path }]})}
          style={[gStyle.flexRowSpace,{
          backgroundColor : colors.boxmeBrand,
          marginHorizontal:10,
          paddingVertical:16,
          paddingHorizontal:10,
          marginTop:2,
          borderRadius:3
        }]}>
            <View style={gStyle.flexRowCenterAlign}>
              <FontAwesome5 name="images" size={24} color="black" />
              <Text style={{...gStyle.textBoxme14,color:colors.black,paddingLeft:5}}>
                Xem ảnh đã chụp
              </Text>
            </View>
            <FontAwesome5 name="angle-right" size={24} color="black" />
        </TouchableOpacity>}
        {!image_path_signature &&
        (
          <SignatureCapture
            style={{flex: 1}}
            ref="sign"
            onSaveEvent={this._onSaveEvent}
            saveImageFileInExtStorage={false}
            showNativeButtons={false}
            showTitleLabel={false}
            backgroundColor="#ffffff"
            strokeColor="#090909"
            minStrokeWidth={2}
            maxStrokeWidth={2}
            viewMode={"portrait"}
          />
        )}

        {!is_commit ? <View style={styles.containerBottom}>
          {!image_path_signature && <TouchableOpacity
            style={[styles.bottomButton,{backgroundColor:colors.yellow}]}
            onPress={() => this.handleEmpty()}
          >
            <Text style={[styles.textButton]} numberOfLines={1} ellipsizeMode="tail">
              {translate('screen.module.handover.btn_re_sign')}
            </Text>
          </TouchableOpacity>}
          {!image_path &&<TouchableOpacity
            style={[
              styles.bottomButton,
              { backgroundColor:colors.brandPrimary},
            ]}
            onPress={() => this.saveSign()}
          >
            <Text style={[styles.textButton]} numberOfLines={1} ellipsizeMode="tail">
              {translate('screen.module.handover.btn_next_step')}</Text>
          </TouchableOpacity>}
          {image_path && <TouchableOpacity
            style={[styles.bottomButton,{backgroundColor:colors.yellow}]}
            onPress={() => this.toggleCamera(true)}
          >
            <Text style={styles.textButton} numberOfLines={1} ellipsizeMode="tail">
              {translate('screen.module.handover.btn_photo')}
            </Text>
          </TouchableOpacity>}
          {image_path &&<TouchableOpacity
            style={[
              styles.bottomButton,
              { backgroundColor: colors.brandPrimary },
            ]}
            onPress={() => this.setState({open_created : true})}//this._submitImage()
          >
            <Text style={styles.textButton} numberOfLines={1} ellipsizeMode="tail">
              {translate('screen.module.handover.btn_end_step')}</Text>
          </TouchableOpacity>}

        </View>:<View style={styles.containerBottom}>
            <TouchableOpacity
              style={[
                styles.bottomButton,
                { backgroundColor: colors.boxmeBrand,width:'100%'},
              ]}
              onPress={() => this._goToListOb()}
            >
            <Text style={styles.textButton} numberOfLines={1} ellipsizeMode="tail">
              {translate('screen.module.handover.header')}
            </Text>
          </TouchableOpacity>
          </View>}
        {open_camera && (
            <CameraModule
              showModal={open_camera}
              allowClose={true}
              setModalVisible={() => this.toggleCamera(false)}
              setImage={(result) => this.onUploadImageByCamera(result.uri)}
            />
          )}
        {open_created && (
          <ConfirmHandover
            navigation ={navigation}
            onUploadAsset={this.pickImageorVideoHandover}
            onConfirm = {this._submitImage}
            onClose = {this._onCloseModel}
            isLoading = {is_loading}
            list_driver = {list_driver}
            onSetVehicle = {this._onChangeVehicle}
            onSetName = {this._onChangeName}
            onSetPhone = {this._onChangePhone}
          >

          </ConfirmHandover>
        )}
      </View>
    );
  }
}

SignatureScreenBase.propTypes = {
  // required
  navigation: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  containerScroll: {
    flexDirection: "row",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
  },
  containerBottom: {
    flexDirection : 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    width:'97%',
    bottom: device.iPhoneNotch ? 20 : 5
  },
  bottomButton: {
    width: "45%",
    paddingVertical: 15,
    marginLeft:5,
    borderRadius:6,
    backgroundColor: colors.boxmeBrand,
  },
  textButton: {
    textAlign: "center",
    color: colors.white,
    ...gStyle.textBoxme14,
  },
  preview: {
    width: device.width,
    height: undefined,
    resizeMode: 'contain',
    aspectRatio: 1,
    borderColor : colors.white,
    borderRadius : 3
  },
  previewImageCamera: {
    width: device.width,
    height: device.width
  },
});
export default SignatureScreenBase;
