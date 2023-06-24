const buttons = document.querySelectorAll('.button-light');
const textFields = document.querySelectorAll('.field');

textFields.forEach((textField) => {
  textField.addEventListener('input', () => {
    if (textField.value !== null && textField.value !== '') {
      const verbose = textField.name.split('-');
      localStorage.setItem(
        textField.name,
        `${verbose[0]} ${textField.value} ${verbose[1]}`
      );
    } else {
      localStorage.removeItem(textField.name);
    }
  });
});

const addFilter = (filterId) => {
  console.log('adding filter ' + filterId);
  const selectedFilters =
    JSON.parse(localStorage.getItem('selectedFilters')) ?? [];
  selectedFilters.push(filterId);
  localStorage.setItem('selectedFilters', JSON.stringify(selectedFilters));
};

const removeFilter = (filterId) => {
  console.log('removing filter ' + filterId);
  let selectedFilters = JSON.parse(localStorage.getItem('selectedFilters'));
  selectedFilters = selectedFilters.filter((filter) => filter !== filterId);
  localStorage.setItem('selectedFilters', JSON.stringify(selectedFilters));
};

const loadFilters = function () {
  buttons.forEach((button) => {
    if (selectedFilters.includes(button.id)) {
      button.style.backgroundColor = 'grey';
      isSelected = true;
    }
  });

  textFields.forEach((textField) => {
    textField.value = localStorage.getItem(textField.name)?.split(' ')[1] ?? '';
  });
};

export function getFilters() {
  const selectedFilters =
    JSON.parse(localStorage.getItem('selectedFilters')) || [];
  console.log(selectedFilters);

  return selectedFilters;
}

buttons.forEach((button) => {
  let isSelected = false;
  let originalBackgroundColor = button.style.backgroundColor;
  let originalBorderColor = button.style.borderColor;

  button.addEventListener('click', () => {
    isSelected = !isSelected;
    if (isSelected) {
      button.style.backgroundColor = 'grey';

      addFilter(button.id);
    } else {
      button.style.backgroundColor = originalBackgroundColor;
      button.style.borderColor = originalBorderColor;

      removeFilter(button.id);
    }
  });
});

document.onload = loadFilters();
