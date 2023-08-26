
import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default putDetailBinInventory = async (tracking_code,body) => {
  try {
    const API_REPORT_BIN_DETAIL = await getvalueUrlContent('API_REPORT_BIN_DETAIL');
    return await axios.put(API_REPORT_BIN_DETAIL+tracking_code,body);
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};