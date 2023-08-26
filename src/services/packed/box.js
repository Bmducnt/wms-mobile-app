
import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';


export default postBoxPacked = async (body) => {
  try {
    const API_PACKED_BOX = await getvalueUrlContent('API_PACKED_BOX');
    return await axios.post(API_PACKED_BOX,body);
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};