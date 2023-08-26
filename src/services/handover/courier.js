import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default getListCarrier = async () => {
  try {
    const API_LIST_COURRIER = await getvalueUrlContent('API_LIST_COURRIER');
    return await axios.get(API_LIST_COURRIER,{});
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};