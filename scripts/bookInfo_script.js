    // RETRIEVE THE LOCALSTORAGE VALUES SET FROM bookCatalogue
    var book_id = localStorage.getItem("book_id");
    var title = localStorage.getItem("title");
    var author = localStorage.getItem("author");
    var date = localStorage.getItem("date");
    var genre = localStorage.getItem("genre");
    var copies = localStorage.getItem("copies");
    var picture = localStorage.getItem("picture");
    
    // SET THE VALUES FOR THE FIELDS 
    document.getElementById("bookId").textContent = "Book ID: " + book_id;
    document.getElementById("title").textContent = "Book Title: " + title;
    document.getElementById("author").textContent = "Book Author: " +author;
    document.getElementById("date").textContent = "Published Date: " +date;
    document.getElementById("genre").textContent = "Book Genre: " +genre;
    document.getElementById("copies").textContent = "Book Copies Avilable: " +copies;
    document.getElementById("picture").src = picture;


    // MAKING THE bookBorrowDiv VISIBLE
    document.getElementById('showBorrowBookFormButton').addEventListener('click', function(){
        document.getElementById('blurBackground').classList.remove('hideContent');
        document.getElementById('bookBorrowDiv').classList.remove('hideContent');
        setTimeout(() => {
            document.getElementById('blurBackground').classList.add('showContent');
            document.getElementById('bookBorrowDiv').classList.add('showContent');
        }, 10)
    });
    // MAKING THE bookBorrowDiv INVISIBLE
    document.getElementById('cancelBorrowButton').addEventListener('click', function() {
        document.getElementById('blurBackground').classList.remove('showContent');
        document.getElementById('bookBorrowDiv').classList.remove('showContent');
        setTimeout(() => {
            document.getElementById('blurBackground').classList.add('hideContent');
        document.getElementById('bookBorrowDiv').classList.add('hideContent');
        }, 300)
    });

    // MAKING THE bookReserveDiv VISIBLE
    document.getElementById('showReserveBookFormButton').addEventListener('click', function(){
        document.getElementById('blurBackground').classList.remove('hideContent');
        document.getElementById('bookReserveDiv').classList.remove('hideContent');
        setTimeout(() => {
            document.getElementById('blurBackground').classList.add('showContent');
            document.getElementById('bookReserveDiv').classList.add('showContent');
        }, 10)
    });
    // MAKING THE bookReserveDiv INVISIBLE
    document.getElementById('cancelReservationButton').addEventListener('click', function() {
        document.getElementById('blurBackground').classList.remove('showContent');
        document.getElementById('bookReserveDiv').classList.remove('showContent');
        setTimeout(() => {
            document.getElementById('blurBackground').classList.add('hideContent');
        document.getElementById('bookReserveDiv').classList.add('hideContent');
        }, 300)
    });

    
    // FOR BORROWBOOK FORM 
    // addEventListener("DOMContentLoaded", function(){
        
    // })
 // ADDING INFORMATION TO THE READONLY
//  var book_id = localStorage.getItem("book_id");
//  document.getElementById("reserveFormBookId").value = book_id;
 
