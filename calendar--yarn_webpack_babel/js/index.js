import { formCalendarList } from './render-calendar.js';

import '../scss/main.scss';
import '../scss/dates-list.scss';

const buttonUp = document.querySelector('.nav_button_up');
const buttonDown = document.querySelector('.nav_button_down');

const today = new Date();
let date = today;

formCalendarList(date, today);

buttonUp.addEventListener('click', () => {
    date = new Date(date.getFullYear(), date.getMonth() + 1);
    formCalendarList(date, today);
});

buttonDown.addEventListener('click', () => {
    date = new Date(date.getFullYear(), date.getMonth() - 1);
    formCalendarList(date, today);
});