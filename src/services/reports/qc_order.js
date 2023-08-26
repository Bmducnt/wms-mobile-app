import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';
export default getOrderQC = async params => {
  try {
    const API_QC_ORDER = await getvalueUrlContent('API_QC_ORDER');
    return await axios.get(API_QC_ORDER, {params});
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};
