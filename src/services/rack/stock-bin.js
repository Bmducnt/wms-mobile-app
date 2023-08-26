import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default getStockBin = async (body) => {
    try {
      const API_REPORT_BIN_CHECK = await getvalueUrlContent('API_REPORT_BIN_CHECK');
      return await axios.put(API_REPORT_BIN_CHECK, body);
    } catch (e) {
      if (e.response) {
        return e.response;
      } else {
        return e;
      }
    }
};