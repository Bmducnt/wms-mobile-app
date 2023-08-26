import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';
export default getReportOrderKPI = async params => {
  try {
    const API_REPORT_ORDER_KPI = await getvalueUrlContent('API_REPORT_ORDER_KPI');
    return await axios.get(API_REPORT_ORDER_KPI, {params});
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};
