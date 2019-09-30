// implement your API here
const express = require('express'); //equivalent to importing in REACT.

const usersModel = require('./data/db.js');

const server = express();

server.use(express.json()); //Need this for post and put, allows server to read JSON.

server.get('/', (req, res)=>{ 
//order matters, first argument should always be req
res.send('hello from first node project');
});

server.get('/users', (req, res)=>{
    usersModel
    .find()
    .then(users => {
        res.json(users);
    })
    .catch(error => {
        res.status(500).json({ errorMessage: "The users information could not be retrieved."});
    });
});

server.get('/users/:id', (req, res)=>{
const id = req.params.id;

    usersModel
    .findById(id)
    .then(users => {
        if (!users) {
            res.status(404).json({ message: "The user with the specified ID does not exist." });
        }
        else{res.json(users)}
    })
    .catch(error => {
        res.status(500).json({ errorMessage: "The users information could not be retrieved." });
    });
});

server.post('/users', (req, res)=>{ // this woudn't work without server.use(express.json()) above.
    const userData = req.body;

    console.log('user data', userData);

    //Validate around here
    if (!userData.name || !userData.bio) {
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." });
    } else {
    usersModel
    .insert(userData)
    .then(user =>{
        res.status(201).json(user);
    })
    .catch(error => {
        res.status(500).json({ message: 'There was an error while saving the user to the database' });
    })
}
})

server.delete('/users/:id', (req, res)=>{
const id = req.params.id;


usersModel
.remove(id)
.then(users => {
    if (!users) {
        res.status(404).json({ message: "The user with the specified ID does not exist." });
    }
    else{res.status(200).json(users)}
})
.catch(error => {
    res.status(500).json({ message: 'The user could not be removed.' });
})
})

server.put('/users/:id', (req, res)=>{
    const id= req.params.id;
    const changes = req.body;

    usersModel
    .update(id, changes)
    .then(users => {
        if (!users) {
            res.status(404).json({ message: "The user with the specified ID does not exist." });
        }
        else{res.status(200).json(users)}
    })
    .catch(error => {
        res.json({ message: 'The user information could not be modified.' });
    })
})

const port = 7000;
server.listen(port, ()=> console.log(`\nAPI on ${port}\n`))