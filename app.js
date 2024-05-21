const express = require('express') //USING THE EXPRESS FILE
const {connectToDb, getDB} = require('./db') //USING THE .db FILE
const { ObjectId } = require('mongodb') //USING THE MONGODB FILE

//express FUNCTION RENAMED AS app IN ORDER TO BE USED FOR POST AND GET METHODS.
//SENDS THE DATA FROM THESE TO BROWSER IN JSON FORMAT
const app = express() 
app.use(express.json())

//SERVE THE STATIC FILES FROM THE 'public' DIRECTORY
app.use(express.static('public')) 
app.use(express.static('scripts'))

//SETTING THE VIEW ENGINE TO EJS ONLY FROM client FOLDER
app.set ('view engine', 'ejs');

app.set('views', './client')
app.set(express.static('client'));
//ESTABLISHING THE CONNECTION TO THE DATABASE
let database 

connectToDb((err) =>{
    if(!err){
        //ESTABLISHING THE LOCAL HOST CONNECTION WITH TIMESTAMP
        app.listen(3000, () =>{
            console.log('App listening on port 3000')
            const currentTimestamp = new Date();
            currentTimestamp.setHours(currentTimestamp.getHours() + 8)
            console.log('Local Hosted at Timestamp:',currentTimestamp);
        })
        database = getDB()
    }
    //IF THE CONNECTION TO THE SERVER FAILS
    else{
        console.log(err)
    }
})

// ESTABLISHING THE FULL OPERATION OF CRUD METHOD FOR THE manageParticipants
app.get('/database/accounts', (req, res) => {
    let allAccounts = [ ]
    database.collection('participants')
    .find()
    .forEach(account => allAccounts.push(account))
    .then(() => {
        res.status(200).json(allAccounts)
    })
    .catch(() => {
        res.status(404).json({
            error: 'Could not connect to participants collection'
        })
    })
})
app.get('/database/accounts/:id', (req, res) => {
    if (ObjectId.isValid(req.params.id)){
        const accountID = new ObjectId(req.params.id)

        database.collection('participants')
        .findOne({ _id: accountID})
        .then(doc => {
            if (doc) {
                res.status(200).json(doc);
            }
            else{
                res.status(404).json({error: 'Request not found'});
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Could not connect to the requests collection' });
        });
        } else {
            res.status(500).json({error: "Invalid Request ID"})
}})

app.post('/database/accounts', (req, res) => {
    const postAccount = req.body
    console.log(postAccount)

    database.collection('participants')
    .insertOne(postAccount)
    .then(result => {
        res.status(200).json(result)
    })
    .catch(err => {
        res.status(500).json({
            err: 'Could not add account to the participants collection'
        })
    })
})
// app.patch()


//localhost:3000/books
//READS THE 'books' COLLECTION AND SENDS IT TO THE BROWSER. SORTED ALPHABETICALLY BY NAME
app.get('/database/books', (req, res) => {
    let books = [ ]

    database.collection('books')
        .find()
        // .sort({
        //     book_title: 1
        // })
        .forEach(book => books.push(book))
        .then(() =>{
            res.status(200).json(books)
        })
        .catch(() =>{
            res.status(200).json({
                error: 'Could not access books collection'
            })
        })
})


//SEND OR STORE BOOKS TO THE DATABASE IN JSON FORMAT
app.post('/database/books', (req, res) =>{
    const book = req.body
    console.log(book)

    database.collection('books')
    .insertOne(book)
    .then(result => {
        res.status(201).json(result.ops[0]); // Send the inserted document in the response
    })
    .catch(err => {
        res.status(500).json({
            err: 'Could not add new book'
        })
    })
})    


app.get('/database/requests', (req, res) => {
    let requests = [ ]

    database.collection('requests')
        .find()

        .forEach(request => requests.push(request))
        .then(() =>{
            res.status(200).json(requests)
        })
        .catch(() =>{
            res.status(200).json({
                error: 'Could not access requests collection'
            })
        })
})


app.post('/database/requests', (req, res) =>{
    const request = req.body
    console.log(request)

    database.collection('requests')
    .insertOne(request)
    .then(result => {
        res.status(201).json(result.ops[0]); // Send the inserted document in the response
    })
    .catch(err => {
        res.status(500).json({
            err: 'Could not add new request'
        })
    })
})    
// FOR GETTING THE SINGULAR DOCUMENTS
app.get('/database/requests/:id', (req, res) => {
    if (ObjectId.isValid(req.params.id)){
        const requestID = new ObjectId(req.params.id)

        database.collection('requests')
        .findOne({ _id: requestID})
        .then(doc => {
            if (doc) {
                res.status(200).json(doc);
            }
            else{
                res.status(404).json({error: 'Request not found'});
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Could not connect to the requests collection' });
        });
        } else {
            res.status(500).json({error: "Invalid Request ID"})
}})
    
// FOR DELETING THE REQUESTS
app.delete('/database/requests/:id', (req, res) =>{
    if(ObjectId.isValid(req.params.id)) {
        const requestID = new ObjectId(req.params.id)
        database.collection('requests')
        .deleteOne({ _id: requestID})
        .then(result => {
            if (result){
                    res.status(200).json(result);
                } else {
                    res.status(404).json({ error: 'Request cannot be delete' });
                }
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ error: 'Could not connect to the requests collection' });
                    });
            } else {
                res.status(500).json({ error: 'Invalid Request ID' });
            }
})
// FOR UPDATING THE REQUESTS
app.patch('/database/requests/:id', (req, res) => {
    const requestID = req.params.id;

    if (ObjectId.isValid(requestID)) {
        const updateFields = req.body; // Assuming req.body contains the fields to update

        database.collection('requests')
            .updateOne(
                { _id: new ObjectId(requestID) },
                { $set: updateFields } // Using $set to specify the fields to update
            )
            .then(result => {
                if (result.matchedCount > 0) {
                    res.status(200).json(result);
                } else {
                    res.status(404).json({ error: 'Request not found' });
                }
            })
            .catch(err => {
                res.status(500).json({ error: 'An error occurred', details: err });
            });
    } else {
        res.status(400).json({ error: 'Invalid Request ID' });
    }
});





