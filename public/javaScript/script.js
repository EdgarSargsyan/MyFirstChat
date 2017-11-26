var socket = io.connect('http://localhost:3000');

function loadPrompt(){
	var nick = prompt("Wat's your NickName?");
	if(nick){
		var now = new Date();
		socket.emit('getNick', {nick: `${nick}`, time: `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`});
		socket.on('sendNick', function(dat){
			$('#chatMsg').append( `<p>_${dat.nick}_ <span class='online'>online</span> <span class="time">${dat.time}</span><p>` ) ;
		});
		$('#inpMsg').focus(function(){
			console.log('write');
			socket.emit('writes');
		});
		socket.on('userWrites', function(data){
			$('#write').append( `<p id=${data.nick}>_${data.nick}_ writes a message</p>` );
		});
		$('#inpMsg').focusout(function(){
			socket.emit('writesEnd');
		});
		socket.on('userWritesEnd', function(data){
			$(`#${data.nick}`).remove();
		});
		$('#btnSend').on('click',  function(){
			now = new Date();
			event.preventDefault();
			var msg = $('#inpMsg').val();
			if(msg){
				if(msg === 'exit'){
					location.reload();
				}else{
					socket.emit('getMsg', {msg: `${msg}`, time: `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`});
					$('#inpMsg').val("");
				}
			}
		});
		socket.on('newMsg', function(data){
			$('#chatMsg').append( `<p>_${data.nick}_ :  <span class='mess'> ${data.msg} </span> <span class="time">${data.time}</span></p>` ) ;
		});
		socket.on('desc', function(data){
			$(`#${data.nick}`).remove();
			$('#chatMsg').append( `<p>_${data.nick}_ <span class="ofline">ofline</span> </p>` ) ;
		});
	}
}

