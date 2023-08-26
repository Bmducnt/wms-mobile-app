import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default getBinFnsku = async (code,params) => {
  try {
    const API_PRODUCT_BIN = await getvalueUrlContent('API_PRODUCT_BIN');
    return await axios.get(API_PRODUCT_BIN+code+'/',{params});
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};