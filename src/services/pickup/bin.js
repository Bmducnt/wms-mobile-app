
import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default getDetailBinPickup = async (params) => {
  try {
    const API_DETAIL_BIN_PICKUP = await getvalueUrlContent('API_DETAIL_BIN_PICKUP');
    return await axios.get(API_DETAIL_BIN_PICKUP,{params});
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};