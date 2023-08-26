import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default getListPutawayInbound = async (params) => {
  try {
    const API_PUTAWAY_LIST = await getvalueUrlContent('API_PUTAWAY_LIST');
    return await axios.get(API_PUTAWAY_LIST,{params});
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};