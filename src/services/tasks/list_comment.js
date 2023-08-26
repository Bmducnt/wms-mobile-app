
import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default getCommentTask = async (task_code) => {
  try {
    const API_COMMENT_TASKS = await getvalueUrlContent('API_COMMENT_TASKS');
    return await axios.get(API_COMMENT_TASKS+task_code,{});
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};