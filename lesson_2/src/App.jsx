// This Lesson picks up where we left off and covers adding styling to a react app.
// Here we cover adding an index.css file to hold our css and how to use selectors
// to apply the css. We will also cover how to improve error messages with css, using
// inline stlyes as an alternative way of applying css, and clearify somethings about
// styling. The lesson continues the notes app and is broken into 3 parts:
// - Improved error message
//    Here we cover how to add some style to our app using css through a classic css
//    page. We add some styling to parts of the app and add an improvement to our error
//    message.
// - Inline styles
//    In this section we go over using inline styles and how to add them to our html 
//    instead of using the index.css page to seperate the parts of a project. In the
//    lesson they say that the philosophy of react calls for keeping html, css, and js
//    code together which goes against the traditional thought of keeping these parts 
//    seperate. Instead seperating based on the logic of the components. I don't agree
//    with this approach and instead find it better to seperate the css to keep the 
//    components as clean as possible. 
// - Couple of important remarks
//    This section is a commentary on the apps design so far and not the styling of the 
//    lesson. It talks about how the app sets its inital notes state to an empty array.
//    This is correct but it goes over the mechanics of how react renders and processes
//    data. It also goes over how the use effect gets triggered. If an empty array is 
//    used the effect occurs after the first render, but if a state is used then the 
//    effect occurs after each change in the state.
import { useState, useEffect } from 'react'
import Note from './components/Note'
import noteServices from './services/notes'
import './index.css'

const Notification = ({message}) => {
  if (message === null) {
    return null
  }

  return (
    <div className='error'>
      {message}
    </div>
  )
}

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    console.log('effect')
    noteServices.getAll().then(initialNotes => setNotes(initialNotes))
  }, [])
  console.log('render', notes.length, 'notes')

  const notesToShow = showAll ? notes : notes.filter(note => note.important === true)

  const addNote = (event) => {
    event.preventDefault()
    console.log("button clicked", event.target)
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
      // id: notes.length + 1
    }
    noteServices.create(noteObject).then(returnedNote => {
      console.log(returnedNote)
      setNotes(notes.concat(returnedNote))
      setNewNote('')
    })
  }

  const addNoteChange = (e) => {
    console.log(e.target.value)
    setNewNote(e.target.value)
  }

  const toggleImportance = (id) => {
    const note = notes.find(n => n.id === id)
    const changedNote = {...note, important: !note.important}

    noteServices.update(id, changedNote).then(returnedNote => {
      setNotes(notes.map(n => n.id !== id ? n : returnedNote))
    }).catch(error => {
      setErrorMessage(
        `the note '${n.content}' was already deleted from server`
      )
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      setNotes(notes.filter(n => n.id !== id))
    })
  }



  console.log(newNote)
  console.log(notes)

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage}/>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? "important" : "all"}
        </button>
      </div>
      <ul>
        {notesToShow.map(note => 
          <Note key={note.id} note={note} toggleImportance={() => toggleImportance(note.id)}/>
        )}
      </ul>

      <form onSubmit={addNote}>
        <input value={newNote} onChange={addNoteChange}/>
        <button type='submit'>Save</button>
      </form>
    </div>
  )
}

export default App