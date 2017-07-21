/**
 * Created by choiseonho on 2017. 7. 14..
 */
'use strict';

const express = require('express');
const router = express.Router();

const util = require('../services/util');
const cafeteria = require('../services/cafeteria');

let day = [];
util.thisWeekDate(day);

const checkUserKey = (req, res, next) => {
  if (req.body.user_key !== undefined) {
    next();
  } else {
    res.status(500).send({error: 'user_key is undefined'});
  }
};

router.get('/keyboard', (req, res) => {
  const buttons = {
    type: 'buttons',
    'buttons': [
      '학생식당',
      '교직원식당',
      '기숙사식당'
    ]
  };
  res.set({
    'content-type': 'application/json'
  }).send(JSON.stringify(buttons))
});

router.post('/message', checkUserKey, async (req, res) => {
  const _obj = {
    user_key: req.body.user_key,
    type: req.body.type,
    content: req.body.content
  };

  let result = '';
  switch (_obj.content) {
    case '학생식당':
      result = await cafeteria.todayStudentCafeteria(day);
      break;
    case '교직원식당':
      result = await cafeteria.todayEmployeeCafeteria(day);
      break;
    case '기숙사식당':
      result = await cafeteria.todayDormitoryCafeteria(day);
      break;
    default:
      console.log('잘못된 입력입니다.');
      break;
  }

  let message = {
    'message': {
      'text': result
    },
    'keyboard': {
      'type': 'buttons',
      'buttons': [
        '학생식당',
        '교직원식당',
        '기숙사식당'
      ]
    }
  };

  res.set({
    'content-type': 'application/json'
  }).send(JSON.stringify(message));
});

router.post('/friend', checkUserKey, (req, res) => {
  const user_key = req.body.user_key;
  console.log(`${user_key}님이 채팅방에 참가했습니다.`);

  res.set({
    'content-type': 'application/json'
  }).send(JSON.stringify({success: true}));
});

router.delete('/friend', checkUserKey, (req, res) => {
  const user_key = req.body.user_key;
  console.log(`${user_key}님이 채팅방을 차단했습니다.`);

  res.set({
    'content-type': 'application/json'
  }).send(JSON.stringify({success: true}));
});

router.post('/chat_room/:user_key', checkUserKey, (req, res) => {
  const user_key = req.params.user_key;
  console.log(`${user_key}님이 채팅방에서 퇴장습니다.`);

  res.set({
    'content-type': 'application/json'
  }).send(JSON.stringify({success: true}));
});

module.exports = router;