import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './DatePickerCalendar.css';

const DatePickerCalendar = ({ availableDates = [], selectedDate = '', onDateSelect, onClear, onMonthSelect, onYearSelect, currentMonthFilter = '', currentYearFilter = '' }) => {
  const [currentMonth, setCurrentMonth] = useState(() => {
    if (selectedDate) {
      const date = new Date(selectedDate);
      return { year: date.getFullYear(), month: date.getMonth() };
    }
    return { year: new Date().getFullYear(), month: new Date().getMonth() };
  });
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);

  // Get all dates that have photos (YYYY-MM-DD format)
  const photoDates = new Set(availableDates);

  // Get days in month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  // Navigate months
  const goToPreviousMonth = () => {
    setCurrentMonth(prev => {
      if (prev.month === 0) {
        return { year: prev.year - 1, month: 11 };
      }
      return { year: prev.year, month: prev.month - 1 };
    });
  };

  const goToNextMonth = () => {
    setCurrentMonth(prev => {
      if (prev.month === 11) {
        return { year: prev.year + 1, month: 0 };
      }
      return { year: prev.year, month: prev.month + 1 };
    });
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth.year, currentMonth.month);
    const firstDay = getFirstDayOfMonth(currentMonth.year, currentMonth.month);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentMonth.year}-${String(currentMonth.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      days.push({
        day,
        dateStr,
        hasPhoto: photoDates.has(dateStr),
        isSelected: selectedDate === dateStr
      });
    }

    return days;
  };

  const handleDateClick = (dateStr) => {
    if (dateStr) {
      onDateSelect(dateStr);
    }
  };

  // Generate year list (current year ± 10 years)
  const generateYearList = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 10; i <= currentYear + 10; i++) {
      years.push(i);
    }
    return years;
  };

  const handleMonthSelect = (monthIndex) => {
    setCurrentMonth(prev => ({ ...prev, month: monthIndex }));
    setShowMonthPicker(false);
    // If onMonthSelect callback is provided, call it
    if (onMonthSelect) {
      onMonthSelect(currentMonth.year, monthIndex);
    }
  };

  const handleYearSelect = (year) => {
    setCurrentMonth(prev => ({ ...prev, year }));
    setShowYearPicker(false);
    // If onYearSelect callback is provided, call it
    if (onYearSelect) {
      onYearSelect(year);
    }
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];
  const monthNamesShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const calendarDays = generateCalendarDays();
  const yearList = generateYearList();

  return (
    <div className="date-picker-calendar">
      <div className="calendar-header">
        <button className="calendar-nav-btn" onClick={goToPreviousMonth}>
          <FaChevronLeft />
        </button>
        <div className="calendar-month-year">
          <button 
            className={`calendar-month-btn ${currentMonthFilter ? 'filtered' : ''}`}
            onClick={() => {
              setShowMonthPicker(!showMonthPicker);
              setShowYearPicker(false);
            }}
            title={currentMonthFilter ? `Filtered: ${currentMonthFilter}` : 'Select month'}
          >
            {monthNames[currentMonth.month]}
            {currentMonthFilter && <span className="filter-indicator">●</span>}
          </button>
          <button 
            className={`calendar-year-btn ${currentYearFilter ? 'filtered' : ''}`}
            onClick={() => {
              setShowYearPicker(!showYearPicker);
              setShowMonthPicker(false);
            }}
            title={currentYearFilter ? `Filtered: ${currentYearFilter}` : 'Select year'}
          >
            {currentMonth.year}
            {currentYearFilter && <span className="filter-indicator">●</span>}
          </button>
        </div>
        <button className="calendar-nav-btn" onClick={goToNextMonth}>
          <FaChevronRight />
        </button>
      </div>

      {showMonthPicker && (
        <div className="calendar-picker-dropdown month-dropdown">
          {monthNames.map((month, index) => (
            <button
              key={index}
              className={`calendar-picker-dropdown-item ${currentMonth.month === index ? 'active' : ''}`}
              onClick={() => handleMonthSelect(index)}
            >
              {month}
            </button>
          ))}
        </div>
      )}

      {showYearPicker && (
        <div className="calendar-picker-dropdown year-dropdown">
          {yearList.map(year => (
            <button
              key={year}
              className={`calendar-picker-dropdown-item ${currentMonth.year === year ? 'active' : ''}`}
              onClick={() => handleYearSelect(year)}
            >
              {year}
            </button>
          ))}
        </div>
      )}

      <div className="calendar-weekdays">
        {dayNames.map(day => (
          <div key={day} className="calendar-weekday">{day}</div>
        ))}
      </div>

      <div className="calendar-days">
        {calendarDays.map((dayData, index) => {
          if (dayData === null) {
            return <div key={`empty-${index}`} className="calendar-day empty"></div>;
          }

          return (
            <button
              key={dayData.dateStr}
              className={`calendar-day ${dayData.hasPhoto ? 'has-photo' : ''} ${dayData.isSelected ? 'selected' : ''}`}
              onClick={() => handleDateClick(dayData.dateStr)}
              title={dayData.hasPhoto ? `Has photos on ${dayData.dateStr}` : ''}
            >
              {dayData.day}
            </button>
          );
        })}
      </div>

      {selectedDate && (
        <div className="calendar-footer">
          <button className="clear-calendar-btn" onClick={onClear}>
            Clear
          </button>
        </div>
      )}
    </div>
  );
};

export default DatePickerCalendar;
