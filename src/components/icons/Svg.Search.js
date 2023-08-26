import * as React from 'react';
import PropTypes from 'prop-types';
import { Feather} from '@expo/vector-icons';
import { colors } from '../../constants';

const SvgSearch = ({ fill, size }) => (
  <Feather color={fill} name="search" size={size}/>
);

SvgSearch.defaultProps = {
  fill: colors.blackBg,
  size: 16
};

SvgSearch.propTypes = {
  // optional
  fill: PropTypes.string,
  size: PropTypes.number
};

export default SvgSearch;
