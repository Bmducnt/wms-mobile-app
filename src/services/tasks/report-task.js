
import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default getReportTask = async () => {
  try {
    const API_REPORT_TASKS = await getvalueUrlContent('API_REPORT_TASKS');
    return await axios.get(API_REPORT_TASKS,{});
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};