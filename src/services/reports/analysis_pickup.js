import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default getAnanlysisPickup = async params => {
  try {
    const API_REPORT_ANALYSIS_PICKUP = await getvalueUrlContent('API_REPORT_ANALYSIS_PICKUP');
    return await axios.get(API_REPORT_ANALYSIS_PICKUP, {params});
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};
