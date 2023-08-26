
import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default getDetailTask = async (task_code) => {
  try {
    const API_DETAIL_TASKS = await getvalueUrlContent('API_DETAIL_TASKS');
    return await axios.get(API_DETAIL_TASKS+task_code,{});
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};