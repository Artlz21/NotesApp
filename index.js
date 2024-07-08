// This is where we connect the server and the frontend together now and finish our
// full stack app. We bring in the react components and the server into the same file
// and change the route of notes.js baseURL to get the notes from our servers get 
// route, but it doesn't work.
// - Same origin policy and CORS
//      The issue is a thing called Same Origin Policy, a urls origin is defined by
//      a combonation of protocol (scheme), hostname, and port. It is a safety measure
//      put into browsers. When a browser makes a request to a server the response is 
//      some HTML file that may contain one or more references to external resources,
//      think of fonts, images, or scripts the page uses. When the browser sees these
//      other links it issues requests, if it is to the same source as the HTML file 
//      the response is processed with no issue, but if not then it checks the 
//      Access-Control-Allow-Origin response header. If it contains a * in the URL 
//      header then it process the response otherwise it won't. Since our front and 
//      backends do not share the same origin (3001 and 5173) we install cors middleware
//      in our backend (npm install cors)
// - Application to the internet
//      Here we go over using a cloud based service to deploy our app to the internet for
//      public use. First we need to add to our PORT at the bottom of the page, we change
//      (3001 => process.env.PORT || 3001). We are going to use Render, in the past Heroku
//      was the most used. 
const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())

let notes = [
    {
        id: "1",
        content: "HTML is easy",
        important: false
    },
    {
        id: "2",
        content: "Browser can execute only JavaScript",
        important: true
    },
    {
        id: "3",
        content: "GET and POST are the most important methods of HTTP protocol",
        important: true
    }
]

app.get('/', (req, res) => {
    res.send('<h1>Hello World</h1>')
})

app.get('/api/notes', (req, res) => {
    res.json(notes)
})

app.get('/api/notes/:id', (req, res) => {
    const id = req.params.id
    const note = notes.find(note => note.id === id)
    if(note) {
        res.json(note)
    }
    else{
        res.status(404).end()
    }
})

app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id
    notes = notes.filter(note => note.id !== id)
    res.status(204).end()
})

const generateId = () => {
    const maxId = notes.length > 0 ? Math.max(...notes.map(n => Number(n.id))) : 0
    return String(maxId + 1)
}

app.post('/api/notes', (req, res) => {
    const body = req.body

    if(!body.content) {
        return res.status(400).json({error: 'content missing'})
    }

    const note ={
        content: body.content,
        import: Boolean(body.important) || false,
        id: generateId()
    }
     
    notes = notes.concat(note)

    console.log(note)
    res.json(note)
})

app.put('/api/notes/:id', (req,res) => {
    const id = req.params
    const body = req.body
    console.log(body)

    let note = notes.find(note => note.id === id)
    let updatedNote = {...note, important: body.important}
    notes = notes.map(note => note.id !== id ? note : updatedNote)

    console.log(updatedNote)
    res.json(updatedNote)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})