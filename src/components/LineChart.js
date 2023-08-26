import React, { useRef,memo } from "react";
import {
    StyleSheet,
    View,
    Text,
    Dimensions
} from 'react-native';
import { 
    FontAwesome5
   } from '@expo/vector-icons';
import { 
    VictoryChart,
    VictoryAxis,
    VictoryBar,
    VictoryStack,
    VictoryLabel
  } from 'victory-native';
import { colors, gStyle } from '../constants';


const LineChart = props => {
    const width = Dimensions.get("window").width -50;
    return (
        <View style={styles.shadow}>
            <VictoryChart 
                animate={{
                    duration: 1000,
                    onLoad: { duration: 500 }
                }}
                height={200}
                width={300}
                
            >
              <VictoryStack
                  style={{ data: { width: 25 }, labels: { fontSize: 15,fill:colors.white } }}
                  >
                    
                    <VictoryBar
                        style={{ data: { fill: colors.brandPrimary, width: 25} }}
                        data={props.data2}
                        y={(data) => (-Math.abs(data.y))}
                        labels={({ datum }) => (`${Math.abs(datum.y)} `)}
                    />
                    <VictoryBar
                      style={{ data: { fill: colors.boxmeBrand, width: 25 } }}
                      data={props.data1}
                      labels={({ datum }) => (`${Math.abs(datum.y)}`)}
                    />
                  </VictoryStack>

                  <VictoryAxis
                    style={{
                        axis: { stroke:colors.transparent },
                        ticks: { stroke: colors.transparent },
                        tickLabels: { fontSize: 10, fill: colors.white }
                    }}
                    tickLabelComponent={
                        <VictoryLabel
                            angle={-90} textAnchor="end" verticalAnchor="middle"
                      />
                  }
                  tickValues={props.data1.map((point) => point.x).reverse()}
                  />
            </VictoryChart>
            <View style={[gStyle.flexRowCenter]}>
                <View style={[gStyle.flexCenter,{marginRight:10}]}>
                    <FontAwesome5 name="window-minimize" size={20} color={colors.brandPrimary} />
                    <Text style={{...gStyle.textBoxme12,color:colors.white}}>{props.t('screen.module.analysis.pickup_code')}</Text>
                </View>
                <View style={gStyle.flexCenter}>
                    <FontAwesome5 name="window-minimize" size={20} color={colors.boxmeBrand} />
                    <Text style={{...gStyle.textBoxme12,color:colors.white}}>{props.t('screen.module.analysis.pickup_minute')}</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    shadow: {
        shadowColor: colors.white,
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 3,
    }
})

export default memo(LineChart);