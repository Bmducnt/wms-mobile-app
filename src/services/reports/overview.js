import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';
export default getReportOverview = async params => {
  try {
    const API_REPORT_OVERVIEW = await getvalueUrlContent('API_REPORT_OVERVIEW');
    return await axios.get(API_REPORT_OVERVIEW, {params});
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};
