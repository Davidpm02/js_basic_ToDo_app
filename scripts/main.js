// Inicializamos las variables principales
let btnAddTask = document.getElementById('btn_todo_header')
let modal = document.getElementById('taskModal')
let deleteTaskModal = document.getElementById('deleteTaskModal')
let isEditing = false
let cardBeingEdited = null
let taskToDelete = null
let deleteAllTasksModal = null
let deleteAllTasksBtn = null

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar variables que dependen del DOM
    deleteAllTasksModal = document.getElementById('deleteAllTasksModal')
    deleteAllTasksBtn = document.getElementById('btn_clear_all')

    // Configurar evento para eliminar todas las tareas
    if (deleteAllTasksBtn && deleteAllTasksModal) {
        deleteAllTasksBtn.addEventListener('click', openDeleteAllTasksModal)
    }
})

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
    const taskTitle = document.getElementById('taskTitle').value.trim()
    const taskDescription = document.getElementById('taskDescription').value.trim()
    
    // Validación de campos
    if (!taskTitle || !taskDescription) {
        alert('Por favor, complete todos los campos')
        return
    }
    
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
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo cargar la plantilla de la tarjeta')
            }
            return response.text()
        })
        .then(html => {
            let parser = new DOMParser()
            let doc = parser.parseFromString(html, "text/html")
            let card = doc.body.firstElementChild

            if (!card) {
                throw new Error('Error al procesar la plantilla de la tarjeta')
            }

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
                card.querySelector('.btn-edit').disabled = isChecked
                card.querySelector('.btn-delete').disabled = isChecked
            })

            // Agrego el evento de edición de la tarea
            const btnEdit = card.querySelector('.btn-edit')
            btnEdit.addEventListener('click', function() {
                isEditing = true
                cardBeingEdited = this.closest('.card')
                openModal()
                document.getElementById('taskTitle').value = cardBeingEdited.querySelector('.card-title').textContent
                document.getElementById('taskDescription').value = cardBeingEdited.querySelector('.card-description').textContent
            })

            // Agregar evento de eliminación específico para esta tarjeta
            const btnDelete = card.querySelector('.btn-delete')
            btnDelete.addEventListener('click', function() {
                taskToDelete = this.closest('.card')
                openDeleteTaskModal()
            })

            document.querySelector('.main_task_container').appendChild(card)
            closeModal()
        })
        .catch(error => {
            console.error('Error:', error.message)
            alert('Hubo un error al crear la tarea: ' + error.message)
        })
}


// Evento de eliminación de tarea
let deleteTaskBtn = document.querySelector('.btn-delete')
deleteTaskBtn.addEventListener('click', function () {
    taskToDelete = this.closest('.card')
    openDeleteTaskModal()
})


// Función para abrir el modal de eliminación de tareas
function openDeleteTaskModal() {
    deleteTaskModal.style.display = "block"
    document.body.style.backgroundColor = "rgba(0, 0, 0, 0.5)"

    // Cierro el modal al hacer click en el botón 'X'
    const btnClose = deleteTaskModal.querySelector('.close')
    btnClose.addEventListener('click', closeDeleteTaskModal)

    // Cierro el modal si se hace click en el botón de cancelar
    const btnCancel = deleteTaskModal.querySelector('.btn-cancel')
    btnCancel.addEventListener('click', closeDeleteTaskModal)

    // Confirmar eliminación
    const btnConfirmDelete = deleteTaskModal.querySelector('.btn-confirm')
    btnConfirmDelete.addEventListener('click', function() {
        if (taskToDelete) {
            taskToDelete.remove()
            taskToDelete = null
            closeDeleteTaskModal()
        }
    })
}

// Función para cerrar el modal de eliminación de tareas
function closeDeleteTaskModal() {
    deleteTaskModal.style.display = "none"
    document.body.style.backgroundColor = "#f1f2f6"
    taskToDelete = null
}


// Evento de eliminación de todas las tareas
if (deleteAllTasksBtn && deleteAllTasksModal) {
    deleteAllTasksBtn.addEventListener('click', function() {
        openDeleteAllTasksModal()
    })
}

function openDeleteAllTasksModal() {
    if (!deleteAllTasksModal) return

    // Reviso si hay tareas para eliminar
    const cardsCount = getCards()
    if (cardsCount === 0) {
        alert('No hay tareas para eliminar')
        return
    }
    
    deleteAllTasksModal.style.display = "block"
    document.body.style.backgroundColor = "rgba(0, 0, 0, 0.5)"

    // Remover event listeners existentes para evitar duplicados
    const btnClose = deleteAllTasksModal.querySelector('.close')
    const btnCancelDeleteAll = deleteAllTasksModal.querySelector('.btn-cancel-delete-all')
    const btnConfirmDeleteAll = deleteAllTasksModal.querySelector('.btn-confirm-delete-all')
    
    // Crear nuevas funciones para los event listeners
    const closeHandler = () => closeDeleteAllTasksModal()
    const confirmHandler = () => {
        const allCards = document.querySelectorAll('.card')
        allCards.forEach(card => card.remove())
        closeDeleteAllTasksModal()
    }

    // Agregar event listeners
    btnClose.addEventListener('click', closeHandler, { once: true })
    btnCancelDeleteAll.addEventListener('click', closeHandler, { once: true })
    btnConfirmDeleteAll.addEventListener('click', confirmHandler, { once: true })
}

function closeDeleteAllTasksModal() {
    if (!deleteAllTasksModal) return
    
    deleteAllTasksModal.style.display = "none"
    document.body.style.backgroundColor = "#f1f2f6"
}

function getCards() {
    const cards = document.querySelectorAll('.card')
    console.log(Array.from(cards).length)
    return Array.from(cards).length
}