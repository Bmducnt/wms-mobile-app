import React, { useRef,memo } from "react";
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    TouchableOpacity,
    Platform
} from 'react-native';
import { VictoryPie } from 'victory-native';
import { colors, gStyle } from '../constants';

import {Svg} from 'react-native-svg';

const ChartModule = props => {

    // dummy data
    const [categories, setCategories] = React.useState(props.data);
    const [selectedCategory, setSelectedCategory] = React.useState(null);

    // React.useEffect(() => {
    //     selectDefaultLabel()
    // }, [])


    function selectDefaultLabel(){
        categories.forEach((element,i) => {
            if (element.expenses[0].total >0){
                setSelectedCategory(element);
                return;
            }
        })
    }
    function processCategoryDataToDisplay() {
        // Filter expenses with "Confirmed" status
        let chartData = categories.map((item) => {
            let confirmExpenses = item.expenses.filter(a => a.status == "C")
            var total = confirmExpenses.reduce((a, b) => a + (b.total || 0), 0)

            return {
                name: item.name,
                y: total,
                expenseCount: confirmExpenses.length,
                color: item.color,
                id: item.id
            }
        })

        // filter out categories with no data/expenses
        let filterChartData = chartData.filter(a => a.y >= 0)

        // Calculate the total expenses
        let totalExpense = filterChartData.reduce((a, b) => a + (b.y || 0), 0)

        // Calculate percentage and repopulate chart data
        let finalChartData = filterChartData.map((item) => {
            let percentage = (item.y / totalExpense * 100).toFixed(0)
            return {
                label: `${percentage}%`,
                y: Number(item.y),
                expenseCount: item.expenseCount,
                color: item.color,
                name: item.name,
                id: item.id
            }
        })

        return finalChartData
    }

    function setSelectCategoryByName(name) {
        let category = categories.filter(a => a.name == name)
        setSelectedCategory(category[0])
    }

    function renderChart() {

        let chartData = processCategoryDataToDisplay()
        let colorScales = chartData.map((item) => item.color)
        let totalExpenseCount = 0
        categories.forEach((element,i) => {
            totalExpenseCount += element.expenses[0].total
        })
        if(Platform.OS == 'ios')
        {
            return (
                <View  style={[gStyle.flexRowCenterAlign]}>
                    <VictoryPie
                        data={chartData}
                        labels={(datum) => `${datum.y}`}
                        radius={({ datum }) => (selectedCategory && selectedCategory.name == datum.name) ? 
                        Dimensions.get("window").width * 0.15 : Dimensions.get("window").width * 0.15 - 10}
                        innerRadius={18}
                        labelRadius={({ innerRadius }) => (Dimensions.get("window").width * 0.15 + innerRadius) / 2.5}
                        style={{
                            labels: { fill: "white",  fontSize:10},
                            parent: {
                                ...styles.shadow
                            },
                        }}
                        width={Dimensions.get("window").width * 0.3}
                        height={Dimensions.get("window").width * 0.3}
                        colorScale={colorScales}
                        events={[{
                            target: "data",
                            eventHandlers: {
                                onPress: () => {
                                    return [{
                                        target: "labels",
                                        mutation: (props) => {
                                            let categoryName = chartData[props.index].name
                                            setSelectCategoryByName(categoryName)
                                        }
                                    }]
                                }
                            }
                        }]}
    
                    />
                    {renderExpenseSummary()}
                </View>
    
            )
        }
        else
        {
            // Android workaround by wrapping VictoryPie with SVG
            return (
                <View  style={[gStyle.flexRowCenter]}>
                    <Svg width={Dimensions.get("window").width* 0.3} height={Dimensions.get("window").width* 0.3} style={{width: "100%", height: "auto"}}>

                        <VictoryPie
                            standalone={false} // Android workaround
                            data={chartData}
                            labels={(datum) => `${datum.y}`}
                            radius={({ datum }) => (selectedCategory && selectedCategory.name == datum.name) ? Dimensions.get("window").width * 0.15 : 
                                Dimensions.get("window").width * 0.15 - 10}
                            innerRadius={18}
                            labelRadius={({ innerRadius }) => (Dimensions.get("window").width * 0.15 + innerRadius) / 2.5}
                            style={{
                                labels: { fill: "white" ,fontSize:10},
                                parent: {
                                    ...styles.shadow
                                },
                            }}
                            width={Dimensions.get("window").width* 0.3}
                            height={Dimensions.get("window").width* 0.3}
                            colorScale={colorScales}
                            events={[{
                                target: "data",
                                eventHandlers: {
                                    onPress: () => {
                                        return [{
                                            target: "labels",
                                            mutation: (props) => {
                                                let categoryName = chartData[props.index].name
                                                setSelectCategoryByName(categoryName)
                                            }
                                        }]
                                    }
                                }
                            }]}
        
                        />
                    </Svg>
                    {renderExpenseSummary()}
                </View>
            )
            
        }
        
    }

    function renderExpenseSummary() {
        let data = processCategoryDataToDisplay()

        const renderItem = (item,index) => (
            <TouchableOpacity
                key={index}
                style={{
                    flexDirection: 'row',
                    height: 25,
                    width:(Dimensions.get("window").width-Dimensions.get("window").width* 0.35)-5,
                    borderRadius:3,
                    paddingHorizontal: 6,
                    backgroundColor: (selectedCategory && selectedCategory.name == item.name) ? item.color: colors.transparent
                }}
                onPress={() => {
                    let categoryName = item.name
                    setSelectCategoryByName(categoryName)
                }}
            >
                {/* Name/Category */}
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <View
                        style={{
                            width: 8,
                            height: 8,
                            backgroundColor: (selectedCategory && selectedCategory.name == item.name) ? colors.white : item.color,
                            borderRadius: 4
                        }}
                    />

                    <Text style={{ marginLeft: 5, color: (selectedCategory && selectedCategory.name == item.name) ? colors.white : colors.greyInactive, ...gStyle.textBoxme12 }}>{item.name}</Text>
                </View>

                {/* Expenses */}
                <View style={{ justifyContent: 'center',paddingRight:8 }}>
                    <Text style={{ color: (selectedCategory && selectedCategory.name == item.name) ? colors.white : colors.greyInactive, ...gStyle.textBoxme12 }}>{item.y.toLocaleString()} pcs - {item.label}</Text>
                </View>
            </TouchableOpacity>
        )

        return (
            <View style={{ padding:5,width:(Dimensions.get("window").width-Dimensions.get("window").width* 0.35)}}>
                {data &&
                    data.map((item, index) => (
                        renderItem(item,index.toString())
                    ))
                }
            </View>

        )
    }

    return (
        <View style={[{ flex: 1,backgroundColor:props.bg,marginHorizontal:10,borderRadius:6}]}>
            {renderChart()}
        </View>
    )
}

const styles = StyleSheet.create({
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 3,
    }
})

export default memo(ChartModule);