    // RETRIEVE THE LOCALSTORAGE VALUES SET FROM bookCatalogue
    var book_id = localStorage.getItem("book_id");
    var title = localStorage.getItem("title");
    var author = localStorage.getItem("author");
    var date = localStorage.getItem("date");
    var genre = localStorage.getItem("genre");
    var copies = localStorage.getItem("copies");
    var picture = localStorage.getItem("picture");
    
    // SET THE VALUES FOR THE FIELDS 
    document.getElementById("bookId").textContent = book_id;
    document.getElementById("title").textContent = title;
    document.getElementById("author").textContent = author;
    document.getElementById("date").textContent = date;
    document.getElementById("genre").textContent = genre;
    document.getElementById("copies").textContent = copies;
    document.getElementById("picture").src = picture;