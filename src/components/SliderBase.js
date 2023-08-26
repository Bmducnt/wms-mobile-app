import React, { useRef } from "react";
import {
    StyleSheet,
    View,
    Dimensions,
    FlatList,
    Image
} from 'react-native';
import { Video } from 'expo-av';
import { gStyle } from '../constants';

const SliderBase = props => {
    // dummy data
    const [listMedia, setlistMedia] = React.useState([]);
    const video = React.useRef(null);
    React.useEffect(() => {
        setlistMedia(props.data);
      },[props.data]);
    return (
        <React.Fragment>
            <View style={gStyle.container}>
                <FlatList
                data={listMedia}
                horizontal={true}
                keyExtractor={({ index }) => index.toString()}
                renderItem={({ item }) => (
                    <View style={{
                        alignSelf: 'center'
                    }}>
                        {item.type_upload==='image' && (
                            <Image source={{ uri: item.path }} style={styles.image} />
                        )}

                        {item.type_upload==='video' && ( 
                        <Video
                            ref={video}
                            style={styles.video}
                            source={{
                            uri: item.path,
                            }}
                            useNativeControls
                            resizeMode="contain"
                            isLooping
                        />)}
                    </View>
                )}
                showsHorizontalScrollIndicator={false}
                />
            </View>
            </React.Fragment>
    )
}
const styles = StyleSheet.create({
    video:{
        alignSelf: 'center',
        height: Dimensions.get("window").width,
        width: Dimensions.get("window").width,
    },
    image: {
        height: Dimensions.get("window").width,
        width: Dimensions.get("window").width,
    }
})
export default SliderBase;
