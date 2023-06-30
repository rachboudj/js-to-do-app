const ul = document.querySelector('ul');
const form = document.querySelector('form');
const input = document.querySelector('form > input')

console.log(form, input);

form.addEventListener('submit', (event) => {
    event.preventDefault(); // pour ne pas rafraichir la page
    const value = input.value; // récup valeur input
    input.value = ''; // vider l'input lors de la soumission
    addTodo(value); 
})

const todos = []

const saveTodosToLocalStorage = () => {
    localStorage.setItem('todos', JSON.stringify(todos));
}

const loadTodosFromLocalStorage = () => {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
        todos = JSON.parse(storedTodos);
    } else {
        todos = []; // Assurez-vous de définir un tableau vide si aucun todo n'est trouvé dans le localStorage
    }
}

const displayTodo = () => {
    const todosNode = todos.map((todo, index) => {
        if (todo.editMode) {
            return createTodoEditElement(todo, index);
        } else {
            return createTodoElement(todo, index);
        }
    })
    ul.innerHTML = '';
    ul.append(...todosNode);
}

const createTodoElement = (todo, index) => {
    const li = document.createElement('li');
    const buttonDelete = document.createElement('button');
    buttonDelete.innerHTML = "Supprimer";

    const buttonEdit = document.createElement('button');
    buttonEdit.innerHTML = "Modifier";


    buttonDelete.addEventListener('click', event => {
        event.stopPropagation(); 
        deleteTodo(index);
    })

    buttonEdit.addEventListener('click', event => {
        event.stopPropagation(); 
        toggleEditMode(index);

    })

    li.innerHTML = `
    <span class="todo ${todo.done ? "done" : ""}"></span>
    <p class="${todo.done ? "done-text" : ""}">${ todo.text }</p>
    `;
    li.addEventListener('click', event => {
        toggleTodo(index);
    })
    li.append(buttonEdit, buttonDelete);
    return li;
};

const createTodoEditElement = (todo, index) => {
    // création de l'input edit
    const li = document.createElement('li');
    const input = document.createElement('input');
    input.type = 'text';
    input.value = todo.text;

    // création du bouton save
    const buttonSave = document.createElement('button');
    buttonSave.innerHTML= 'Sauvegarder';
    
    // création du bouton annuler
    const buttonCancel = document.createElement('button');
    buttonCancel.innerHTML= 'Annuler';

    buttonCancel.addEventListener('click', event => {
        event.stopPropagation();
        toggleEditMode(index);
    })

    buttonSave.addEventListener('click', event => {
        editTodo(index, input);
    })

    li.append(input, buttonCancel, buttonSave);
    
    return li;

}

const addTodo = (text) => {
    todos.push({ // pour ajouter un élément
        text, // ou text: text,
        done : false
    });
    displayTodo();
} 

const deleteTodo = (index) => {
    todos.splice(index, 1);
    displayTodo();
}

const toggleTodo = index => {
    todos[index].done = !todos[index].done;
    displayTodo();
}

const toggleEditMode = (index) => {
    todos[index].editMode = !todos[index].editMode;
    displayTodo();
}

const editTodo = (index, input) => {
    const value = input.value;
    todos[index].text = value;
    todos[index].editMode = false;
    displayTodo();
} 

loadTodosFromLocalStorage();
displayTodo();

// Note :
// La propriété value d'un HTMLInputElement permet de récupérer la valeur contenue dans l'input
// attention ! Quanf on supprime un todo en mode done, ça supprime
// celui qui est pas done car celui ci devient le [0] du tableau