import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default getListInbound = async (params) => {
  try {
    const API_LIST_INBOUND = await getvalueUrlContent('API_LIST_INBOUND');
    return await axios.get(API_LIST_INBOUND,{params});
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};