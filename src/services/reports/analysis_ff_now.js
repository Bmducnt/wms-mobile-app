import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default getAnanlysisFFNOW = async params => {
  try {
    const API_REPORT_ANALYSIS_FF_NOW = await getvalueUrlContent('API_REPORT_ANALYSIS_FF_NOW');
    return await axios.get(API_REPORT_ANALYSIS_FF_NOW, {params});
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};
