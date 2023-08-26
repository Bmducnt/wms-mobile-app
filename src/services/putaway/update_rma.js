import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default postPutawayPA = async (body) => {
  try {
    const API_PUTAWAY_PA = await getvalueUrlContent('API_PUTAWAY_PA');
    return await axios.post(API_PUTAWAY_PA, body);
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};