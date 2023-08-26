import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default confirmReceivedInbound = async (code,body) => {
  try {
    const API_RECEIVED_SHIPMENT = await getvalueUrlContent('API_RECEIVED_SHIPMENT');
    return await axios.put(API_RECEIVED_SHIPMENT+code+'/', body);
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};
