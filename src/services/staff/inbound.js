
import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default getInboundStaff = async (staff_id,params) => {
  try {
    const API_INBOUND_STAFF = await getvalueUrlContent('API_INBOUND_STAFF');
    return await axios.get(API_INBOUND_STAFF+staff_id,{params});
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};