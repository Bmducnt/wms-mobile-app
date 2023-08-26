
import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default getOutboundStaff = async (staff_id,params) => {
  try {
    const API_OUTBOUND_STAFF = await getvalueUrlContent('API_OUTBOUND_STAFF');
    return await axios.get(API_OUTBOUND_STAFF+staff_id,{params});
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};