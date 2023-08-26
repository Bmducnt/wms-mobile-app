import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default confirmOrderException = async body => {
  try {
    const API_ORDER_EXCEPTION = await getvalueUrlContent('API_ORDER_EXCEPTION');
    return await axios.put(API_ORDER_EXCEPTION, body);
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};
