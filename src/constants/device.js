import { Dimensions, Platform } from 'react-native';
const version_release = '2.3.7';
// android
const android = Platform.OS === 'android';

const iOS = Platform.OS === 'ios';
const web = Platform.OS === 'web';
const windowInfo = Dimensions.get('window');
const { height, width } = windowInfo;
const aspectRatio = height / width;

// is iPad
const { isPad } = Platform;

// is iPhone with Notch?
// iPhoneX, iPhoneXs, iPhoneXr, iPhoneXs Max, iPhone 11 & 12
let iPhoneNotch = false;
if (iOS) {
  // iphone screen breakdown
  // https://blog.calebnance.com/development/iphone-ipad-pixel-sizes-guide-complete-list.html
  if (
    height === 812 || 
    height === 852 || 
    height === 844 || 
    height === 896 || 
    height === 926 || 
    height === 780 || 
    height === 932
    ) {
    iPhoneNotch = true;
  }
}


// is iPhone 6,7,8 with Notch?
let iPhoneNotchX = false;
if (iOS) {
  // iphone screen breakdown
  // https://blog.calebnance.com/development/iphone-ipad-pixel-sizes-guide-complete-list.html
  if (height === 736 || height === 667 ) {
    iPhoneNotchX = true;
  }
}

export default {
  android,
  aspectRatio,
  height,
  iOS,
  iPhoneNotch,
  iPhoneNotchX,
  isPad,
  web,
  width,
  version_release
};
