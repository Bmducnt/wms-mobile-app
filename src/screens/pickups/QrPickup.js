import * as React from 'react';
import * as Print from 'expo-print';
import PropTypes from 'prop-types';
import { 
    StyleSheet, 
    Text, 
    View,
    TouchableOpacity
} from 'react-native';
import { Feather} from '@expo/vector-icons';
import { 
    colors, 
    gStyle 
} from '../../constants';
import {PDF_QR_PICKUP} from '../../services/endpoints';

// components
import ModalHeader from '../../components/ModalHeader';
import QRCode from 'react-native-qrcode-svg';


class ModalPickupQRCode extends React.Component {

    constructor(props) {
        super(props);
    };
    
    _printQRCode = async (pickup_code,quantity) => {
        try {
          await Print.printAsync({
              uri : PDF_QR_PICKUP+pickup_code+'?quantity='+quantity
          });
        } catch (error) {
            return;
        }
    };

    render() {
        const { navigation } = this.props;
        const {t} = this.props.screenProps;
        return (
            <View style={[gStyle.container]}>
                <ModalHeader
                left={<Feather color={colors.greyLight} name="chevron-down" />}
                leftPress={() => navigation.goBack(null)}
                text={navigation.getParam('pickup_code')}
                />
                <View style={[styles.container,{backgroundColor:colors.white}]}>
                    <QRCode
                        value={navigation.getParam('pickup_code')}
                        size={330}
                    />
                </View>
                <View style={[styles.container]}>
                    <TouchableOpacity
                        onPress={() => this._printQRCode(navigation.getParam('pickup_code'),
                        navigation.getParam('quantity'))}
                    >
                        <Text style={styles.textbtn}>{t('screen.module.pickup.detail.qr_print')}</Text>
                    </TouchableOpacity>
                </View>
                
            </View>
        );
    }
}

ModalPickupQRCode.propTypes = {
  // required
  navigation: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginTop:'10%',
        padding: 16,
        marginLeft:15,
        marginRight : 15,
        borderRadius:6
    },
    textbtn: {
        ...gStyle.textBoxme20,
        color:colors.white,
    },
});
export default ModalPickupQRCode;
