import * as React from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    FlatList,
    KeyboardAvoidingView,
} from 'react-native';
import { Feather,FontAwesome5} from '@expo/vector-icons';
import { colors, gStyle } from '../../constants';

// components
import ModalHeader from '../../components/ModalHeader';
import TextInputComponent from '../../components/TextInputComponent';
import {handleSoundScaner,permissionDenied,handleSoundOkScaner} from '../../helpers/async-storage';

//service api

import getDetailTaskBox from '../../services/tasks/material-detail';
import addMaterialTask from '../../services/tasks/material-update';
import {translate} from "../../i18n/locales/IMLocalized";


class UpdateTasks extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            task_id : null,
            quantity_commit : '1',
            location_code : null,
            material_code : null,
            isloading : false,
            list_material_code : []
        };
    };


    UNSAFE_componentWillMount = async () =>{
        const { params } = this.props?.route;
        this.setState({
            task_id: params?.task_code
        });
        await this.findListBoxService(params?.task_code)

    };

    findListBoxService = async (task_id) => {
        const response = await getDetailTaskBox(task_id);
        if (response.status === 200) {
            this.setState({list_material_code : response.data.results})
        }
    }

    onUpdateQuantity = async (code_scan) => {
        this.setState({ isloading: true });
        const response = await addMaterialTask(this.state.task_id, JSON.stringify({
            quantity_commit: this.state.quantity_commit,
            location_code: this.state.location_code,
            material_code: code_scan
        }));
        if (response.status === 200) {
            handleSoundOkScaner();
            const index = this.state.list_material_code.findIndex(item => (item.material_code=== response.data.results.bsin));
            if (index !== -1) {
                const item = this.state.list_material_code[index];
                item.quantity_commit = response.data.results.quantity_commit;
                item.activebg = colors.boxmeBrand;
            }
        } else if (response.status === 403) {
            await permissionDenied(this.props.navigation);
        } else {
            await handleSoundScaner();
        }
        this.setState({ isloading: false });
    };



    _searchCameraBarcode = async (code) => {
        if (code){
            this.onUpdateQuantity(code);
        }
    };

    _onSubmitEditingInput = async (code) => {
        if (code){
            await this.setState({quantity_commit : code});
        }
    };

    _onSubmitEditingInputBin = async (code) => {
        if (code){
            await this.setState({location_code : code});
        }
    };


    render() {
        const { navigation } = this.props;
        const {
            isloading,
            list_material_code,
            location_code
        } = this.state;
        return (
            <KeyboardAvoidingView
                style={{ height: '100%', width: '100%' }}
                behavior="height"
                keyboardVerticalOffset={0}>
                <View style={gStyle.container}>
                    <ModalHeader
                        left={<Feather color={colors.greyLight} name="chevron-down" />}
                        leftPress={() => this.props.navigation.goBack(null)}
                        text={translate('screen.module.taks.detail.text_update')}
                    />
                    {location_code ? <View style={gStyle.flexRow}>
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
                                textPlaceholder={''}/>
                        </View>
                        <View style={{width:'70%'}}>
                            <TextInputComponent
                                navigation={navigation}
                                autoFocus={true}
                                showSearch = {false}
                                textLabel = {translate('screen.module.pickup.detail.fnsku_code')}
                                onPressCamera = {this._searchCameraBarcode}
                                onSubmitEditingInput = {this._searchCameraBarcode}
                                textPlaceholder={translate('screen.module.pickup.detail.fnsku_scan')}/>
                        </View>
                    </View>:
                    <View style={{width:'100%'}}>
                        <TextInputComponent
                            navigation={navigation}
                            autoFocus={true}
                            showSearch = {true}
                            textLabel = {translate('screen.module.pickup.detail.bin_scan')}
                            onPressCamera = {this._onSubmitEditingInputBin}
                            onSubmitEditingInput = {this._onSubmitEditingInputBin}
                            textPlaceholder={translate('screen.module.pickup.detail.bin_scan')}/>

                    </View>
                    }
                    {isloading && <View style={gStyle.p3}><ActivityIndicator/></View>}
                    <Text style={styles.sectionHeading}>{translate('screen.module.pickup.detail.fnsku_list')}</Text>
                    <View style={styles.containerScroll}>
                        <FlatList
                            data={list_material_code}
                            keyExtractor={(item, index) => `${item[0]}` + index}
                            renderItem={({ item }) => (
                                <View key = {item.material_code} style={[gStyle.flexRowSpace,{marginHorizontal:15,marginVertical:1,
                                    paddingVertical:16,paddingHorizontal:10,borderRadius:2,
                                backgroundColor:item?.activebg ? item.activebg : colors.borderLight}]}>
                                    <View style={gStyle.flexRowCenter}>
                                        <FontAwesome5 name="barcode" size={14} color={colors.white} />
                                        <Text style={{...gStyle.textBoxme16,color:colors.white,paddingLeft:5}}>{item.material_name}</Text>
                                    </View>
                                    <View style={gStyle.flexRow}>
                                        <Text style={{...gStyle.textBoxmeBold16,color:colors.white}}>{item.quantity_commit} / </Text>
                                        <Text style={{...gStyle.textBoxmeBold16,color:colors.boxmeBrand}}>{item.quantity_request}</Text>
                                    </View>

                                </View>
                            )}
                        />
                    </View>
                </View>
            </KeyboardAvoidingView>
        );
    }
}

UpdateTasks.propTypes = {
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
    marginBottom: 5,
    marginLeft: 15,
    marginTop: 16
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
    paddingBottom: 220
  }
});
export default UpdateTasks;
