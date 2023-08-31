import * as React from "react";
import PropTypes from "prop-types";
import {
  Animated,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Alert
} from "react-native";
import * as Device from 'expo-device';
import { Feather } from "@expo/vector-icons";
import { colors, device, gStyle } from "../../constants";

// components
import TextInputComponent from "../../components/TextInputComponent";
import ToastAlert from '../../components/ToastAlert';
import {
  _getTimeDefaultFrom,
  _getTimeDefaultTo,
} from "../../helpers/device-height";
import LineOrderOubound from "../../components/LineOrderOubound";
import {handleSoundScaner,permissionDenied,handleSoundOkScaner} from '../../helpers/async-storage';
// components
import ModelReason from "./ModelReason";
import ModalHeader from "../../components/ModalHeader";
//service api
import removeTrackingOB from "../../services/handover/remove-tracking";
import {translate} from "../../i18n/locales/IMLocalized";

class RejectHandover extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      scrollY: new Animated.Value(0),
      isloading: false,
      list_data: [],
      reason_list : [],
      quantity_scan : 0,
      textError :null,
      from_time: _getTimeDefaultFrom(),
      to_time: _getTimeDefaultTo(),
      code_ob: null,
      code_scan : null,
      open_model: false
    };
    this._fetchDetailHandover = this._fetchDetailHandover.bind(this);
  }

  componentDidMount = async () => {
    const { params } = this.props?.route;
    this.setState({
        code_ob: params?.code,
        is_approved: params?.is_approved,
        quantity : params?.quantity,
        reason_list : params?.reason_list
      });
  };

  onClose = async () => {
    this.setState({open_model:false,code_scan : null});
  };


  onSelect = async (reason_note) =>{
    this.setState({open_model : false})
    this._fetchDetailHandover(this.state.code_ob,this.state.code_scan,reason_note);
  };


  _fetchDetailHandover = async (code,q,reason_note) => {
    this.setState({ isloading: true});
    const response = await removeTrackingOB(this.state.code_ob,JSON.stringify({
      list_tracking: [q],
      reason_note : reason_note
    }));
    if (response.status === 200) {
        if (response.data.results.length > 0 && response.data.status_code === 0){
            if (this.state.list_data.length >= 1 && this.state.list_data.length <= 10){
              this.setState({ list_data:[...this.state.list_data, ...response.data.results]});
            }
            if (this.state.list_data.length === 0 || this.state.list_data.length > 10){
              this.setState({ list_data: response.data.results});
            }
            this.state.quantity_scan =this.state.quantity_scan+1;
            await handleSoundOkScaner();
        }else{
            await handleSoundScaner();
            await this.setState({textError:translate('screen.module.handover.order_status_fail')});
        }
    }
    if (response.status === 400){
        await handleSoundScaner();
        await this.setState({textError:translate('screen.module.handover.order_fail')});
      }
    if (response.status === 403){
      await permissionDenied();
    }
    this.setState({ isloading: false });
  };

  _confirmRemoveaction = async () =>{
    Alert.alert(
      '',
      translate('screen.module.handover.text_confirm_remove'),
      [
        {
          text:translate('base.confirm'),
          onPress: () => this.props.navigation.goBack(null),
        },
        {
          text : translate("screen.module.product.move.btn_cancel"),
          onPress: null,
        }
      ],
      {cancelable: false},
    );
  };

  _searchCameraBarcode = async (code) => {
    if (code) {
      this.state.page = 1
      this.setState({code_scan : code,open_model : true});
    }
  };

  render() {
    const { navigation } = this.props;
    const { params } = this.props?.route;
    const {
      isloading,
      list_data,
      is_approved,
      scrollY,
      quantity_scan,
      textError,
      reason_list,
      open_model
    } = this.state;
    return (
      <React.Fragment>
        <View style={[gStyle.container]}>
        <ModalHeader
            right={<Feather color={colors.white} name="x" />}
            rightPress={() => navigation.goBack(null)}
            text={params?.code}
          />
        <View style={{marginHorizontal:5}}>
          <TextInputComponent
            navigation={navigation}
            labeView={false}
            textLabel={translate("screen.module.handover.input_tracking")}
            autoFocus={true}
            is_close={false}
            textError={textError}
            onPressCamera={this._searchCameraBarcode}
            onSubmitEditingInput={this._searchCameraBarcode}
            textPlaceholder={translate("screen.module.handover.input_tracking")}
          />
        </View>
        <Animated.ScrollView
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          stickyHeaderIndices={[1]}
          style={[gStyle.container]}
        >
          <View style={styles.containerScroll}>
          {isloading && <ActivityIndicator />}
          {list_data.length === 0 && (
            <View style={styles.containerSearch}>
                <Text style={styles.searchInfo}>
                    {translate("screen.module.handover.text1_handover_rollback")}
                </Text>
                <Text style={styles.searchInfo}>
                    {translate("screen.module.handover.text2_handover_rollback")}
                </Text>
            </View>
          )}
          {list_data &&
            list_data.slice(0,10).map((item, index) => (
              <LineOrderOubound
                  key={index.toString()}
                  navigation={navigation}
                  logo_carrier={item.order_id.image_courier}
                  code={item.order_id.tracking_code}
                  is_approved ={is_approved}
                  staff_email={item.outbound_id.created_by.email}
                  quantity={item.order_id.quantity}
                  time_created={item.order_id.created_date}
                  status_code ={item.order_id.status.description}
                  status_id = {item.order_id.status.status_id}
                />
            ))
          }
        </View>
        </Animated.ScrollView>
        <View style={styles.containerBottom}>
            <TouchableOpacity
                style={[styles.bottomButton]}
                disabled={quantity_scan === 0}
                onPress={() => this._confirmRemoveaction()}>
                <Text style={styles.textButton}>
                    {translate("screen.module.handover.btn_handover_rollback")}{" "}{quantity_scan}{" "}{translate("screen.module.handover.unit_order").toLowerCase()}
                </Text>
            </TouchableOpacity>
        </View>
      </View>
      {open_model &&
        <ModelReason
          listData = {reason_list}
          onClose ={this.onClose}
          onSelect ={this.onSelect}
        />
      }
      {Device.osName === 'Android' && textError &&
            <ToastAlert
              textAlert ={textError}
            />
          }
      </React.Fragment>
    );
  }
}

RejectHandover.propTypes = {
  // required
  navigation: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  containerSearch: {
    backgroundColor:colors.cardLight,
    borderLeftColor:colors.boxmeBrand,
    padding:10,
    marginHorizontal: 18,
    borderLeftWidth:4
  },
  searchInfo: {
    ...gStyle.textBoxme16,
    paddingTop:3,
    color: colors.white,
  },
  containerScroll: {
    paddingTop: 20
  },
  containerBottom:{
    position: 'absolute',
    width:'100%',
    bottom: device.iPhoneNotch ? 10 : 0
  },
  bottomButton :{
      justifyContent: 'center',
      alignContent:'center',
      width:'92%',
      paddingVertical:13,
      marginHorizontal:15,
      borderRadius:6,
      backgroundColor:colors.darkgreen
  },
  textButton :{
      textAlign:'center',
      color:colors.white,
      ...gStyle.textBoxmeBold14,
  },
});

export default RejectHandover;
