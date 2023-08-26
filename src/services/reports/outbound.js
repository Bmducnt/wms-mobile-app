import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';
export default getReportOutboundOrder = async params => {
  try {
    const API_REPORT_ORDER_OUTBOUND = await getvalueUrlContent('API_REPORT_ORDER_OUTBOUND');
    return await axios.get(API_REPORT_ORDER_OUTBOUND, {params});
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};
