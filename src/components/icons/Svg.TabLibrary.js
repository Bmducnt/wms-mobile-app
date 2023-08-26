import * as React from 'react';
import PropTypes from 'prop-types';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors } from '../../constants';

const SvgTabLibrary = ({ active, size }) => {
  const fill = active ? colors.white : colors.greyInactive;
  return (
    <FontAwesome5 name="user-alt" color={fill} size={size} />
  );
};

SvgTabLibrary.defaultProps = {
  active: false,
  size: 16
};

SvgTabLibrary.propTypes = {
  // optional
  active: PropTypes.bool,
  size: PropTypes.number
};

export default SvgTabLibrary;
