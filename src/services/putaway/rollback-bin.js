import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default getListFNSKURollback = async (params) => {
  try {
    const API_ROLLBACK_BIN = await getvalueUrlContent('API_ROLLBACK_BIN');
    return await axios.get(API_ROLLBACK_BIN,{params});
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};