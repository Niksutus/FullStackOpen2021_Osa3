const mongoose = require('mongoose')

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.rp581.mongodb.net/puhelinluettelosovellus?retryWrites=true&w=majority`


if(process.argv.length <3) {
  console.log('give password as a argument')
  process.exit(1)
}

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if(!process.argv[3]){
  Person.find({}).then(persons => {
    persons.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
} else {

  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })

  person.save().then(response => {
    console.log(`added ${process.argv[3]} number ${process.argv[4]}`)
    mongoose.connection.close()
  })
}


