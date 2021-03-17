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
    const [newUser, setNewUser] = useState(false);
    const [user, setUser] = useState({
        isSignIn: false,
        name: '',
        photo: '',
        email: '',
        password: '',
    })
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    const fbProvider = new firebase.auth.FacebookAuthProvider();
    const handleSignIn = () => {
        firebase.auth()
            .signInWithPopup(googleProvider)
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

    const handleFbSignIn = () => {
        firebase.auth()
            .signInWithPopup(fbProvider)
            .then(res => {
                console.log('hello');
                var credential = res.credential;
                var user = res.user;
                var accessToken = credential.accessToken;
                console.log(user, 'fb user using in');
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                var email = error.email;
                var credential = error.credential;
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
        if (newUser && user.email && user.password) {
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
                    updateUserName(user.name);
                })
        }
        if (!newUser && user.email && user.password) {
            firebase.auth().signInWithEmailAndPassword(user.email, user.password)
                .then(res => {
                    const newUserInfo = { ...user };
                    newUserInfo.error = '';
                    newUserInfo.success = true;
                    setUser(newUserInfo);
                    console.log('sign in user information', res.user);
                })
                .catch((error) => {
                    const newUserInfo = { ...user };
                    newUserInfo.error = error.message;
                    newUserInfo.success = false;
                    setUser(newUserInfo);
                });
        }
        event.preventDefault();
    }
    const updateUserName = name => {
        var user = firebase.auth().currentUser;

        user.updateProfile({
            displayName: name
        }).then(function () {
            console.log('user name updated successfully');
        }).catch(function (error) {
            console.log(error);
        });
    }
    return (
        <div className="App-header">
            {
                user.isSignIn ? <Button onClick={handleSignOut} variant="primary">Sign out</Button> :
                    <Button onClick={handleSignIn} variant="primary">Sign in</Button>
            }
            <br /> <Button onClick={handleFbSignIn} variant="primary">Sign in Facebook</Button>
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

            <Form.Group id="formGridCheckbox">
                <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" id="" />
                <label htmlFor="newUser"> sign up for new user</label>
            </Form.Group>

            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formGroupEmail">
                    {
                        newUser && <Form.Control onBlur={handleBlur} name="name" type="name" placeholder="Your name" />
                    }
                </Form.Group>

                <Form.Group controlId="formGroupEmail">
                    <Form.Control onBlur={handleBlur} name="email" type="email" placeholder="Enter email" required />
                </Form.Group>

                <Form.Group controlId="formGroupPassword">
                    <Form.Control onBlur={handleBlur} name="password" placeholder="Password" required />
                </Form.Group>
                <Button type="submit" value="Submit">{newUser ? 'Sign up' : 'Sing In'}</Button>
            </Form>
            <p style={{ color: 'red' }}>{user.error}</p>
            {
                user.success && <p style={{ color: 'green' }}>User {newUser ? 'created' : 'Logged in'} successfully</p>
            }
        </div>
    );
}

export default App;
