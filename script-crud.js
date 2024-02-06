const btnAddTask = document.querySelector(".app__button--add-task");
const formAddTask = document.querySelector(".app__form-add-task");
const textArea = document.querySelector(".app__form-textarea");
const ulTask = document.querySelector(".app__section-task-list");

const btnRemoveConcluded = document.querySelector("#btn-remover-concluidas");
const btnRemoveAll = document.querySelector("#btn-remover-todas");

const paragraphTaskDescription = document.querySelector(
  ".app__section-active-task-description"
);

const btnCancelTask = document.querySelector(
  ".app__form-footer__button--cancel"
);

let tasks = JSON.parse(localStorage.getItem("tarefas")) || [];

let selectedTask = null;
let liSelectedTask = null;

function attTasks() {
  localStorage.setItem("tarefas", JSON.stringify(tasks));
}

function createTaskElement(task) {
  const li = document.createElement("li");
  li.classList.add("app__section-task-list-item");

  const svg = document.createElement("svg");
  svg.innerHTML = `
<svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
    <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
</svg>
    `;

  const paragraph = document.createElement("p");
  paragraph.textContent = task.descricao;
  paragraph.classList.add("app__section-task-list-item-description");

  const button = document.createElement("button");
  button.classList.add("app_button-edit");

  button.onclick = () => {
    const newDescription = prompt("Qual é o novo nome da tarefa?");
    if (newDescription) {
      paragraph.textContent = newDescription;
      task.descricao = newDescription;
      attTasks();
    }
  };

  const buttonImage = document.createElement("img");
  buttonImage.setAttribute("src", "/imagens/edit.png");
  button.append(buttonImage);

  li.append(svg);
  li.append(paragraph);
  li.append(button);

  if (task.completed) {
    li.classList.add("app__section-task-list-item-complete");
    button.setAttribute("disabled", "disabled");
  } else {
    li.onclick = () => {
      document
        .querySelectorAll(".app__section-task-list-item-active")
        .forEach((element) => {
          element.classList.remove("app__section-task-list-item-active");
        });

      if (selectedTask == task) {
        paragraphTaskDescription.textContent = "";
        selectedTask = null;
        liSelectedTask = null;
        return;
      }
      selectedTask = task;
      liSelectedTask = li;
      paragraphTaskDescription.textContent = task.descricao;

      li.classList.add("app__section-task-list-item-active");
    };
  }

  return li;
}

btnAddTask.addEventListener("click", () => {
  formAddTask.classList.toggle("hidden");
});

const clearForm = () => {
  textArea.value = "";
  formAddTask.classList.add("hidden");
};

btnCancelTask.addEventListener("click", clearForm);

formAddTask.addEventListener("submit", (event) => {
  event.preventDefault();
  const task = {
    descricao: textArea.value,
  };
  tasks.push(task);
  const taskElement = createTaskElement(task);
  ulTask.append(taskElement);
  attTasks();
  clearForm();
});

tasks.forEach((task) => {
  const taskElement = createTaskElement(task);
  ulTask.append(taskElement);
});

document.addEventListener("FocoFinalizado", () => {
  if (selectedTask && liSelectedTask) {
    liSelectedTask.classList.remove("app__section-task-list-item-active");
    liSelectedTask.classList.add("app__section-task-list-item-complete");
    liSelectedTask.querySelector("button").setAttribute("disabled", "disabled");
    selectedTask.completed = true;
    attTasks();
  }
});

const taskRemove = (onlyCompleted) => {
  const selector = onlyCompleted
    ? ".app__section-task-list-item-complete"
    : ".app__section-task-list-item";
  document.querySelectorAll(selector).forEach((element) => {
    element.remove();
  });
  tasks = onlyCompleted ? tasks.filter((task) => !task.completed) : [];
  attTasks();
};

btnRemoveConcluded.onclick = () => taskRemove(true);
btnRemoveAll.onclick = () => taskRemove(false);
