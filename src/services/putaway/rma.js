import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default getListPutawayRMA = async (params) => {
  try {
    const API_PUTAWAY_RMA_LIST = await getvalueUrlContent('API_PUTAWAY_RMA_LIST');
    return await axios.get(API_PUTAWAY_RMA_LIST,{params});
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};