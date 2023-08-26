import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default getListZoneStaffPickup = async params => {
  try {
    const API_FIND_ZONE = await getvalueUrlContent('API_FIND_ZONE');
    return await axios.get(API_FIND_ZONE,{params});
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};