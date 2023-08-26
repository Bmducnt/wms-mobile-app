import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default getKPIHandoverReport = async params => {
  try {
    const API_REPORT_TEAM_HANDOVER = await getvalueUrlContent('API_REPORT_TEAM_HANDOVER');
    return await axios.get(API_REPORT_TEAM_HANDOVER, {params});
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};
