import * as React from 'react';
import PropTypes from 'prop-types';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors } from '../../constants';

const SvgTabPacked = ({ active, size }) => {
  const fill = active ? colors.white : colors.greyInactive;
  return (
    <FontAwesome5 name="box" size={size} color={fill} />
  );
};

SvgTabPacked.defaultProps = {
  active: false,
  size: 16
};

SvgTabPacked.propTypes = {
  // optional
  active: PropTypes.bool,
  size: PropTypes.number
};

export default SvgTabPacked;
