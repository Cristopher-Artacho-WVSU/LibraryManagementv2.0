// // SCRIPT FOR SIDEBAR
// function toggleSidebar() {
//     var sidebar = document.getElementById("sidebar");
//     sidebar.classList.toggle('active');
//   }
// // SCRIPT FOR THE SUBMENU SIDEBAR
//   function toggleSubMenu() {
//     var subMenu = document.getElementById("userSubMenu");
//     subMenu.classList.toggle('active');
//   }
// // FUNCTION FOR HIDING THE SUBMENU
//   function hideSubMenu() {
//   var subMenu = document.getElementById("userSubMenu");
//   subMenu.classList.remove('active'); 
//   subMenu.classList.add('inactive')
// }

// FOR THE USER VALUES
  // const username = localStorage.getItem("username");
  // document.getElementById("username").textContent = username;
  // const profile_picture = localStorage.getItem("profile_picture");
  // document.getElementById("profilePicture").src = profile_picture;

  document.getElementById("profilePicture").src = localStorage.getItem("profilePicture")
// SCRIPT FOR SIDEBAR
function toggleSidebar() {
  var sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle('active');
}
// SCRIPT FOR THE SUBMENU SIDEBAR
function toggleSubMenu() {
  var subMenu = document.getElementById("subMenuDiv");
  subMenu.classList.toggle('active');
}
// FUNCTION FOR HIDING THE SUBMENU
function hideSubMenu() {
var subMenu = document.getElementById("subMenuDiv");
subMenu.classList.remove('active'); 
subMenu.classList.add('inactive')
}

document.addEventListener("DOMContentLoaded", function() {
const accountPermissions = localStorage.getItem("accountType");

const sidebar = document.getElementById('sidebar');
const subMenuDiv = document.getElementById('subMenuDiv');

const userLinks = [
  { text: 'Book Catalogue', href: '/library-management-system/book-catalogue' },
  { text: 'Profile', href: '/library-management-system/profile' },
  { text: 'Dashboard', href: '/library-management-system/dashboard' },
  { text: 'Book Inventory', href: '/library-management-system/book-inventory' },
];

const userSubMenuLinks = [
  { text: 'Pending Requests', href: '/library-management-system/pending-requests' },
  { text: 'History Requests', href: '/library-management-system/history-requests' },
];

const librarianLinks = [
  { text: 'Manage Accounts', href: '/library-management-system/manage-accounts' },
  { text: 'Manage Books', href: '/library-management-system/manage-books' },
  { text: 'Dashboard', href: '/library-management-system/dashboard' },
  { text: 'Profile', href: '/library-management-system/profile' },
];

const librarianSubMenuLinks = [
  { text: 'Pending Requests', href: '/pending-requests' },
  { text: 'History Requests', href: '/history-requests' },
];

let linksToAdd = [];
let subMenuLinksToAdd = [];

if (accountPermissions === 'User') {
  linksToAdd = userLinks;
  subMenuLinksToAdd = userSubMenuLinks;
} else if (accountPermissions === 'Librarian') {
  linksToAdd = librarianLinks;
  subMenuLinksToAdd = librarianSubMenuLinks;
}

linksToAdd.forEach(link => {
  const div = document.createElement('div');
  const a = document.createElement('a');
  a.href = link.href;
  a.textContent = link.text;
  div.appendChild(a);
  sidebar.appendChild(div);
});

subMenuLinksToAdd.forEach(link => {
  const div = document.createElement('div');
  const a = document.createElement('a');
  a.href = link.href;
  a.textContent = link.text;
  div.appendChild(a);
  subMenuDiv.appendChild(div);
});
});

//FOR THE BOOK CATALOGUE
document.addEventListener("DOMContentLoaded", function() {
  const bookCatalogue = document.getElementById("bookCatalogueDiv");

  // FETCHES THE BOOK DATA FROM THE '/books'. 
  fetch('/database/books')
      .then(response => response.json())
      .then(data => {
          // THE FIELDS AND THEIR VALUES ARE TAKEN AND SENT TO renderBooks TO BE PROCESSED
          renderBooks(data, bookCatalogue);
      }) //IF THERE IS NO BOOK DATA
      .catch(error => {
          console.error('Error fetching books:', error);
          throw new Error('Error Fetching books');
      });
});

  // FOR EACH DATA SENT, THE createBookElement PROCESSES IT TO ADD THE IMAGE AND TITLE WHILE USING localStorage TO OTHER VALUES
  function renderBooks(books, bookCatalogue) {
      books.forEach(book => {
          const bookElement = createBookElement(book);
          // IF THE PROCESS IS DONE, IT IS APPENDED TO bookCatalogue TO HAVE ITS OWN DIVISION
          bookCatalogue.appendChild(bookElement);
      });
  }
  
  // FUNCTION TO ADD IMAGE AND TITLE, AND localStorage THE DATA TAKEN FROM THE '/books' COLLECTION 
  function createBookElement(book) {
  const bookDiv = document.createElement("div");
  bookDiv.classList.add("book");

  // THE img TAKES ITS VALUE FROM THE FIELD 'picture' 
  const img = document.createElement("img");
  img.src = book.picture;
  // THE title GETS ITS TEXTCONTENT FROM THE FIELD 'title'
  const title = document.createElement("div");
  title.classList.add("titlx`e");
  title.textContent = book.title;

  // THE PURPOSE OF THIS IS THAT WHEN THE bookCatalogue IS CLICKED, THE VALUES FOR THESE ARE STORED AND WILL BE USED IN THE bookInfo WEBPAGE
  bookDiv.addEventListener("click", () => {
      localStorage.setItem("book_id", book.book_id);
      localStorage.setItem("title", book.title);
      localStorage.setItem("author", book.author);
      localStorage.setItem("date", book.date);
      localStorage.setItem("genre", book.genre);
      localStorage.setItem("copies", book.copies);
      localStorage.setItem("picture", book.picture);

      // REDIRECTS THE USER/LIBRARIAN TO THE bookInfo WEBPAGE
      window.location.href = "/library-management-system/book-details";
  });
  // THE IMAGE AND TITLE IS APPENDED TO THE bookDiv, and the bookDiv will also be appended to the BookCatalogue
  bookDiv.appendChild(img);
  bookDiv.appendChild(title);

  return bookDiv;
}
