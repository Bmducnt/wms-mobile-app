import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default confirmOBSend = async (code,body) => {
  try {
    const API_APPROVED_OB = await getvalueUrlContent('API_APPROVED_OB');
    return await axios.put(API_APPROVED_OB+code+'/',body);
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};
