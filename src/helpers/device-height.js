import {Dimensions, Platform, StatusBar} from 'react-native';

const X_WIDTH = 375;
const X_HEIGHT = 812;

const XSMAX_WIDTH = 414;
const XSMAX_HEIGHT = 896;

const {height, width} = Dimensions.get('window');

export const isIPhoneX = () =>
  Platform.OS === 'ios' && !Platform.isPad && !Platform.isTVOS
    ? (width === X_WIDTH && height === X_HEIGHT) ||
      (width === XSMAX_WIDTH && height === XSMAX_HEIGHT)
    : false;

export const StatusBarHeight = Platform.select({
  ios: isIPhoneX() ? 44 : 20,
  android: StatusBar.currentHeight,
  default: 0,
});

export const responsiveSize = (size, type) => {
  if (type === 'double') {
    return (size * height * height) / (XSMAX_HEIGHT * XSMAX_HEIGHT);
  }
  return (size * height) / XSMAX_HEIGHT;
};

export const responsiveFontSize = size => {
  return (size * width) / XSMAX_WIDTH;
};


export const _getTimeDefaultFrom = () =>{
    let dt = new Date();
    dt.setDate( dt.getDate() - 8)
    return Math.floor(dt/1000);
};

export const _getTimeDefaultFromOneDay = () =>{
  let dt = new Date();
  dt.setDate( dt.getDate() - 1)
  return Math.floor(dt/1000);
};

export const _getTimeDefaultTo = () =>{
    return parseInt(Math.floor(Date.now() /1000));
};

export const _convertDatetimeToTimestamp = (val) => {
  return parseInt(Math.floor(val /1000));
}

export const _getDatetimeToTimestamp = (unix_timestamp) =>{
  return new Date(unix_timestamp * 1e3).toISOString().slice(0,10);
};

export const _getDatetimeToTimestampFull = (unix_timestamp) =>{
  date = new Date(unix_timestamp * 1e3)
  date.setHours(date.getHours() + 7);
  return date.toISOString().replace("T", " ").slice(0,19);
};