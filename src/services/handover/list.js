import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default getListHandover = async (params) => {
  try {
    const API_LIST_HANDOVER = await getvalueUrlContent('API_LIST_HANDOVER');
    return await axios.get(API_LIST_HANDOVER,{params});
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};