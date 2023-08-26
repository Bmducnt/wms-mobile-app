import * as React from 'react';
import PropTypes from 'prop-types';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors } from '../../constants';

const SvgTabTask = ({ active, size }) => {
  const fill = active ? colors.white : colors.greyInactive;
  return (
    <FontAwesome5 name="poll-h" size={size} color={fill} />
  );
};

SvgTabTask.defaultProps = {
  active: false,
  size: 16
};

SvgTabTask.propTypes = {
  // optional
  active: PropTypes.bool,
  size: PropTypes.number
};

export default SvgTabTask;
