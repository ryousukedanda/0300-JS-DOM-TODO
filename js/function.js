const state = {
  showCompleted: false,
  tasks: [
    {
      name: 'Task 1',
      deadline: new AppDate().getDateInXMonth(1),
      checked: false,
    },
    {
      name: 'Task 2',
      deadline: new AppDate().getDateInXMonth(2),
      checked: false,
    },
    {
      name: 'Task 3',
      deadline: new AppDate().getDateInXMonth(3),
      checked: false,
    },
  ],
};

// ↓↓↓ ここを実装

//表示するタスク一覧の取得
function getVisibleTasks(state) {
  if (state.showCompleted) {
    return state.tasks;
  }
  return state.tasks.filter((task) => !task.checked);
}

// タスク生成
function createTaskElement(task) {
  const li = document.createElement('li');
  const divListItem = div('list__item');
  li.appendChild(divListItem);

  // checkbox
  const divCheckBox = div('list__item-col list__item-col--checkbox');
  const onClickTaskComplete = createTaskCompleteHandler(task, li, divListItem);
  const colCheckbox = checkbox(task.checked, onClickTaskComplete);
  divCheckBox.appendChild(colCheckbox);
  divListItem.appendChild(divCheckBox);

  // name
  const colName = div('list__item-col list__item-col--name');
  colName.textContent = task.name;
  const InputEditName = document.createElement('input');
  const nameBeforeEdit = task.name;
  divListItem.appendChild(colName);

  //タスク名編集
  attachEditNameEventLister(colName, InputEditName, task);
  attachCompleteEditNameEventLister(
    colName,
    InputEditName,
    task,
    nameBeforeEdit
  );

  // deadline
  const colDeadline = div('list__item-col list__item-col--deadline');
  colDeadline.textContent = task.deadline.toString();
  const InputEditDeadline = document.createElement('input');
  const deadlineBeforeEdit = task.deadline.toString();
  divListItem.appendChild(colDeadline);

  //日付編集
  attachEditDeadlineEventLister(colDeadline, InputEditDeadline, task);
  attachCompleteEditDeadlineEventLister(
    colDeadline,
    InputEditDeadline,
    task,
    deadlineBeforeEdit
  );

  // trash
  const colTrash = div('list__item-col list__item-col--actions');
  const onClickTaskTrash = createTaskTrashHandler(task, li);
  const iconTrash = icon(
    'icon icon--trash fa-solid fa-trash',
    onClickTaskTrash
  );
  colTrash.appendChild(iconTrash);
  divListItem.appendChild(colTrash);

  return li;
}

// タスクをレンダリングする
function renderTasks(container) {
  container.replaceChildren();

  const tasksToRender = getVisibleTasks(state);
  tasksToRender.forEach((task) => {
    const li = createTaskElement(task);
    container.appendChild(li);
  });
}

//イベントハンドラー(タスク名編集)
function attachEditNameEventLister(colName, InputEditName, task) {
  colName.addEventListener('click', () => {
    colName.textContent = '';

    InputEditName.setAttribute('type', 'text');
    InputEditName.setAttribute('value', task.name);
    InputEditName.classList.add('form__input-field');
    colName.appendChild(InputEditName);

    InputEditName.focus();
    const length = InputEditName.value.length;
    InputEditName.setSelectionRange(length, length);
    InputEditName.addEventListener('change', (e) => {
      task.name = e.target.value;
    });
  });
}

//イベントハンドラー(タスク名編集完了)
function attachCompleteEditNameEventLister(
  colName,
  InputEditName,
  task,
  nameBeforeEdit
) {
  InputEditName.addEventListener('blur', (e) => {
    InputEditName.remove();
    if (e.target.value === '') {
      colName.textContent = nameBeforeEdit;
      task.name = nameBeforeEdit;
      return;
    }

    colName.textContent = task.name;
  });
}

//イベントハンドラー(日付編集)
function attachEditDeadlineEventLister(colDeadline, InputEditDeadline, task) {
  colDeadline.addEventListener('click', () => {
    colDeadline.textContent = '';

    InputEditDeadline.setAttribute('type', 'date');
    InputEditDeadline.classList.add('form__input-field');
    colDeadline.appendChild(InputEditDeadline);

    InputEditDeadline.focus();
    InputEditDeadline.addEventListener('change', (e) => {
      task.deadline = AppDate.parse(e.target.value);
    });
  });
}

//イベントハンドラ-(日付編集完了)
function attachCompleteEditDeadlineEventLister(
  colDeadline,
  InputEditDeadline,
  task,
  deadlineBeforeEdit
) {
  InputEditDeadline.addEventListener('blur', (e) => {
    InputEditDeadline.remove();
    if (e.target.value === '') {
      colDeadline.textContent = deadlineBeforeEdit;
      task.deadline = AppDate.parse(deadlineBeforeEdit);
      return;
    }
    colDeadline.textContent = e.target.value;
  });
}

// イベントハンドラー(タスク完了)
function createTaskCompleteHandler(task, li, divListItem) {
  return (checked) => {
    task.checked = checked;
    if (checked && !state.showCompleted) {
      divListItem.classList.add('list__item--completed');
      divListItem.addEventListener('transitionend', () => li.remove());
    }
  };
}

//イベントハンドラー(タスク削除)
function createTaskTrashHandler(task, li) {
  return () => {
    if (confirm('このタスクを削除しますか?')) {
      li.remove();
      const index = state.tasks.indexOf(task);
      state.tasks.splice(index, 1);
    }
  };
}

//イベントハンドラー(新規タスク登録)
function onSubmitTask(container) {
  const inputText = document.querySelector('input[type=text]');
  const inputDate = document.querySelector('input[type=date]');

  let taskName = inputText.value;
  let deadline = inputDate.value;

  //タスク名か日付が空ならalertを出す
  if (taskName === '') {
    alert('タスク名を入力してください');
    return;
  }
  if (deadline === '') {
    alert('期限日を入力してください');
    return;
  }

  //stateオブジェクトにタスク追加
  state.tasks.push({
    name: taskName,
    deadline: AppDate.parse(deadline),
    checked: false,
  });

  //stateのtasksを日付順(昇順)にsortする
  state.tasks.sort((a, b) => {
    return a.deadline.getTime() - b.deadline.getTime();
  });

  //タスクをレンダリング
  renderTasks(container);

  //タスク追加後、フォームの入力値をリセット
  const form = document.querySelector('.form');
  form.reset();
}

// ↑↑↑

function main() {
  const todoContainer = document.querySelector('.js-list-container');

  //イベント処理(新規タスク登録)
  document.querySelector('.js-form').addEventListener('submit', (e) => {
    e.preventDefault();
    onSubmitTask(todoContainer);
  });

  //イベント処理(完了タスク表示ボタン)
  document
    .querySelector('.js-show-completed')
    .addEventListener('change', (e) => {
      state.showCompleted = e.target.checked;
      renderTasks(todoContainer);
    });

  //初期表示
  renderTasks(todoContainer);
}

main();
