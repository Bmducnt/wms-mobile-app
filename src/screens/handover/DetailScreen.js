import * as React from "react";
import PropTypes from "prop-types";
import {
  Animated,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  RefreshControl,
  Alert
} from "react-native";
import * as Print from "expo-print";
import { Feather } from "@expo/vector-icons";
import { colors, device, gStyle } from "../../constants";

// components
import ScreenHeader from "../../components/ScreenHeader";
import TouchIcon from "../../components/TouchIcon";
import EmptySearch from "../../components/EmptySearch";
import {
  _getTimeDefaultFrom,
  _getTimeDefaultTo,
} from "../../helpers/device-height";
import LineOrderOubound from "../../components/LineOrderOubound";
import {PDF_QR_PICKUP} from '../../services/endpoints';
import { permissionDenied } from "../../helpers/async-storage";

//service api
import getDetailOb from "../../services/handover/detail-ob";

class DetailScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      scrollY: new Animated.Value(0),
      isloading: false,
      list_data: [],
      from_time: _getTimeDefaultFrom(),
      to_time: _getTimeDefaultTo(),
      code_ob: null,
      reason_list : [],
      total_page : 1,
      carrier_name : null,
      carrier_logo:null,
      page : 1,
      is_approved : true,
      quantity : 0
    };
    this._fetchDetailHandover = this._fetchDetailHandover.bind(this);
  }

  componentDidMount = async () => {
    const { navigation } = this.props;
    this.setState({
        code_ob: navigation.getParam("code"),
        is_approved: navigation.getParam("is_approved"),
        carrier_name: navigation.getParam("carrier_name"),
        carrier_logo: navigation.getParam("carrier_logo"),
        quantity : navigation.getParam("quantity")
    });
    this.willFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      () => {
        this._fetchDetailHandover(navigation.getParam("code"),null);
      }
    );
  };

  componentWillUnmount() {
    this.willFocusSubscription.remove();
  };

  _printPdf = async () => {
    this.setState({ isloading: true});
    try {
      await Print.printAsync({
        uri: PDF_QR_PICKUP + this.state.code_ob + "?quantity=" + this.state.quantity,
      });
    } catch (error) {
      console.log("error:", error);
    }
    this.setState({ isloading: false});
  };

  _fetchDetailHandover = async (code,q) => {
    this.setState({ isloading: true, list_data: [] });
    const response = await getDetailOb(code,{is_pda:1,page:this.state.page,q:q});
    if (response.status === 200) {
      this.setState({ 
        list_data: response.data.results,
        reason_list :  response.data.reason_list,
        total_page: response.data.total_page 
      });
    };
    if (response.status === 403){
      permissionDenied();
    };
    this.setState({ isloading: false });
  };

  _onRefresh = async () => {
    this.state.page = 1;
    this._fetchDetailHandover(this.state.code_ob,null);
  };

  _handleLoadMore = () => {
    if (!this.state.isloading) {
        if (parseInt(this.state.total_page) >= parseInt(this.state.page+1)){
          this.state.page = this.state.page + 1;// increase page by 1
          this._fetchDetailHandover(this.state.code_ob,null);
        }
    }
  };

  isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    if (contentSize.height < layoutMeasurement.height){
      return false
    };
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
  }
  
  render() {
    const { navigation } = this.props;
    const {
      isloading,
      list_data,
      is_approved,
      carrier_logo,
      carrier_name,
      code_ob,
      scrollY,
      reason_list
    } = this.state;
    const { t } = this.props.screenProps;
    return (
      <React.Fragment>
        <View style={[gStyle.container]}>
        <View
          style={{ position: "absolute", top: 0, width: "100%", zIndex: 1}}
        >
          <ScreenHeader title={`${t('screen.module.packed.detail.text')} ${navigation.getParam("code")}`} showBack={true}/>
        </View>
        <Animated.ScrollView
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          refreshControl={
            <RefreshControl
              refreshing={isloading}
              onRefresh={this._onRefresh}
            />
          }
          onMomentumScrollEnd={({nativeEvent}) => {
            if (this.isCloseToBottom(nativeEvent)) {
              this._handleLoadMore();
            }
          }}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          stickyHeaderIndices={[1]}
          style={[gStyle.container]}
        >
          <View style={styles.containerScroll}>
          {list_data.length === 0 && (
            <EmptySearch t={t}/>
          )}
          {list_data &&
            list_data.map((item, index) => (
              <LineOrderOubound
                  key={index.toString()}
                  navigation={navigation}
                  logo_carrier={item.order_id.image_courier}
                  code={item.order_id.type_order === 8 ? item.order_id.combine_id : item.order_id.tracking_code}
                  trans={t}
                  reason_note={item.reason_note}
                  is_approved ={is_approved}
                  staff_email={item.outbound_id.created_by.email}
                  quantity={item.order_id.quantity}
                  time_created={item.order_id.created_date}
                  status_code ={item.order_id.status.description}
                  status_id = {item.order_id.status.status_id}
                  is_error = {item.is_error}
                />
            ))
          }
        </View>
        </Animated.ScrollView>
        {is_approved == 0 && <View style={styles.containerBottom}>
            <TouchableOpacity style={[styles.bottomButton,
                     {borderRadius:3,}]} 
                onPress={() => navigation.navigate('CreatedHandoverList',{
                    carrier_name: carrier_name,
                    carrier_logo : carrier_logo,
                    dispatched_code: code_ob,
                    handover_type : 2
                  })
                }>
                <Text style={styles.textButton}>
                    {t("screen.module.handover.add_new_tracking")}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.bottomButton,
                     {backgroundColor :colors.boxmeBrand,
                     borderRadius:3,}]} 
                onPress={() => navigation.navigate('RejectHandover',{
                    code: code_ob,
                    reason_list : reason_list,
                  })
                }>
                <Text style={styles.textButton}>
                    {t("screen.module.handover.btn_remove")}
                </Text>
            </TouchableOpacity>
        </View>}
        <View style={gStyle.iconRight}>
            <TouchIcon
                icon={<Feather color={colors.white} name="printer" />}
                iconSize ={18}
                onPress={() => this._printPdf()}
            />
        </View>
      </View>
      </React.Fragment>
    );
  }
}

DetailScreen.propTypes = {
  // required
  navigation: PropTypes.object.isRequired,
  screenProps: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({

  containerScroll: {
    paddingTop: device.iPhoneNotch ? 100 : 90,
    paddingBottom: 80,
  },
  containerBottom:{
    flexDirection : 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    width:'100%',
    backgroundColor:colors.blackBg,
    bottom:0,
  },
  bottomButton :{
      width: '46%',
      paddingVertical:13,
      marginHorizontal:2,
      backgroundColor:colors.darkgreen
  },
  textButton :{
      textAlign:'center',
      paddingHorizontal:5,
      color:colors.white,
      ...gStyle.textBoxmeBold14,
  },
  iconRight: {
    alignItems: "center",
    width:35,
    height:35,
    borderRadius:35/2,
    backgroundColor:colors.borderLight,
    justifyContent: "center",
    position: "absolute",
    right: 24,
    top: device.iPhoneNotch ? 45 : 20,
    zIndex: 100,
  },
});

export default DetailScreen;
