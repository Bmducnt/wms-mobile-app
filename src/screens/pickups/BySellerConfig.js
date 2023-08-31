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
  } from '@expo/vector-icons';
import {
  colors,
  gStyle ,
  device
} from '../../constants';
import TextInputComponent from "../../components/TextInputComponent";
import addRulePickup from "../../services/pickup/add-rule";
import getListRulePickup from "../../services/pickup/list-rule";
import removeRulePickup from "../../services/pickup/remove_rule";
import SellerOptions from "./SellerOptions";
import {translate} from "../../i18n/locales/IMLocalized";


const BySellerConfig = props => {

    const [email, setEmail] = React.useState(null);
    const [listEmail, setlistEmail] = React.useState([]);
    const [filterConfig, setfilterConfig] = React.useState(false);

    const fetchListEmailConfig = async () => {
        const response = await getListRulePickup({key : 'by_email'});
        if (response?.status === 200) {
            console.log(response?.data?.results)
            setlistEmail(response?.data?.results)
        }
    };

    const removeEmailConfig = async (seller_email) => {
        const response = await removeRulePickup(JSON.stringify({seller_email : seller_email}));
    };

    const onLoadAfterSb = async() =>{
        fetchListEmailConfig();
        setfilterConfig(false);
    }

    const onClose = async ()=>{
        props.onClose(false);
        props.onReload();
    }

    const addRuleSeller = async (pick_by_order,combo_name,quantity) => {
        if(email){
            const response = await addRulePickup(JSON.stringify({
                rule_type: 'by_email',
                seller_email: email,
                is_pick_by_order : pick_by_order,
                combo_name : combo_name,
                quantity : quantity,
            }));
            if (response?.status === 200) {
                Alert.alert(
                    '',
                    translate('screen.module.pickup_rule.add_ok'),
                    [
                    {
                        text: t("base.confirm"),
                        onPress: () => onClose(),
                    }
                    ],
                    {cancelable: false},
                );
            }
        }
    };


    const handleRemoveItem = email => {
        removeEmailConfig(email.email);
        setlistEmail(listEmail.filter(item => item.email !== email.email))
    }


    React.useEffect( () => {
        fetchListEmailConfig();
      }, []);


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

                        <Text >
                            {translate('screen.module.pickup_rule.by_seller_title')}
                        </Text>
                        <TouchableOpacity
                            onPress={() => onClose()}
                            style={gStyle.flexRowSpace}
                            activeOpacity={gStyle.activeOpacity}
                        >
                            <AntDesign name="closecircle" size={22} color={colors.greyInactive} />
                        </TouchableOpacity>

                    </View>
                    <View >
                        <Text style={{paddingHorizontal:15,
                        paddingVertical:13,}}>{translate('screen.module.pickup_rule.by_seller_title_sub')}</Text>
                        <TextInputComponent
                            navigation={props.navigation}
                            labeView={true}
                            autoFocus={false}
                            showSearch={false}
                            showScan={false}
                            multiline={true}
                            numberOfLines={6}
                            heightInput={50}
                            autoChange={true}
                            onPressCamera={setEmail}
                            onSubmitEditingInput={setEmail}
                            textPlaceholder={translate('screen.module.pickup_rule.by_seller_email')}
                            textLabel={translate('screen.module.pickup_rule.by_seller_email_input')}
                        />
                    </View>

                    <View style={{marginTop:10}} >
                        <TouchableOpacity
                            disabled={!email}
                            style={[styles.bottomButton]}
                            onPress={() => setfilterConfig(true)}
                        >
                            <Text style={styles.textButton}>
                            {translate('screen.module.pickup_rule.btn_submit')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{
                        paddingHorizontal:10,
                        paddingVertical:13,
                        marginHorizontal:5,
                        marginVertical:5}}>
                        <Text>{translate('screen.module.pickup_rule.by_seller_list')}</Text>
                        <ScrollView
                            contentContainerStyle={{ paddingBottom: 100 }}>
                            <View style={{
                                backgroundColor : colors.whiteBg,
                                paddingHorizontal:10,
                                paddingVertical:13,
                                marginTop:5
                            }}>
                                {listEmail.length > 0  ?
                                    listEmail.map((track, index) => (
                                        <TouchableOpacity onPress={() => handleRemoveItem(track)} key={index} style={[gStyle.flexRowSpace,{
                                            padding: 12,
                                            backgroundColor:'#f6f7f7',
                                            margin:4,
                                            borderRadius:6,
                                        }]}>
                                            <View>
                                                <Text key={track} style={{paddingRight : 15}}>{track.email}</Text>

                                                {track?.combo_name && <Text>{translate('screen.module.pickup_rule.by_seller_combo_prioritize')} {track?.combo_name}</Text>}
                                                {/* {track?.quantity && <Text>{translate('screen.module.pickup_rule.by_seller_quantity_prioritize')} {track?.quantity}</Text>} */}
                                                {track?.pick_by_order && <View style={gStyle.flexRowCenterAlign}>
                                                    <Text style={{color:colors.boxmeBrand}}><AntDesign name="star" size={16} color={colors.boxmeBrand} /> {translate('screen.module.pickup_rule.by_seller_by_order')}</Text>
                                                </View>}
                                            </View>
                                            <AntDesign name="closecircle" size={16} color={colors.greyInactive} />
                                        </TouchableOpacity>

                                )):
                                        <View style={gStyle.flexCenter}>
                                            <Text style={{color:colors.greyInactive,paddingVertical:12}}>{translate('screen.module.pickup_rule.by_seller_empty')}</Text>
                                        </View>
                                }
                            </View>
                        </ScrollView>
                    </View>
                </View>
                {filterConfig && <SellerOptions onClose={onLoadAfterSb}  onSubmit= {addRuleSeller} emailLoad={email}/>}
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

export default React.memo(BySellerConfig);
