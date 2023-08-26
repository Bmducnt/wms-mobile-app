
import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default getDetailTaskBox = async (task_code) => {
  try {
    const API_LIST_BOX_DETAIL = await getvalueUrlContent('API_LIST_BOX_DETAIL');
    return await axios.get(API_LIST_BOX_DETAIL+task_code,{});
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};