//  var account_id = localStorage.getItem("accountId")
//  documdocument.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('DOMContentLoaded', function() {
        initializeDatepickers();
    
        document.getElementById("showBorrowBookFormButton").addEventListener('click', function() {
            setupBorrowForm();
        });
    
        document.getElementById("showReserveBookFormButton").addEventListener('click', function() {
            setupReserveForm();
        });
    });
    
    function initializeDatepickers() {
        $('#BorrowFormReturnDate, #reserveFormStartDate, #reserveFormReturnDate').datepicker({
            format: 'yyyy-mm-dd',
            autoclose: true
        }).on('show', function() {
            adjustDatepickerZIndex();
        });
    
        $('#BorrowFormReturnDate').on('changeDate', function(event) {
            var return_date = $(this).val();
            compareDates($('#BorrowFormStartDate').val(), return_date, '#BorrowFormReturnDate');
        });
    
        $('#reserveFormStartDate').on('changeDate', function(event) {
            var borrow_date = $(this).val();
            compareDates(borrow_date, $('#reserveFormReturnDate').val(), '#reserveFormStartDate');
        });
    
        $('#reserveFormReturnDate').on('changeDate', function(event) {
            var return_date = $(this).val();
            compareDates($('#reserveFormStartDate').val(), return_date, '#reserveFormReturnDate');
        });
    }
    
    function adjustDatepickerZIndex() {
        setTimeout(function() {
            $('.datepicker, .datepicker-dropdown, .datepicker-container').css({
                'z-index': 1050,
                'position': 'absolute',
                'background-color': 'white'
            });
        }, 0);
    }
    
    let isSubmitting = false;
    
    function setupBorrowForm() {
        var request_id = generateRequestID();
        var book_id = localStorage.getItem("book_id");
        var account_id = localStorage.getItem("accountId");
        var request_type = "Borrow Request";
        var request_status = "Pending";
        var return_fine = 0;
    
        document.getElementById("borrowFormBookId").value = book_id;
        document.getElementById("borrowFormUserId").value = account_id;
    
        const borrowDate = new Date();
        const borrow_date = borrowDate.toISOString().split('T')[0];
        document.getElementById("BorrowFormStartDate").value = borrow_date;
    
        const sendButton = document.getElementById('sendBorrowFormButton');
        sendButton.removeEventListener('click', handleBorrowSubmit);
        sendButton.addEventListener('click', handleBorrowSubmit);
        
        function handleBorrowSubmit(event) {
            event.preventDefault();
            if (isSubmitting) return;
            isSubmitting = true;
    
            var return_date = document.getElementById('BorrowFormReturnDate').value;
            sendRequest(request_id, book_id, account_id, borrow_date, return_date, request_type, request_status, return_fine)
                .finally(() => {
                    isSubmitting = false;
                });
        }
    }
    
    function setupReserveForm() {
        var request_id = generateRequestID();
        var book_id = localStorage.getItem("book_id");
        var account_id = localStorage.getItem("accountId");
        var request_type = "Reservation Request";
        var request_status = "Pending";
        var return_fine = 0;
    
        document.getElementById("reserveFormBookId").value = book_id;
        document.getElementById("reserveFormUserId").value = account_id;
    
        const sendButton = document.getElementById('sendReservationFormButton');
        sendButton.removeEventListener('click', handleReserveSubmit);
        sendButton.addEventListener('click', handleReserveSubmit);
        
        function handleReserveSubmit(event) {
            event.preventDefault();
            if (isSubmitting) return;
            isSubmitting = true;
    
            var borrow_date = document.getElementById('reserveFormStartDate').value;
            var return_date = document.getElementById('reserveFormReturnDate').value;
            sendRequest(request_id, book_id, account_id, borrow_date, return_date, request_type, request_status, return_fine)
                .finally(() => {
                    isSubmitting = false;
                });
        }
    }
    
    function generateRequestID() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }
    
    function compareDates(start_date, return_date, datepickerId) {
        if (!start_date || !return_date) return;
    
        const startDateInt = parseInt(start_date.replace(/-/g, ''), 10);
        const returnDateInt = parseInt(return_date.replace(/-/g, ''), 10);
        if (returnDateInt < startDateInt) {
            alert("Invalid date: Return date cannot be earlier than start date");
            $(datepickerId).val('');
        }
    }
    
    function sendRequest(request_id, book_id, account_id, borrow_date, return_date, request_type, request_status, return_fine) {
        const requestForm = {
            request_id,
            book_id,
            account_id,
            borrow_date,
            return_date,
            request_type,
            request_status,
            return_fine
        };
    
        return fetch('/database/requests', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestForm)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Request sent successfully:', data);
            alert('Request sent successfully!');
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to send request. Please try again.');
        });
    }
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
    { text: 'Book Catalogue', href: '/EduBook.com/book-catalogue' },
    { text: 'Profile', href: '/EduBook.com/profile' },
    { text: 'Dashboard', href: '/EduBook.com/dashboard' },
    { text: 'Book Inventory', href: '/EduBook.com/book-inventory' },
];

const userSubMenuLinks = [
    { text: 'Pending Requests', href: '/EduBook.com/pending-requests' },
    { text: 'History Requests', href: '/EduBook.com/history-requests' },
];

const librarianLinks = [
    { text: 'Manage Accounts', href: '/EduBook.com/manage-accounts' },
    { text: 'Manage Books', href: '/EduBook.com/manage-books' },
    { text: 'Dashboard', href: '/EduBook.com/dashboard' },
    { text: 'Profile', href: '/EduBook.com/profile' },
];

const librarianSubMenuLinks = [
    { text: 'Pending Requests', href: '/EduBook.com/pending-requests' },
    { text: 'History Requests', href: '/EduBook.com/history-requests' },
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
