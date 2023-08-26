import * as React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Switch,
  Alert
} from 'react-native';
import { 
    AntDesign,
  } from '@expo/vector-icons'; 
import { 
  colors, 
  gStyle ,
  device
} from '../../constants';
import addRulePickup from "../../services/pickup/add-rule";
import getListRulePickup from "../../services/pickup/list-rule";


const ByVasConfig = props => {

    const t = props.t;

    const [byVas, setbyVas] = React.useState(false);


    const toggleSwitch = () => setbyVas(previousState => !previousState);

    fetchConfig = async () => {
        const response = await getListRulePickup({key : 'by_vas'});
        if (response?.status === 200) {
            console.log(response?.data)
            setbyVas(response?.data?.results)
        }
    };

    addRuleVas= async () => {
        const response = await addRulePickup(JSON.stringify({
            rule_type: 'by_vas',
            is_vas: byVas
        }));
        if (response?.status === 200) {
            Alert.alert(
                '',
                t('screen.module.pickup_rule.add_ok'),
                [
                {
                    text: t("base.confirm"),
                    onPress: () => props.onClose(false),
                }
                ],
                {cancelable: false},
            );
        }
        
    };


    React.useEffect( () => {
        fetchConfig();
    }, []);


    return (
      <React.Fragment>
        <Modal
            animationType="fade"
            presentationStyle="formSheet"
            visible={props.visible}
        >
            <View style={[gStyle.container,{backgroundColor:'#f6f7f7'}]}>
                <View style={[gStyle.flexRowSpace,{
                    paddingVertical:15,
                    paddingHorizontal:15,
                }]}>

                    <Text >
                    {t('screen.module.pickup_rule.by_vas_title')}
                    </Text>
                    <TouchableOpacity 
                        onPress={() => props.onClose(false)}
                        style={gStyle.flexRowSpace}
                        activeOpacity={gStyle.activeOpacity}
                    >
                        <AntDesign name="closecircle" size={22} color={colors.greyInactive} />
                    </TouchableOpacity>
                    
                </View>
                <View >
                    <Text style={{paddingHorizontal:15,
                    paddingVertical:13,}}>{t('screen.module.pickup_rule.by_vas_title_sub')}</Text>
                </View>
                <View style={[gStyle.flexRowSpace,{
                    backgroundColor : colors.whiteBg,
                    paddingHorizontal:10,
                    paddingVertical:13,
                    marginHorizontal:15,
                    marginVertical:10
                }]}>
                    <Text>{t('screen.module.pickup_rule.by_vas_prioritize')}</Text>
                    <Switch
                        trackColor={{false: colors.cardLight, true: colors.brandPrimary}}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={byVas}
                    />
                </View>
                <View style={styles.containerBottom}>
                    <TouchableOpacity
                        style={[styles.bottomButton]}
                        onPress={() => addRuleVas()}
                    >
                        <Text style={styles.textButton}>
                            {t('screen.module.pickup_rule.btn_submit')}
                        </Text>
                    </TouchableOpacity>
                    </View>
            </View>
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

export default React.memo(ByVasConfig);
