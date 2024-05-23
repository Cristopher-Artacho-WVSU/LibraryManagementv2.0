 // MAKING THE signUpForm VISIBLE
 document.getElementById('addAccountButton').addEventListener('click', function(){
    document.getElementById('blurBackground').classList.remove('hideContent');
    document.getElementById('signUpDiv').classList.remove('hideContent');
    setTimeout(() => {
        document.getElementById('blurBackground').classList.add('showContent');
        document.getElementById('signUpDiv').classList.add('showContent');
    }, 10)
});
// MAKING THE signUpForm INVISIBLE
document.getElementById('cancelForm').addEventListener('click', function() {
    document.getElementById('blurBackground').classList.remove('showContent');
    document.getElementById('signUpDiv').classList.remove('showContent');
    setTimeout(() => {
        document.getElementById('blurBackground').classList.add('hideContent');
    document.getElementById('signUpDiv').classList.add('hideContent');
    }, 300)
});
//VALIDATING THE INPUTS FOR REQUIREMENTS, CONFIRM PASSWORD, EMAIL, LAST AND FIRST NAME, AND CONTACT NUMBER
function validateInputs(username, password, last_name, given_name, email_address, contact_number, profile_picture, address, verify_password, account_type) {
if (!username || !password || !last_name || !given_name || !email_address || !contact_number || !profile_picture || !address ||! verify_password ||!account_type) {
alert("All fields are required")
throw new Error('All fields are required.');
}
if (password !== verify_password) {
alert("Passwords do not match");
throw new Error('Passwords do not match');
}
if (!email_address.endsWith('.com')) {
alert("Email address not valid")
throw new Error('Email address must end with ".com".');
}
if (!contact_number.startsWith('0') || contact_number.length != 11){
alert("Contact Number incorrect")
throw new Error('Contact Number should start with a zero and is exactly 11 digits in total')
}
if (username.includes(' ')){
alert("Username is incorrect")
throw new Error('Username contains whitespaces')
return;
}
if (given_name.charAt(0) !== given_name.charAt(0).toUpperCase()){
alert("First letter must be capital")
throw new Error('First Name First Letter is not Capital')
return;
}
if (last_name.charAt(0) !== last_name.charAt(0).toUpperCase()){
throw new Error('Last Name First Letter is not Capital')
}

}
//VERIFYING THAT THE USERNAME IS UNIQUE WITHIN THE DATABASE
async function checkUsernameExists(username) {
const response = await fetch('/database/accounts', {
    method: 'GET'
});
if (!response.ok) {
    throw new Error('Failed to check username existence. Server returned ' + response.status);
}

const usersData = await response.json();
const duplicateUser = usersData.find(users => users.username === username);

if (duplicateUser) {
    return true;
}
}

//IF THERE IS A CHANGE IN THE VALUE OF FILEINPUT, IMAGERELOAD() IS TRIGGERED
window.onload = function() {
document.getElementById('profile_picture').addEventListener('change', imageReload);
}
//FUNCTION FOR READING THE BOOK PATH
function imageReload(){
const image = document.getElementById('profile_picture').files[0]; //GETS THE VALUE AS AN OBJECT
const reader = new FileReader();  //RETURNS A FILEREADER OBJECT
reader.onload = function () {
    profile_picture = reader.result; //FILE CONTENTS
}
reader.readAsDataURL(image); //RETURNS THE FILE DATA
}

// GENERATING A RANDOM 6-DIGIT ALPHANUMERIC FOR USER ID
function generateUserID() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = 6;
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }
    return result;
}
// TOGGLING THE VISIBILITY FOR THE accountRoleValues DIV ON OR OFF
function toggleAccountTypeContent() {
    var accountRoleContent = document.getElementById('accountType_values');
    if (accountRoleContent.style.display === "block") {
        accountRoleContent.style.display = "none";
    } else {
        accountRoleContent.style.display = "block";
    }
}
// ADDING THE CHOSEN VALUE TO THE accountRole INPUT 
function setAccountType(value) {
    document.getElementById('accountType_values').style.display = "none";
    document.getElementById('account_type').value = value;
}
// ALLOWING TO HIDE THE DIV WHEN CLICKED OUTSIDE
window.onclick = function(event) {
    if (!event.target.matches('#account_type')) {
        var accountTypeContent = document.getElementById('accountType_values');
        if (accountTypeContent.style.display === "block") {
            accountTypeContent.style.display = "none";
        }
    }
}

document.getElementById("profilePicture").src = localStorage.getItem("profilePicture")


