import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default getOrderHandover = async params => {
  try {
    const API_HANDOVER = await getvalueUrlContent('API_HANDOVER');
    return await axios.get(API_HANDOVER, {params});
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};
