import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';
export default putErrorOrderFF = async body => {
  try {
    const API_NOTIFY = await getvalueUrlContent('API_NOTIFY');
    return await axios.put(API_NOTIFY, body);
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};