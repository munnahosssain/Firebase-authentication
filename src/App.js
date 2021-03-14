import './App.css';
import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import firebase from "firebase/app";
// Add the Firebase services that you want to use
import "firebase/auth";
import "firebase/firestore";
import firebaseConfig from "./firebase.auth"

firebase.initializeApp(firebaseConfig);

function App() {
    const [user, setUser] = useState({
        isSignIn: false,
        name: '',
        photo: '',
        email: ''
    })

    const provider = new firebase.auth.GoogleAuthProvider();
    const handleSignIn = () => {
        firebase.auth()
            .signInWithPopup(provider)
            .then((result) => {
                /** @type {firebase.auth.OAuthCredential} */
                var credential = result.credential;

                // This gives you a Google Access Token. You can use it to access the Google API.
                var token = credential.accessToken;
                // The signed-in user info.
                var user = result.user;
                // ...
            }).catch((error) => {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // The email of the user's account used.
                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;
                // ...
            });
    }


    return (
        <div className="App">
            {/* {
                user.isSignIn ? <Button onClick={handleSignOut} variant="outline-light">Sign out</Button> :
                    <Button onClick={handleSignIn} variant="primary">Sign in</Button>
            } */}
            <Button onClick={handleSignIn} variant="primary">Sign in</Button>
            {
                user.isSignIn && <div>
                    <p>Welcome {user.name}</p>
                    <p>Your email : {user.email}</p>
                    <img src={user.photo} alt="" />
                </div>
            }
        </div>
    );
}

export default App;

// https://web.programming-hero.com/web-3/video/web-3-41-8-not-google-user-login-signout-user