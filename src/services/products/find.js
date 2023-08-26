import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default findDetailFnskuMove = async (code,params) => {
    try {
        const API_PRODUCT_FIND_BIN_MAP = await getvalueUrlContent('API_PRODUCT_FIND_BIN_MAP');
        return await axios.get(API_PRODUCT_FIND_BIN_MAP+code+'/', {params});
    } catch (e) {
      if (e.response) {
        return e.response;
      } else {
        return e;
      }
    }
};