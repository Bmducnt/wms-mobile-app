
import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default getDetailPickup = async (pickup_id,params) => {
  try {
    const API_DETAIL_DETAIL_PICKUP = await getvalueUrlContent('API_DETAIL_DETAIL_PICKUP');
    return await axios.get(API_DETAIL_DETAIL_PICKUP+pickup_id+'/',{params});
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};