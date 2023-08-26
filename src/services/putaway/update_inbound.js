import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default postPutawayInbound = async (code,body) => {
  try {
    const API_PUTAWAY_UPDATE = await getvalueUrlContent('API_PUTAWAY_UPDATE');
    return await axios.post(API_PUTAWAY_UPDATE+code+'/', body);
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};