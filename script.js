let notes = []
let editingNoteId = null


function loadNotes() {
    const savedNotes = localStorage.getItem('quickNotes')
    return savedNotes ? JSON.parse(savedNotes) : []
}

//save note 
function saveNote(event) {
    event.preventDefault() //very imp otherwise u will lose the data.

    const title = document.getElementById('noteTitle').value.trim(); // we use trim to delete white space.
    const content = document.getElementById('noteContent').value.trim();

    // prevent empty notes
    if (!title || !content) return;

    if (editingNoteId) {

        // Update existing Note
        const noteIndex = notes.findIndex(note => note.id === editingNoteId)

        notes[noteIndex] = {
            ...notes[noteIndex],
            title: title,
            content: content
        }

    } else {

        // Add New Note // unshift add new value in the beginning of an array 
        notes.unshift({
            id: generateId(),
            title: title,
            content: content
        })
    }

    saveNotes()

    renderNotes()

    closeNoteDialog()

    editingNoteId = null
}

function generateId() {
    return Date.now().toString() //return current time stamp 
}

//saveNote function defined 
function saveNotes() {

    //store value under a key quickNotes and convert array into string useing stringify
    localStorage.setItem('quickNotes', JSON.stringify(notes))
}

// buttons logics
function deleteNotes(noteId) {

    notes = notes.filter(note => note.id !== noteId)

    saveNotes()

    renderNotes()
}

//show notes / render On Screen , update the page
function renderNotes() {

    const notesContainer = document.getElementById('notesContainer');

    //check array is empty
    if (notes.length === 0) {

        // show some fall back elements. (message)
        notesContainer.innerHTML = `
        <div class="empty-state">
            <h2>No notes yet</h2>
            <p>Create your first note to get started!</p>
            <button class="add-note-btn" onclick="openNoteDialog()">
                + Add Your First Note
            </button>
        </div>
        `

        return
    }

    // notes.map where map function let us execute a block of code for every note in the array
    notesContainer.innerHTML = notes.map(note => `
        <div class="note-card">

            <h3 class="note-title">${note.title}</h3>

            <p class="note-content">${note.content}</p>

            <div class="note-actions">

                <button class="edit-btn" onclick="openNoteDialog('${note.id}')" title="Edit Note">

                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">

                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>

                    </svg>

                </button>

                <button class="delete-btn" onclick="deleteNotes('${note.id}')" title="Delete Note">

                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">

                        <path d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.88c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"/>

                    </svg>

                </button>

            </div>

        </div>
    `).join('')
}

//open note dialog
function openNoteDialog(noteId = null) {

    const dialog = document.getElementById('noteDialog');

    const titleInput = document.getElementById('noteTitle');

    const contentInput = document.getElementById('noteContent');

    if (noteId) {

        // Edit Mode
        const noteToEdit = notes.find(note => note.id === noteId)

        if (!noteToEdit) return

        editingNoteId = noteId

        document.getElementById('dialogTitle').textContent = 'Edit Note'

        titleInput.value = noteToEdit.title

        contentInput.value = noteToEdit.content

    }
    else {

        // Add Mode
        editingNoteId = null

        document.getElementById('dialogTitle').textContent = 'Add New Note'

        titleInput.value = ''

        contentInput.value = ''
    }

    // open dialog modal
    dialog.showModal()

    titleInput.focus()
}

// close note
function closeNoteDialog() {

    document.getElementById('noteDialog').close()
}
// toggleTheme function for dark Mode
function toggleTheme(){
  const isDark =  document.body.classList.toggle('dark-theme') //isDark we will store the boolean value.
  localStorage.setItem('theme',isDark? 'dark':'light') // after it still in dark
  document.getElementById('themeToggleBtn').textContent = isDark ? '☀️' : '🌙'
}

function applyStoredTheme(){
    if(localStorage.getItem('theme')=== 'dark'){
        document.body.classList.add('dark-theme')
        document.getElementById('themeToggleBtn').textContent='☀️'
    }
}

//click everywhere in outside close the modal
document.addEventListener('DOMContentLoaded', function () {
        applyStoredTheme()
    // this function will return the notes from local storage.
    notes = loadNotes()

    renderNotes()

    document.getElementById('noteForm').addEventListener('submit', saveNote)
    
    // dark mode and light mode toggle button 
    document.getElementById('themeToggleBtn').addEventListener('click',toggleTheme)

    document.getElementById('noteDialog').addEventListener('click', function (event) {

        if (event.target === this) {

            closeNoteDialog()
        }
    })
})