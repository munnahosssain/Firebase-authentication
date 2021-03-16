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
        email: '',
        password: '',
    })
    const provider = new firebase.auth.GoogleAuthProvider();
    const handleSignIn = () => {
        firebase.auth()
            .signInWithPopup(provider)
            .then(res => {
                // console.log(res);
                const { displayName, photoURL, email } = res.user;
                const signedInUser = {
                    isSignIn: true,
                    name: displayName,
                    email: email,
                    photo: photoURL
                }
                setUser(signedInUser);
                // console.log(displayName, email, photoURL);
            })
            .catch((error) => {
                console.log(error);
                console.log(error.message);
            });
    }
    const handleSignOut = () => {
        firebase.auth().signOut()
            .then(res => {
                const signOutUser = {
                    isSignIn: false,
                    name: '',
                    photo: '',
                    email: '',
                    error: '',
                    success: '',
                }
                setUser(signOutUser)
            })
            .catch((error) => {
                console.log(error);
                console.log(error.message);
            });
    }
    const handleBlur = (event) => {
        // console.log(event.target.name, event.target.value);
        let isFieldValid = true;
        if (event.target.name === 'email') {
            isFieldValid = /\S+@\S+\.\S+/.test(event.target.value);
            // console.log(isFieldValid);
        }
        if (event.target.name === 'password') {
            const isPasswordValid = event.target.value.length > 6;
            // console.log(isPasswordValid, 'moreThanSix');
            const passwordHashNumber = /\d{1}/.test(event.target.value);
            // console.log(passwordHashNumber, 'is trueOrFalse');
            isFieldValid = isPasswordValid && passwordHashNumber;
            // console.log(isFieldValid, "valid");
        }
        if (isFieldValid) {
            const newUserInfo = { ...user };
            newUserInfo[event.target.name] = event.target.value;
            setUser(newUserInfo);
        }
    }
    const handleSubmit = (event) => {
        // console.log(user.email, user.password);
        if (user.email && user.password) {
            firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
                .then(res => {
                    const newUserInfo = { ...user };
                    newUserInfo.error = '';
                    newUserInfo.success = true;
                    setUser(newUserInfo);
                    // console.log(res);
                })
                .catch(error => {
                    const newUserInfo = { ...user };
                    newUserInfo.error = error.message;
                    newUserInfo.success = false;
                    setUser(newUserInfo);
                })
        }
        event.preventDefault();
    }
    return (
        <div className="App-header">
            {
                user.isSignIn ? <Button onClick={handleSignOut} variant="primary">Sign out</Button> :
                    <Button onClick={handleSignIn} variant="primary">Sign in</Button>
            }
            {
                user.isSignIn && <div className="App">
                    <p>Welcome {user.name}</p>
                    <p>Email : {user.email}</p>
                    <img src={user.photo} alt="" />
                </div>
            }
            <h1>Our Own Authentication</h1>
            {/* <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
            <p>Password: {user.password}</p> */}

            {/* <Form onSubmit={handleSubmit}>
                <input onBlur={handleBlur} name="name" type="name" placeholder="Your name" />
                <input onBlur={handleBlur} required type="email" name="email" placeholder="Enter email" />
                <input onBlur={handleBlur} required name="password" placeholder="Password" /><br />
                <input type="submit" value="Submit" />
            </Form> */}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formGroupEmail">
                    <Form.Control onBlur={handleBlur} name="name" type="name" placeholder="Your name" />
                </Form.Group>

                <Form.Group controlId="formGroupEmail">
                    <Form.Control onBlur={handleBlur} name="email" type="email" placeholder="Enter email" required />
                </Form.Group>

                <Form.Group controlId="formGroupPassword">
                    <Form.Control onBlur={handleBlur} name="password" type="password" placeholder="Password" required />
                </Form.Group>
                <Button type="submit" value="Submit">Submit</Button>
            </Form>
            <p style={{ color: 'red' }}>{user.error}</p>
            {
                user.success && <p style={{ color: 'green' }}>User created successfully</p>
            }
        </div>
    );
}

export default App;
