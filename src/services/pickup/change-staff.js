
import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default changeStaffService = async (pickup_id,body) => {
  try {
    const API_STAFF_CHANGER = await getvalueUrlContent('API_STAFF_CHANGER');
    return await axios.put(API_STAFF_CHANGER+pickup_id+'/',body);
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};