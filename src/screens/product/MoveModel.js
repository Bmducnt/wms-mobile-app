import * as React from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text} from 'react-native';
import { Feather} from '@expo/vector-icons';
import { colors, gStyle} from '../../constants';

// components
import ModalHeader from '../../components/ModalHeader';
import {translate} from "../../i18n/locales/IMLocalized";
class MoveModel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    };

    UNSAFE_componentWillMount = async () =>{
    }


    render() {
        const { navigation } = this.props;
        const {
        } = this.state;
        return (
            <View style={[gStyle.containerModel]}>
                <ModalHeader
                    right={<Feather color={colors.white} name="x"/>}
                    rightPress={() => navigation.goBack(null)}
                    text={translate('screen.module.product.move.text_header')}
                />
                <View style={{
                    marginTop:'5%',
                    marginHorizontal:10
                }}>
                    <Text style={{
                            ...gStyle.textBoxme14,
                            color:colors.white,
                            paddingBottom:5
                        }}>
                            {translate('screen.module.product.move.move_1_fnsku')}
                        </Text>
                    <View style={{
                        backgroundColor:'#282a2c',
                        padding:15,
                        borderTopLeftRadius:8
                    }}>

                        <Text style={{
                            color:colors.white,
                            paddingTop:3
                        }}>

                            {translate('screen.module.product.move.move_1_fnsku_2')}
                        </Text>
                        <Text style={{
                            color:colors.white,
                            paddingTop:3
                        }}>

                            {translate('screen.module.product.move.move_1_fnsku_3')}
                        </Text>
                    </View>
                    <Text style={{
                            ...gStyle.textBoxme14,
                            color:colors.white,
                            paddingTop:5
                        }}>
                            {translate('screen.module.product.move.move_n_fnsku')}
                        </Text>
                    <View style={{
                        backgroundColor:'#282a2c',
                        padding:15,
                        marginTop:10,
                        borderBottomLeftRadius:15
                    }}>

                        <Text style={{
                            color:colors.white,
                            paddingTop:3
                        }}>

                            {translate('screen.module.product.move.move_n_fnsku_1')}
                        </Text>
                        <Text style={{
                            color:colors.white,
                            paddingTop:3
                        }}>

                            {translate('screen.module.product.move.move_n_fnsku_2')}
                        </Text>
                        <Text style={{
                            color:colors.white,
                            paddingTop:3
                        }}>
                            {translate('screen.module.product.move.move_1_fnsku_3')}
                        </Text>
                    </View>
                </View>
                <View style={styles.containerBottom}>
                    <TouchableOpacity
                        activeOpacity={gStyle.activeOpacity}
                        hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
                        onPress={() => navigation.navigate("MoveProducts",{})}
                        style={{
                            borderColor:colors.boxmeBrand,
                            backgroundColor:colors.boxmeBrand,
                            borderWidth:1,
                            height:55,
                            marginHorizontal:15,
                            borderRadius:6,
                            justifyContent:'center',
                            flexDirection:'row',
                            alignItems:'center'
                    }}>
                        <Feather color={colors.white} name="plus" size={16} />
                        <Text style={{...gStyle.textBoxmeBold16,color:colors.white,paddingLeft:10}}>
                            {translate('screen.module.product.move.btn_1_fnsku')}
                        </Text>
                    </TouchableOpacity>
                    <View style={[gStyle.flexCenter]}>
                        <View style={{
                        marginVertical:8
                        }}>
                            <Text style={{
                            ...gStyle.textBoxme18,
                            color:colors.white
                            }}>
                            {translate('screen.module.product.move.text_or')}
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        activeOpacity={gStyle.activeOpacity}
                        onPress={() => navigation.navigate("MoveListProduct",{})}
                        style={{
                            borderColor:colors.boxmeBrand,
                            borderWidth:1,
                            borderStyle: 'dashed',
                            height:55,
                            marginHorizontal:15,
                            justifyContent:'center',
                            flexDirection:'row',
                            alignItems:'center'
                    }}>
                        <Feather color={colors.boxmeBrand} name="plus" size={16} />
                        <Text style={{...gStyle.textBoxmeBold16,color:colors.boxmeBrand,paddingLeft:10}}>
                            {translate('screen.module.product.move.btn_n_fnsku')}
                        </Text>
                        <TouchableOpacity
                        style={{
                            backgroundColor:'#fd0d37',
                            paddingHorizontal:8,
                            paddingVertical:5,
                            borderRadius:3,
                            position:'absolute',
                            top:-10,
                            right:5
                        }}
                        >
                        <Text
                            style={{
                            color:colors.white
                            }}
                        >New</Text>
                        </TouchableOpacity>

                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

MoveModel.propTypes = {
  // required
  navigation: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
    containerBottom:{
        marginTop:12
    },
    bottomButton :{
        justifyContent: 'center',
        alignContent:'center',
        width:'92%',
        paddingVertical:13,
        marginHorizontal:15,
        borderRadius:6,
        backgroundColor:colors.boxmeBrand
    },
    textButton :{
        textAlign:'center',
        color:colors.white,
        ...gStyle.textBoxme16,
    },
    labelOption :{
        backgroundColor:colors.borderLight,
        padding: 6,
        marginHorizontal:3,
        borderColor:colors.borderLight,
        borderWidth: 1,
        borderRadius: 6
    },
    labelOptionText:{
        ...gStyle.textBoxme14,
        color:colors.white
    }

});
export default MoveModel;
