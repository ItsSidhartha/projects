const CALENDAR = [];
const ALL_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

const WEEK_DAYS = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun"
];

function isLeapYear(year) {
  const isDivisibleBy4 = year % 4 === 0;
  const isNotCentury = year % 100 !== 0;
  const isDivisibleBy400 = year % 400 === 0;
  const isDivisibleby4Not100 = isDivisibleBy4 && isNotCentury;

  return isDivisibleby4Not100 || isDivisibleBy400;
}

function calculateMonthEndDay(month, year) {
  if (month === 2) {
    return isLeapYear(year) ? 29 : 28;
  }

  return ((month - 1) % 7) % 2 === 0 ? 31 : 30;
}

function pushDates(firstDay, year) {
  let index = firstDay;
  for (let month = 0; month < 12; month++) {
    CALENDAR.push([]);
    const monthEndDay = calculateMonthEndDay(month + 1, year);
    let day = 1;
    for (let weeks = 0; weeks < 6; weeks++) {
      CALENDAR[month].push([]);
      while (day <= monthEndDay && index < 7) {

        CALENDAR[month][weeks][index] = day;
        day++;
        index++;
      }
      index = index === 7 ? 0 : index;
    }
  }
}

function monthFragment(month) {
  const monthContents = [];
  for (let weeks = 0; weeks < 6; weeks++) {
    let thisWeek = '';
    for (let day = 0; day < 7; day++) {
      const thisDay = (CALENDAR[month][weeks][day] || '') + '';
      thisWeek += thisDay.padStart(2).padEnd(4);
    }
    monthContents.push(thisWeek);
  }

  return monthContents;
}

function dispCalendar(year) {
  const yearMsg = `${' '.repeat(11)}${year}\n${' '.repeat(11)}${'-'.repeat(4)}`
  console.log(yearMsg);

  for (let months = 0; months < 12; months++) {
    const month = monthFragment(months);
    console.log(' '.repeat(10) + ALL_MONTHS[months]);
    console.log(' '.repeat(10) + '-'.repeat(ALL_MONTHS[months].length));
    console.log(WEEK_DAYS.join(' '));
    console.log(month.join('\n'));
    console.log('\n');
  }
}

function firstDayOfTheYear(year) {
  const totalYears = year - 1;
  const yeasDivisibleBy4 = Math.floor((totalYears) / 4);
  const centuryYears = Math.floor((totalYears) / 100);
  const yearsDivisbleBy400 = Math.floor((totalYears) / 400);
  const leapYearsCount = (yeasDivisibleBy4) - (centuryYears) + (yearsDivisbleBy400);
  const normalYearCount = totalYears - leapYearsCount;
  const totalDaysShift = normalYearCount + (2 * leapYearsCount);
  const dayShift = totalDaysShift % 7;
  return WEEK_DAYS[dayShift];
}

function main(args) {
  const year = parseInt(args[0]) || 2025;
  const firstDay = firstDayOfTheYear(year);

  const indexOfFirstDay = WEEK_DAYS.indexOf(firstDay);
  pushDates(indexOfFirstDay, year);
  dispCalendar(year);
}

main(Deno.args);  