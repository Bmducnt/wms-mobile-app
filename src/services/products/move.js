import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default putNewLocationMove = async (code,body) => {
    try {
        const API_PRODUCT_FIND_BIN_MAP = await getvalueUrlContent('API_PRODUCT_FIND_BIN_MAP');
        return await axios.put(API_PRODUCT_FIND_BIN_MAP+code+'/', body);
    } catch (e) {
      if (e.response) {
        return e.response;
      } else {
        return e;
      }
    }
};