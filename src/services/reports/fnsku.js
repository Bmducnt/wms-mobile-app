import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default getReportFnsku = async params => {
  try {
    const API_REPORT_PRODUCT = await getvalueUrlContent('API_REPORT_PRODUCT');
    return await axios.get(API_REPORT_PRODUCT, {params});
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};
