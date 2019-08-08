document.querySelector("#searchForm").addEventListener('submit', event => {
    event.preventDefault();
    console.log("submit")
    console.log("search/age/" + document.querySelector("#searchInput").value);
    window.location.href = "http://localhost:3000/search/age/" + document.querySelector("#searchInput").value;
});