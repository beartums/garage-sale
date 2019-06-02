import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';

import { Observable, Subscription, Subject, of } from 'rxjs';

import { map } from 'rxjs/operators';
import { User } from './user';
import { Message } from './message';
import { DataService } from './data.service';
import { FilterService } from './filter.service';

@Injectable()
export class AuthService {

  _offlineUser = {
    displayName: 'offline player',
    email: 'ric+offline@griffithnet.com',
    phoneNumber: '+256 DontCallMe',
    uid: 'xb0gzTfBzjgQ7Fc8e2O5L2XtciH3',
    photoURL: 'no/photo/here.jpg'
  }

  public authUser: Observable<firebase.User|any>;
  user: User;
  user$: Observable<User>;

  private _isLoggedIn = false;
  private _isAdmin = false;
  private _isLoggedIn$: Observable<boolean>;
  private _isAdmin$: Observable<boolean>;
  private subscription: Subscription;
  private userSubscription: Subscription;

  get isLoggedIn(): boolean {  return this._isLoggedIn; }
  get isAdmin(): boolean {  return this._isAdmin; }
  get isLoggedIn$(): Observable<boolean> {  return this._isLoggedIn$; }
  get isAdmin$(): Observable<boolean> {  return this._isAdmin$; }
  get userEmail(): string { return this.user.email; }
  get userDisplayName(): string { return this.user.displayName; }
  get userId(): string { return this.user.uid; }

  constructor(private firebaseAuth: AngularFireAuth, router: Router, private ds: DataService,
            private fs: FilterService) {

    // Wanted to do some offline programming at the hairy lemon, so tried to override the user info
    // here.  Never got this working properly (partly because there was a lot to do at the hairy lemon)
    // this.user = !environment.offline ? firebaseAuth.authState : of(this._offlineUser);
    this.authUser = firebaseAuth.authState;

    // Set private observables -- used mostly by AuthGuards
    this._isAdmin$ = this.authUser.pipe (map(authUser => this.isUserAdmin(authUser)));
    this._isLoggedIn$ = this.authUser.pipe (map(authUser => authUser ? true : false));

    // Subscribe to the user observable to handle login state changes and set private
    // non-observable state properties
    this.subscription = this.authUser.subscribe(authUser => {
      this.user = new User(authUser);
  
      if (authUser) {
        // Set loggedin and GM status
        this._isLoggedIn = true;
        this._isAdmin = this.isUserAdmin(authUser);
        this.user$ = this.ds.getUser$(this.user.uid);
        this.userSubscription = this.user$.subscribe( dbUser => {
          if (dbUser) {
            this.user = Object.assign(new User(), dbUser);
            // Update the loaded user with current data from the Authorized User and save
            const isChanged = this.user.updateAuthUserData(authUser);
            if (isChanged) {
              this.ds.updateUser(this.user.uid, this.user);
            }
            if (this.user.settings && this.user.settings.filters) {
              this.updateFilters(this.user.settings.filters);
            }
          } else {
            this.user = new User(authUser)
            this.ds.setUserData(this.user);
            this.user$ = of(this.user)
          }

        })
      } else {
        // Set logged out and GM status.  Also clear out the userdata
        this._isLoggedIn = false;
        this._isAdmin = false;
        this.user = new User();

      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  /**
   * Test is the user is an administrator.  Anyone from griffithnet.com is admin
   * @param user Currently logged in user
   * @returns True if user is a gm
   */
  isUserAdmin(user: firebase.User): boolean {
    const emailArray = user? user.email.split('@') : '';
    if (emailArray.length !== 2) { return false; };

    return emailArray[1].toLowerCase() === 'griffithnet.com';
  }

  /**
   * Sign up with email and password (not used)
   * @param email Email of person signing up
   * @param password Password of same person
   */
  signupWithEmail(email: string, password: string) {
    this.firebaseAuth.auth.createUserWithEmailAndPassword(email, password)
      .then(value => {
        console.log('Success!', value);
      })
      .catch(err => {
        console.log('Something went wrong:', err.message);
      });
  }

  /**
   * Login using email and password (Unused)
   * @param email Email of logger inner
   * @param password password of logger inner
   */
  loginWithEmail(email: string, password: string) {
    this.firebaseAuth.auth.signInWithEmailAndPassword(email, password)
      .then(value => {
        console.log('Nice, it worked!');
      })
      .catch(err => {
        console.log('Something went wrong:', err.message);
      });
  }

  /**
   * Google OAuth login
   */
  loginWithGoogle() {
    this.firebaseAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(value => {
        console.log(value);
      })
      .catch(err => {
        console.log('Something went wrong:', err.message);
      });
  }

  /**
   * Just what it says.  Log Out.
   */
  logout() {
    this.firebaseAuth.auth.signOut();
  }

   updateFilters(filters: any) {
    this.fs.chosenTags = filters.tagFilters ? filters.tagFilters.included || [] : [];
    this.fs.negativeTags = filters.tagFilters ? filters.tagFilters.excluded || [] : [];
    this.fs.soldItems = filters.soldItemFilter;
    this.fs.featuredItems =filters.featuredItemFilter;
    this.fs.favoritedItems = filters.favoritedItemFilter;
  }


}
