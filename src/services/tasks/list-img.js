
import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default getImageTask = async (task_code) => {
  try {
    const API_IMG_TASKS = await getvalueUrlContent('API_IMG_TASKS');
    return await axios.get(API_IMG_TASKS+task_code,{});
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};