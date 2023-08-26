import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default confirmRollbackBinException = async body => {
  try {
    const API_ROLLBACK_BIN = await getvalueUrlContent('API_ROLLBACK_BIN');
    return await axios.put(API_ROLLBACK_BIN, body);
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};
