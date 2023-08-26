import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default getReportHandover = async (params) => {
  try {
    const API_REPORT_OB = await getvalueUrlContent('API_REPORT_OB');
    return await axios.get(API_REPORT_OB,{params});
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};