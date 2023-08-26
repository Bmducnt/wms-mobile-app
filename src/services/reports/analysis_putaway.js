import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default getAnanlysisPutaway = async params => {
  try {
    const API_REPORT_ANALYSIS_INBOUND = await getvalueUrlContent('API_REPORT_ANALYSIS_INBOUND');
    return await axios.get(API_REPORT_ANALYSIS_INBOUND, {params});
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};
