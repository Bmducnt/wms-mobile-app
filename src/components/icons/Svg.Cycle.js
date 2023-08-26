import * as React from 'react';
import PropTypes from 'prop-types';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors } from '../../constants';

const SvgTabCycle = ({ active, size }) => {
  const fill = active ? colors.white : colors.greyInactive;
  return (
    <FontAwesome5 name="recycle" size={size} color={fill} />
  );
};

SvgTabCycle.defaultProps = {
  active: false,
  size: 16
};

SvgTabCycle.propTypes = {
  // optional
  active: PropTypes.bool,
  size: PropTypes.number
};

export default SvgTabCycle;
