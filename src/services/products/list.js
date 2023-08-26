import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default getListFnsku = async params => {
  try {
      const API_PRODUCT_LIST = await getvalueUrlContent('API_PRODUCT_LIST');
      return await axios.get(API_PRODUCT_LIST, {params});
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  }
  
};
