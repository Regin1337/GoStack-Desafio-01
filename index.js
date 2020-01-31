const express = require('express');

const server = express();

server.use(express.json());

const projects = []

var contador = 0

// Middleware Global contar o numero de requisições
server.use((req, res, next) => {

    contador++
    console.log(`Número de requisições: ${contador}`);
    
    next();
})

// Middleware Local para checar se o projeto existe, usando o id como parametro
function checkProjectExists(req, res, next){
    const { id } = req.params;
    const project = projects.find(project => project.id == id);
    if (!project){
        return res.status(400).json({ error: 'Project does not exists' });
    }

    return next();
}

// Listar todos os projetos
server.get('/projects', (req, res) => {
    return res.json(projects);
})

// Criar projeto
server.post('/projects', (req, res) => {
    const { id } = req.body
    const { title } = req.body
    
    projects.push({
        id,
        title,
        tasks:[]
    });

    return res.json(projects);
})

// Criar tarefa do projeto
server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const project = projects.find(project => project.id == id);
    
    project.tasks.push(title);

    return res.json(projects);
})

// Editar projeto
server.put('/projects/:id', checkProjectExists, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const project = projects.find(project => project.id == id);
    
    project.title = title;

    return res.json(project);
})

// Apagar projeto
server.delete('/projects/:id', checkProjectExists, (req, res) => {
    const { id } = req.params;
    
    const projectIndex = projects.findIndex(project => project.id == id);

    projects.splice(projectIndex, 1);
    
    return res.json(projects);
})

server.listen(3000);