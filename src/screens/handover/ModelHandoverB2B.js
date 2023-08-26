import * as React from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    Alert,View,
    ActivityIndicator,
    FlatList,
    Image,
    TouchableOpacity,
    Text} from 'react-native';
import * as Print from "expo-print";
import { Feather,AntDesign} from '@expo/vector-icons';
import { colors, gStyle,device,images} from '../../constants';
import TextInputComponent from "../../components/TextInputComponent"
import Badge from "../../components/Badge";
// components
import ModalHeader from '../../components/ModalHeader';
import {_getTimeDefaultFrom,_getTimeDefaultTo} from '../../helpers/device-height';
import {
	handleSoundScaner,
	permissionDenied,
	handleSoundOkScaner,
} from "../../helpers/async-storage"
//service api
import getListBoxB2BHandover from '../../services/handover/b2b-get';
import confirmBoxB2BHandover from '../../services/handover/b2b-put';

class ModelHandoverB2B extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            is_loading : false,
            box_code_scan : null,
            tracking_code : null,
            total_box : 0,
            total_box_done : 0,
            list_box_awaiting_confirm : [],
            is_awaiting_invocie : false,
            list_document : [],
            total_invoice_copy : 0,
        };
    };

    componentDidMount() {
        const {navigation} = this.props
		this.setState({
			tracking_code: navigation.getParam("tracking_code")
		})
		
	}

    UNSAFE_componentWillMount = async () =>{
        const {navigation} = this.props
        this.fetchOrderB2B(navigation.getParam("tracking_code"));
    }

    fetchOrderB2B = async (tracking_code) => {
		this.setState({is_loading: true});
        const { t } = this.props.screenProps;
        const response = await getListBoxB2BHandover({
            'tracking_code' : tracking_code
        });
		if (response.status === 200) {
			handleSoundOkScaner();
            if(response.data?.is_waiting_invoice === true){
                if (response.data?.success === false){
                    Alert.alert(
                        '',
                        t("screen.module.handover.b2b_document_submit_error"),
                        [
                          {
                            text: t("base.confirm"),
                            onPress: () => this.props.navigation.goBack(null),
                          }
                        ],
                        {cancelable: false},
                        );
                }else{
                    this.setState({
                        list_document :response.data?.results,
                        total_invoice_copy : response.data?.total_copy,
                        is_awaiting_invocie : true,
                        is_loading: false,
                    })
                }
                
            }else{
                this.setState({
                    total_box_done: response.data.total_box_done,
                    total_box: response.data.total_box,
                    list_box_awaiting_confirm: response.data.results,
                    tracking_code :response.data.tracking_code,
                    is_loading: false,
                })
            }
			
			
		} else if (response.status === 403) {
			permissionDenied(this.props.navigation)
		} else {
			handleSoundScaner();
		}
		this.setState({is_loading: false})
	};

    onSubmit = async () =>{
        this.props.navigation.goBack(null);
    }


    submitOrderB2B = async (code,is_submit_invoice) => {
		this.setState({is_loading: true});
        const { t } = this.props.screenProps;

		const response = await confirmBoxB2BHandover({
			tracking_code: this.state.tracking_code,
			box_code: code,
            is_submit_invoice : is_submit_invoice
		})
		if (response.status === 200) {
			handleSoundOkScaner();
            if(response.data?.is_submit_invoice === true){
                Alert.alert(
                    '',
                    t("screen.module.handover.b2b_document_submit_ok"),
                    [
                      {
                        text: t("base.confirm"),
                        onPress: () => this.props.navigation.goBack(null),
                      }
                    ],
                    {cancelable: false}
                );
            }else{
                this.setState({
                    total_box_done: response.data.total_box_done,
                    total_box: response.data.total_box,
                    list_box_awaiting_confirm: response.data.results,
                    is_loading: false,
                })
            }
			
			
		} else if (response.status === 403) {
			permissionDenied(this.props.navigation)
		} else {
			handleSoundScaner();
			this.setState({box_code_scan: null})
		}
		this.setState({is_loading: false,})
	}

    onSubmitEditingInput = async (code) => {
		if (code) {
			await this.submitOrderB2B(code,0)
		}
	}

    _printPdf = async (path) => {
        try {
          await Print.printAsync({
            uri: encodeURI(path),
          });
        } catch (error) {
          console.log("error:", error);
        }
    };

    render_box_scan = (
        t,
        is_loading,
        box_code_scan,
        list_box_awaiting_confirm,
        total_box_done,
        total_box,
        navigation) => {
        return (
            <React.Fragment>
                <View style={[gStyle.flexCenter,{marginTop:20,marginHorizontal:10}]}>
                    <View style={{
                        paddingHorizontal:13,
                        paddingVertical:6,
                        borderRadius:50,
                        borderWidth:3,
                        borderColor:colors.cardLight,
                        backgroundColor:colors.borderLight,
                        alignItems: 'center',
                        flexDirection: 'row',
                        justifyContent: 'center'
                    }}>
                        <Text style={{
                            ...gStyle.textBoxmeBold30,
                            color:colors.boxmeBrand
                        }}>{total_box_done}</Text>
                        <Text style={{
                            ...gStyle.textBoxmeBold30,
                            color:colors.white
                        }}>/{total_box}</Text>
                    </View>

                    <Text style={{
                            ...gStyle.textBoxme14,
                            paddingTop:5,
                            color:colors.white
                    }}>{t("screen.module.handover.b2b_box_de")}</Text>
                </View>
                <View >
                    <TextInputComponent
                        navigation={navigation}
                        textLabel={t("screen.module.handover.b2b_box_label")}
                        inputValue={box_code_scan}
                        autoFocus={true}
                        is_close={false}
                        onPressCamera={this.onSubmitEditingInput}
                        onSubmitEditingInput={this.onSubmitEditingInput}
                        textPlaceholder={t("screen.module.handover.b2b_box_input")}
                    />
				</View>
                <View style={[styles.container]}>
                    <View style={gStyle.flexRowSpace}>
                        <Text style={{
                            ...gStyle.textBoxme14,
                            color:colors.white,
                            paddingBottom:5
                        }}>
                            {t("screen.module.handover.b2b_box_awaiting")}
                        </Text>
                        <Text style={{
                            ...gStyle.textBoxme14,
                            color:colors.white
                        }}>{total_box}</Text>
                    </View>
                    {is_loading ? <ActivityIndicator/>:
                        <FlatList
                            data={list_box_awaiting_confirm}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={({ overpack_code }) => overpack_code.toString()}
                            contentContainerStyle={{ paddingBottom: 500 }}
                            renderItem={({ item }) => (
                                <View style={{
                                    paddingHorizontal: 10,
                                    paddingVertical:12,
                                    marginVertical: 0.5,
                                    width:'100%',
                                    backgroundColor:colors.borderLight
                                }}>

                                    <View style={gStyle.flexRowSpace}>
                                        <View >
                                            
                                            <Text style={{
                                                color:colors.white,
                                                ...gStyle.textBoxme14
                                            }}><AntDesign name="dropbox" size={14} color={colors.white} /> {}{item.overpack_code}</Text>
                                            <Text
                                            style={{
                                                color:colors.white,
                                                ...gStyle.textBoxme14
                                            }}>{t("screen.module.handover.b2b_box_qt")} {item.overpack_quantity}</Text>
                                        </View>
                                        <Badge
                                            name={`${t("screen.module.handover.b2b_box_status")}`}
                                            style={{
                                                backgroundColor: colors.cardLight,
                                                color: colors.boxmeBrand,
                                                borderRadius: 20,
                                            }}
                                        />
                                    </View>
                                </View>
                            )}
                        />
                    }
                </View>
                <View style={styles.containerBottom}>
                    <TouchableOpacity style={[styles.bottomButton,
                        {
                            width:'90%',
                            backgroundColor: list_box_awaiting_confirm.length > 0 ? colors.greyInactive : colors.darkgreen
                        }]}
                        disabled={list_box_awaiting_confirm.length > 0}
                        onPress={() => this.onSubmit()}>
                        <Text style={styles.textButton} numberOfLines={1} ellipsizeMode="tail">
                        {t("screen.module.handover.b2b_btn_submit")}
                        </Text>
                    </TouchableOpacity>
                </View>
            </React.Fragment>
        )
    }

    render_document_print = (t,list_document,total_invoice_copy) =>{
        return (
            <React.Fragment>
                <View style={[gStyle.flexCenter,{marginTop:20,marginHorizontal:10}]}>
                    <View style={[gStyle.flexRowSpace,{
                        paddingHorizontal:13,
                        paddingVertical:13,
                        borderRadius:6,
                        borderWidth:3,
                        width:'100%',
                        borderColor:colors.cardLight,
                        backgroundColor:colors.boxmeBrand,
                    }]}>
                        <View>
                            <Text style={{
                                ...gStyle.textBoxme16,
                                paddingTop:5,
                                color:colors.black
                            }}>{t("screen.module.handover.b2b_document_attach")}</Text>
                                <Text style={{
                                ...gStyle.textBoxme12,
                                color:colors.black40
                            }}>{t("screen.module.handover.b2b_document_attach_sub")}</Text>
                        </View>
                        <Text style={{
                            ...gStyle.textBoxmeBold26,
                            color:colors.black
                        }}>{total_invoice_copy}</Text>
                    </View>
                </View>


                <View style={[styles.container]}>
                    <View >
                        <Text style={{
                            ...gStyle.textBoxme16,
                            color:colors.white,
                            paddingBottom:5
                        }}>
                            {t("screen.module.handover.b2b_document_list")}
                        </Text>
                        <Text style={{
                            ...gStyle.textBoxme12,
                            color:colors.greyInactive,
                            paddingBottom:10
                        }}>
                            {t("screen.module.handover.b2b_document_alert")}
                        </Text>
                    </View>
                    <FlatList
                        data={list_document}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item, index) => `${item.document_name} + ${index}`}
                        contentContainerStyle={{ paddingBottom: 500 }}
                        renderItem={({ item }) => (
                            <View  key={item.document_name} style={[gStyle.flexRowSpace,{
                                paddingHorizontal: 10,
                                paddingVertical:5,
                                marginVertical:1,
                                width:'100%',
                                borderRadius:2,
                                backgroundColor:colors.whiteBg
                            }]}>

                                <View style={gStyle.flexRow}>
                                    <View style={{}}>
                                        <Image source={images['pdf_file']} style={styles.image} />
                                    </View>
                                    <View style={{marginLeft:5}}>
                                            <Text style={{
                                                ...gStyle.textBoxme16,
                                                paddingTop:5,
                                                color:colors.black
                                            }}>{item.document_name}</Text>
                                            <Text style={{
                                                ...gStyle.textBoxme16,
                                                paddingTop:5,
                                                color:colors.black50
                                            }}>{t("screen.module.handover.b2b_document_quantity")} {item.quantity}</Text>
                                    </View>
                                </View>
                                <View >
                                    <TouchableOpacity
                                        style={[gStyle.flexCenter,{
                                            width:35,
                                            height:35,
                                            borderRadius:35/2,
                                            backgroundColor:colors.cardLight,
                                        }]}
                                        onPress={() => this._printPdf(item.url)}>
                                            <Feather color={colors.white} name='printer' size={16}/>
                                    </TouchableOpacity>
                                    
                                </View>
                            </View>
                        )}
                    />
                </View>
                <View style={styles.containerBottom}>
                    <TouchableOpacity style={[styles.bottomButton,
                        {
                            width:'90%',
                            backgroundColor: colors.darkgreen
                        }]}
                        onPress={() => this.submitOrderB2B(this.state.tracking_code,1)}>
                        <Text style={styles.textButton} numberOfLines={1} ellipsizeMode="tail">
                            {t("screen.module.handover.b2b_btn_submit_printer")}
                        </Text>
                    </TouchableOpacity>
                </View>
            </React.Fragment>
        )
    }
    render() {
        const { navigation } = this.props;
        const {
            is_loading,
            box_code_scan,
            list_box_awaiting_confirm,
            total_box_done,
            total_box,
            list_document,
            total_invoice_copy,
            is_awaiting_invocie
        } = this.state;
        const { t } = this.props.screenProps;
        return (
            <View style={gStyle.containerModel}>
                <ModalHeader
                    right={<Feather color={colors.white} name="x" />}
                    rightPress={() => navigation.goBack(null)}
                    text={t("screen.module.handover.b2b_header")}
                />
                {is_awaiting_invocie ? this.render_document_print(t,list_document,total_invoice_copy) : this.render_box_scan(
                    t,
                    is_loading,
                    box_code_scan,
                    list_box_awaiting_confirm,
                    total_box_done,
                    total_box,
                    navigation
                )}
            </View>
        );
    }
}

ModelHandoverB2B.propTypes = {
  // required
  navigation: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
    container: {
        marginTop: 10, marginHorizontal: 13
    },
    image: {
        height: 45,
        marginBottom: 5,
        width: 45,
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
        marginHorizontal:3,
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
export default React.memo(ModelHandoverB2B);
