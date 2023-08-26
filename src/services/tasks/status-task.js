import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default updateStatusTask = async (task_code,body) => {
  try {
    const API_STATUS_TASKS = await getvalueUrlContent('API_STATUS_TASKS');
    return await axios.put(API_STATUS_TASKS+task_code,body);
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};