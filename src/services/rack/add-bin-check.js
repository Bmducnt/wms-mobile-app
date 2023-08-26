import axios from 'axios';
import {API_REPORT_BIN_ADD} from '../endpoints';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default addNewInventoryCheck = async (body) => {
  try {
    const API_REPORT_BIN_ADD = await getvalueUrlContent('API_REPORT_BIN_ADD');
    return await axios.post(API_REPORT_BIN_ADD, body);
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};