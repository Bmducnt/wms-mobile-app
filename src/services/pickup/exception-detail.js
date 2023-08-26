
import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default getDetailOrderExceptionPickup = async (params) => {
  try {
    const API_DETAIL_TRACKING_PICKUP = await getvalueUrlContent('API_DETAIL_TRACKING_PICKUP');
    return await axios.get(API_DETAIL_TRACKING_PICKUP,{params});
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};