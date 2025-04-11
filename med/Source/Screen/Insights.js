import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { LineChart } from "react-native-gifted-charts";
import { ThemeContext } from '../Context/ThemeContext';

const MyComponent = () => {
  const [datewiseData, setDatewiseData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState('2025-01-25');
  const { themeColors, toggleTheme } = useContext(ThemeContext);
  const [isStartDatePickerVisible, setStartDatePickerVisible] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisible] = useState(false);

  const data = [
    {
      id: "1737808490595",
      date: "2024-01-30",
      totalPrice: 40,
      orders: [
        { name: "Missal", price: 40, quantity: 1 }
      ]
    },
    {
      id: "1737808504238",
      date: "2025-01-25",
      totalPrice: 80,
      orders: [
        { name: "Missal", price: 40, quantity: 1 },
        { name: "Poha", price: 20, quantity: 2 }
      ]
    },
    {
      id: "1737808497323",
      date: "2025-01-24",
      totalPrice: 60,
      orders: [
        { name: "Missal", price: 40, quantity: 1 },
        { name: "Poha", price: 20, quantity: 1 }
      ]
    },
    // Add more items here as per your existing data
  ];

  // Function to generate dates between a start and end date
  const generateEmptyDates = (startDate, endDate) => {
    let dates = [];
    let currentDate = new Date(startDate);
    const end = new Date(endDate);

    while (currentDate <= end) {
      dates.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };

  // Function to aggregate the data by date
  const aggregateDatewiseData = (data) => {
    let aggregatedData = {};

    data.forEach((item) => {
      const date = item.date;

      if (!aggregatedData[date]) {
        aggregatedData[date] = {
          date,
          totalOrders: 0,
          moneyEarned: 0,
          itemsSold: 0,
        };
      }

      aggregatedData[date].totalOrders += 1;
      aggregatedData[date].moneyEarned += item.totalPrice;

      item.orders.forEach(order => {
        aggregatedData[date].itemsSold += order.quantity;
      });
    });

    const result = Object.values(aggregatedData);

    result.sort((a, b) => new Date(a.date) - new Date(b.date));

    return result;
  };

  const handleDateFilter = () => {
    // Aggregate the data
    const aggregatedData = aggregateDatewiseData(data);

    // Filter the data based on the selected date range
    const filteredData = aggregatedData.filter(item => {
      return item.date >= startDate && item.date <= endDate;
    });

    // Generate empty dates to fill the data for the chart
    const fullDateList = generateEmptyDates(startDate, endDate);

    // Fill in missing data for the selected date range
    const finalData = fullDateList.map(date => {
      const existingData = filteredData.find(d => d.date === date);
      return existingData ? existingData : { date, totalOrders: 0, moneyEarned: 0, itemsSold: 0 };
    });

    setDatewiseData(finalData);

    // Prepare data for the chart
    const chartFormattedData = finalData.map(item => ({
      value: item.moneyEarned,
      date: item.date
    }));

    setChartData(chartFormattedData);
  };

  useEffect(() => {
    handleDateFilter();  // Initialize with default date range
  }, [startDate, endDate]);

  // Handlers for date picker visibility
  const showStartDatePicker = () => setStartDatePickerVisible(true);
  const hideStartDatePicker = () => setStartDatePickerVisible(false);
  const handleStartDateConfirm = (date) => {
    setStartDate(date.toISOString().split('T')[0]);
    hideStartDatePicker();
  };

  const showEndDatePicker = () => setEndDatePickerVisible(true);
  const hideEndDatePicker = () => setEndDatePickerVisible(false);
  const handleEndDateConfirm = (date) => {
    setEndDate(date.toISOString().split('T')[0]);
    hideEndDatePicker();
  };

  // Aggregate totals for the filtered date range
  const aggregateTotals = (data) => {
    return data.reduce(
      (totals, item) => {
        totals.totalOrders += item.totalOrders;
        totals.moneyEarned += item.moneyEarned;
        totals.itemsSold += item.itemsSold;
        return totals;
      },
      { totalOrders: 0, moneyEarned: 0, itemsSold: 0 }
    );
  };

  const totals = aggregateTotals(datewiseData);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <View style={styles.datePickerContainer}>
        <Text>Select Start Date:</Text>
        <Button title={`Start Date: ${startDate}`} onPress={showStartDatePicker} />
        <DateTimePickerModal
          isVisible={isStartDatePickerVisible}
          mode="date"
          date={new Date(startDate)}
          onConfirm={handleStartDateConfirm}
          onCancel={hideStartDatePicker}
        />
        
        <Text>Select End Date:</Text>
        <Button title={`End Date: ${endDate}`} onPress={showEndDatePicker} />
        <DateTimePickerModal
          isVisible={isEndDatePickerVisible}
          mode="date"
          date={new Date(endDate)}
          onConfirm={handleEndDateConfirm}
          onCancel={hideEndDatePicker}
        />
        
        <Button title="Filter Data" onPress={handleDateFilter} />
      </View>

      <View style={styles.chartContainer}>
        <LineChart
          areaChart
          data={chartData}
          rotateLabel
          width={350}
          hideDataPoints
          spacing={10}
          color="#00ff83"
          thickness={2}
          startFillColor="rgba(20,105,81,0.3)"
          endFillColor="rgba(20,85,81,0.01)"
          startOpacity={0.9}
          endOpacity={0.2}
          initialSpacing={0}
          noOfSections={6}
          maxValue={600}
          yAxisColor="white"
          yAxisThickness={0}
          rulesType="solid"
          rulesColor="gray"
          yAxisTextStyle={{ color: 'gray' }}
          yAxisSide="right"
          xAxisColor="lightgray"
          pointerConfig={{
            pointerStripHeight: 160,
            pointerStripColor: 'lightgray',
            pointerStripWidth: 2,
            pointerColor: 'lightgray',
            radius: 6,
            pointerLabelWidth: 100,
            pointerLabelHeight: 90,
            activatePointersOnLongPress: true,
            autoAdjustPointerLabelPosition: false,
            pointerLabelComponent: items => {
              return (
                <View
                  style={{
                    height: 110,
                    width: 100,
                    justifyContent: 'center',
                    marginTop: -30,
                    marginLeft: -40,
                  }}
                >
                  <Text style={{ color: 'white', fontSize: 14, marginBottom: 6, textAlign: 'center' }}>
                    {items[0].date}
                  </Text>
                  <View
                    style={{
                      paddingHorizontal: 14,
                      paddingVertical: 6,
                      borderRadius: 16,
                      backgroundColor: 'white',
                    }}
                  >
                    <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>
                      {'$' + items[0].value + '.0'}
                    </Text>
                  </View>
                </View>
              );
            }
          }}
        />
      </View>

      <View style={styles.totalsContainer}>
        <Text style={styles.totalsText}>Total Orders: {totals.totalOrders}</Text>
        <Text style={styles.totalsText}>Total Money Earned: ${totals.moneyEarned}</Text>
        <Text style={styles.totalsText}>Total Items Sold: {totals.itemsSold}</Text>
      </View>

      {/* <FlatList
        data={datewiseData}
        keyExtractor={(item) => item.date}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.dateText}>Date: {item.date}</Text>
            <Text>Total Orders: {item.totalOrders}</Text>
            <Text>Money Earned: ${item.moneyEarned}</Text>
            <Text>Items Sold: {item.itemsSold}</Text>
          </View>
        )}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   padding: 20,
  // },
  datePickerContainer: {
    marginBottom: 20,
  },
  chartContainer: {
    marginBottom: 20,
  },
  totalsContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  totalsText: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  // itemContainer: {
  //   marginBottom: 20,
  //   padding: 15,
  //   backgroundColor: '#f8f8f8',
  //   borderRadius: 8,
  //   shadowColor: '#000',
  //   shadowOpacity: 0.1,
  //   shadowRadius: 5,
  //   shadowOffset: { width: 0, height: 3 },
  // },
});

export default MyComponent;
