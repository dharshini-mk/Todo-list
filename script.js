let todoList = JSON.parse(localStorage.getItem('todoList')) || []
let todoListhtml = ''
console.log(todoList)
let currentSortMethod = 'date' 
let currentSortOrder = 'asc' 
let currentCategorySortOrder = 'asc' 

let isEditing = false
let editIndex = null

let filterMethod = 'all'

const addIcon = document.createElement('i')
addIcon.classList.add('fa-solid', 'fa-add')

const checkIcon = document.createElement('i')
checkIcon.classList.add('fa-solid', 'fa-check')

document.querySelector('.js-name-input').addEventListener('input', (e) => {
  let input = e.target.value
  if (input.length === 120) {
    alert('max character limits exceeded')
  }
})

let dateCheck = false
let timeCheck = false

document.querySelector('.js-date-input').addEventListener('click', (e) => {
  e.preventDefault()
  if (!dateCheck) {
    e.target.showPicker()
    dateCheck = true
  } else {
    dateCheck = false
  }
})

document.querySelector('.js-date-input').addEventListener('blur', () => {
  dateCheck = false
})

document.querySelector('.js-time-input').addEventListener('click', (e) => {
  e.preventDefault()
  if (!timeCheck) {
    e.target.showPicker()
    timeCheck = true
  } else {
    timeCheck = false
  }
})

document.querySelector('.js-time-input').addEventListener('blur', () => {
  timeCheck = false
})

function clearInputs() {
  const inputNameElement = document.querySelector('.js-name-input')
  const inputDateElement = document.querySelector('.js-date-input')
  const inputTimeElement = document.querySelector('.js-time-input')
  const inputCategoryElement = document.querySelector('.js-category-input')
  const inputPriorityElement = document.querySelector('.js-priority-input')

  inputNameElement.value = ''
  inputDateElement.value = ''
  inputTimeElement.value = ''
  inputCategoryElement.value = ''
  inputPriorityElement.value = ''
  setDefaultDateTime()
}

function addTodo() {
  const inputNameElement = document.querySelector('.js-name-input')
  const inputDateElement = document.querySelector('.js-date-input')
  const inputTimeElement = document.querySelector('.js-time-input')
  const inputCategoryElement = document.querySelector('.js-category-input')
  const inputPriorityElement = document.querySelector('.js-priority-input')

  let name = inputNameElement.value
  let date = inputDateElement.value
  let time = inputTimeElement.value
  let category = inputCategoryElement.value
  let priority = inputPriorityElement.value

  if (!name || !date || !time || !category || !priority) {
    alert(
      'Please fill in all fields: task, date, time, category, and priority.'
    )
    return
  }

  if (date < inputDateElement.min) {
    alert('Please select the current date or a future date.')
    return
  }

  if (time < inputTimeElement.min && date === inputDateElement.min) {
    alert('Please select a future time.')
    return
  }

  if (isEditing) {
    todoList[editIndex] = {
      name,
      date,
      time,
      category,
      priority,
      completed: false,
    } 
    isEditing = false 
    editIndex = null

    const addButton = document.querySelector('.js-add-button')
    addButton.innerHTML = ''
    addButton.title = 'Add'
    addButton.appendChild(addIcon)

    const cancelEditBtn = document.querySelector('.js-cancel-button')
    cancelEditBtn.style.display = 'none'
  } 
  else
  {
    todoList.push({ name, date, time, category, priority, completed: false }) // Ensure completed is set
  }

  localStorage.setItem('todoList', JSON.stringify(todoList))

  clearInputs()

  updateTodoList()
}

function deleteTodo(index)
{
  todoList.splice(index, 1)
  localStorage.setItem('todoList', JSON.stringify(todoList))
  updateTodoList()
}

function editTodo(index) {
  let inputNameElement = document.querySelector('.js-name-input')
  let inputDateElement = document.querySelector('.js-date-input')
  let inputTimeElement = document.querySelector('.js-time-input')
  let inputCategoryElement = document.querySelector('.js-category-input')
  let inputPriorityElement = document.querySelector('.js-priority-input')

  inputNameElement.value = todoList[index].name
  inputDateElement.value = todoList[index].date
  inputTimeElement.value = todoList[index].time
  inputCategoryElement.value = todoList[index].category
  inputPriorityElement.value = todoList[index].priority

  isEditing = true
  editIndex = index

  const cancelEditBtn = document.querySelector('.js-cancel-button')
  cancelEditBtn.style.display = 'block'

  const addButton = document.querySelector('.js-add-button')
  addButton.innerHTML = ''
  addButton.title = 'Update'
  addButton.appendChild(checkIcon)
}

function cancelEditTodo() {
  isEditing = false
  editIndex = null

  clearInputs()

  const cancelEditBtn = document.querySelector('.js-cancel-button')
  cancelEditBtn.style.display = 'none'

  const addButton = document.querySelector('.js-add-button')
  addButton.innerHTML = ''
  addButton.title = 'Add'
  addButton.appendChild(addIcon)
}

