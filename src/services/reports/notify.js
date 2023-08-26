import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default getListNotifyByWarehouse = async params => {
  try {
    const API_NOTIFY = await getvalueUrlContent('API_NOTIFY');
    return await axios.get(API_NOTIFY, {params});
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};
