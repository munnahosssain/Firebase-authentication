import './App.css';
import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import firebase from "firebase/app";
// Add the Firebase services that you want to use
import "firebase/auth";
import "firebase/firestore";
import firebaseConfig from "./firebase.auth"

// firebase.initializeApp(firebaseConfig);
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
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
            .then(res => {
                console.log(res);
                const { displayName, photoURL, email } = res.user;
                const signedInUser = {
                    isSignIn: true,
                    name: displayName,
                    email: email,
                    photo: photoURL
                }
                setUser(signedInUser);
                console.log(displayName, email, photoURL);
                // var credential = res.credential;
                // var token = credential.accessToken;
                // var user = res.user;
            })
            .catch((error) => {
                console.log(error);
                console.log(error.message);
                // var errorCode = error.code;
                // var errorMessage = error.message;
                // var email = error.email;
                // var credential = error.credential;
            });
    }
    const handleSignOut = () => {
        firebase.auth().signOut()
            .then(res => {
                const signOutUser = {
                    isSignIn: false,
                    name: '',
                    photo: '',
                    email: ''
                }
                setUser(signOutUser)
            })
            .catch((error) => {
                // console.log(error);
                // console.log(error.message);
            });
    }
    const handleSubmit = () => {

    }
    const handleBlur = (event) => {
        console.log(event.target.name, event.target.value);
        if (event.target.name === 'email') {
            const isEmailValid = /\S+@\S+\.\S+/.test(event.target.value);
            console.log(isEmailValid);
        }
        if (event.target.name === 'password') {
            const isPasswordValid = event.target.length > 5;
            const passwordHashNumber = /\d{1}/.test(event.target.value);
            console.log(isPasswordValid && passwordHashNumber);
        }
    }
    return (
        <div className="App">
            {
                user.isSignIn ? <Button onClick={handleSignOut} variant="primary">Sign out</Button> :
                    <Button onClick={handleSignIn} variant="primary">Sign in</Button>
            }
            {/* <Button onClick={handleSignIn} variant="primary">Sign in</Button> */}
            {
                user.isSignIn && <div>
                    <p>Welcome {user.name}</p>
                    <p>Your email : {user.email}</p>
                    <img src={user.photo} alt="" />
                </div>
            }
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formGroupEmail">
                    <Form.Control onBlur={handleBlur} name="email" type="email" placeholder="Enter email" required />
                </Form.Group>
                <Form.Group controlId="formGroupPassword">
                    <Form.Control onBlur={handleBlur} name="password" placeholder="Enter password" type="password" placeholder="Password" required />
                </Form.Group>
                <Button type="submit" value="Submit">Submit</Button>
            </Form>
        </div>
    );
}

export default App;

// https://web.programming-hero.com/web-3/video/web-3-41-8-not-google-user-login-signout-user