import * as React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Switch,
  Alert,
  KeyboardAvoidingView,
  ScrollView
} from 'react-native';
import {
    AntDesign,
    Entypo
  } from '@expo/vector-icons';
import {
  colors,
  gStyle ,
  device
} from '../../constants';
import getOrderSeller from "../../services/pickup/order-report";
import ItemList from "./ItemList";
import {translate} from "../../i18n/locales/IMLocalized";


const SellerOptions = props => {

    const [listCombo, setlistCombo] = React.useState([]);
    const [listQuantity, setlistQuantity] = React.useState([]);
    const [pickByOrder, setpickByOrder] = React.useState(false);
    const [openQuantity, setopenQuantity] = React.useState(false);
    const [openCombo, setopenCombo] = React.useState(false);

    const [comboSelect, setcomboSelect] = React.useState(null);
    const [quantitySelect, setquantitySelect] = React.useState(null);

    const onSubmitCombo = async (value) => {
        setcomboSelect(value);
        setopenCombo(false);
    }

    const onSubmitComboQuantity = async (value) => {
        setquantitySelect(value);
        setopenQuantity(false);
    }

    const toggleSwitch = () => setpickByOrder(previousState => !previousState);


    const fetchListOrderByEmail = async (email) => {
        const response = await getOrderSeller(email);
        if (response?.status === 200) {
            setlistCombo(response?.data?.results?.list_combos);
            setlistQuantity(response?.data?.results?.list_quantity);
        }
    };

    React.useEffect( () => {
        fetchListOrderByEmail(props.emailLoad).then(r => {});
      }, []);


    const onClose = async ()=>{
        props.onClose(false);
    }


    return (
      <React.Fragment>
        <Modal
            animationType="fade"
            presentationStyle="formSheet"
            visible={props.visible}
        >
            <KeyboardAvoidingView
                style={{ height: '100%', width: '100%' }}
                behavior="padding"
                keyboardVerticalOffset={0}>
                <View style={[gStyle.container,{backgroundColor:'#f6f7f7'}]}>
                    <View style={[gStyle.flexRowSpace,{
                        paddingVertical:15,
                        paddingHorizontal:15,
                    }]}>

                        <TouchableOpacity
                            onPress={() => onClose()}
                            style={gStyle.flexRowSpace}
                            activeOpacity={gStyle.activeOpacity}
                        >
                            <Text style={{...gStyle.textBoxme16}}>
                                {translate('screen.module.pickup_rule.by_seller_btn_back')}
                            </Text>
                        </TouchableOpacity>

                        <Text style={{...gStyle.textBoxmeBold16,color:colors.black70}}>
                            {translate('screen.module.pickup_rule.by_seller_filter_header')}
                        </Text>

                        <TouchableOpacity  onPress={() => props.onSubmit(pickByOrder,comboSelect,quantitySelect)} >

                            <Text style={{...gStyle.textBoxme16}}>
                                {translate('screen.module.pickup_rule.by_seller_btn_cf')}
                            </Text>
                        </TouchableOpacity>

                    </View>
                    <View style={{
                        paddingHorizontal:10,
                        paddingVertical:13,
                        marginHorizontal:5,
                        marginVertical:5}}>
                        <Text>{translate('screen.module.pickup_rule.by_seller_prioritize')}</Text>

                        <View style={[gStyle.flexRowSpace,{
                            backgroundColor : colors.whiteBg,
                            paddingHorizontal:10,
                            paddingVertical:13,
                            marginVertical:10,
                            borderRadius:3
                        }]}>
                            <Text style={{...gStyle.textBoxmeBold14}}>{translate('screen.module.pickup_rule.by_seller_by_order')}</Text>
                            <Switch
                                trackColor={{false: colors.cardLight, true: colors.brandPrimary}}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={toggleSwitch}
                                value={pickByOrder}
                            />

                        </View>

                        <TouchableOpacity onPress={() => setopenQuantity(!openQuantity)} style={[gStyle.flexRowSpace,{
                            backgroundColor : colors.whiteBg,
                            paddingHorizontal:10,
                            paddingVertical:13,
                            borderRadius:3

                        }]}>
                            <View>
                                <Text style={{...gStyle.textBoxmeBold14}}>{translate('screen.module.pickup_rule.by_seller_prioritize_qt')}</Text>
                                <TouchableOpacity style={gStyle.flexRowCenterAlign} onPress={() => setquantitySelect(null)}>
                                    <Text style={{color:colors.black50}}>{translate('screen.module.pickup_rule.by_seller_quantity_prioritize')} {quantitySelect} </Text>
                                    {quantitySelect &&  <AntDesign name="closecircle" size={14} color={colors.greyInactive} />}
                                </TouchableOpacity>
                            </View>
                            <View style={gStyle.flexRow}>
                                <Text>{listQuantity.length} </Text>
                                <Entypo name={!openQuantity ? "chevron-thin-down" : "chevron-thin-up"} size={16} color={colors.black50} />
                            </View>

                        </TouchableOpacity>
                        {openQuantity && <View><ItemList data={listQuantity} isCombo = {false} onSubmit = {onSubmitComboQuantity} /></View>}
                        <TouchableOpacity onPress={() => setopenCombo(!openCombo)} style={[gStyle.flexRowSpace,{
                            backgroundColor : colors.whiteBg,
                            paddingHorizontal:10,
                            paddingVertical:13,
                            marginTop:10,
                            borderRadius:3
                        }]}>
                            <View>
                                <Text style={{...gStyle.textBoxmeBold14}}>{translate('screen.module.pickup_rule.by_seller_prioritize_cb')}</Text>
                                <TouchableOpacity style={gStyle.flexRowCenterAlign} onPress={() => setcomboSelect(null)}>
                                    <Text style={{color:colors.black50}}>{translate('screen.module.pickup_rule.by_seller_combo_prioritize')} {comboSelect} </Text>
                                    {comboSelect &&  <AntDesign name="closecircle" size={14} color={colors.greyInactive} />}
                                </TouchableOpacity>
                            </View>
                            <View style={gStyle.flexRow}>
                                <Text>{listCombo.length} </Text>
                                <Entypo name={!openCombo ? "chevron-thin-down" : "chevron-thin-up"} size={16} color={colors.black50} />
                            </View>
                        </TouchableOpacity>
                        {openCombo && <View><ItemList data={listCombo} isCombo = {true} onSubmit = {onSubmitCombo} /></View>}
                    </View>
                </View>

            </KeyboardAvoidingView>
        </Modal>

      </React.Fragment>
    );
  }

const styles = StyleSheet.create({
    containerBottom: {
        position: "absolute",
        width: "100%",
        backgroundColor: '#f6f7f7',
        bottom: device.iPhoneNotch ? 10 : 0,
    },
    bottomButton: {
        justifyContent: "center",
        alignContent: "center",
        width: "92%",
        paddingVertical: 15,
        marginHorizontal: 15,
        borderRadius: 6,
        backgroundColor: colors.boxmeBrand,
    },
    textButton: {
        textAlign: "center",
        color: colors.white,
        ...gStyle.textBoxme16,
    },
});

export default React.memo(SellerOptions);
