import { Component, Element, Prop } from '@stencil/core';
import { RouterHistory } from '@stencil/router';


@Component({
  tag: 'main-page',
  styleUrl: 'main-page.scss'
})
export class MainPage {

  @Element() el: HTMLElement;

  @Prop() history: RouterHistory;

  imageCapture: any;
  stream: MediaStream;

  componentDidLoad() {
    this.doCamera({
      video: { facingMode: "environment" },
      audio: false,
    })
  }

  doCamera(constraints: any) {
    navigator.mediaDevices.getUserMedia(
      constraints
    ).then((stream) => {
      this.stream = stream;
      this.imageCapture = new (window as any).ImageCapture(stream.getVideoTracks()[0]);

      this.el.querySelector('video').srcObject = stream;
    }).catch((err) => {
      console.error(err);
    })
  }

  takePic() {
    this.imageCapture.takePhoto().then((blob) => {
      this.save(blob);
    })
  }

  switchCamera() {
    this.stream.getTracks()[0].stop();

    const constraints = this.stream.getTracks()[0].getConstraints();
    if (constraints.facingMode === 'environment') {
      this.doCamera({
        video: { facingMode: 'user' }
      })
    } else {
      this.doCamera({
        video: { facingMode: 'environment' }
      })
    }
  }

  save(image: Blob) {
    /*idbKeyval.get('images').then((value) => {
      console.log(value, image);
      if (value === undefined) {
        idbKeyval.set('images', [image]);
      } else {
        console.log(value);
        value.push(image);
        idbKeyval.set('images', value);
      }
    })*/
    (window as any).db.collection('images').add({
      image: URL.createObjectURL(image)
    });
  }

  render() {
    return (
      <div>

        <video autoplay></video>

        <ion-footer>
          <ion-toolbar color='dark'>
            <ion-buttons slot='start'>
              <stencil-route-link url='/images'>
                <ion-button clear>
                  <ion-icon name='image'></ion-icon>
                </ion-button>
              </stencil-route-link>
            </ion-buttons>

            <ion-buttons slot='end'>
              <ion-button onClick={() => this.switchCamera()} clear>
                <ion-icon name='reverse-camera'></ion-icon>
              </ion-button>

              <ion-button clear onClick={() => this.takePic()}>
                <ion-icon name='camera'></ion-icon>
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-footer>
      </div>
    );
  }
}
