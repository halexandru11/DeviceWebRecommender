const searchBar = document.querySelector(".field");

const searchEvent = function () {
    const searchValue = searchBar.value;
    if(searchValue === '' ) {
        return ;
    }
    localStorage.setItem('search', searchValue);
    window.location.href = '/products';
}

searchBar.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        searchEvent();
    }
});