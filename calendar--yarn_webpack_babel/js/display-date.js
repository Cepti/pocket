export const displayCalendarElement = (elemDate, currentMonth, calendarContainer, isToday) => {
    const newElem = document.createElement('div');
    if (elemDate.getMonth() === currentMonth) {
        newElem.classList.add('calendar_element');
        if (isToday) {
                newElem.classList.add('current_date');
            }
    } else {
        newElem.classList.add('calendar_element', 'not_current_month');
    }
    newElem.innerText = elemDate.getDate();
    calendarContainer.appendChild(newElem);
}