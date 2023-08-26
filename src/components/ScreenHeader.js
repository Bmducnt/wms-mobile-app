import * as React from 'react';
import PropTypes from 'prop-types';
import * as Device from 'expo-device';
import { 
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Dimensions
} from 'react-native';
import { withNavigation } from 'react-navigation';
import { Feather } from '@expo/vector-icons';
import { colors, device, gStyle } from '../constants';

// components
import TouchIcon from './TouchIcon';
import ScanQrCode from './ScanQrCode';
import LinearGradient from './LinearGradient';

// icons
import SvgSearch from './icons/Svg.Search';

const ScreenHeader = ({ 
  navigation,
  showBack,
  title ,
  isFull,
  isOpenCamera,
  inputValueSend,
  onPressCamera,
  onSubmitEditingInput,
  autoFocus,
  textPlaceholder,
  showInput,
  iconLeft,
  bgColor,
  textAlign
}) => {

  const [inputValue, setinputValue] = React.useState(inputValueSend);
  const [openCamera, setopenCamera] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      if(Device.osName !== 'Android' && isOpenCamera){
        setopenCamera(true)
      }
    })();
  }, []);
  
  const cameraScanHandel =  (code) => {
    setopenCamera(false);
    onPressCamera(code);
    if (autoFocus){
      setinputValue(null)
    }else{
      if(Device.osName === 'Android'){
        setinputValue(null);
      }else{
        setinputValue(code);
      }
      
    }
  };
  
  const onChangeTextSubmit =  (code) => {
    onSubmitEditingInput(code);
    if (autoFocus){
      setinputValue(null)
    }else{
      if(Device.osName === 'Android'){
        setinputValue(null);
      }else{
        setinputValue(code);
      }
    }
  };

  return(
    <View >
      <LinearGradient fill="#3d4c6c" height={device.iPhoneNotch ? 60 : 45} />
      <View style={[styles.container,gStyle.flexRowCenter]}>
        {showBack && (
          <View style={styles.left}>
            <TouchIcon
              icon={<Feather color={colors.white} name={iconLeft} />}
              iconSize={24}
              onPress={() => navigation.goBack(null)}
            />
          </View>
        )}

        {showInput ? <View style={[gStyle.flexRowCenterAlign]}>
            <TouchableOpacity
              activeOpacity={1}
              style={styles.searchPlaceholder}
            >
              <View style={[gStyle.mR1,gStyle.mL1]}>
                <SvgSearch fill={colors.white}/>
              </View>
              <TextInput  
                style={[styles.searchPlaceholderText,
                  {width: isFull ? Dimensions.get("window").width-135:Dimensions.get("window").width-200}]}
                placeholderTextColor={colors.white}
                blurOnSubmit={false}
                selectTextOnFocus={true}
                editable={true}
                autoFocus={autoFocus}
                value={inputValue}
                numberOfLines={1}
                returnKeyType='search'
                multiline={false}
                onChangeText={text => setinputValue(text)}
                onSubmitEditing = {text => (onChangeTextSubmit(inputValue))}
                placeholder={textPlaceholder}/>
                <View style={[gStyle.mL3,gStyle.mR1]}>
              <TouchIcon
                icon={<Feather color={colors.white} name='maximize' />}
                onPress={() => setopenCamera(true)}
                iconSize={20}
              />
            </View>
            </TouchableOpacity>
            
        </View>:<View style={styles.containerText}>
          <Text style={[styles.text,{textAlign:textAlign}]}>{title}</Text>
        </View>}
          {showBack && <View style={gStyle.flex1} />}
          {openCamera && <ScanQrCode
              onPress = {cameraScanHandel}
              onClose = {setopenCamera}
              />}
        </View>
     </View>
  )
};

ScreenHeader.defaultProps = {
  showBack: false,
  isFull : false,
  isOpenCamera:false,
  iconLeft : 'chevron-left',
  keyboardType:'default',
  bgColor : colors.blackBg,
  textAlign : 'left'
};

ScreenHeader.propTypes = {
  // required
  navigation: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  isFull : PropTypes.bool,
  isOpenCamera : PropTypes.bool,
  iconLeft : PropTypes.string,
  bgColor :PropTypes.string,
  // optional
  showBack: PropTypes.bool,
  textAlign : PropTypes.string
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 10,
    marginTop:-10
  },
  searchPlaceholder: {
    alignItems: 'center',
    backgroundColor: '#2b3138',
    borderRadius: 4,
    paddingVertical:10,
    flexDirection: 'row',
  },
  searchPlaceholderText: {
    ...gStyle.textBoxme14,
    color: colors.white,
    paddingRight: device.iPhoneNotch ? 10:15
  },
  containerText: {
    ...gStyle.flex5,
  },
  text: {
    ...gStyle.textBoxme18,
    color: colors.white,
  },
  left: {
    ...gStyle.flex1,
    alignItems: 'flex-start'
  }
});

export default withNavigation(ScreenHeader);
