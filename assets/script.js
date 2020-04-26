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

db.collection('Result').onSnapshot(snapshot => {
    console.log("Result");
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        console.log(change.doc.data());
        if (change.type === 'added') {
            document.getElementById("fund").innerHTML = change.doc.data().fund
            document.getElementById("donated").innerHTML = change.doc.data().donated
            document.getElementById("available").innerHTML = change.doc.data().available
        } else if (change.type === "modified") {
            console.log(change.doc.data());
            document.getElementById("fund").innerHTML = change.doc.data().fund
            document.getElementById("donated").innerHTML = change.doc.data().donated
            document.getElementById("available").innerHTML = change.doc.data().available
        }
    });
})


const form = document.querySelector('#donationForm');
document.getElementById("donationForm").style.display = "none";
form.addEventListener('submit', (e) => {
    e.preventDefault();
    //confirmation message
    Swal.fire(
        'Donation Successful',
        'Thanks for your donation!',
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