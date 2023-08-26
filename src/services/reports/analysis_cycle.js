import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default getAnanlysisCycle = async params => {
  try {
    const API_REPORT_ANALYSIS_CYCLE = await getvalueUrlContent('API_REPORT_ANALYSIS_CYCLE');
    return await axios.get(API_REPORT_ANALYSIS_CYCLE, {params});
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};
