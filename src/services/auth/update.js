import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default updateTokenApp = async (body) => {
  try {
    const API_STAFF_UPDATE = await getvalueUrlContent('API_STAFF_UPDATE')
    return await axios.put(API_STAFF_UPDATE,body);
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};
