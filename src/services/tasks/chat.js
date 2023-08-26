import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default addCommentTask = async (task_code,body) => {
  try {
    const API_CHAT_TASKS = await getvalueUrlContent('API_CHAT_TASKS');
    return await axios.put(API_CHAT_TASKS+task_code, body);
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};