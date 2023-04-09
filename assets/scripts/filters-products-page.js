const filtersRow = document.documentElement.querySelector('.filters__row');

const loadFilters = function() {
    let selectedFilters = JSON.parse(localStorage.getItem('selectedFilters'));

    // remove all filters from filtersRow
    filtersRow.innerHTML = '';

    if(selectedFilters === null) {
        return;
    }

    selectedFilters.forEach(filter => {
        const filterCapsule = document.createElement('div');
        filterCapsule.classList.add('filter-capsule');

        const filterName = document.createElement('p');
        filterName.textContent = filter;

        const filterIcon = document.createElement('i');
        filterIcon.classList.add('fa', 'fa-times', 'filter-capsule__icon');
        filterIcon.addEventListener('click', () => {
            selectedFilters = selectedFilters.filter(f => f !== filter);
            localStorage.setItem('selectedFilters', JSON.stringify(selectedFilters));
            loadFilters();
        });

        filterCapsule.appendChild(filterName);
        filterCapsule.appendChild(filterIcon);
        filtersRow.appendChild(filterCapsule);
    });

    const textFieldsNames = ['min-ron', 'max-ron', 'min-hours', 'max-hours'];
    textFieldsNames.forEach(textFieldName => {
        const textFieldValue = localStorage.getItem(textFieldName);
        if(textFieldValue !== null) {
            const filterCapsule = document.createElement('div');
            filterCapsule.classList.add('filter-capsule');

            const filterName = document.createElement('p');
            filterName.textContent = textFieldValue;

            const filterIcon = document.createElement('i');
            filterIcon.classList.add('fa', 'fa-times', 'filter-capsule__icon');
            filterIcon.addEventListener('click', () => {
                localStorage.removeItem(textFieldName);
                loadFilters();
            });

            filterCapsule.appendChild(filterName);
            filterCapsule.appendChild(filterIcon);
            filtersRow.appendChild(filterCapsule);
        }
    });
}

document.onload = loadFilters();