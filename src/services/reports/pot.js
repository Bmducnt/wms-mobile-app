import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';
export default getReportPOT = async params => {
  try {
    const API_REPORT_POT = await getvalueUrlContent('API_REPORT_POT');
    return await axios.get(API_REPORT_POT, {params});
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};
