import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default getDetailOb = async (code,params) => {
  try {
    const API_DETAIL_OB = await getvalueUrlContent('API_DETAIL_OB');
    return await axios.get(API_DETAIL_OB+code+'/',{params});
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};