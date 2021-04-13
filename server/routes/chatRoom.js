const express = require('express')
const ChatRoom = require('../controller/ChatRoom');

const router = express.Router();

router.post('/create',(req,res)=>{ ChatRoom.create(req,res, router.updater)});
router.get('/find', ChatRoom.find);
router.get('/find_all', ChatRoom.findAll);
router.post('/message/new',(req,res)=>{ ChatRoom.newMessage(req,res,router.updater)});
router.get('/message/get', ChatRoom.getMessages);
router.put('/user_receive_message', (req,res) =>{ ChatRoom.userReceiveMessages(req,res,router.updater) });
router.put('/user_receive_all_message', (req,res) =>{ ChatRoom.userReceiveAllMessage(req,res,router.updater) });
router.put('/user_seen_message', (req,res)=>{ ChatRoom.userSeenMessage(req,res,router.updater)});

module.exports = router;