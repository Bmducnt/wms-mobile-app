import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default getDetailFnsku = async (code,params) => {
  try {
    const API_PRODUCT_DETAIL = await getvalueUrlContent('API_PRODUCT_DETAIL');
    return await axios.get(API_PRODUCT_DETAIL+code+'/', {params});
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};