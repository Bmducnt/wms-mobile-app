import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default getKPIIboundReport = async params => {
  try {
    const API_REPORT_TEAM_INDBOUND = await getvalueUrlContent('API_REPORT_TEAM_INDBOUND');
    return await axios.get(API_REPORT_TEAM_INDBOUND, {params});
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};
