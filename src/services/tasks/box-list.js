import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default getListBox = async params => {
  try {
    const API_LIST_BOX = await getvalueUrlContent('API_LIST_BOX');
    return await axios.get(API_LIST_BOX, {params});
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};
