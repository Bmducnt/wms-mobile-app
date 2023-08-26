import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default putItemOutBound = async (pickup_id,body) => {
  try {
    const API_DETAIL_DETAIL_PICKUP = await getvalueUrlContent('API_DETAIL_DETAIL_PICKUP');
    return await axios.put(API_DETAIL_DETAIL_PICKUP+pickup_id+'/', body);
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};