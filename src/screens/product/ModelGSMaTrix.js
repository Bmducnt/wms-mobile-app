import * as React from 'react';
import PropTypes from 'prop-types';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TouchableWithoutFeedback
} from 'react-native';
import moment from 'moment';
import { Feather} from '@expo/vector-icons';
import { withNavigation } from 'react-navigation';
import { colors, gStyle,images,device } from '../../constants';



const ModelGSMaTrix = props  => {
    const expirationPattern = /17(\d{6})/;
    const [gtin, setgtin] = React.useState(null);
    const [quantity, setquantity] = React.useState(1);
    const [expiration, setexpiration] = React.useState(null);


    React.useEffect( () => {
        let code = props.text.replace("]d2", "")
        if (code === null){
            return;
        }
        if (parseInt(code.slice(0, 2)) !== 91 || !code.includes('37117')) {
            return;
        }


        setgtin(gs1Data.split('37117')[0].slice(2));

        setexpiration(code.match(expirationPattern)[1]);
      }, []);



    return (
        <Modal
        animationType="slide"
        transparent={true}
        onRequestClose={() => props.onClose(false)}
        visible={props.isVisible}
        >
        <TouchableWithoutFeedback
                >
                <View style={{
                    flex: 1, 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    position:'absolute',
                    bottom:0
                }}>
                    <View style={{
                        height: device.iPhoneNotch ? 250 :Dimensions.get("window").height/2-80,
                        width: Dimensions.get("window").width ,
                        borderTopLeftRadius:3,
                        borderTopRightRadius:3,
                        backgroundColor:colors.whiteBg
                    }}>
                        <View style={[gStyle.flexRowSpace,{
                            paddingVertical:13,
                            paddingHorizontal:10,
                            borderBottomColor:'#f0f1f6',
                            borderBottomWidth:1
                        }]}>
                            <Text>{props.trans("screen.module.product.detail.gs1_scan")}</Text>
                            <TouchableOpacity 
                                onPress={() => props.onClose(false)}
                                style={gStyle.flexCenter}
                                activeOpacity={gStyle.activeOpacity}
                            >
                                <Feather color={colors.black70} name='chevron-down' size={20}/>
                                
                            </TouchableOpacity>
                        
                        </View>
                        <View style={[{
                            backgroundColor:colors.transparent,
                            marginHorizontal:10,
                            borderRadius:3,
                            paddingVertical:5,
                            }]}>
                                <View style={[gStyle.flexRowSpace,{marginVertical:4}]}>
                                    <Text>GTIN</Text>
                                    <Text>{gtin}</Text>
                                </View>
                                <View style={[gStyle.flexRowSpace,{marginVertical:4}]}>
                                    <Text>Quantity</Text>
                                    <Text>{quantity}</Text>
                                </View>
                                <View style={[gStyle.flexRowSpace,{marginVertical:4}]}>
                                    <Text>Expiration date</Text>
                                    {expiration && <Text>{moment(expiration, 'YYMMDD').format('MMMM DD, YYYY')}</Text>}
                                </View>
                                
                        </View>
                        <TouchableOpacity 
                                    style={[styles.bottomButton]} 
                                        onPress={() => props.onSubmit(gtin)}>
                                        <Text style={styles.textButton}>
                                            {props.trans("screen.module.product.detail.btn_detail")} 
                                        </Text>
                        </TouchableOpacity>
                    </View>
                </View>
        </TouchableWithoutFeedback>
        </Modal>
    )
};

ModelGSMaTrix.propTypes = {
  // required
  text: PropTypes.string.isRequired
};

const styles = StyleSheet.create({
  
    bottomButton: {
        justifyContent: "center",
        alignContent: "center",
        width: "96%",
        paddingVertical: 13,
        borderRadius: 6,
        position:"absolute",
        bottom:10,
        marginHorizontal:10,
        backgroundColor: colors.boxmeBrand,
    },
    textButton: {
        textAlign: "center",
        color: colors.white,
        ...gStyle.textBoxme18,
    },
});

export default withNavigation(ModelGSMaTrix);