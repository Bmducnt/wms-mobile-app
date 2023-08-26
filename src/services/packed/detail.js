
import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default getDetailPacked = async (pickup_id,params) => {
  try {
    const API_PACKED_DETAIL = await getvalueUrlContent('API_PACKED_DETAIL');
    return await axios.get(API_PACKED_DETAIL+pickup_id+'/',{params});
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};