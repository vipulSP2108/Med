import { useState, useEffect, useContext } from 'react';
import moment from 'moment';
import Colors from './Colors';
import { ThemeContext } from '../Context/ThemeContext';

export default useShopStatus = (openingTime = '09:00 am', closingTime = '09:00 pm', offDays = [], leaveDayString = '') => {
  // const [status, setStatus] = useState({ text: '', color: [], state: '' });
    // const { Colors.dark.colors, toggleTheme } = useContext(ThemeContext);
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  // Determine the status
  let newStatus = { text: '', color: [], state: '' };
  // useEffect(() => {
  const checkShopStatus = () => {
    const currentDate = new Date();
    const currentDay = currentDate.getDay(); // 0 is Sunday, 6 is Saturday
    const currentTime = currentDate.getHours() * 60 + currentDate.getMinutes(); // time in minutes
    const currentdayNames = dayNames[currentDay]

    // Convert opening and closing time from "HH:mm am/pm" to minutes of the day
    const convertTimeToMinutes = (time) => {
      if (!time) return 0;
      const timeParts = time.split(':');
      let minutes = (parseInt(timeParts[0]) % 12) * 60 + parseInt(timeParts[1]);

      if (time.toLowerCase().includes('pm') && parseInt(timeParts[0]) < 12) {
        minutes += 12 * 60; // Convert PM hours to 24-hour format
      }

      return minutes;
    };

    let openingMinutes = convertTimeToMinutes(openingTime);
    let closingMinutes = convertTimeToMinutes(closingTime);

    // If closing time is earlier than opening time, it means it spans overnight
    const isOvernight = closingMinutes < openingMinutes;

    // if (isOvernight) {
    //   closingMinutes += 24 * 60; // Add 24 hours (1440 minutes) to closing time for overnight handling
    // }

    const date = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const todayDate = date.toLocaleDateString('en-US', options);

    // Check if the shop is off on the current day
    const isOffDay = Array.isArray(offDays) && offDays.includes(currentdayNames);
    const isLeaveDay = leaveDayString && leaveDayString === todayDate;

    if (isLeaveDay) {
      newStatus = {
        text: `Today, the shop is under maintenance. It will resume operations on ${moment(leaveDayString, "MMMM D, YYYY").add(1, 'days').format("MMMM D, YYYY")} at ${openingTime}.`,
        color: ["#FF0000", Colors.dark.colors.backGroundColor], //"#6f0000"
        state: "closed"
      };
    } else if (isOffDay) {
      newStatus = {
        text: `We're closed for the day, but don’t worry—come back tomorrow at ${openingTime}!`,
        color: ["#FF0000", Colors.dark.colors.backGroundColor],
        state: "closed"
      }
    } else if (isOvernight) {
      // Handle overnight opening hours
      if (currentTime >= openingMinutes || currentTime < closingMinutes) {
        if (currentTime >= closingMinutes - 60 && closingMinutes - currentTime > -60) {
          newStatus = {
            text: `Hurry up! Kitchen's closing in ${closingMinutes - currentTime} minutes! Get your order now, before it's too late!`, 
            color: ["#f7ff00", '#1A4314'], 
            state: "closingSoon"
          }
        } else {
          newStatus = {
            text: "We're open and ready to serve! Dive into our menu now and enjoy a delicious meal!", 
            color: ['#0BDA51', 'transparent'], 
            state: "open"
          }
        }
      } else {
        if (currentTime >= openingMinutes - 60 && openingMinutes - currentTime > -60) {
          newStatus = {
            text: `Almost there! Just ${openingMinutes - currentTime} minutes until the kitchen's back in action! Get ready to place your order!`, 
            color: ["#f7ff00", '#FF0000'], 
            state: "openingSoon"
          }
        } else {
          newStatus = {
            text: `Oops! You missed us! We're closed for now, but we'll be back at ${openingTime}.`, 
            color: ["#FA3131", 'transparent'],
            state: "closed"
          };
        }
      }
    } else {
      // Regular day-time check (no overnight)
      if (currentTime >= openingMinutes && currentTime < closingMinutes) {
        if (currentTime >= closingMinutes - 60) {
          newStatus = {
            text: `Hurry up! Kitchen's closing in ${closingMinutes - currentTime} minutes! Get your order in now before it's too late!`, 
            color: ["#f7ff00", '#1A4314'], 
            state: "closingSoon"
          }
        } else {
          newStatus = {
            text: "We're open and ready to serve! Dive into our menu now and enjoy a delicious meal!", 
            color: ['#0BDA51', 'transparent'], 
            state: "open"
          }
        }
      } else {
        if (currentTime >= openingMinutes - 60 && openingMinutes - currentTime > -60) {
          newStatus = {
            text: `Almost there! Just ${openingMinutes - currentTime} minutes until the kitchen's back in action!`, 
            color: ["#f7ff00", '#FF0000'], 
            state: "openingSoon"
          }
        } else {
          newStatus = {
            text: `Oops! You missed us! We're closed for now, but we'll be back at ${openingTime}.`, 
            color: ["#FF0000", Colors.dark.colors.backGroundColor],
            state: "closed"
          };
        }
      }
    }

    // Update the state only if the status has changed
    // if (newStatus.state !== status.state) {
    //   setStatus(newStatus);
    // }
  };

  // Call checkShopStatus initially
  checkShopStatus();

  // Set an interval to check the status every minute
  // const interval = setInterval(checkShopStatus, 60000); // Update status every minute

  // return () => clearInterval(interval); // Cleanup interval on unmount
  // }, [openingTime, closingTime, offDays, leaveDayString, status.state]); // Added status.state to prevent infinite loop

  return newStatus;
};

//  useShopStatus;