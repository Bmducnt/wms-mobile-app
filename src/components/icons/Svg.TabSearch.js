import * as React from 'react';
import PropTypes from 'prop-types';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors } from '../../constants';

const SvgTabSearch = ({ active, size }) => {
  const fill = active ? colors.white : colors.greyInactive;
  return (
    <FontAwesome5 name="chalkboard" color={fill} size={size} />
  );
};

SvgTabSearch.defaultProps = {
  active: false,
  size: 16
};

SvgTabSearch.propTypes = {
  // optional
  active: PropTypes.bool,
  size: PropTypes.number
};

export default SvgTabSearch;