//ADD THE FORM INTO MONGODB DATABASE
document.addEventListener('DOMContentLoaded', function() {
document.getElementById('signUpForm').addEventListener('submit', async function(event) {
event.preventDefault();
const account_id = generateUserID();
const username = document.getElementById('username').value;
const password = document.getElementById('password').value;
const last_name = document.getElementById('last_name').value;
const given_name = document.getElementById('given_name').value;
const email_address = document.getElementById('email_address').value;
const contact_number = document.getElementById('contact_number').value;
const image = document.getElementById('profile_picture').files[0];
const verify_password = document.getElementById('verify_password').value;
const account_type = document.getElementById('account_type').value;
const address = document.getElementById('address').value;
const edited_by = localStorage.getItem("accountId")
//VALIDATE INPUTS
validateInputs(username, password, last_name, given_name, email_address, contact_number, profile_picture, address, verify_password, account_type);

//USERNAME CHECK
    const usernameExists = await checkUsernameExists(username);
    if (usernameExists) {
        alert('Username already exists. Please choose a different username.');
        return;
    }

    //FILEREADER ADD ON
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = function () {
        const picture = reader.result;
    }

    //JSON FORM
    const signup_creds = {account_id, username, password, last_name, given_name, email_address, contact_number, profile_picture, address, account_type, edited_by };

    //POST REQUEST ATTEMPT TO /users
    const response = await fetch('/database/accounts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(signup_creds)
    });

    if (!response.ok) {
        throw new Error('Failed to register account. Please try again');
    }

    const data = await response.json();
    console.log('User successfully registered:', data);
    alert('User account successfully added!');
    //REDIRECT TO INDEX AFTER FILLING UP THE FORM
    // window.location.href = '/library-management-system'
});
});

// FUNCTION FOR EXTRACTING THE USER ID
async function extractAccountID(){
    var accountID = document.getElementById("account_id").value;
    
    const response = await fetch('/database/accounts', {
        method: 'GET'
    });
    if (!response.ok) {
        throw new Error('Cannot connect to participants collection. Server returned ' + response.status);
    }
    const accountData = await response.json();
    const findAccountID = accountData.find(users => users.account_id === accountID);

    if (findAccountID){
        return console.log('User ID found')
    }
    else{
        return ('No User ID found')
    }
}

document.addEventListener("DOMContentLoaded", function(){
    console.log('beginning adding the data to table')
    fetch('/database/accounts')
    .then(response => {
        console.log('fetched successfully');
        return response.json(); // Return the parsed JSON data
    })
    .then(data => {
        data.forEach(field => {
            createAccountDataTable(
                field.account_id,
                field.username,
                field.email_address,
                field.contact_number,
                field.account_type,
                field.edited_by
            );
            console.log('Passed through the createAccountDataTable function')
        });
    })
    .catch(error => {
        console.error('Error fetching accounts:', error);
        throw new Error('Error Fetching accounts');
    });
});
async function createAccountDataTable(accountID, accountUsername, accountEmailAddress, accountContactNumber, accountType, librarianEdited){
    const accountCellData = document.getElementById("accountTableData")
    const tableRow = document.createElement("tr");
    const librarianFullName =  await getFullNameByHandleId(librarianEdited)
    tableRow.innerHTML =`
    <td>${accountID}</td>
    <td>${accountUsername}</td>
    <td>${accountEmailAddress}</td>
    <td>${accountContactNumber}</td>
    <td>${accountType}</td>
    <td>${librarianEdited}</td>`;
    
    accountCellData.append(tableRow)
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

    const accountPermissions = localStorage.getItem("accountType");
    const accountID = localStorage.getItem("accountId")
    const sidebar = document.getElementById('sidebar');
    const subMenuDiv = document.getElementById('subMenuDiv');

    document.addEventListener("DOMContentLoaded", function() {
    
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
        { text: 'Pending Requests', href: '/library-management-system/pending-requests' },
        { text: 'History Requests', href: '/library-management-system/history-requests' },
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

async function getFullNameByHandleId(handled_by){
    const response = await fetch(`/database/accounts?account_id=${handled_by}`, {
        method: 'GET'
    });
    if(!response.ok){
        console.log('Could not establish a connection to the accounts', handled_by);
        return 'Could not fetch the Full Name';
    }

    const accountData = await response.json();

    const fullName = accountData.find(accountparam => accountparam.account_id === handled_by);
    if (fullName){
        const {
            last_name,
            given_name
        } = fullName;
        return given_name + " " + last_name;
    }
    else{
        return 'Could not fetch the Full Name';
    }
}
