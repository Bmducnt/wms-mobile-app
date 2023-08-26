import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default getBoxPacked = async (order_id) => {
  try {
    const API_PACKED_SUGGET = await getvalueUrlContent('API_PACKED_SUGGET');
    return await axios.get(API_PACKED_SUGGET+order_id);
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};