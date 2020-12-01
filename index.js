// (common js)
const express = require('express') //imports express from node_modules folder
const shortid = require('shortid') //imports shortid from node_modules folder

const server = express();

// configured our server (plug functionality)
server.use(express.json())



// FAKE TABLE
let users = [{
    id: shortid.generate(),
    name: "Tina",
    bio: "i like stuff and things."
}]

console.log(users)

// HELPER FUNCTIONS
const Store = {
    getById(id) {
        return users.find(user => user.id === id)
    },

    createNew(obj) {
        const newUser = {
            id: shortid.generate(),
            ...obj
        }

        users.push(newUser)
        return newUser
    },

    delete(id) {
        const user = users.find(user => user.id === id)

        if (user){
            users = users.filter(guy => guy.id !== id)
        }
        return user //to be deleted
    }

}

// ENDPOINTS
server.post('/api/users', (req, res) => {
    
    const userFromClient = req.body; //1- gather info from the request obj
    
    try {
        if (!userFromClient.name || !userFromClient.bio){
            res.status(400).json({ errorMessage: "Please provide name and bio for the user." }) //3- send to client an appropriate response 
        } else {
            const newlyCreatedUser = Store.createNew(userFromClient); //2- interact with db
            res.status(201).json(newlyCreatedUser) //3- send to client an appropriate response
        }
    }

    catch {
        res.status(500).json({ errorMessage: "There was an error while saving the user to the database" })
    }
    
})

server.get('/api/users', (req, res) => {
    if (users) {
        const allUsers = users; //2- interact with db
        res.status(200).json(allUsers) //3- send to client an appropriate response 
    } else {
        res.status(500).json({ errorMessage: "The users information could not be retrieved." }) //3- send to client an appropriate response 
    }
})

server.get('/api/users/:id', (req, res) => {
    
    const { id } = req.params; //1- gather info from the request obj
    
    const user = Store.getById(id) //2- interact with db
    if (!user) {
        res.status(404).json({ message: "The user with the specified ID does not exist, id: " + id }) //3- send to client an appropriate response 
    } else {
        res.status(200).json(user) //3- send to client an appropriate response 
    }
    
})

server.delete('/api/users/:id', (req, res) => {
    
    const { id } = req.params; //1- gather info from the request obj

    const deleted = Store.delete(id); //2- interact with db
    
    try {
        if (deleted){
            res.status(200).json({message: "removed user"})
            console.log('removed user: ', deleted);
        } else {
            res.status(404).json({ message: "The user with the specified ID does not exist." })
        }
    }
    catch {
        res.status(500).json({ errorMessage: "The user could not be removed" })
    }

    //3- send to client an appropriate response 
})

server.put('/api/users/:id', (req, res) => {
    
    const { id } = req.params //1- gather info from the request obj
    const {name, bio } = req.body;
    const findIndex = users.findIndex(user => user.id === id);
    
    try{
        if (!name || !bio){
            res.status(400).json({ errorMessage: "Please provide name and bio for the user." }) //3- send to client an appropriate response 
        } else if (findIndex === -1){
            res.status(404).json({ message: "The user with the specified ID does not exist." }) //3- send to client an appropriate response 
        }
        else{
            users[findIndex] = { id, name, bio} //2- interact with db
            res.status(200).json(users[findIndex]) //3- send to client an appropriate response 
        }
    }
    catch{
        res.status(500).json({ errorMessage: "The user information could not be modified." })//3- send to client an appropriate response 
    }
    
})

/// CATCH-ALL ENDPOINTS
server.use('*', (req, res) => {
    //req represents the request from the client
    //res represents the response we build for the client
    res.status(404).json({ message: 'not found'})
})

// START the SERVER
server.listen(5001, () => {
    console.log('listening on port 5001')
})