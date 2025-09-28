// date class
class AppDate {
  static parse(dateString) {
    if (!dateString) {
      return;
    }

    const [year, month, day] = dateString
      .split('-')
      .map((str) => parseInt(str, 10));
    return new AppDate(new Date(year, month - 1, day));
  }

  constructor(date = new Date()) {
    this.date = date;
  }

  get cloneDate() {
    return new Date(this.date.getTime());
  }

  toString() {
    const month = (this.date.getMonth() + 1).toString().padStart(2, '0');
    const day = this.date.getDate().toString().padStart(2, '0');

    return `${this.date.getFullYear()}-${month}-${day}`;
  }

  getDateInXMonth(n) {
    const date = (this.date.getMonth() + n) % 12;
    const res = new Date(this.cloneDate.setMonth(date));

    return new AppDate(res);
  }

  getTime() {
    return this.date.getTime();
  }

  isAfter(date) {
    return this.date.getTime() > date.getTime();
  }
}

// components

function div(klass) {
  const div = document.createElement('div');
  div.setAttribute('class', klass);

  return div;
}

function icon(klass, onClick) {
  const i = document.createElement('i');
  i.setAttribute('class', klass);
  i.addEventListener('click', onClick);

  return i;
}

function button(text, klass, onClick) {
  const button = document.createElement('button');
  button.setAttribute('class', `button ${klass}`);
  button.textContent = text;
  button.addEventListener('click', onClick);

  return button;
}

//checkboxを生成する
function checkbox(checked, onClick) {
  //label生成
  const label = document.createElement('label');
  label.setAttribute('class', 'checkbox');
  if (checked) {
    label.classList.add('checkbox--checked');
  }
  //input生成
  const checkbox = document.createElement('input');
  checkbox.setAttribute('type', 'checkbox');
  checkbox.setAttribute('class', 'checkbox__input');
  //ここでcheckedの状態を引き継いている
  checkbox.checked = checked;

  label.addEventListener('click', () => {
    checkbox.checked = !checkbox.checked;
    if (checkbox.checked) {
      label.classList.add('checkbox--checked');
    } else {
      label.classList.remove('checkbox--checked');
    }
    onClick(checkbox.checked);
  });
  label.appendChild(checkbox);
  //i生成
  label.appendChild(icon('icon icon--check fa-solid fa-check', onClick));

  return label;
}
