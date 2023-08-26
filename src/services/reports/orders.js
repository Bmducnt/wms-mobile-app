import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';
export default getReportOrder = async params => {
  try {
    const API_REPORT_ORDERS = await getvalueUrlContent('API_REPORT_ORDERS');
    return await axios.get(API_REPORT_ORDERS, {params});
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};
