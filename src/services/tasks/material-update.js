import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default addMaterialTask = async (task_code,body) => {
  try {
    const API_LIST_BOX_UPDATE = await getvalueUrlContent('API_LIST_BOX_UPDATE');
    return await axios.put(API_LIST_BOX_UPDATE+task_code, body);
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};