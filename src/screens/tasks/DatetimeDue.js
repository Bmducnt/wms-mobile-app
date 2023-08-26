import React, { useState, useEffect } from "react";
import {
  StyleSheet,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import DatePicker from 'react-native-date-picker'
import {_convertDatetimeToTimestamp} from '../../helpers/device-height';

const DatetimeDue = (props) => {

    const [date, setDate] = useState(new Date())
    const [localeStaff,setlocaleStaff] = useState('vi_VN');

    React.useEffect(() => {
        async function fetchDataStaff() {
          const staff_profile = await AsyncStorage.getItem('staff_profile');
          if (JSON.parse(staff_profile).country_id === 237){
            setlocaleStaff('vi_VN');
          }else{
            setlocaleStaff('en_GB')
          };
        };
        fetchDataStaff();
      }, []);

    const onSelect = async (val) =>{
        props.onSelect(_convertDatetimeToTimestamp(val));
        props.onClose(3);
    };

    return (
        <DatePicker
          modal
          open={true}
          date={date}
          mode="datetime"
          confirmText={props.trans('base.confirm')}
          cancelText={props.trans('base.back')}
          androidVariant = 'nativeAndroid'
          locale = {localeStaff}
          onConfirm={(date) => onSelect(date)}
          onCancel={() => props.onClose(3)}
        />
    );
};

const styles = StyleSheet.create({

  });
export default DatetimeDue;
