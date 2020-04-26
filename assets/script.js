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
        if(change.type === 'added') {
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