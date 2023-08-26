import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default getListStaffPickup = async params => {
  try {
    const API_STAFF_PACKED = await getvalueUrlContent('API_STAFF_PACKED');
    return await axios.get(API_STAFF_PACKED,{params});
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};