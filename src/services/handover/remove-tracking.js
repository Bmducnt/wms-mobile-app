import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default removeTrackingOB = async (code,body) => {
  try {
    const API_REMOVE_TRACKING_OB = await getvalueUrlContent('API_REMOVE_TRACKING_OB');
    return await axios.put(API_REMOVE_TRACKING_OB+code+'/',body);
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};
