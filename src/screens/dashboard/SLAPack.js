import * as React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
} from 'react-native';
import {
  colors,
  gStyle ,
} from '../../constants';
import ChartModule from '../../components/ChartModule';
import {translate} from "../../i18n/locales/IMLocalized";




const SLAPack = props => {
    const [data, setdata] = React.useState([]);
    const chartColor = [colors.boxmeBrand,colors.darkgreen,colors.purple,colors.lightBlue,colors.lightGreen]
    React.useEffect(() => {
      caclulateDataChar();
    }, []);

    const caclulateDataChar = async () =>{
      let dataChart = [];
      props.slaPack.forEach((element,i) => {
        dataChart.push({
          id: i,
          name: element.name,
          color: chartColor[Math.floor(Math.random() * 5)],
          expenses: [
              {
                  total: element.value,
                  status: "C"
              }
          ]
        })
      })
      setdata(dataChart)
    };


    return (
        <React.Fragment>
          <View style={[gStyle.container]}>
            {props.slaPack && <View style={gStyle.flexRowSpace}>
              <Text style={[styles.sectionHeading]} numberOfLines={1}>SLA Pack</Text>
            </View>}

            {data.length >0 &&
              <ChartModule
                data={data}
                bg={colors.cardLight}
                text_info = {translate("screen.module.staff_report.unit_item")}
              />
            }
            </View>
        </React.Fragment>
      );
    }

const styles = StyleSheet.create({
    sectionHeading: {
      ...gStyle.textBoxme16,
      color: colors.white,
      marginVertical:6,
      marginLeft: 10
    },
});

export default React.memo(SLAPack);
