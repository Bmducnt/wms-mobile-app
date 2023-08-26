import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default getListStaff = async params => {
  try {
    const API_STAFF_LIST = await getvalueUrlContent('API_STAFF_LIST');
    return await axios.get(API_STAFF_LIST, {params});
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};
