'use strict';
//
const Hapi = require('@hapi/hapi');
const Path = require('path');
const Inert = require('@hapi/inert');

const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost',
        routes: {
            files:{
                relativeTo: Path.join(__dirname, 'public')
            }
        }
    });

    server.route({ //요청에 응답하는 가장 기본적인 방법 : Hello 를 띄운다
        method: 'GET',
        path: '/',
        handler: (request,h) => {
            return 'Hello';
        }
    });

   
    server.route({ //params 방식 (주소에 '/'뒤에 들어온 내용을 {age}로 인식한다.)
        method : 'GET',
        path: '/users/{age}',
        handler: (request, h) =>{
            const age =request.params.age.split('/'); //split('/')을 이용하여 '/users/13/24로 요청이 들어온다면 age[0]=13, age[1]=24가 된다.
            return `<h2>Your age is ${age[0]} </h2>`;
        }
    });

    server.route({ //404 error 출력 : 위에서 정의되지 않은 형식으로 들어온 경우 이곳에서 걸러져 404 Error를 표시한다.
        method: '*', 
        path: '/{any*}',
        handler: (request,h) => {
            return '404 ERROR!';
        }
    });

   await server.register(Inert); //Using Inert for sending static files

    //2 ways to show 'public/hello.html'
    server.route({  //1. using h.file
        method: 'GET',
        path: '/hello.html',
        handler: (request, h) =>{
            return h.file('hello.html');
        }
    })

    server.route({
        method : 'GET',
        path: '/login.html',
        handler:(request, h) =>{
            return h.file('login.html');
            
        }
    })
    
    //here is the way how to request "GET" and "POST" method
    server.route({ // 1. GET method from login.html
        method : 'GET',
        path: '/login', //http://localhost:3000/login?ID="{id}"&PASSWORD="{pw}"
        handler:(request, h) =>{  
            const information = request.query; //information has {"ID":"{id}","PASSWORD":"{pw}"}
            return information; //you can also approximate "information.ID"
        }
    })

    server.route({ // 2. POST method from login.html
        method : 'POST',
        path: '/login', //http://localhost:3000/login
        handler:(request, h) =>{
            const information = request.payload; //information is same as method get
            return information; //you can also approximate "information.ID"
        }
    })
   

    /////////////////////////////////////////////

    server.route({ //using directory handler option to show files : localhost:3000/abc.html 로 접속하면 public/abc.html을 보여준다.
        method: 'GET',
        path: '/{hereisnothingelsewhatyouwant*}', //no matter what are there
        handler:{ 
            directory: {
                path: '.', //이 path는 relativeTo의 설정을 따라갑니다. (public 예하 폴더 入)
                redirectToSlash : true, //슬래쉬를 이용해서 파일 접근을 허용할 지 묻습니다.
            }
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();