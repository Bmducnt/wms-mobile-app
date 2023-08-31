import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default getListPickup = async (params) => {
  try {
    const API_LIST_PICKUP = await getvalueUrlContent('API_LIST_PICKUP');
    return await axios.get(API_LIST_PICKUP,{params});
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};
