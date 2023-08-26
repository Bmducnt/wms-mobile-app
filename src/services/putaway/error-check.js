import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default putErrorPutawayInbound = async body => {
  try {
    const API_PUTAWAY_LIST = await getvalueUrlContent('API_PUTAWAY_LIST');
    return await axios.put(API_PUTAWAY_LIST, body);
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};