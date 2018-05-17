var express = require('express');
var user    = require('./controllers/user');
var post    = require('./controllers/post');
var auth    = require('./controllers/auth');
var router  = express.Router();
var config  = require('./config');

router.get('/', post.index);             // 主页
router.post('/', post.post_index);       //add a post API for getting the re-render request
router.get('/week', post.week);          // 周榜
router.get('/month', post.month);        // 月榜
router.get('/p/:page', post.index);      // 主页分页
router.get('/week/p/:page', post.week);  // 周榜分页
router.get('/month/p/:page', post.week); // 月榜分页
router.get('/post/up', post.upload);     // 上传帖子
router.get('/post/pass', post.pass);     // 审核帖子
router.get('/topic/:topic', post.topic); // 某个帖子

router.get('/user/new', user.new);       // register新用户
router.get('/user/login', user.login);   // 站内login
router.get('/auths/:type', auth.index);   // 第三方login
router.get('/auth/wb', auth.wbSign);     // 微博登录
router.get('/auth/qq', auth.qqSign);     // qq登录进入
router.get('/user/out', user.out);       // logout
router.get('/user/edit', user.edit);     // 修改用户资料的页面
router.get('/user/center', user.center); // 用户中心

router.get('/user/chat/:name', user.chat); // 与某人聊天


router.get('/people/:name', user.index);      // 某人的主页
router.get('/people/:name/:page', user.index);// 某人的主页的分页
router.get('/reply/:name', user.reply);       // 某人的评论
router.get('/reply/:name/:page', user.reply); // 某人的评论的分页

// 这个页面主要是用于通过iframe框架的地址来传递值！
router.use('/uploadredirect', function (req, res, next) {
	res.send('helloWorld!');
});

module.exports = router;