import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default getComplexity = async params => {
  try {
    const API_REPORT_COMPLEXITY = await getvalueUrlContent('API_REPORT_COMPLEXITY');
    return await axios.get(API_REPORT_COMPLEXITY, {params});
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};
