/**
 * Created by choiseonho on 2017. 7. 14..
 */
const today = new Date();
const todayOfWeek = today.getDay();
let weekday = ['일', '월', '화', '수', '목', '금', '토'];

exports.thisWeekDate = (day) => {
  let startDate = new Date(today.setDate(today.getDate() - (todayOfWeek + 1)));
  for (let d of weekday) {
    day.push(new Date(startDate.setDate(startDate.getDate() + 1)).toISOString().slice(0, 10))
  }
};
