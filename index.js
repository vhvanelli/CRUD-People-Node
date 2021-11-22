const { request, response } = require('express');
const express = require('express');
const uuid = require('uuid');
const cors = require('cors');

const port = 3001;
const app = express();
app.use(express.json())
app.use(cors())

//---------QUERY PARAMS------------------
// app.get('/users', (request, response) => {
//     const {name, age} = request.query;

//     return response.json({name, age});
// })



//---------ROUTE PARAMS------------------
// app.get('/users/:id', (request, response) => {
//     const { id } = request.params

//     console.log(id)

//     return response.json({id});
// })



//---------BODY PARAMS------------------
// app.get('/users', (request, response) => {
//     const { name,age } = request.body
//     console.log(request.body)

//     return response.json({name, age});
// })

const users = [];
//Middleware -> INTERCEPTADOR -> Tem o poder de parar ou alterar dados da requisição.
const checkUserId = (request,response,next) =>{
    const { id } = request.params;
    const index = users.findIndex(user => user.id === id);

    if(index < 0){
        response.status(404).json({error:"User not found"});
    }

    request.userIndex = index;
    request.userId = id
    next()
}
//Retorna todos os usuários
app.get("/users", (request,response) => {    
    return response.json(users);
});
//Cria novo usuário
app.post("/users", (request,response) => {    
    const { name, age } = request.body;

    const user = {id:uuid.v4() , name, age}

    users.push(user)

    return response.status(201).json(user);
});
// Atualiza o usuário
app.put("/users/:id",checkUserId,(request, response) => {
    const { name, age } = request.body;
    const index = request.userIndex;
    const id = request.userId;
    const updatedUser = {id, name, age};

    users[index] = updatedUser;
    console.log(index);

    return response.json(updatedUser);
})
// Deleta usuário
app.delete("/users/:id",checkUserId,(request, response) => {
    const { id } = request.params;
    const index = request.userIndex;

    users.splice(index, 1);

    return response.status(204).json();
})
 

app.listen(port,()=>{
    console.log(`Servidor rodando na porta ${port} 🚀️`);
});