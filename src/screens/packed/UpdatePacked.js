import * as React from 'react';
import PropTypes from 'prop-types';
import {
    Alert,
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    FlatList,
    TouchableOpacity,
    KeyboardAvoidingView,
} from 'react-native';
import * as Device from 'expo-device';
import { Feather} from '@expo/vector-icons';
import { colors, gStyle,device} from '../../constants';

// components
import ModalHeader from '../../components/ModalHeader';
import TextInputComponent from '../../components/TextInputComponent';
import {
    handleSoundScaner,
    permissionDenied,
    handleSoundOkScaner,
} from '../../helpers/async-storage';
import FNSKUItems from '../../components/ListFNSKUPickup';
import ModelOrderItems from './OrderItems';

//API
import postDetailPacked from '../../services/packed/update';
import getDetailPacked from '../../services/packed/detail';
import postBoxPacked from '../../services/packed/box';
import getBoxPacked from '../../services/packed/get_box';
import postBoxPackedOneByOne from '../../services/packed/overpack';
import {translate} from "../../i18n/locales/IMLocalized";

class ModalUpdatePacked extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isloading : false,
            fnsku_code : null,
            pickup_code : null,
            is_model : false,
            tracking_code_done :null,
            order_id : null,
            is_boxscan : false,
            box_code_sugget : null,
            list_code_sugget :[],
            tracking_code : '',
            printer_label : {
                name : null,
                url : null
            },
            overpack_code :null,
            overpack_quantity :0,
            overpack_items : [],
            overpack_box_packed: null,
            overpack_box_scan_box: null,

            order_items:[],
            list_label:[],
            list_box:[],
            fnsku_quantity_scan : 1,
            list_tracking_outbound :[],
            list_item_packed : []
        };
    };

    componentDidMount() {
        const { params } = this.props?.route;
        this.setState({
            pickup_code: params?.pickup_code
        });
    };

    UNSAFE_componentWillMount = async () =>{
        const { params } = this.props;
        this._fetchDetailPacking(params?.pickup_code)
    };

    _check_packed_ok = async () => {
        const is_check = this.state.list_item_packed.every(item => item.total_pick === item.total_items);
        await this.setState({is_boxscan: is_check});
    };


    _getBoxByTracking = async () =>{
        const response = await getBoxPacked(this.state.order_id);
        if (response.status === 200){
            await this.setState({
                box_code_sugget : response.data.results.box_name,
                list_code_sugget:response.data.results.box_list_allow,
            })
        }
    }

    addBoxB2BOrder = async (code) => {
        if (code) {
          let box_number = 1;
          if (this.state.list_box.length > 0) {
            // Get the last box number and add 1
            const last_box = this.state.list_box[this.state.list_box.length - 1];
            box_number = parseInt(last_box.overpack_code.split('-')[2]) + 1;
          }
          const overpack_code = `${this.state.pickup_code}-${box_number.toString().padStart(2, '0')}`;
          await this.setState({ overpack_code });
        } else {
          const { overpack_code, overpack_quantity, overpack_items } = this.state.list_box[0];
          await this.setState({ overpack_code, overpack_quantity, overpack_items });
        }
    };

    addItemToBox = async (fnsku_code, quantity) => {
        if (!Number.isInteger(quantity) || quantity <= 0) {
          throw new Error('Invalid quantity');
        }
        let is_match = false;
        const new_items = this.state.overpack_items.map((item) => {
          if (item.fnsku_code === fnsku_code) {
            is_match = true;
            return {
              ...item,
              fnsku_quantity: item.fnsku_quantity + quantity,
            };
          }
          return item;
        });
        if (!is_match) {
          new_items.push({
            fnsku_code,
            fnsku_quantity: quantity,
          });
        }
        await this.setState({
          overpack_items: new_items,
          overpack_quantity: this.state.overpack_quantity + quantity,
        });
    };

    commitItemToBox = async (code) =>{
        const rp = await postBoxPackedOneByOne(JSON.stringify({
            overpack_code: this.state.overpack_code,
            overpack_quantity: this.state.overpack_quantity,
            overpack_items: this.state.overpack_items,
            tracking_code: this.state.pickup_code,
            overpack_box_packed: code
        }));
        if (rp.status === 400){
            await handleSoundScaner();
            Alert.alert(
            '',
            translate('screen.module.packed.detail.box_add_error'),
            [

                {
                text : translate('base.confirm'),
                onPress: () => null,
                }
            ],
            {cancelable: false},
            );
            return;
        }
        handleSoundOkScaner();
        await this.setState({
            overpack_box_packed :null,
            overpack_box_scan_box:false,
            is_boxscan:false,
            overpack_items :[],
            overpack_quantity :0,
            overpack_code: this.state.pickup_code+'-'+parseInt(parseInt(this.state.overpack_code.slice(-1))+1)
        })

    };


    _postOutBoundHandler = async  (code_scan) =>{
        this.setState({isloading:true});
        const response = await postDetailPacked(this.state.pickup_code,JSON.stringify({
            bsin: code_scan,
            quantity: this.state.fnsku_quantity_scan,
            tracking_code: this.state.pickup_code
        }));
        if (response.status === 200){
            handleSoundOkScaner();
            let list_item_packed = []
            for (let index = 0; index < this.state.list_tracking_outbound.length; index++) {
                if (this.state.list_tracking_outbound[index].tracking_code__tracking_code === response.data.results.tracking_code){
                    if(this.state.list_tracking_outbound[index].bsin__seller_sku === response.data.results.bsin){
                        this.state.list_tracking_outbound[index].total_pick = response.data.results.total_pickup;
                        this.state.list_tracking_outbound[index]['activebg'] = '#252b2e';
                        this.addItemToBox(response.data.results.bsin,this.state.fnsku_quantity_scan);
                    }
                    list_item_packed.push(this.state.list_tracking_outbound[index])
                }
            }
            await this.setState({
                list_item_packed : list_item_packed,
                order_id : list_item_packed[0].tracking_code__order_id,
                tracking_code : response.data.results.tracking_code
            });
            if (!this.state.box_code_sugget){
                this._getBoxByTracking()
            }
            this._check_packed_ok();
        }else{
            handleSoundScaner();
        }
        this.setState({isloading:false});
    };

    _postBoxorder = async (code_scan) =>{
        this.setState({isloading:true});
        const response = await postBoxPacked(JSON.stringify({
            box_code: code_scan,
            box_code_sugget: code_scan,
            code: this.state.pickup_code,
            list_code_sugget : this.state.list_code_sugget,
            table_packed :Device.osName
        }));
        if (response.status === 200){
            Alert.alert(
                '',
                translate('screen.module.packed.detail.packed_ok'),
                [

                    {
                    text : translate('base.confirm'),
                    onPress: () => this.props.navigation.goBack(),
                    }
                ],
                {cancelable: false},
                );
        }else if (response.status === 403){
            permissionDenied(this.props.navigation);
        }else{
            handleSoundScaner();
        }
        this.setState({isloading:false});
    };

    _confirmRemoveactionBox = async () =>{
        Alert.alert(
          '',
          translate('screen.module.packed.detail.box_add'),
          [
            {
              text:translate('screen.module.packed.detail.box_add_yes'),
              onPress: () => this.addBoxB2BOrder(true),
            },
            {
              text : translate('screen.module.packed.detail.box_add_no'),
              onPress: () => this.addBoxB2BOrder(false),
            }
          ],
          {cancelable: false},
        );
    };

    _fetchDetailPacking = async  (packing_code) =>{
        this.setState({isloading : true,list_data:[]});
        const response = await getDetailPacked(packing_code,{is_put:1});
        if (response.status === 200){

            this.setState({
                list_tracking_outbound: response.data.results.orders,
                list_box :response.data.results.list_box
            });
            if (response.data.results.list_box.length === 0){
                await this.addBoxB2BOrder(true);
            }else{
                await this._confirmRemoveactionBox();
            }
        }else if (response.status === 403){
          await permissionDenied(this.props.navigation);
        };
        this.setState({isloading : false});
    };

    _onGetOrderInfo = async (code) => {
        let data = [];
        let list_label = [];
        this.setState({isloading : true});
        const response = await getDetailPacked(code,{is_put:1});
        if (response.status === 200){
          list_label = response.data.results.items[0].label;
          response.data.results.orders.forEach(element => {
            data.push({
                'fnsku_code' :element.product_bsin,
                'fnsku_name' :element.product_name,
                'quantity_pick' : element.total_pick,
                'sold' : element.total_items,
            })
          });

        }
        await this.setState({order_items : data,isloading:false,list_label : list_label});

        this._setopenModel(true);
    }

    _setopenModel = async (code) =>{
        this.setState({is_model : code})
    }

    _onSubmitEditingInput = async (code) => {
        if (code){
            await this.setState({fnsku_quantity_scan : code});
        }
    };

    _searchCameraBarcode = async (code) => {
        if (code){
            this._postOutBoundHandler(code);
        }
    };

    _searchCameraBoxScan = async (code) => {
        if (code){
            if (this.state.overpack_box_scan_box){
                this.commitItemToBox(code)
            }else{
                this.commitItemToBox(code)
                this._postBoxorder(code);
            }

        }
    };

    render() {
        const { navigation } = this.props;
        const { params } = this.props?.route;

        const {
            list_item_packed,
            isloading,
            tracking_code,
            tracking_code_done,
            is_boxscan,
            order_items,
            list_label,
            is_model,
            box_code_sugget,
            overpack_code
        } = this.state;
        return (
            <KeyboardAvoidingView
                style={{ height: '100%', width: '100%' }}
                behavior="height"
                keyboardVerticalOffset={0}>
                <View style={gStyle.container}>
                    <ModalHeader
                    left={<Feather color={colors.greyLight} name="chevron-down" />}
                    leftPress={() => navigation.goBack(null)}
                    text={params?.pickup_code}
                    />

                    {!is_boxscan ?<View style={[gStyle.flexRow,{marginBottom:15}]}>
                        <View style={{width:'30%'}}>
                            <TextInputComponent
                                navigation={navigation}
                                textLabel = {translate('screen.module.pickup.detail.quantity_out')}
                                inputValue = {'1'}
                                keyboardType={'numeric'}
                                autoChange = {true}
                                ediTable={true}
                                showSearch = {false}
                                showScan = {false}
                                onPressCamera = {this._onSubmitEditingInput}
                                onSubmitEditingInput = {this._onSubmitEditingInput}
                                textPlaceholder={''}>
                            </TextInputComponent>
                        </View>
                        <View style={{width:'70%'}}>
                            <TextInputComponent
                                navigation={navigation}
                                autoFocus={true}
                                showSearch = {false}
                                textLabel = {translate('screen.module.pickup.detail.fnsku_code')}
                                onPressCamera = {this._searchCameraBarcode}
                                onSubmitEditingInput = {this._searchCameraBarcode}
                                textPlaceholder={translate('screen.module.pickup.detail.fnsku_scan')}>
                            </TextInputComponent>
                        </View>
                    </View>:
                        <View style={[{marginBottom:15}]}>
                            <TextInputComponent
                                navigation={navigation}
                                autoFocus={true}
                                showSearch = {true}
                                textLabel = {translate('screen.module.packed.detail.box_label')}
                                onPressCamera = {this._searchCameraBoxScan}
                                onSubmitEditingInput = {this._searchCameraBoxScan}
                                textPlaceholder={translate('screen.module.packed.detail.box_scan')}>
                            </TextInputComponent>

                        </View>
                    }
                    {isloading && <View style={gStyle.p3}><ActivityIndicator/></View>}
                    {overpack_code && <View style={[gStyle.flexRowSpace,{marginHorizontal:15,
                            backgroundColor:colors.borderLight,
                            paddingHorizontal:10,
                            paddingVertical:15,
                            borderRadius:3
                    }]}>
                        <Text style={{
                                ...gStyle.textBoxme14,
                                color:colors.white
                        }}>{translate('screen.module.packed.detail.box_todo')}</Text>
                        <Text style={{
                                ...gStyle.textBoxmeBold12,
                                color:colors.boxmeBrand
                            }}>{overpack_code}</Text>
                    </View>}

                    {box_code_sugget && <TouchableOpacity
                        onPress={() => null}
                        style={[gStyle.flexRowSpace,{
                            backgroundColor:colors.borderLight,
                            marginBottom:3,
                            marginHorizontal:15,
                            paddingVertical:6
                        }]}>
                        <Text style={{
                        ...gStyle.textBoxme14,
                        color:colors.greyInactive,
                        paddingLeft:10
                        }}>{translate('screen.module.packed.detail.box_sugget')}</Text>
                        <Text style={{
                        ...gStyle.textBoxmeBold14,
                        color:colors.brandPrimary,
                        paddingRight:15
                        }}>{box_code_sugget}</Text>
                    </TouchableOpacity>}
                    {tracking_code_done && <TouchableOpacity
                        onPress={() => this._onGetOrderInfo(tracking_code_done)}
                        style={[gStyle.flexRowSpace,{
                            backgroundColor:colors.borderLight,
                            marginBottom:3,
                            marginHorizontal:15,
                            paddingVertical:8
                        }]}>
                        <Text style={{
                        ...gStyle.textBoxme14,
                        color:colors.boxmeBrand,
                        paddingLeft:15
                        }}>{translate('screen.module.packed.tracking_last')}</Text>
                        <Text style={{
                        ...gStyle.textBoxmeBold14,
                        color:colors.boxmeBrand,
                        paddingRight:15
                        }}>{tracking_code_done}</Text>
                    </TouchableOpacity>}
                    <View style={styles.containerScroll}>
                        <FlatList
                            data={list_item_packed}
                            keyExtractor={(item, index) => `${item[0]}` + index}
                            renderItem={({ item }) => (
                                <FNSKUItems
                                    navigation = {navigation}
                                    textLabelLeft = {translate('screen.module.pickup.detail.fnsku_code')}
                                    textLabelRight = {translate('screen.module.pickup.list.sold')}
                                    fnsku_info={{
                                        code: item.product_barcode.left > 0 ? item.product_barcode[0] : item.product_bsin,
                                        quantity_oubound: item.total_items,
                                        fnsku_name : item.product_name,
                                        pickup_box_id :15151991,
                                        quantity_pick:item.total_pick,
                                        is_pick :item.total_pick === item.total_items,
                                        total_product : 0,
                                        activebg : item.activebg ? item.activebg : colors.blackBg,
                                        expire_date : null,
                                        box_code : null
                                }}
                                disableRightSide={true}
                                />
                            )}
                            />
                    </View>
                    <View style={[gStyle.flexCenter,styles.containerBottom]}>
                            <TouchableOpacity style={[styles.bottomButton]}
                                onPress={() => this.setState({is_boxscan : true,overpack_box_scan_box:true})}>
                                <Text style={styles.textButton}>
                                {translate('screen.module.packed.detail.btn_box_scan')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    {is_model &&
                        <ModelOrderItems
                            listData = {order_items}
                            load_by = {false}
                            list_label = {list_label}
                            onClose = {this._setopenModel}
                        />
                    }
                </View>
            </KeyboardAvoidingView>
        );
    }
}

ModalUpdatePacked.propTypes = {
  // required
  navigation: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
  containerDetails: {
    marginBottom: 3
  },
  containerProduct: {
    flex:5,
    alignItems:'center',
    textAlign:'center'
  },
  sectionHeading: {
    ...gStyle.textBoxme14,
    color: colors.greyInactive,
  },
  textLabel:{
    color:colors.greyInactive,
    ...gStyle.textBoxme16,
  },
  searchPlaceholderText: {
    ...gStyle.textBoxme16,
    color: colors.blackBg
  },
  containerScroll: {
    paddingBottom: 220,
    marginHorizontal:15
  },
  containerBottom:{
    position: 'absolute',
    width:'100%',
    bottom: device.iPhoneNotch ? 10 : 0
    },
    bottomButton :{
        justifyContent: 'center',
        alignContent:'center',
        width:'90%',
        paddingVertical:15,
        borderRadius:6,
        backgroundColor:colors.darkgreen
    },
    textButton :{
        textAlign:'center',
        color:colors.white,
        ...gStyle.textBoxmeBold14,
    },
});
export default ModalUpdatePacked;
