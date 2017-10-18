import { Component, Element, Prop, State } from '@stencil/core';
import { RouterHistory } from '@stencil/router';

declare var idbKeyval: any;

@Component({
  tag: 'main-page',
  styleUrl: 'main-page.scss'
})
export class MainPage {

  @Element() el: HTMLElement;

  @Prop() history: RouterHistory;
  @Prop({ context: 'isServer' }) private isServer: boolean;
  @State() imageLabels: any[];

  imageCapture: any;
  stream: MediaStream;
  flash: Boolean = false;

  componentDidLoad() {
    if (!this.isServer) {
      if (this.stream && this.stream.getTracks()[0]) {
        this.stream.getTracks()[0].stop();

        this.doCamera({
          video: { facingMode: "environment" },
          audio: false,
        });
      } else {
        this.doCamera({
          video: { facingMode: "environment" },
          audio: false,
        });
      }
    }
  }

  componentWillUnload() {
    this.stream.getTracks()[0].stop();
  }

  doCamera(constraints: any) {
    navigator.mediaDevices.getUserMedia(
      constraints
    ).then((stream) => {
      this.stream = stream;
      if ('ImageCapture' in window) {
        this.imageCapture = new (window as any).ImageCapture(stream.getVideoTracks()[0]);
      } else {
        this.imageCapture = {};
      }

      this.el.querySelector('video').srcObject = stream;
    }).catch((err) => {
      console.error(err);
    })
  }

  takePic() {
    if ('ImageCapture' in window) {
      this.imageCapture.takePhoto().then((blob) => {
        navigator.vibrate(300);
        this.save(blob);
      })
    } else {
      const input = document.createElement('input');
      input.type = 'file';
      input.name = 'image';
      input.accept = 'image/*';
      input.setAttribute('capture', '');

      input.click();

      input.addEventListener('change', (ev: any) => {
        console.log(ev);
        // const url = window.URL.createObjectURL(ev.target.files[0]);

        this.save(ev.target.files[0]);
      })
    }
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

  save(image: any) {
    console.log(image);
    idbKeyval.get('images').then((value) => {
      console.log(value, image);
      if (value === undefined) {
        idbKeyval.set('images', [image]);
      } else {
        console.log(value);
        value.push(image);
        idbKeyval.set('images', value);
      }
    })
  }

  google() {
    this.imageCapture.takePhoto().then((blob) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);

      reader.onloadend = () => {

        fetch('/vision', {
          method: 'POST',
          body: JSON.stringify({ image: reader.result })
        }).then((res) => {
          return res.json()
        }).then((data) => {
          console.log(data);

          this.imageLabels = data;

          setTimeout(() => {
            this.el.querySelector('.labelsCard').classList.add('up');
          }, 500);
        })

      }
    })
  }

  close() {
    this.el.querySelector('.labelsCard').classList.remove('up');

    setTimeout(() => {
      this.imageLabels = null;
    }, 300);
  }

  render() {
    if (this.imageLabels) {
      const list = this.imageLabels.slice(0, 2);
      const labels = list.map((label) => {
        return (
          <li>{label}</li>
        )
      });

      return (
        <div>
          <video autoplay></video>

          <ion-footer>
            <div class='labelsCard'>
              <ion-button clear color='primary' onClick={() => this.close()}>
                Close
            </ion-button>

              <span class='what-i-see'>What I see</span>

              <ul>
                {labels}
              </ul>
            </div>
            <ion-toolbar color='dark'>
              <ion-buttons slot='start'>
                <stencil-route-link url='/images'>
                  <ion-button clear>
                    <ion-icon name='image'></ion-icon>
                  </ion-button>
                </stencil-route-link>

                <stencil-route-link url='/video'>
                  <ion-button clear>
                    <ion-icon name='videocam'></ion-icon>
                  </ion-button>
                </stencil-route-link>
              </ion-buttons>

              <ion-buttons slot='end'>
                <ion-button onClick={() => this.google()} clear>
                  <ion-icon name='search'></ion-icon>
                </ion-button>

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
    } else {
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

                <stencil-route-link url='/video'>
                  <ion-button clear>
                    <ion-icon name='videocam'></ion-icon>
                  </ion-button>
                </stencil-route-link>
              </ion-buttons>

              <ion-buttons slot='end'>
                <ion-button onClick={() => this.google()} clear>
                  <ion-icon name='search'></ion-icon>
                </ion-button>

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
      )
    }
  }
}