function updateTodoList() {
  let filteredTodos = todoList

  if (filterMethod === 'pending') {
    filteredTodos = todoList.filter((todo) => !todo.completed)
  } else if (filterMethod === 'completed') {
    filteredTodos = todoList.filter((todo) => todo.completed)
  }

  filteredTodos.sort((a, b) => {
    if (currentSortMethod === 'date') {
      const dateA = new Date(a.date + ' ' + a.time)
      const dateB = new Date(b.date + ' ' + b.time)
      return dateA - dateB
    } else if (currentSortMethod === 'category') {
      return currentCategorySortOrder === 'asc'
        ? a.category.localeCompare(b.category)
        : b.category.localeCompare(a.category)
    } else if (currentSortMethod === 'priority') {
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      return currentSortOrder === 'asc'
        ? priorityOrder[a.priority] - priorityOrder[b.priority]
        : priorityOrder[b.priority] - priorityOrder[a.priority]
    }
  })

  const addElement = document.querySelector('.js-add-html')
  todoListhtml = ''

  for (let i = 0; i < filteredTodos.length; i++) {
    const todo = filteredTodos[i]
    todoListhtml += `
      <div class="small-container ${todo.completed ? 'completed' : ''}">
        <input type="checkbox" class="js-complete-checkbox" data-index="${i}" ${todo.completed ? 'checked' : ''} onchange="toggleComplete(${todoList.indexOf(todo)})">
        <div class="task-info">
          <span class="task-name">${todo.name}</span>
          <span class="category-tag">${todo.category}</span>
          <span class="priority-tag priority-${todo.priority}">${todo.priority}</span>
        </div>
      </div>
      <div class="small-container">${todo.date}</div>
      <div class="small-container">${todo.time}</div>
      <button class="js-delete-button" data-index="${i}">
      <i class="fa-solid fa-trash"></i>
      </button>
      <button class="js-edit-button" data-index="${i}">
      <i class="fa-solid fa-pen"></i>
      </button>`
  }

  if (todoList.length === 0) {
    addElement.style.display = 'none' 
  } else {
    addElement.style.display = 'grid' 
    addElement.innerHTML = todoListhtml
  }

  document.querySelectorAll('.js-delete-button').forEach((button) => {
    button.addEventListener('click', (event) => {
      const index = event.currentTarget.getAttribute('data-index')
      deleteTodo(index)
    })
  })

  document.querySelectorAll('.js-edit-button').forEach((button) => {
    button.addEventListener('click', (event) => {
      const index = event.currentTarget.getAttribute('data-index')
      editTodo(index)
    })
  })
}

function setDefaultDateTime() {
  const inputDateElement = document.querySelector('.js-date-input')
  const inputTimeElement = document.querySelector('.js-time-input')

  const now = new Date()
  const date = now.toISOString().split('T')[0]
  const time = now.toTimeString().split(' ')[0].slice(0, 5)

  inputDateElement.value = date
  inputDateElement.min = date 
  inputTimeElement.value = time
  inputTimeElement.min = time 
}

function sortTodos(sortBy) {
  if (sortBy === 'priority') {
    currentSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc'
  } else if (sortBy === 'category') {
    currentCategorySortOrder =
      currentCategorySortOrder === 'asc' ? 'desc' : 'asc'
  }
  currentSortMethod = sortBy
  updateTodoList()
}

function filterTodos() {
  const filterElement = document.querySelector('.js-filter-input')
  filterMethod = filterElement.value
  updateTodoList()
}

function successNotification() {
  const success = document.getElementById('js-success-notification')
  success.style.display = 'flex'
  setTimeout(() => {
    success.style.display = 'none'
  }, 4000)
}

function toggleComplete(index) {
  todoList[index].completed = !todoList[index].completed
  if (todoList[index].completed) {
    successNotification()
  }
  localStorage.setItem('todoList', JSON.stringify(todoList))
  updateTodoList()
}

document.addEventListener('DOMContentLoaded', () => {
  updateTodoList()
  setDefaultDateTime()

  const inputNameElement = document.querySelector('.js-name-input')
  inputNameElement.focus()

  const cancelEditBtn = document.querySelector('.js-cancel-button')
  cancelEditBtn.style.display = 'none'

  document.querySelector('.js-add-button').addEventListener('click', addTodo)
  document
    .querySelector('.js-cancel-button')
    .addEventListener('click', cancelEditTodo)

  document
    .querySelector('.sort-button-category')
    .addEventListener('click', () => sortTodos('category'))
  document
    .querySelector('.sort-button-priority')
    .addEventListener('click', () => sortTodos('priority'))

  document
    .querySelector('.js-filter-input')
    .addEventListener('change', filterTodos)
})

let year = document.querySelector('.year')
year.innerText = new Date().getFullYear()
