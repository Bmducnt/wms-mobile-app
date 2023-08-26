import axios from 'axios';
import {getvalueUrlContent} from '../../helpers/wrap-api';

export default getJourneyOrder = async code => {
  try {
    const API_JOURNEY_ORDER = await getvalueUrlContent('API_JOURNEY_ORDER');
    return await axios.get(API_JOURNEY_ORDER+code);
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};