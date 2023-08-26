import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default getSummaryPickup = async (pickup_id) => {
    try {
      const API_SUMMARY_PK = await getvalueUrlContent('API_SUMMARY_PK');
      return await axios.get(API_SUMMARY_PK+pickup_id+'/');
    } catch (e) {
      if (e.response) {
        return e.response;
      } else {
        return e;
      }
    };
  };