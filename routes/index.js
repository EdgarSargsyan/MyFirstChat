const express = require("express");
const router = express.Router();

router.get("/",(req,res)=>{
  res.render(`index`,{});
});

io.on('connection', (client) => {
	client.on('getNick', (dat) => {
		io.sockets.emit('sendNick', {nick:`${dat.nick}`, time:`${dat.time}`});
		client.on('writes', () => {
			client.broadcast.emit('userWrites', { nick: `${dat.nick}`});
		});
		client.on('writesEnd', () => {
			client.broadcast.emit('userWritesEnd', { nick: `${dat.nick}`});
		})
		client.on('getMsg', (data) => {
			io.sockets.emit('newMsg', { nick: `${dat.nick}`, msg: `${data.msg}`, time: `${data.time}` });
		})
		client.on('disconnect', () => {
			client.broadcast.emit('desc', { nick: `${dat.nick}`});
			});
	});
});	



module.exports = router;