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
import {translate} from "../../i18n/locales/IMLocalized";


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
        }
    };

    render() {
        const { navigation } = this.props;
        const { params } = this.props?.route;

        return (
            <View style={[gStyle.container]}>
                <ModalHeader
                left={<Feather color={colors.greyLight} name="chevron-down" />}
                leftPress={() => navigation.goBack(null)}
                text={params?.pickup_code}
                />
                <View style={[styles.container,{backgroundColor:colors.white}]}>
                    <QRCode
                        value={params?.pickup_code}
                        size={330}
                    />
                </View>
                <View style={[styles.container]}>
                    <TouchableOpacity
                        onPress={() => this._printQRCode(params?.pickup_code,
                        params?.quantity)}
                    >
                        <Text style={styles.textbtn}>{translate('screen.module.pickup.detail.qr_print')}</Text>
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
