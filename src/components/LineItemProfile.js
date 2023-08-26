import * as React from 'react';
import PropTypes from 'prop-types';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View,
  
} from 'react-native';
import {
  Feather
} from '@expo/vector-icons';
import { colors, gStyle } from '../constants';
import {removeStaffLogout} from '../helpers/async-storage';

const LineItemProfile = ({
  navigation,
  icon,
  title,
  disableRightSide,
  id
}) => {

  const staffLogout = async () => {
    removeStaffLogout();
    navigation.navigate("Auth",{initial: false})
  };

  return (
    <TouchableOpacity
      activeOpacity={gStyle.activeOpacity}
      onPress={staffLogout}
      disabled={id !==7}
      style={styles.container}
    >
      <View style={gStyle.flexRowCenterAlign}>
        <Feather color={colors.greyInactive} name={icon} size={24} />
        <Text style={styles.title}>{title}</Text>
      </View>

      {disableRightSide ? null : (
        <View style={styles.containerRight}>
          <View style={styles.iconRight}>
            <Feather color={colors.greyInactive} name="chevron-right" size={20} />
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

LineItemProfile.defaultProps = {
  disableRightSide: null
};

LineItemProfile.propTypes = {
  // required
  icon: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  disableRightSide: PropTypes.bool.isRequired,
  // optional
  
  iconLibrary: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 10,
    width: '100%'
  },
  title: {
    ...gStyle.textBoxme14,
    color: colors.white,
    marginLeft: 16
  },
  containerRight: {
    alignItems: 'flex-end',
    flex: 1
  },
  iconRight :{
    position:'absolute',
    top:-5
  }
});

export default LineItemProfile;
