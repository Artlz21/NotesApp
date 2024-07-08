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
//      was the most used. To deploy on render we use github and git, we do need to do some
//      setup and configuration but the process is done in this order after creating the repo
//      (git init, git add README.md, git commit -m "first commit", git branch -M main, 
//      git remote add origin git@github.com:Artlz21/NotesApp.git, git push -u origin main).
//      When this is done go to render create a new web service log in through github and 
//      use the repo link. For our project make sure the build command and the start command
//      are set to npm install and npm start. Start it up and wait for it to deploy.
// - Frontend production build
//      So far we have been using development mode to run React apps which gives dev benefits
//      like immediate rendering, clear errors, and more. Now we need a production build, for
//      vite we create a production build with the command (npm run build) in the apps root.
//      Now we need to copy the dist file into the backend you can just copy paste but the 
//      command to do so is (cp -r <file being copied> <destination>). To run the static content
//      from the file we need a middleware from express (express.static('filename')). Now both
//      front and back are in the same origin and can be displayed with the same url, change the
//      baseUrl in the app to /api/notes and make a new production build with the same process.
// - The whole app to the internet
//      Now the whole app is ready to be deployed to render. Use (git status) to see the changes
//      made to the app and start to commit and push it to github then verify the changes on the 
//      deployed app.
const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

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