const express = require('express');
const cors = require('cors');
const pg = require('pg');
const bcrypt = require('bcrypt');

var knex = require('knex')({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : '4858',
    database : 'smartbrain'
  }
});

const app = express();

app.use(cors());
app.use(express.json());

app.post('/register',(req,resp)=>{
	const hash = bcrypt.hashSync(req.body.password, 10);
	knex('users').insert({name: req.body.name,hash: hash})
	.then(res=> resp.json(req.body.name))
	.catch((err)=>resp.json('user exists'))
})

app.post('/signin',(req,resp)=>{
	knex('users').where({
	  name : req.body.name
	}).select('*')
	.then(user=>{
		if(user.length)
			if(bcrypt.compareSync(req.body.password, user[0].hash))
				resp.json(req.body.name);
			else
				resp.json('wrong password');
		else
			resp.json('no such user');
	})

})


app.listen(3050);