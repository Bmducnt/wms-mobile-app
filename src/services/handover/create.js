import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default createHandoverAPI = async (params) => {
  try {
    const API_CREATE_HANDOVER = await getvalueUrlContent('API_CREATE_HANDOVER');
    return await axios.get(API_CREATE_HANDOVER,{params},{timeout: 1000});
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};