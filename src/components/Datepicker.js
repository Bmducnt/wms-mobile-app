import React, { useState } from "react";
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-community/async-storage';
import DatePicker from 'react-native-date-picker'

const DatePickerBase = props  => {
    const [confirmText, setconfirmText] = useState(props.trans('screen.datetimepicker.btn_confirm'));
    const [headerText, setheaderText] = useState(props.headerText);
    const [localeStaff,setlocaleStaff] = useState('vi');
    const [dateNow, setdateNow] = useState(new Date())

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


    const handleConfirm = (date) => {
      props.onConfirm(date,props.typeLoad)
    };

    return (
        <DatePicker
          modal
          open={props.isDatePickerVisible}
          date={dateNow}
          mode="date"
          title={headerText}
          confirmText={props.trans('base.confirm')}
          cancelText={props.trans('base.back')}
          androidVariant = 'nativeAndroid'
          locale = {localeStaff}
          onConfirm={(date) => handleConfirm(date)}
          onCancel={() => props.onCancel(false)}
        />
    );
};

DatePickerBase.defaultProps = {
    typeLoad : false
};
  
DatePickerBase.propTypes = {
  confirmText : PropTypes.string,
  headerText : PropTypes.string,
  isDatePickerVisible : PropTypes.bool,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  typeLoad : PropTypes.bool.isRequired,
  trans : PropTypes.func.isRequired
};

export default DatePickerBase;
