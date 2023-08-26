import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default getListTask = async params => {
  try {
    const API_LIST_TASKS = await getvalueUrlContent('API_LIST_TASKS');
    return await axios.get(API_LIST_TASKS, {params});
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};
