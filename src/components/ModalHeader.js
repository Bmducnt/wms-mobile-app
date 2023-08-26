import * as React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import { colors, device, gStyle } from '../constants';

// components
import TouchIcon from './TouchIcon';

const ModalHeader = ({ left, leftPress, right, rightPress, style, text }) => (
  <View style={[styles.container, style]}>
    {left && <TouchIcon icon={left} onPress={leftPress} style={styles.left} />}
    {!left && <View style={styles.left} />}

    {text && (
      <View style={styles.containerText}>
        <Text style={styles.text}>{text}</Text>
      </View>
    )}

    {right && (
        <View >
          <TouchIcon icon={right} onPress={rightPress} style={styles.right} iconSize={20} />
        </View>
      
    )}
    {!right && <View style={styles.right} />}
  </View>
);

ModalHeader.defaultProps = {
  left: null,
  leftPress: () => null,
  right: null,
  rightPress: () => null,
  style: {},
  text: null
};

ModalHeader.propTypes = {
  // optional
  left: PropTypes.element,
  leftPress: PropTypes.func,
  right: PropTypes.element,
  rightPress: PropTypes.func,
  style: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.number,
    PropTypes.object
  ]),
  text: PropTypes.string
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingBottom:3,
    paddingTop: device.iPhoneNotch ? 60 : 35
  },
  containerText: {
    alignItems: 'center',
    flex: 7,
    justifyContent: 'center'
  },
  text: {
    ...gStyle.textBoxme16,
    color: colors.white,
    textAlign: 'center'
  },
  left: {
    alignItems: 'flex-start',
    flex: 1,
    justifyContent: 'center'
  },
  right: {
    alignItems: 'flex-end',
    flex: 1,
    justifyContent: 'center'
  }
});

export default React.memo(ModalHeader);
