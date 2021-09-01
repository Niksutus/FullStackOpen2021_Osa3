const express = require('express')
const app = express()
const axios = require('axios')
const morgan = require('morgan')

app.use(express.json())
const cors = require('cors')
app.use(cors())

app.use(express.static('build'))

// morgan.token('type', function (req, res) { return req.body })


app.use(morgan('tiny'))


let persons = [
      {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
      },
      {
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: 2
      },
      {
        name: "Dan Abramov",
        number: "12-43-234345",
        id: 3
      },
      {
        name: "Mary Poppendieck",
        number: "39-23-6423122",
        id: 4
      }
    ]

app.get('/info', (req, res) => {
    res.send(`<p>Phonebook has info for ${persons.length} people </p><p>${new Date()}</p>`)
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if(person){
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    
    const body = req.body
    
    axios
        .get('http://localhost:3001/api/persons')
        .then(response => {
            let updatedPersons = response.data;
            let nameArray = updatedPersons.map(person => person.name); 
    
        if (!body.name) {
            return res.status(400).json({
            error: 'name missing'
        })
        } else if(nameArray.includes(body.name)){
            return res.status(400).json({
            error: 'name must be unique'
        })
        } else if (!body.number){
            return res.status(400).json({
            error: 'number missing'
        })
        }

        const person = {
            name: body.name,
            number: body.number,
            id: Math.floor(Math.random()*200)
        }

        persons = persons.concat(person)
        res.json(body);
    })  

})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})