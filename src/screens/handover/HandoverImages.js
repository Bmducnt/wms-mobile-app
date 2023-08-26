import * as React from "react";
import PropTypes from "prop-types";
import {
  Image,
  StyleSheet,
  View,
  KeyboardAvoidingView,
} from "react-native";
import { 
  gStyle,
  images
} from "../../constants";

import ImageView from "react-native-image-viewing";
import getDetailOb from "../../services/handover/detail-ob";
import ImageFooter from './ImageFooter'

class HandoverImages extends React.Component {
  constructor() {
    super();
    this.state = {
        visible : true,
        list_images : []
    };
  }
  
  UNSAFE_componentWillMount = async () => {
    const {navigation} = this.props;
    if (navigation.getParam("load_local") === false){
      this.fetchDetailImgHandover(navigation.getParam("handover_code"));
    }else{
      this.setState({list_images : navigation.getParam("path")})
    }
    
  };

  onClose = async () =>{
    this.setState({visible : false});
    this.props.navigation.goBack(null);
  }

  fetchDetailImgHandover= async (code) => {
    this.setState({
        list_images: []
    });

    const response = await getDetailOb(code,{is_pda:1,page:1,q:null});
    if (response.status === 200) {
        if (response.data?.document_list.length > 0){
            let image_handover = []
            response.data?.document_list.forEach((element,i) => {
                image_handover.unshift({
                  uri: element.urls
                })
            })
            this.setState({ list_images: image_handover });
        }
    };
  };


  render() {
    const { navigation } = this.props;
    const {visible,list_images} = this.state;
    return (
      <View style={gStyle.container}>
        <KeyboardAvoidingView
          style={{ flex:1,height: "100%", width: "100%"}}
          behavior="padding"
          keyboardVerticalOffset={0}
        >
            <ImageView
                images={list_images}
                imageIndex={0}
                visible={visible}
                onRequestClose={() => this.onClose()}
                FooterComponent={({ imageIndex }) => (
                    <ImageFooter imageIndex={imageIndex} imagesCount={list_images.length} />)}
            />
        </KeyboardAvoidingView>
      </View>
    );
  }
}

HandoverImages.propTypes = {
  // required
  navigation: PropTypes.object.isRequired,
  screenProps: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
    
});

export default HandoverImages;
