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
        }});
    await server.register(
        {  //hapi-mongodb 用
        plugin: require('hapi-mongodb'),
        options:{
            url:"mongodb://localhost:27017/hapinotice",
            settings:{
                useUnifiedTopology: true,
            },
            decorate: true
        }
    });
    
    await server.register(Inert);

    server.route({
        method: 'GET',
        path: '/',
        handler:{
            file: 'main.html'
        }
    });

    server.route({
        method: 'POST',
        path: '/',
        handler: async (req,h)  => {
            const login_data = req.payload;
            const id = await req.mongo.db.collection('members').findOne({"ID":login_data.ID});
            if(id===null) return "Nothing";
            else{
                const next = await req.mongo.db.collection('members')
                    .findOne({"ID":login_data.ID}, {"PASSWORD":login_data.PASSWORD});
                console.log(next);
                if(next===null) return "ID OK PW NO";
                else return "GREAT!";
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/signup',
        handler: async (req,h) =>{
            const join_data = req.payload;
            console.log(join_data);
            await req.mongo.db.collection('members').insertOne(join_data);
            return "DONE!";
        }
    })
    
    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();