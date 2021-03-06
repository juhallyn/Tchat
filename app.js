/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   app.js                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: hp-user <hp-user@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/11/13 06:45:51 by hp-user           #+#    #+#             */
/*   Updated: 2018/11/15 11:15:01 by hp-user          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');
const port = 8080;

let users = [];
let connections = [];

let server = http.createServer((request, response) => {
	let page = url.parse(request.url).pathname;
	let filePath = path.join(__dirname, page);

	if (page == '/')
	{
		fs.readFile("index.html", 'utf-8', (err, content) => {
			if (err) { console.log(err) }
			else {
				response.writeHead(200, { "Content-Type": "text/html"});
				response.end(content);
			}
		});
	}
	else
	{
		response.writeHead(200, { "Content-Type" : "text/html"});
		response.end("<h1>NOPE</h1>");
	}
});

var io = require('socket.io').listen(server);

io.sockets.on('connection', (socket) => {
	connections.push(socket);
	console.log("new connection | sockets Total : %d", connections.length);
	socket.on('disconnect', (data) => {
		connections.splice(connections.indexOf(socket), 1);
		console.log("DISCONNECT | sockets Total : %d", connections.length);
	});
	socket.on('send message', (data) => {
		io.sockets.emit('new message', {msg: data});
		console.log("data = %s", data);
	});
});

console.log("Server listenning on %d ...", port);
server.listen(port);
