import AsyncStorage from '@react-native-community/async-storage';
import { Audio } from 'expo-av';


export const savePrinterLabelStaff = async printer_label =>{
  await AsyncStorage.setItem('printer_label', JSON.stringify(printer_label));
}

export const savePrinterInvoiceStaff = async printer_invoice =>{
  await AsyncStorage.setItem('printer_invoice', JSON.stringify(printer_invoice));
}

export const saveLastTrackingByStaff = async tracking_code =>{
  await AsyncStorage.setItem('tracking_code_last', tracking_code);
}

export const saveStaffLogin = async (data) => {
  const { token, results } = data;
  const { email } = results;
  try {
    await Promise.all([
      AsyncStorage.setItem('staff_token', token),
      AsyncStorage.setItem('staff_profile', JSON.stringify(results)),
      AsyncStorage.setItem('staff_email', email),
    ]);
  } catch (error) {
    console.log(error);
  }
};

export const removeStaffLogout = async () => {
  try {
    await Promise.all([
      AsyncStorage.removeItem('staff_token'),
      AsyncStorage.removeItem('staff_profile'),
    ]);
  } catch (error) {
    console.log(error);
    // handle error
  }
};


export const permissionDenied = async (navigation) => {
  try {
    await removeStaffLogout();
  } catch (error) {
    console.log(error);
  }
  navigation?.navigate('Auth');
};


Audio.setAudioModeAsync({
  playsInSilentModeIOS: true,
  shouldDuckAndroid: true,
  playThroughEarpieceAndriod: true,
});


const sound = new Audio.Sound();

export const handleSoundScaner = async () => {
  try {
    await sound.unloadAsync();
    await sound.loadAsync(require('../assets/sound/error.mp3'));
    await sound.playAsync();
  } catch (error) {
    // An error occurred!
  }
};

export const handleSoundOkScaner = async () => {
  try {
    await sound.unloadAsync();
    await sound.loadAsync(require('../assets/sound/ok.mp3'));
    await sound.playAsync();
  } catch (error) {
    // An error occurred!
  }
};