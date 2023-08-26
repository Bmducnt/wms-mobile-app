import * as React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Dimensions,
  View
} from 'react-native';
import {
  BarChart
} from "react-native-chart-kit";
import { withNavigation } from 'react-navigation';
import { colors} from '../constants';

const StaffReportHorizontal = ({ data}) => (
  <View style={styles.container}>
    <BarChart 
        data={data}
        width={Dimensions.get("window").width-20}
        height={300} 
        chartConfig={{ 
          backgroundColor: colors.cardLight,
          backgroundGradientTo: colors.cardLight,
          backgroundGradientFromOpacity: 0,
          backgroundGradientFrom: colors.cardLight,
          backgroundGradientToOpacity: 1,
          color: (opacity = 1) => colors.white,
          barPercentage: 0.28,
          barRadius : 5,  
        }}
        withHorizontalLabels={true}
        fromZero={false}
        withCustomBarColorFromData={true}
        flatColor={true}
        withInnerLines={false}
        showBarTops={false}
        showValuesOnTopOfBars={true}
        verticalLabelRotation={45}
      />
  </View>
);

StaffReportHorizontal.propTypes = {
  // required
  data: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
    width: '100%'
  },
  containerContent: {
    paddingLeft: 16
  }
});

export default withNavigation(StaffReportHorizontal);
