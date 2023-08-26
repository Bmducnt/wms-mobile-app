import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default getListPacked = async (params) => {
  try {
    const API_PACKED_LIST = await getvalueUrlContent('API_PACKED_LIST');
    return await axios.get(API_PACKED_LIST,{params});
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};