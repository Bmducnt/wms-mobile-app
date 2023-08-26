import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default getReportBin = async params => {
  try {
      const API_REPORT_BIN = await getvalueUrlContent('API_REPORT_BIN');
      return await axios.get(API_REPORT_BIN, {params});
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  }
  
};
