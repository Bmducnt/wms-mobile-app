import * as React from 'react';
import PropTypes from 'prop-types';
import {
  ToastAndroid
} from 'react-native';
import * as Device from 'expo-device';

const ToastAlert = props => {
    const [textError, settextError] = React.useState(null);
    React.useEffect(() => {
      settextError(props.textAlert);
    },[props.textAlert]);

    return(
        <React.Fragment>
            {Device.osName === 'Android' && textError && 
                ToastAndroid.showWithGravity(textError, ToastAndroid.SHORT,ToastAndroid.TOP)
            }
        </React.Fragment>
    )
};

ToastAlert.propTypes = {
    textAlert : PropTypes.string,
    TextButton:PropTypes.string
};

export default ToastAlert;