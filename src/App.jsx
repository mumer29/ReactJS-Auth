import React, {useState, useEffect} from 'react'
import { GlobalStyle } from './styles/GlobalStyles'

import Login from './components/Login'

import fire from './database/fire';

export default function App() {

  const [user,setUser] = useState('');

  const [email,setEmail] = useState('');
  const [emailError,setEmailError] = useState('');

  const [password,setPassword] = useState('');
  const [passwordError,setPasswordError] = useState('');

  const [hasAccount,setHasAccount] = useState(false);

  const clearInputs = () =>{
    setEmail('');
    setPassword('');
  }

  const clearErrors = () =>{
    setEmailError('');
    setPasswordError('');
  }

  const handleLogin = () => {
    fire.auth()
    .signInWithEmailAndPassword(email,password)
    .catch((err) =>{
      switch(err.code){
        case 'auth/invalid-email':
        case 'auth/user-disabled':
        case 'auth/user-not-found':
          setEmailError(err.message);
          break;
        case 'auth/wrong-password':
          setPasswordError(err.message);
          break;
      }

    })
  }

  const handleSignup = () => {
    fire.auth()
    .createUserWithEmailAndPassword(email,password)
    .catch((err) =>{
      switch(err.code){
        case 'auth/email-already-in-use':
        case 'auth/invalid-email':
          setEmailError(err.message);
          break;
        case 'auth/weak-password':
          setPasswordError(err.message);
          break;
      }
    })
  }

  const handleLogout = () => {
    fire.auth().signOut()
  }

  const authListener = () =>{
    fire.auth().onAuthStateChanged((user) =>{
      if(user){
        clearInputs();
        setUser(user);
      } else{
        setUser('')
      }
    })
  }

  useEffect(() =>{
    authListener();
  }, [])

  return (
    <div>
      <Login 
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleLogin={handleLogin}
      handleSignup={handleSignup}
      hasAccount={hasAccount}
      setHasAccount={setHasAccount}
      emailError={emailError}
      passwordError={passwordError}
      />
      <GlobalStyle/>
    </div>
  )
}
