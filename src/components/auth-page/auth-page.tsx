import { Component, Prop } from '@stencil/core';
import { RouterHistory } from '@stencil/router';

declare var firebase: any;

@Component({
  tag: 'auth-page',
  styleUrl: 'auth-page.scss'
})
export class WebCamera {

  @Prop() history: RouterHistory;

  provider: any;

  componentDidLoad() {
    
    this.provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().getRedirectResult().then((result) => {
      if (result && result.credential) {
        const token = result.credential.accessToken;
        console.log(token);

        const user = result.user;
        console.log(user);

        // this.history.push(`/main`, {});

        window.location.href = '/main';
      }
    }).catch(function(error) {
      console.error(error);
    });
  }

  login() {
    firebase.auth().signInWithRedirect(this.provider);
  }

  render() {
    return (
      <ion-page class='show-page'>
        <ion-content padding>
          
          <div class='myIcon'>
            <img src='./assets/icon/256.png'></img>
          </div>

          <h1>IonCamera</h1>

          <div class='loginButton'>
            <ion-button block onClick={() => this.login()}>Login</ion-button>
          </div>
        </ion-content>
      </ion-page>
    );
  }
}
