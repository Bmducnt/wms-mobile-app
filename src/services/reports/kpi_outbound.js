import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default getKPIPackReport = async params => {
  try {
    const API_REPORT_TEAM_OUTBOUND = await getvalueUrlContent('API_REPORT_TEAM_OUTBOUND');
    return await axios.get(API_REPORT_TEAM_OUTBOUND, {params});
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};
