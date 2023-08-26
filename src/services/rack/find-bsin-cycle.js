import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default getInfoBinStockCycle = async (code,params) => {
  try {
      const API_REPORT_BIN_FIND = await getvalueUrlContent('API_REPORT_BIN_FIND');
      return await axios.get(API_REPORT_BIN_FIND+code, {params});
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  }
  
};
