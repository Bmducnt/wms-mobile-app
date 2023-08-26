import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default getListCycle = async params => {
  try {
      const API_REPORT_BIN_LIST = await getvalueUrlContent('API_REPORT_BIN_LIST');
      return await axios.get(API_REPORT_BIN_LIST, {params});
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  }
  
};
