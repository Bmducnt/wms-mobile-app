import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default getListOrderException = async params => {
  try {
    const API_ORDER_EXCEPTION = await getvalueUrlContent('API_ORDER_EXCEPTION');
    return await axios.get(API_ORDER_EXCEPTION, {params});
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};
