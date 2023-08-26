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
} from "../../constants";

import ImageView from "react-native-image-viewing";
import getImageTask from "../../services/tasks/list-img";


class ImagesViewList extends React.Component {
  constructor() {
    super();
    this.state = {
        visible : true,
        list_images : []
    };
  }

  UNSAFE_componentWillMount = async () => {
    this.fetchDetailImgTask(this.props.navigation.getParam("task_code"));
  };

  onClose = async () =>{
    this.setState({visible : false});
    this.props.navigation.goBack(null);
  }

  fetchDetailImgTask= async (code) => {
    this.setState({
        list_images: []
    });
    const response = await getImageTask(code);
    if (response.status === 200) {
        this.setState({ list_images: response.data.results });
        
    }
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
            />
        </KeyboardAvoidingView>
      </View>
    );
  }
}

ImagesViewList.propTypes = {
  // required
  navigation: PropTypes.object.isRequired,
  screenProps: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
    
});

export default ImagesViewList;
