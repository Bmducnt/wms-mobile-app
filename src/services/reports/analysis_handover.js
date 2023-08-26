import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default getAnanlysisHandover = async params => {
  try {
    const API_REPORT_ANALYSIS_HANDOVER = await getvalueUrlContent('API_REPORT_ANALYSIS_HANDOVER');
    return await axios.get(API_REPORT_ANALYSIS_HANDOVER, {params});
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};
