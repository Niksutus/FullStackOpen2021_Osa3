require('dotenv').config()
const express = require('express')
const app = express()
const axios = require('axios')
const morgan = require('morgan')
const Person = require('./models/person')
const cors = require('cors')

app.use(express.json())
app.use(cors())
app.use(express.static('build'))


// morgan.token('type', function (req, res) { return req.body })


app.use(morgan('tiny'))


// let persons = [
//       {
//         name: "Arto Hellas",
//         number: "040-123456",
//         id: 1
//       },
//       {
//         name: "Ada Lovelace",
//         number: "39-44-5323523",
//         id: 2
//       },
//       {
//         name: "Dan Abramov",
//         number: "12-43-234345",
//         id: 3
//       },
//       {
//         name: "Mary Poppendieck",
//         number: "39-23-6423122",
//         id: 4
//       }
//     ]

app.get('/info', (req, res) => {
    Person.find({}).then(persons => {
        res.send(`<p>Phonebook has info for ${persons.length} people </p><p>${new Date()}</p>`) 
    })
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if(person){
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
   Person.findByIdAndRemove(req.params.id)
    .then(result => {
        res.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
    
    const body = req.body

    if(body.name === undefined){
        return res.status(400).json({error: 'content missing'})
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        res.json(savedPerson)
    })
    .catch(error => next(error))

})

app.put('/api/persons/:id', (request, response, next) => {

    console.log(request.body)
    const body = request.body

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(request.params.id, person, { new:true })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({error: 'malformatted id'})
    } else if (error.name === 'ValidationError') {
        return response.status(400).send(error.message)
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})