
import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default getDetailBinInventory = async (tracking_code,params) => {
  try {
    const API_REPORT_BIN_DETAIL = await getvalueUrlContent('API_REPORT_BIN_DETAIL');
    return await axios.get(API_REPORT_BIN_DETAIL+tracking_code,{params});
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};