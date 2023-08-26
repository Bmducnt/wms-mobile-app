import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default addNewTask = async body => {
  try {
    const API_ADD_TASK = await getvalueUrlContent('API_ADD_TASK');
    return await axios.post(API_ADD_TASK, body);
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};
