import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';
export default getReportsShipment = async params => {
  try {
    const API_REPORT_SHIPMENT = await getvalueUrlContent('API_REPORT_SHIPMENT');
    return await axios.get(API_REPORT_SHIPMENT, {params});
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};
