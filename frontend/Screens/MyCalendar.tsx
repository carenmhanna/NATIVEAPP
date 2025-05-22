import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Calendar } from 'react-native-calendars';

const { width } = Dimensions.get('window');

interface MyCalendarProps {
  onDateSelect?: (date: string) => void;
  seizureDates?: string[];
}

const MyCalendar: React.FC<MyCalendarProps> = ({
  onDateSelect = () => {},
  seizureDates = [],
}) => {
  const today = useMemo(() => new Date(), []);
  const todayStr = useMemo(() => today.toISOString().split('T')[0], [today]);

  const [selectedDate, setSelectedDate] = useState<string>('');
  const [currentMonth, setCurrentMonth] = useState(todayStr);

  const markedDates = useMemo(() => {
    const marks: Record<string, any> = {};

    seizureDates.forEach((date) => {
      marks[date] = {
        dots: [
          {
            key: 'seizure',
            color: '#FF4C4C',
            selectedDotColor: '#FF4C4C',
          },
        ],
      };
    });

    if (selectedDate) {
      marks[selectedDate] = {
        selected: true,
        selectedColor: '#6B2A88',
        selectedTextColor: 'white',
        dots: marks[selectedDate]?.dots || [],
      };
    }

    return marks;
  }, [seizureDates, selectedDate]);

  const onDayPress = (day: any) => {
    if (day.dateString > todayStr) return; // prevent future dates

    setSelectedDate(day.dateString);
    onDateSelect(day.dateString);
  };

  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  return (
    <View style={styles.container}>
      <View style={styles.navigationContainer}>
        <Text style={styles.monthText}>
          {new Date(currentMonth).toLocaleString('default', {
            month: 'long',
            year: 'numeric',
          }).toUpperCase()}
        </Text>
      </View>

      <View style={styles.weekDayContainer}>
        {weekDays.map((day) => (
          <View key={day} style={styles.dayBox}>
            <Text style={styles.dayText}>{day}</Text>
          </View>
        ))}
      </View>

      <View style={styles.calendarFrame}>
        <Calendar
          current={currentMonth}
          maxDate={todayStr}
          onDayPress={onDayPress}
          markedDates={markedDates}
          markingType="multi-dot"
          hideExtraDays={true}
          theme={{
            backgroundColor: '#EABAFF',
            calendarBackground: '#EABAFF',
            dayTextColor: 'black',
            textSectionTitleColor: 'transparent',
            textDayFontSize: 18,
            monthTextColor: '#6B2A88',
            arrowColor: '#6B2A88',
          }}
          renderHeader={() => <></>}
          onMonthChange={(month) => setCurrentMonth(month.dateString)}
          style={{ width: width - 30 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  monthText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6B2A88',
  },
  weekDayContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width - 30,
    marginBottom: 5,
    paddingHorizontal: 2,
  },
  dayBox: {
    flex: 1,
    backgroundColor: '#6B2A88',
    borderRadius: 20,
    marginHorizontal: 2,
    alignItems: 'center',
    paddingVertical: 4,
  },
  dayText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  calendarFrame: {
    borderWidth: 3,
    borderColor: '#6B2A88',
    borderRadius: 15,
    padding: 10,
    backgroundColor: '#EABAFF',
  },
});

export default MyCalendar;
