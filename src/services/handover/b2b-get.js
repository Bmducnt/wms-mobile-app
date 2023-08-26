import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default getListBoxB2BHandover = async (params) => {
  try {
    const API_B2B_HANDOVER_CHECK = await getvalueUrlContent('API_B2B_HANDOVER_CHECK');
    return await axios.get(API_B2B_HANDOVER_CHECK,{params});
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};