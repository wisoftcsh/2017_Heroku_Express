/**
 * Created by choiseonho on 2017. 7. 14..
 */
'use strict';

const axios = require('axios');
const cheerio = require('cheerio');

const today = new Date();
const todayOfWeek = today.getDay();
let weekday = ['일', '월', '화', '수', '목', '금', '토'];

exports.todayStudentCafeteria = async (day) => {
  const cafeteria = await getStudentCafeteria();
  const extractTodayMenu = await getTodayStudentMenu(day, cafeteria);
  return `요청한 결과\n ${extractTodayMenu}`
};

exports.todayEmployeeCafeteria = async (day) => {
  const cafeteria = await getEmployeeCafeteria();
  const extractTodayMenu = await getTodayEmployeeMenu(day, cafeteria);
  return `요청한 결과\n ${extractTodayMenu}`
};

exports.todayDormitoryCafeteria = async (day) => {
  const cafeteria = await getDormitoryCafeteria();
  const extractTodayMenu = await getTodayDormitoryMenu(day, cafeteria);
  return `요청한 결과\n ${extractTodayMenu}`
};

const getStudentCafeteria = () => {
  return axios.get(`http://m.hanbat.ac.kr/html/kr/diet/diet_01.html`).then(response => {
    return response.data;
  })
};

const getTodayStudentMenu = (day, cafeteria) => {
  const items = 5;
  let titleList = ['중식', '석식', '양식류', '일품류', '라면류'];
  let infoList = ['', '', '', '', ''];

  let result = '';
  return new Promise(resolve => {
    const $ = cheerio.load(cafeteria);

    $('article.top_mar_20').find('div > .table2 > tbody > tr').each((index, elem) => {
      titleList.push($(elem).find('th').text());
      infoList.push($(elem).find('td').text().replace('\n\n', '\n'))
    });

    result = '\n오늘의 메뉴 (' + day[todayOfWeek] + ' ' + weekday[todayOfWeek] + '요일)\n';

    let pick = (todayOfWeek * items);
    for (let i = pick; i < pick + items; i++) {
      result += '[ ' + titleList[i] + ' ]';
      if (infoList[i] === '')
        result += ' 운영하지 않음' + '\n\n';
      else
        result += infoList[i] + '\n\n';
    }

    resolve(result);
  });
};

const getEmployeeCafeteria = () => {
  return axios.get(`http://m.hanbat.ac.kr/html/kr/diet/diet_02.html`).then(response => {
    return response.data;
  })
};

const getTodayEmployeeMenu = (day, cafeteria) => {
  const items = 3;
  let titleList = ['중식', '석식', '샐러드바'];
  let infoList = ['', '', ''];

  let result = '';
  return new Promise(resolve => {
    const $ = cheerio.load(cafeteria);

    $('article.top_mar_20').find('div > .table2 > tbody > tr').each((index, elem) => {
      titleList.push($(elem).find('th').text());
      infoList.push($(elem).find('td').text().replace('\n\n', '\n'))
    });

    result = '\n오늘의 메뉴 (' + day[todayOfWeek] + ' ' + weekday[todayOfWeek] + '요일)\n';

    let pick = (todayOfWeek * items);
    for (let i = pick; i < pick + items; i++) {
      result += '[ ' + titleList[i] + ' ]';
      if (infoList[i] === '')
        result += ' 운영하지 않음' + '\n\n';
      else
        result += infoList[i] + '\n\n';
    }

    resolve(result);
  });
};

const getDormitoryCafeteria = () => {
  return axios.get(`http://dorm.hanbat.ac.kr/sub020601`).then(response => {
    return response.data;
  })
};

const getTodayDormitoryMenu = (day, cafeteria) => {
  const items = 3;
  let titleList = ['아침', '점심', '저녁'];
  let infoList = [];
  let result = '';
  return new Promise(resolve => {
    const $ = cheerio.load(cafeteria);

    $('div.table-type-01').find('table > tbody > tr > td').each((index, elem) => {
      infoList.push($(elem).text().replace('\n\t\t\t\t\t', '').replace('\t\t\t\t\n\t\t\t\t\t', '\n\n')
        .replace('\t\t\t\t\n\t\t\t\t\t', '\n\n').replace('\t\t\t\t', '\n'));
    });

    result = '\n오늘의 메뉴 (' + day[todayOfWeek] + ' ' + weekday[todayOfWeek] + '요일)\n';
    let pick = (todayOfWeek * items);
    let i = 0;
    for (let j = pick; j < pick + items; j++) {
      result += '[ ' + titleList[i++] + ' ]\n';
      if (infoList[j] === '')
        result += ' 운영하지 않음' + '\n';
      else
        result += infoList[j] + '\n';
    }


    resolve(result);
  });
};