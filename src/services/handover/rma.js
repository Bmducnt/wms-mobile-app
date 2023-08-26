import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default getListRMA = async (params) => {
  try {
    const API_LIST_RMA = await getvalueUrlContent('API_LIST_RMA');
    return await axios.get(API_LIST_RMA,{params});
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};