import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default createPickupByStaff = async body => {
  try {
    const API_CREATE_PK = await getvalueUrlContent('API_CREATE_PK');
    return await axios.post(API_CREATE_PK, body);
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};
