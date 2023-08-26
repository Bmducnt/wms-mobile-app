import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';
export default getReportStaff = async params => {
  try {
    const API_REPORT_STAFF = await getvalueUrlContent('API_REPORT_STAFF');
    return await axios.get(API_REPORT_STAFF, {params});
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};
