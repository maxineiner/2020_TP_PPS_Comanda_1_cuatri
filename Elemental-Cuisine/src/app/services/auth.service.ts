import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { auth } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private AFauth: AngularFireAuth,
    private router: Router,
  ) { }

  logIn(email: string, password: string) {
    return new Promise((resolve, rejected) => {
      this.AFauth.auth.signInWithEmailAndPassword(email, password)
        .then(user => resolve(user))
        .catch(err => rejected(err))
    });
  }

  logOut() {
    this.AFauth.auth.signOut().then(auth => {
      this.router.navigate(['/login']);
    })
  }

  getCurrentUser() {
    return this.AFauth.auth.currentUser;
  }

  createUser(user) {
    var actionCodeSettings = {
      url: '/login',
      handleCodeInApp: true
    };

    this.AFauth.auth.sendSignInLinkToEmail(user.email, actionCodeSettings)
      .then(function() {
        // The link was successfully sent. Inform the user.
        // Save the email locally so you don't need to ask the user for it again
        // if they open the link on the same device.
        window.localStorage.setItem('emailForSignIn', user.email);
      })
      .catch(function(error) {
        // Some error occurred, you can inspect the code: error.code
      });
    return this.AFauth.auth.createUserWithEmailAndPassword(user.email, user.password);
  }

  async googleSignIn() {
    const provider = new auth.GoogleAuthProvider();
    const credential = await this.AFauth.auth.signInWithPopup(provider);
    return credential.user;
  }

  async facebookSigin() {
    const provider = new auth.FacebookAuthProvider();
    const credential = await this.AFauth.auth.signInWithPopup(provider);
    return credential.user;
  }

}