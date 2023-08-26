import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default putErrorPickup = async (pickup_code,body) => {
  try {
    const API_PICKUP_LOG = await getvalueUrlContent('API_PICKUP_LOG');
    return await axios.put(API_PICKUP_LOG+pickup_code+'/', body);
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};