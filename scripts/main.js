// Inicializamos las variables principales
let btnAddTask = document.getElementById('btn_todo_header')
let modal = document.getElementById('taskModal')
let isEditing = false
let cardBeingEdited = null

// Evento de agregación de nueva tarea
btnAddTask.addEventListener('click', function () {
    isEditing = false
    openModal()
})

// Función para abrir el modal
function openModal() {
    modal.style.display = "block"
    document.body.style.backgroundColor = "rgba(0, 0, 0, 0.5)"

    // Cierro el modal al hacer click en el botón 'X'
    const btnClose = document.querySelector('.close')
    btnClose.addEventListener('click', closeModal)

    // Cierro el modal si se hace click en el botón de cancelar
    const btnCancel = document.querySelector('.btn-cancel')
    btnCancel.addEventListener('click', closeModal)
}

// Función para cerrar el modal
function closeModal() {
    modal.style.display = "none"
    document.body.style.backgroundColor = "#f1f2f6"
    taskForm.reset()
    isEditing = false
    cardBeingEdited = null
}

// Evento de guardado de tarea
const taskForm = document.getElementById('taskForm')
const btnSave = document.querySelector('.btn-save')
taskForm.addEventListener('submit', function (event) {
    event.preventDefault()

    // Obtengo los valores de los inputs
    const taskTitle = document.getElementById('taskTitle').value
    const taskDescription = document.getElementById('taskDescription').value
    
    if (isEditing && cardBeingEdited) {
        // Si estamos editando, actualizamos la tarjeta existente
        cardBeingEdited.querySelector('.card-title').textContent = taskTitle
        cardBeingEdited.querySelector('.card-description').textContent = taskDescription
        closeModal()
    } else {
        // Si es una nueva tarea, creamos una nueva tarjeta
        createNewCard(taskTitle, taskDescription)
    }
})

// Función para crear una nueva tarjeta
function createNewCard(taskTitle, taskDescription) {
    fetch('../templates/todo_card.html')
        .then(response => response.text())
        .then(html => {
            let parser = new DOMParser()
            let doc = parser.parseFromString(html, "text/html")
            let card = doc.body.firstElementChild

            card.querySelector(".card-title").textContent = taskTitle
            card.querySelector(".card-description").textContent = taskDescription
            
            // Agregar el evento del checkbox a la nueva tarjeta
            const checkbox = card.querySelector('input[type="checkbox"]')
            checkbox.addEventListener('change', function() {
                const isChecked = checkbox.checked
                card.classList.toggle('card_finished', isChecked)
                card.querySelector('.card-title').classList.toggle('card-title_finished', isChecked)
                card.querySelector('.card-description').classList.toggle('card-description_finished', isChecked)
                card.querySelector('.btn-edit').classList.toggle('btn_finished', isChecked)
                card.querySelector('.btn-delete').classList.toggle('btn_finished', isChecked)
                
                // Deshabilito los botones de edición y eliminación si la tarea está marcada como finalizada
                if (isChecked) {
                    card.querySelector('.btn-edit').disabled = true
                    card.querySelector('.btn-delete').disabled = true
                } else {
                    card.querySelector('.btn-edit').disabled = false
                    card.querySelector('.btn-delete').disabled = false
                }
            })

            // Agrego el evento de edición de la tarea
            const btnEdit = card.querySelector('.btn-edit')
            btnEdit.addEventListener('click', function() {
                isEditing = true
                cardBeingEdited = this.closest('.card')
                
                // Apertura del modal de edición de tarea
                openModal()

                // Inserto los valores actuales en los inputs del modal
                document.getElementById('taskTitle').value = cardBeingEdited.querySelector('.card-title').textContent
                document.getElementById('taskDescription').value = cardBeingEdited.querySelector('.card-description').textContent
            })

            document.querySelector('.main_task_container').appendChild(card)
            closeModal()
        })
        .catch(error => console.error('Error al cargar la tarjeta de la nueva tarea:', error.message))
}