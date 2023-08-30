import * as React from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    Alert,View,
    ActivityIndicator,
    FlatList,
    TouchableOpacity,
    Text} from 'react-native';
import { Feather} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, gStyle,device} from '../../constants';

// components
import ModalHeader from '../../components/ModalHeader';
import {permissionDenied} from '../../helpers/async-storage';
import ListCarrierName from '../../components/ListCarrierAtWarehouse';

//service api
import getListCarrier from '../../services/handover/courier';
import {translate} from "../../i18n/locales/IMLocalized";

class ModalListCarrier extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            list_carrier : [],
            carrier_name : null,
            logo_carrier:null,
            courier_id : null,
            warehouse_id:null,
            isLoading : false,
            handover_type : 2,
        };
    };

    componentDidMount = async () => {
        const { params } = this.props?.route;
        this.setState({
            handover_type: params?.handover_type,
        });
    };

    UNSAFE_componentWillMount = async () =>{
        let staff_info = await AsyncStorage.getItem('staff_profile');
        this.setState({warehouse_id:JSON.parse(staff_info).warehouse_id.warehouse_id});
        this._fetchListCarrierHandler();
    }

    _fetchListCarrierHandler = async () =>{
        this.setState({isLoading : true});
        const response = await getListCarrier({});
        if (response.status === 200){
            this.setState({list_carrier:response.data.results})
        }else if (response.status === 403){
          permissionDenied(this.props.navigation);
        }
        this.setState({isLoading : false});
    };

    _onSelectCarrier = async (carrier_name,logo_carrier,courier_id) =>{
        this.setState(
            {carrier_name : carrier_name,
            logo_carrier:logo_carrier,
            courier_id:courier_id
        })
    };

    _confirmCreated = async (code,order_type) =>{
        if (!this.state.carrier_name){
            Alert.alert(
                '',
                translate('screen.module.handover.alert_carrier_null'),
                [
                    {
                    text: translate('base.confirm'),
                    onPress: null,
                    },
                ],
                {cancelable: false},
            );
            return;
        }
        this.props.navigation.navigate('CreatedHandoverList',{
            carrier_name: this.state.carrier_name,
            carrier_logo : this.state.logo_carrier,
            handover_type : code,
            order_type : order_type,
            quantity_rollback : 0
        })
    }
    render() {
        const { navigation } = this.props;
        const {
            list_carrier,
            courier_id,
            isLoading,
            handover_type
        } = this.state;
        return (
            <View style={gStyle.containerModel}>
                <ModalHeader
                    right={<Feather color={colors.white} name="x" />}
                    rightPress={() => navigation.goBack(null)}
                    text={translate('screen.module.handover.select_carrier')}
                />
                <View style={styles.containerScroll}>
                    {isLoading ? <ActivityIndicator/>:
                        <FlatList
                            data={list_carrier}
                            keyExtractor={({ courier_id }) => courier_id.toString()}
                            renderItem={({ item }) => (
                                <ListCarrierName
                                    navigation = {navigation}
                                    logo_carrier={item.courier_logo}
                                    carrier_name={item.courier_name}
                                    courier_id = {item.courier_id}
                                    text_note1 = {'screen.module.handover.alert_carrier_null'}
                                    text_note2 = {'screen.module.handover.alert_carrier_null'}
                                    is_show_note = {false}
                                    is_select = {courier_id}
                                    onPress ={this._onSelectCarrier}
                                />
                            )}
                        />
                    }
                </View>
                {handover_type === 2 ? <View style={styles.containerBottom}>
                    <TouchableOpacity style={[styles.bottomButton,{backgroundColor:colors.boxmeBrand,width:'20%'}]}
                    onPress={() => this._confirmCreated(2,'b2b')}>
                        <Text style={styles.textButton} numberOfLines={1} ellipsizeMode="tail">
                        B2B
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.bottomButton,{width:'66%'}]}
                    onPress={() => this._confirmCreated(2,'b2c')}>
                        <Text style={styles.textButton} numberOfLines={1} ellipsizeMode="tail">
                        B2C
                        </Text>
                    </TouchableOpacity>
                </View>:
                    <View style={styles.containerBottom}>
                    <TouchableOpacity style={[styles.bottomButton,
                    {
                        width:'90%'}]}
                    onPress={() => this._confirmCreated(0,'rma')}>
                        <Text style={styles.textButton} numberOfLines={1} ellipsizeMode="tail">{translate('screen.module.handover.btn_rma_text')}</Text>
                    </TouchableOpacity>
                </View>
                }
            </View>
        );
    }
}

ModalListCarrier.propTypes = {
  // required
  navigation: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
    containerScroll: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom:device.iPhoneNotch ? 160 : 110,
    },
    containerBottom:{
        flexDirection : 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        width:'100%',
        bottom: device.iPhoneNotch ? 25 :0,
    },
    bottomButton :{
        width: '46%',
        marginHorizontal:2,
        paddingVertical:15,
        borderRadius:6,
        backgroundColor:colors.darkgreen
    },
    textButton :{
        textAlign:'center',
        paddingHorizontal:5,
        color:colors.white,
        ...gStyle.textBoxmeBold14,
    }

});
export default React.memo(ModalListCarrier);
