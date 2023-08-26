import React, { useState, useEffect } from "react";
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
  Dimensions,
  Image,
  Alert
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { 
    colors, 
    device, 
    gStyle,
    images
} from "../../constants";
import TextInputComponent from "../../components/TextInputComponent";
import getListBox from "../../services/tasks/box-list";


const ModelBoxList = (props) => {
    const [listData,setlistData] = useState([]);
    const [listBox,setlistBox] = useState([]);
    const [listBoxSelect,setlistBoxSelect] = useState([]);
    const [itemPerBatch,setitemPerBatch] = useState(0);



    React.useEffect(() => {
        setlistBoxSelect([])
        findListBoxService();
    }, []);


    const onAddBox = async (box_code,quantity,item_per_batch)=>{
        if (listBoxSelect.length > 4){
            Alert.alert(
                '',
                props.t("screen.module.taks.detail.box_alert"),
                [
                    {
                    text: props.t("base.confirm"),
                    onPress: () => {null},
                    },
                ],
                {cancelable: false},
              );
            return;
        };
        setitemPerBatch(item_per_batch)
        const is_duplicate_box = listBoxSelect.some(element => element.seller_sku === box_code);
        if(!is_duplicate_box) {
            setlistBoxSelect([...listBoxSelect, {'seller_sku' : box_code,'quantity':quantity}]);
            const index = listBox.findIndex(element => element.seller_sku === box_code);
      
            if (index !== -1) {
                const updatedElement = {
                    ...listBox[index],
                    box_active_quantity: quantity,
                };
                const updatedListBox = [...listBox.slice(0, index), updatedElement, ...listBox.slice(index + 1)];
                setlistBox(updatedListBox);
            }
        }else{
            listBoxSelect.forEach(element =>  {
                if (element.seller_sku === box_code && element.quantity === quantity){
                    is_clear_box = true;
                }
            });
            const index = listBoxSelect.findIndex(element => element.seller_sku === box_code);
            if (index !== -1 && listBoxSelect[index].quantity === quantity){
                let new_list = listBoxSelect.filter(item => item.seller_sku !== box_code);
                listBox.forEach(element => {
                    if (element.seller_sku === box_code){
                        element.box_active_quantity = 0;
                    }
                });
                setlistBox([...listBox])
                setlistBoxSelect(new_list);
            }else{
                listBoxSelect.forEach(element =>  {
                    if (element.seller_sku === box_code){
                        element.quantity= quantity
                    }
                });
                listBox.forEach(element => {
                    if (element.seller_sku === box_code){
                        element.box_active_quantity = quantity;
                    }
                });
                setlistBox([...listBox])
                setlistBoxSelect([...listBoxSelect]);
            }
        }
    }

    const onSelect = async (val) =>{
        props.onSelect(listBoxSelect);
        props.onClose(4);
    };

    const findBoxByCode = async (val) => {
        if(val){
            setlistBox(listData.filter((film) => film.name.includes(val.toUpperCase())));
        }
    }

    const findListBoxService = async () => {
        const response = await getListBox({
        });
        
        if (response.status === 200) {
            setlistData(response.data.results);
            setlistBox(response.data.results);
        }
    }


    const renderBoxItem = (obj) => {
        return (
            <View >
                <TouchableOpacity
                    activeOpacity={gStyle.activeOpacity}
                    onPress={() => null}
                    style={[styles.container,{
                            backgroundColor:colors.whiteBg,
                            paddingVertical:4,
                            borderRadius:3,
                    }]}
                >
                    <View style={gStyle.flexRowCenterAlign}>
                        <View style={gStyle.flexRow}>
                            <Image
                                style={styles.imageAvatar}
                                source={images['no_image_available']}
                            />
                            <View >
                                <Text style={[styles.textCode, { ...gStyle.textBoxmeBold14 }]} 
                                    numberOfLines={1} ellipsizeMode="tail">
                                    {obj.name.substring(0, 15)}
                                </Text>
                                <Text style={[styles.textRight,{paddingLeft:10}]} 
                                    numberOfLines={1} ellipsizeMode="tail">
                                    {props.t('screen.module.taks.add.stock_box')} {obj.total_stock.toLocaleString()}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View >
                        <View style={[gStyle.flexRow]}>
                            <TouchableOpacity
                                activeOpacity={gStyle.activeOpacity}
                                disabled={obj.total_stock > 0 ?  false: true}
                                onPress={() => onAddBox(obj.seller_sku,1,obj.item_per_batch)}
                                style={{
                                    backgroundColor: obj?.box_active_quantity === 1 ? colors.boxmeBrand:colors.greyLight,
                                    paddingHorizontal:4,
                                    paddingVertical:8,
                                    borderTopLeftRadius:3,
                                    borderBottomLeftRadius:3,
                                }}
                            >
                                <Text style={{...gStyle.textBoxme14,color:colors.white}}>1 Batch</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={gStyle.activeOpacity}
                                disabled={obj.total_stock > 0 ?  false: true}
                                onPress={() => onAddBox(obj.seller_sku,10,obj.item_per_batch)}
                                style={{
                                    backgroundColor: obj?.box_active_quantity === 10 ? colors.boxmeBrand:colors.greyInactive,
                                    paddingHorizontal:4,
                                    paddingVertical:8,
                                    borderTopRightRadius:3,
                                    borderBottomRightRadius:3,
                                }}
                            >
                                <Text style={{...gStyle.textBoxme14,color:colors.white}}>10 Batch</Text>
                            </TouchableOpacity>
                            
                        </View>
                        <View style={[gStyle.flexRow,{marginTop:2,}]}>
                            
                            <TouchableOpacity
                                activeOpacity={gStyle.activeOpacity}
                                disabled={obj.total_stock > 0 ? false : true}
                                onPress={() => onAddBox(obj.seller_sku,5,obj.item_per_batch)}
                                style={{
                                    backgroundColor: obj?.box_active_quantity === 5 ? colors.boxmeBrand:colors.greyInactive,
                                    paddingHorizontal:4,
                                    paddingVertical:8,
                                    
                                    borderTopLeftRadius:3,
                                    borderBottomLeftRadius:3,
                                }}
                            >
                                <Text style={{...gStyle.textBoxme14,color:colors.white}}>5 Batch</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={gStyle.activeOpacity}
                                disabled={obj.total_stock > 0 ? false : true}
                                onPress={() => onAddBox(obj.seller_sku,20,obj.item_per_batch)}
                                style={[gStyle.flexCenter,{
                                    backgroundColor: obj?.box_active_quantity === 20 ? colors.boxmeBrand:colors.greyLight,
                                    paddingHorizontal:4,
                                    paddingVertical:8,
                                    borderTopRightRadius:3,
                                    borderBottomRightRadius:3
                                }]}
                            >
                                <Text style={{...gStyle.textBoxme14,color:colors.white}}>20 Batch</Text>
                            </TouchableOpacity>
                            
                        </View>
                        
                    </View>
                </TouchableOpacity>
            </View>
        )
    };

    return (
        <Modal 
        animationType="slide"
        presentationStyle="formSheet"
        visible={true}
        >
        <TouchableWithoutFeedback style={gStyle.flex1}>
            <View style={[gStyle.container]}>
                <View
                    style={{
                    height: Dimensions.get("window").height,
                    width: Dimensions.get("window").width,
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                    backgroundColor: "#f0f1f6",
                    }}
                >
                    <View
                    style={[
                        gStyle.flexRowSpace,
                        {
                        paddingVertical: 15,
                        paddingHorizontal: 10,
                        borderBottomColor: "#f0f1f6",
                        borderBottomWidth: 1.5,
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                        backgroundColor: colors.whiteBg,
                        },
                    ]}
                    >
                        <Text>
                            {props.t('screen.module.taks.add.select_box')}
                        </Text>
                        <TouchableOpacity
                        onPress={() => props.onClose(4)}
                        activeOpacity={gStyle.activeOpacity}
                        style={gStyle.flexCenter}
                        >
                            <AntDesign name="closecircle" size={22} color={colors.greyInactive} />
                        
                        </TouchableOpacity>
                    </View>
                    <View style={{marginTop : 5}}>
                        <TextInputComponent
                            navigation={props.navigation}
                            textLabel = {props.t('screen.module.taks.add.select_box')}
                            autoChange = {true}
                            ediTable={true}
                            autoFocus={true}
                            showSearch = {false}
                            showScan = {false}
                            onPressCamera = {findBoxByCode}
                            onSubmitEditingInput = {findBoxByCode}
                            textPlaceholder={''}>
                        </TextInputComponent>
                        <View style={[gStyle.flexRowSpace,{
                            marginHorizontal:15,
                            marginTop:5
                        }]}>
                            <View style={gStyle.flexRowCenterAlign}>
                                <View style={{height:8,width:8,borderRadius:8,backgroundColor:colors.boxmeBrand}} />
                                <Text style={{paddingLeft:4}}>1 Batch = {itemPerBatch} psc</Text>
                            </View>
                        </View>
                    </View>
                    <View style={[gStyle.flexRow, { paddingBottom: 250,marginTop:10,marginHorizontal:15}]}>
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            data={listBox}
                            initialNumToRender={15}
                            keyExtractor={(item, index) => item +index.toString()}
                            renderItem={({ item }) => (
                                renderBoxItem(item)
                            )}
                        />

                    </View>
                </View>
                <View style={styles.containerBottom}>
                    <TouchableOpacity
                        style={[styles.bottomButton]}
                        onPress={() => onSelect()}
                    >
                        <Text style={styles.textButton}>
                        {props.t('screen.module.taks.detail.box_have')} {listBoxSelect.length} {props.t('screen.module.taks.detail.box_select')}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableWithoutFeedback>
    </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 10,
      marginVertical: 0.5,
      width: '100%'
    },
    containerStatus: {
      marginLeft: 10,
      flexDirection: 'row'
    },
    containerBottom: {
        position: "absolute",
        width: "100%",
        backgroundColor: colors.whiteBg,
        bottom: 0,
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
    textCode: {
      ...gStyle.textBoxme14,
      color: colors.black70,
      marginTop: 8,
      marginLeft: 10,
    },
    imageAvatar: {
      width: 45,
      height: 50,
      borderRadius:3
    },
  });
export default ModelBoxList;
