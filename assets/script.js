var firebaseConfig = {
    apiKey: "AIzaSyAsn1tsVokdbR9dHZuaLlbSJYnMBwl-ZQA",
    authDomain: "iftar-mahfil.firebaseapp.com",
    databaseURL: "https://iftar-mahfil.firebaseio.com",
    projectId: "iftar-mahfil",
    storageBucket: "iftar-mahfil.appspot.com",
    messagingSenderId: "154325578581",
    appId: "1:154325578581:web:be38097ba1b187dffef5dc",
    measurementId: "G-46SGQGSFHS",
    crossDomain: true,
    crossorigin: true
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//   firebase.analytics();

console.log("Result");
var db = firebase.firestore();
var tableData = [];

var fundAmount = {
    fund: 0,
    distributed: 0,
    balance: 0
}

db.collection('Result').onSnapshot(snapshot => {
    console.log("Result");
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        console.log(change.doc.data());
        if (change.type === 'added') {
            document.getElementById("fund").innerHTML = change.doc.data().fund;
            document.getElementById("donated").innerHTML = change.doc.data().donated;
            document.getElementById("available").innerHTML = change.doc.data().available;
            fundAmount['fund'] = change.doc.data().fund;
        } else if (change.type === "modified") {
            console.log(change.doc.data());
            document.getElementById("fund").innerHTML = change.doc.data().fund;
            document.getElementById("donated").innerHTML = change.doc.data().donated;
            document.getElementById("available").innerHTML = change.doc.data().available;
        }
    });
})

function saveFundAmount(fundAmount) {

    var donated;
    db
        .collection('Result')
        .doc('Result')
        .get()
        .then(doc => {
            if (doc.exists) {
                //Inserted data of total funding
                db.collection('Result').doc('Result').set({
                    fund: fundAmount.fund,
                    donated: fundAmount.distributed,
                    available: fundAmount.balance,
                });
            }
        })
        .catch(error => {
            console.log("Resutl error: ", error)
        });
}

let distributedTableData = [];
//create element and render list
function renderDistributedList(doc) {

    var values = {
        name: doc.data().name, amount: doc.data().amount, charge: doc.data().charge,
        total: doc.data().total, transactionID: doc.data().transactionID, proof: doc.data().proof
    };
    distributedTableData.push(values);
}

db.collection('Distributed').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if (change.type === 'added') { // If data is added
            renderDistributedList(change.doc);
            fundAmount['distributed'] += parseInt(change.doc.data().total);
        } else if (change.type === "removed") { // If data is removed
            let index = 0;
            for (let data of distributedTableData) {
                if (data.transactionID == change.doc.data().transactionID) {
                    console.log("Removed ", index);
                    distributedTableData.splice(index, 1);
                    break;
                }
                index++;
            }
        } else if (change.type === "modified") { // If data is modified
            let index = 0;
            for (let data of distributedTableData) {
                if (data.transactionID == change.doc.data().transactionID) {
                    distributedTableData[index] = change.doc.data();
                    break;
                }
                index++;
            }
        }
    });

    fundAmount['balance'] = fundAmount['fund'] - fundAmount['distributed'];
    saveFundAmount(fundAmount)
    loadDistributedTableData(distributedTableData);

});


// Adding data into table
function loadDistributedTableData(distributedTableData) {
    const tableBody = document.getElementById('distributedList');
    let dataHtml = '';
    if (distributedTableData != null) {
        for (let data of distributedTableData) {
            dataHtml += '<tr><td><input class="list-value" value="' + data.name +
                '"></td><td><input class="list-value" value="' + data.amount +
                '"></td><td><input class="list-value" value="' + data.charge +
                '"></td><td><input class="list-value" value="' + data.total +
                '"></td><td><input class="list-value" value="' + data.proof +
                '"></center></td></tr>';
            tableBody.innerHTML = dataHtml;
        }

    }
}


// // Realtime data fetching
// db.collection('Donation List').orderBy('name', 'asc').onSnapshot(snapshot => {
//     let changes = snapshot.docChanges();
//     changes.forEach(change => {
//         console.log(change.doc.data());
//         if (change.type === 'added') { // If data is added
//             renderList(change.doc);

//         } else if (change.type === "removed") { // If data is removed
//             console.log("Id: " + change.doc.data().transactionID);
//             let index = 0;
//             for (let data of tableData) {
//                 if (data.transactionID == change.doc.data().transactionID) {
//                     console.log("Removed ", index);
//                     tableData.splice(index, 1);
//                     break;
//                 }
//                 index++;
//             }
//         } else if (change.type === "modified") { // If data is modified
//             console.log(change.doc.data().transactionID);
//             let index = 0;
//             for (let data of tableData) {
//                 if (data.transactionID == change.doc.data().transactionID) {
//                     console.log("Modified ", index);
//                     tableData[index] = change.doc.data();
//                     break;
//                 }
//                 index++;
//             }
//         }


//     });

//     loadTableData(tableData);
// });



// //create element and render list
// function renderList(doc) {

//     var values = {
//         name: doc.data().name, email: doc.data().email, batch: doc.data().batch, account: doc.data().account,
//         amount: doc.data().amount, transactionID: doc.data().transactionID
//     };

//     tableData.push(values);
//     console.log(tableData);
// }

// var databasePath = 'Pending Donation'




// Adding data into table
// function loadTableData(tableData) {
//     const tableBody = document.getElementById('donorList');
//     let dataHtml = '';
//     let index = 0;
//     for (let data of tableData) {
//         dataHtml += '<tr><td><input class="list-value" value="' + data.name +
//             '"></td><td><input class="list-value" value="' + data.batch +
//             '"></center></td></tr>';
//         index++;
//     }
//     tableBody.innerHTML = dataHtml;

// }


const form = document.querySelector('#donationForm');
document.getElementById("donationForm").style.display = "none";
form.addEventListener('submit', (e) => {
    e.preventDefault();
    //confirmation message
    Swal.fire(
        'Donation Successful',
        'Thanks for your donation! Your donation request is under the checking process. Ater checking process it will be added to the donation list.',
        'success'
    )

    //Inserted data
    db.collection('Pending Donation').doc(form.transactionID.value).set({
        name: form.name.value,
        email: form.email.value,
        batch: form.batch.value,
        account: form.account.value,
        amount: form.amount.value,
        transactionID: form.transactionID.value
    })
    //blank this field when inserted
    console.log(form.batch.value)
    form.name.value = '';
    form.email.value = '';
    form.amount.value = '';
    form.transactionID.value = '';
})

document.getElementById("clickForDonation").onclick = function () {
    console.log("Donation")
    document.getElementById("donationForm").style.display = "block";
    document.getElementById("clickForDonation").style.display = "none"
}
