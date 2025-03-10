// Inicializamos las variables principales
let btnAddTask = document.getElementById('btn_todo_header')
let modal = document.getElementById('taskModal')

// Evento de agregación de nueva tarea
btnAddTask.addEventListener('click', function () {
    // Apertura del modal de registro de tarea
    modal.style.display = "block"

    // Opaco el fondo del HTML
    document.body.style.backgroundColor = "rgba(0, 0, 0, 0.5)"

    // Cierro el modal al hacer click en el botón 'X'
    const btnClose = document.querySelector('.close')
    btnClose.addEventListener('click', function () {
        modal.style.display = "none"
        document.body.style.backgroundColor = "#f1f2f6"
	    })

    // Cierro el modal si se hace click en el botón de cancelar
    const btnCancel = document.querySelector('.btn-cancel')
    btnCancel.addEventListener('click', function () {
        modal.style.display = "none"
        document.body.style.backgroundColor = "#f1f2f6"
    })
})

