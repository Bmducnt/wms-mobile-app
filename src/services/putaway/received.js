import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default getDetailShipmentCode = async code => {
  try {
    const API_RECEIVED_SHIPMENT = await getvalueUrlContent('API_RECEIVED_SHIPMENT');
    return await axios.get(API_RECEIVED_SHIPMENT+code+'/');
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};