// // GETS THE INDIVIDUAL JSON WITH THE USE OF :id AS THE SPECIFIER TO WHICH JSON DATA IS TO BE PRESENTED
// app.get('/pendingrequests/:id', (req, res) => {
//     // ObjectId takes the value of the field '_id'
//     if (ObjectId.isValid(req.params.id)){
//         const objectID = new ObjectId(req.params.id)

//         database.collection('pendingHistory')
//         .findOne({_id: objectID})
//         .then(doc => {
//             if (doc) {
//                 res.status(200).json(doc);
//             }
//             else {
//                 res.status(404).json({error: 'Request not found'});
//             }
//         })
//         .catch(err => {
//             console.error(err);
//             res.status(500).json({ error: 'No collection found' });
//         });
//     } else {
//         res.status(500).json({error: "Invalid ID"})
//     }})

// // ALLOWS THE OPERATION OF DELETING THE DATA BY USING :id AS THE SPECIFIER TO LOCATE WHICH DATA IS TO BE DELETED
// app.delete('/pendingrequests/:id', (req, res) => {
//     if (ObjectId.isValid(req.params.id)) {
//         database.collection('pendingHistory')
//         .deleteOne({ _id: new ObjectId(req.params.id)})
//         .then(result => {
//             if (result) {
//                 res.status(200).json(result);
//             } else {
//                 res.status(404).json({ error: 'Request cannot be delete' });
//             }
//         })
//         .catch(err => {
//             console.error(err);
//             res.status(500).json({ error: 'Collection not found' });
//         });
// } else {
//     res.status(500).json({ error: 'Invalid ID' });
// }})



app.get('/library-management-system/manage-accounts', (req, res) => {
    res.render('manageAccounts')
})
app.get('/library-management-system/login', (req, res) => {
    res.render('loginAccount')
})
app.get('/library-management-system/dashboard', (req, res) => {
    res.render('libraryDashboard')
})
app.get('/library-management-system/profile', (req, res) => {
    res.render('libraryProfile')
})
app.get('/library-management-system/book-catalogue', (req, res) => {
    res.render('libraryBookCatalogue')
})
app.get('/library-management-system/manage-books', (req, res) => {
    res.render('manageBooks')
})
app.get('/library-management-system/book-details', (req, res) => {
    res.render('libraryBookInfo')
})

app.get('/library-management-system/pending-requests', (req, res) => {
    res.render('libraryPendingRequests')
})
app.get('/library-management-system/history-requests', (req, res) => {
    res.render('libraryHistoryRequests')
})

// // app.get('/library-management-system/login/librarian/dashboard/add_book', (req, res) => {
// //     res.render('add_book')
// // })