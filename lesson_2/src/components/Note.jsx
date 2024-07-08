const Note = ({ note, toggleImportance }) => {
    const importance = note.important ? 'Make not important' : 'Make important'
    return (
        <li className="note">
          {note.content} <button onClick={toggleImportance}>{importance}</button>
        </li> 
    )
  }
  
  export default Note