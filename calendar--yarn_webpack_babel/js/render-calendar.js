import { displayCalendarElement } from './display-date.js';

export const formCalendarList = (date, today) => {
    const calendarContainer = document.querySelector('.date_list');
    const currentMonthHeader = document.querySelector('.current_month');

    calendarContainer.innerHTML = '';

    const currentMonth = date.getMonth();
    const currentMonthsFirstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    let currentMonthsFirstWeekday = currentMonthsFirstDay.getDay();

    const daysInDaWeek = 7;

    if (currentMonthsFirstWeekday === 0) {
        currentMonthsFirstWeekday = daysInDaWeek;
    }

    currentMonthHeader.innerText = `${date.toLocaleString('en-GB', { month: 'long' })} ${date.getFullYear()}`;
    const datesInTheList = 42;

    for (let i = 0; i < datesInTheList; i++) {
        const calendarListElem = new Date(date.getFullYear(), date.getMonth(), 1 - currentMonthsFirstWeekday + i);

        if (today.getFullYear() === calendarListElem.getFullYear() &&
            today.getMonth() === calendarListElem.getMonth() &&
            today.getDate() === calendarListElem.getDate()) {
            displayCalendarElement(calendarListElem, currentMonth, calendarContainer, true);
        } else {
            displayCalendarElement(calendarListElem, currentMonth, calendarContainer);
        }
    }
}