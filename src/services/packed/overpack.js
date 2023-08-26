
import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default postBoxPackedOneByOne = async (body) => {
  try {
    const API_PACKED_OVERPACK = await getvalueUrlContent('API_PACKED_OVERPACK');
    return await axios.post(API_PACKED_OVERPACK,body);
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};