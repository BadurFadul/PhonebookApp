const { json } = require("body-parser");
const express = require("express")
const app= express();
const morgon = require("morgan");

const cors = require('cors')
app.use(cors())
app.use(express.static('build'))

morgon.token('body', (req) => {return req.method==="POST" ? JSON.stringify(req.body) : ""})
app.use(morgon(':method :url :status :res[content-length] - :response-time ms :body'));

app.use(express.json());
app.use(express.urlencoded({
  extended:true
}))

let persons = [
    { 
        "id": 1,
        "name": "Arto Hellas", 
        "number": "040-123400"
      },
      { 
        "id": 2,
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
      },
      { 
        "id": 3,
        "name": "Dan Abramov", 
        "number": "12-43-234345"
      },
      { 
        "id": 4,
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
      }
]
app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })

app.get('/api/persons', (request, response) => {
    response.json(persons)
  })

app.get('/api/persons/:id',(request, response) =>{
    const id = Number(request.params.id)
    const person = persons.find(person => person.id ===id)

    if (person) {
        response.json(person)
    }else{
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response)=>{
  const id = Number(request.params.id)
  persons= persons.filter(person => person.id !== id )

  response.status(204).end()

})

app.post('/api/persons', (request, response)=>{
  const user = request.body;


  if(!user.name){
    return response.status(400).json({
      error: 'name missing'})     
  }

  if(!user.number){
    return response.status(400).json({
      error: 'number missing'})     
  }

    const person = {
      name: user.name,
      number: user.number,
      id:Math.floor(Math.random()*1000)
    }
  persons=persons.concat(person)
  response.json(persons)

})

  app.get('/info',(request, response)=>{
    response.send(`<p>Phonebook has info for ${persons.length} people<p/>`+ `${new Date()}`)
  })
  
  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})