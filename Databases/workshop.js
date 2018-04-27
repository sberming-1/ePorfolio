const express = require('express');
var Pool = require('pg').Pool;
var bodyParser = require('body-parser');
var dateFormat = require('dateformat');


var config = {
    host: 'localhost',
    user: 'workshopmanager',
    password: 'reY5678Fgejad90',
    database: 'workshops'
};

const app = express();
var pool = new Pool(config);
app.set('port',(8080));
app.use(bodyParser.json({type: 'application/json'}));
app.use(bodyParser.urlencoded({extended: true}));

app.post('/create-user', async (req, res) => {
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var username = req.body.username;
    var email = req.body.email;

    if(!firstname || !lastname || !username || !email){
        res.json({error: "Parameters not given"});
    }
    else{
        try{
            var check = await pool.query("select username from users where username = $1", [username]);
            if(check.rows.length == 0){
                
                    var response = await pool.query("insert into users values($1,$2,$3,$4)",[firstname,lastname,username,email]);
                    res.json({status: "user added"});
            
            
            }
            
            else{
                res.json({status: "Username taken"});
            }
        }
        catch(e){
            console.log("Error running insert " + e);
        }
    }
});

app.post('/add-workshop', async(req, res) => {
    var title = req.body.title;
    var date = req.body.date;
    var location = req.body.location;
    var maxseats = req.body.maxseats;
    var instructor = req.body.instructor;

    if(!title || !date || !location || !maxseats || !instructor){
        res.json({error: "Parameters not given"});
    }
    else{
        var check = await pool.query("select title from workshops where title = $1 and date = $2 and location = $3",[title,date,location]);
        if(check.rows.length == 0){
            try{
                var response = await pool.query("insert into workshops (title,date,location,maxseats,seatstaken,instructor) values($1,$2,$3,$4,0,$5)",[title,date,location,maxseats,instructor]);
                res.json({status: "Workshop added"});
            }
            catch(e){
                console.log("Error running insert "+ e);
            }
        }
        else{
            res.json({status: "Workshop already in database"});
        }
    }
});
    
app.post('/enroll', async(req, res) => {
    var username = req.body.username;
    var title = req.body.title;
    var date = req.body.date;
    var location = req.body.location;

    if(!title || !username || !location || !date){
        res.json({error: "Parameters not given"});
    }
    else{
        try{
            var workshopCheck = await pool.query("select * from workshops where title = $1 and date = $2 and location = $3",[title,date,location]);
            var userCheck = await pool.query("select * from users where username = $1", [username]);
        }
        catch(e){
            console.log("Error running insert " + e);
        }
        if(workshopCheck.rows.length == 0){
            res.json({status: "workshop does not exist"});
            console.log("wscheck");
        }
        if(userCheck.rows.length == 0){
            res.json({status: "user does not exist"});
            console.log("usercheck");
        }
        if(workshopCheck.rows[0].seatstaken == workshopCheck.rows[0].maxseats){
            res.json({status: "no seats available"});
        }
        else{
            try{
                var response = await pool.query("insert into attendees values($1,$2)",[workshopCheck.rows[0].id,username]);
                var update = await pool.query("update workshops set seatstaken = seatstaken+1 where title = $1 and date = $2 and location = $3",[title,date,location]);
                res.json({status: "user added"});
            }
            catch(e){
                console.log("Error running insert " + e);
            } 
        }
    }
});

app.delete('/delete-user', async (req, res) => {
    var username = req.body.username;
    if(!username){
        res.json({error: "parameters not given"});
    }
    else{
        var check = await pool.query("select * from users where username = $1",[username]);
        if(check.rows.length == 0){
            res.json({status: "user does not exist"});
        }
        else{
            try{
                console.log("in try")
                var response2 = await pool.query("delete from attendees where username = $1",[username]);
                var response = await pool.query("delete from users where username = $1",[username]);
            }
            catch(e){
                console.log("Error running delete " + e);
            }
            res.json({status: "user deleted"})
        }
    }
});

app.get('/list-users', async (req, res) => {
    var type = req.query.type;
    if(!type){
        res.json({error: "parameters not given"});
    }
    else{
        try{
            var response = await pool.query("select * from users");
            console.log(JSON.stringify(response.rows));
            if(type == "summary"){
                x = [];
                for(var i=0; i<response.rows.length; i++){
                    var obj = response.rows[i];
                    x[i]= {firstname: obj.firstname,lastname: obj.lastname};
                }

                res.json({users: x});
            }
            if(type == "full"){
                x = [];
                for(var i=0; i<response.rows.length; i++){
                    var obj = response.rows[i];
                    x[i]= [obj.firstname,obj.lastname,obj.username,obj.email];
                }
                res.json({users: x});
            }
        }
        catch(e){
            console.error('Error running querry '+e);
        }
    }
});

app.get('/attendees', async (req, res) => {
    var title = req.query.title;
    var date = req.query.date;
    var location = req.query.location;

    if(!title||!date||!location){
        res.json({error: "parameters not given"});
    }
    else{
        try{
            var response = await pool.query("select u.firstname, u.lastname from users u join attendees a on u.username = a.username join workshops w on a.workshopid = w.id where w.title = $1 and w.date = $2 and w.location = $3",[title,date,location]);
            x=[i];
            for(var i=0; i<response.rows.length; i++){
                var obj = response.rows[i];
                x[i]= {firstname: obj.firstname,lastname: obj.lastname};
            }
        
            res.json({attendees: x});
        }
        catch(e){
            console.error('Error running querry '+e);
        }
    }
});

app.get('/list-workshops', async (req, res) => {
    try{
        var response = await pool.query("select * from workshops");
        console.log(JSON.stringify(response.rows));
        var x = [];
        
        for(var i=0; i<response.rows.length; i++){
            var obj = response.rows[i];
            x[i]= {title: obj.title,date: dateFormat(obj.date, "yyyy-mm-dd"),location: obj.location};
        }
    
        res.json({workshops: x});

    }
    catch(e){
        console.error('Error running querry '+e);
    }
});

app.listen(app.get('port'),() =>{
    console.log('running')
});
