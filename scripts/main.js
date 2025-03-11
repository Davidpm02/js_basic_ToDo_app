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

// Evento de guardado de nueva tarea
const taskForm = document.getElementById('taskForm')
const btnSave = document.querySelector('.btn-save')
taskForm.addEventListener('submit', function (event) {
    event.preventDefault()

    // Obtengo los valores de los inputs
    const taskTitle = document.getElementById('taskTitle').value
    const taskDescription = document.getElementById('taskDescription').value
    
    // Creo la card de la nueva tarea
    fetch('../templates/todo_card.html')
        .then(response => response.text())
        .then(html => {
            let parser = new DOMParser();
            let doc = parser.parseFromString(html, "text/html");
            let card = doc.body.firstElementChild; // Obtener el primer elemento (la card)

            card.querySelector(".card-title").textContent = taskTitle;
            card.querySelector(".card-description").textContent = taskDescription;
            
            // Agregar el evento del checkbox a la nueva tarjeta
            const checkbox = card.querySelector('input[type="checkbox"]');
            checkbox.addEventListener('change', function() {
                const isChecked = checkbox.checked;
                card.classList.toggle('card_finished', isChecked);
                card.querySelector('.card-title').classList.toggle('card-title_finished', isChecked);
                card.querySelector('.card-description').classList.toggle('card-description_finished', isChecked);
                card.querySelector('.btn-edit').classList.toggle('btn_finished', isChecked);
                card.querySelector('.btn-delete').classList.toggle('btn_finished', isChecked);
                
                // Deshabilito los botones de edición y eliminación si la tarea está marcada como finalizada
                if (isChecked) {
                    card.querySelector('.btn-edit').disabled = true;
                    card.querySelector('.btn-delete').disabled = true;
                } else {
                    card.querySelector('.btn-edit').disabled = false;
                    card.querySelector('.btn-delete').disabled = false;
                }
            });

            document.querySelector('.main_task_container').appendChild(card);
            
            // Reinicio el color del fondo
            document.body.style.backgroundColor = "#f1f2f6";

            // Limpio el formulario
            taskForm.reset();
        })
        .catch(error => console.error('Error al cargar la tarjeta de la nueva tarea:', error.message));
    
    // Cierro el modal de creación de tareas
    modal.style.display = 'none';
})