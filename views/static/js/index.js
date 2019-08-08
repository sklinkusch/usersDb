document.querySelector("#searchForm").addEventListener('submit', event => {
    event.preventDefault();
    window.location.href = "/search/age/" + document.querySelector("#searchInput").value;
});