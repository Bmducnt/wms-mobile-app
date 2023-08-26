import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default confirmBoxB2BHandover = async (body) => {
  try {
    const API_B2B_HANDOVER_CHECK = await getvalueUrlContent('API_B2B_HANDOVER_CHECK');
    return await axios.put(API_B2B_HANDOVER_CHECK,body);
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};
