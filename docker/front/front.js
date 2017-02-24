"use strict"

var HOST = process.env.HOST || process.argv[2] || '127.0.0.1'
var BASES = (process.env.BASES || process.argv[3] || '').split(',')


var Hapi = require('hapi')
var Rif = require('rif')

var server = new Hapi.Server()
var rif = Rif()

console.log(HOST,rif(HOST),require('os').networkInterfaces())
setTimeout(console.log,5000)


server.connection({ 
  port: 8000 // test with http://localhost:8000/api/ping
})

server.register(require('inert'))

server.register({
  register: require('wo'),
  options: {
    bases: BASES,
      sneeze: {
	  host: rif(HOST),
	  silent: false
      }
  }
})

server.route({ 
  method: 'GET', path: '/api/ping', 
  handler: {
    wo: {}
  }
})

server.route({
  method: 'POST', path: '/api/post/{user}', 
  handler: {
    wo: {
      passThrough: true
    }
  }
})

server.route({
  method: 'POST', path: '/api/follow/{user}', 
  handler: {
    wo: {
      passThrough: true
    }
  }
})


server.route({ 
  method: 'GET', path: '/mine/{user}', 
  handler: {
    wo: {}
  }
})


server.route({ 
  method: ['GET','POST'], path: '/search/{user}', 
  handler: {
    wo: {}
  }
})


server.route({ 
  method: 'GET', path: '/{user}', 
  handler: {
    wo: {}
  }
})

server.route({
  path: '/favicon.ico',
  method: 'get',
  config: {
    cache: {
      expiresIn: 1000*60*60*24*21
    }
  },
  handler: function(request, reply) {
    reply().code(200).type('image/x-icon')
  }
})

server.route({
  method: 'GET',
  path: '/res/{path*}',
  handler: {
    directory: {
      path: __dirname + '/www/res',
    }
  }
})


server.start(function(){
  console.log('front',server.info.uri)
})
