import * as React from 'react';
import { 
    Modal, 
    Text, 
    TouchableOpacity, 
    View,StyleSheet,
    FlatList,
    Dimensions,
    ActivityIndicator,
    Image
} from "react-native";
import * as Print from "expo-print";
import { Feather} from '@expo/vector-icons';
import { colors, gStyle } from '../../constants';
import EmptySearch from "../../components/EmptySearch";

const ImageProductNull =
  "https://wms.boxme.asia/assets/images/boxme/image_available.jpg";
  
const ModelOrderItems = props => {
    const [listData,setlistData] = React.useState(props.listData);
    const [isLoading,setisLoading] = React.useState(false);

    const _printPdf = async (path) => {
        setisLoading(true);
        try {
          await Print.printAsync({
            uri: path,
          });
        } catch (error) {
          console.log("error:", error);
        }
        setisLoading(false);
    };

    const renderBoxItem = (obj) =>{
        return (
            <View style={[gStyle.flexRowSpace,{
                marginVertical:3,
                marginHorizontal:10,
                padding:6,
                borderRadius:3,
                backgroundColor:colors.whiteBg
             }]}>
                <View
                    >
                        <View style={[gStyle.flexRowSpace,{marginRight:10}]}>
                            <Text style={[styles.textValue,{
                                ...gStyle.textBoxme14,
                                color:colors.black
                                }]} numberOfLines={3}>{obj.overpack_code}</Text>
                            
                        </View>
                        <Text style={[styles.textValue,{paddingTop:5,marginRight:10}]}>{obj.request_time}</Text>
                        
                </View>
                <View >
                    <TouchableOpacity
                        style={[gStyle.flexCenter,{
                            width:35,
                            height:35,
                            borderRadius:35/2,
                            backgroundColor:colors.brandPrimary,
                        }]}
                        onPress={() => _printPdf(obj.label)}>
                            {isLoading ? <ActivityIndicator color={colors.black} size={16} />:
                            <Feather color={colors.white} name='printer' size={16}/>}
                    </TouchableOpacity>
                    
                </View>
            </View>
        )
    }
    const renderOrderItem = (obj) =>{
        return (
            <View style={{
                marginHorizontal:10,
                marginVertical:3,
                padding:5,
                backgroundColor:colors.whiteBg
                }}>
                <View style={gStyle.flexRow}>
                    <View style={{ width: 55, marginTop: 5 }}>
                        <Image
                            style={styles.imageProduct}
                            source={{ uri: ImageProductNull }}
                        />
                    </View>
                    <View
                        style={{
                            width: Dimensions.get("window").width - 70,
                            marginTop:5,
                            paddingHorizontal:10
                        }}
                        >
                            <View style={[gStyle.flexRowSpace,{marginRight:10}]}>
                                <Text style={[styles.textValue,{
                                    ...gStyle.textBoxme14,
                                    }]} numberOfLines={3}>{obj.fnsku_code}</Text>
                                <Text style={[styles.textValue,{
                                    ...gStyle.textBoxmeBold14,
                                    }]}>{obj.quantity_pick}/{obj.sold}</Text>
                            </View>
                            <Text style={[styles.textValue,{paddingTop:2,marginRight:10}]} numberOfLines={2}>{obj.fnsku_name}</Text>
                            
                    </View>
                </View>
            </View>
        )
    }
    return (
        <Modal
            animationType="slide"
            transparent={false}
            presentationStyle="formSheet"
        >
            
            <View style={[gStyle.container,{backgroundColor:'#f0f1f6'}]}>
                <View style={[gStyle.flexRowSpace,{
                    paddingVertical:14,
                    paddingHorizontal:15,
                    backgroundColor:colors.whiteBg
                }]}>
                    <Text>{props.t("screen.module.packed.item.list_fnsku")}</Text>
                    <TouchableOpacity 
                        onPress={() => props.onClose(false)}
                        activeOpacity={gStyle.activeOpacity}
                        style={gStyle.flexCenter}
                    >
                        <Feather color={colors.black70} name='chevron-down' size={20}/>
                        
                    </TouchableOpacity>
                
                </View>
                
                {listData.length > 0 ? <View style={{flex:1,marginVertical:8,backgroundColor:'#f0f1f6'}}>
                    <FlatList
                        data={listData}
                        ListHeaderComponent={
                            <View style={{marginVertical:5,marginHorizontal:10}}>

                            {props.list_label &&
                                props.list_label.map((item, index) => (
                                    <TouchableOpacity key ={index} 
                                        onPress={() => _printPdf(item.label)}
                                        style={[
                                        gStyle.flexRowSpace,{
                                            marginVertical:1,
                                            backgroundColor:colors.whiteBg,
                                            paddingVertical:10,
                                            borderRadius:3,
                                        }]}>
                                        <Text numberOfLines={1} style={{
                                        ...gStyle.textBoxme14,
                                        color:colors.black70,
                                        paddingLeft:10,
                                        width:'70%'
                                        
                                        }}>{item.label_name} - {props.t('screen.module.packed.item.sl_printer')} {item.label_quantity}</Text>
                                        <View style={[gStyle.flexCenter,{
                                                width:35,
                                                height:35,
                                                borderRadius:35/2,
                                                backgroundColor:colors.brandPrimary,
                                                marginRight:5
                                            }]}>
                                            <Feather color={colors.white} name='printer' size={16}/>
                                        </View>
                                    </TouchableOpacity>
                                ))
                            }
                            </View>
                            
                            }
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            !props.load_by ? renderOrderItem(item) : renderBoxItem(item) 
                        )}
                    />
                </View> : <EmptySearch t={props.t}/>
                }
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    imageProduct: {
        width: 50,
        height: 50,
        borderRadius: 10,
    },
    textLabel :{
        ...gStyle.textBoxme14,
        color:colors.black50
      },
    textValue :{
        ...gStyle.textBoxme14,
        color:colors.black70
    },
  
});

export default ModelOrderItems;
