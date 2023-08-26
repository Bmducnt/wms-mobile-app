
import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default getRMAStaff = async (staff_id,params) => {
  try {
    const API_RMA_STAFF = await getvalueUrlContent('API_RMA_STAFF');
    return await axios.get(API_RMA_STAFF+staff_id,{params});
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};