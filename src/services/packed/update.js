
import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default postDetailPacked = async (pickup_id,body) => {
  try {
    const API_PACKED_UPDATE = await getvalueUrlContent('API_PACKED_UPDATE');
    return await axios.post(API_PACKED_UPDATE+pickup_id+'/',body);
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};