import { Component, Element, Prop, State} from '@stencil/core';
import { ToastController, AlertController } from '@ionic/core';


@Component({
  tag: 'video-page',
  styleUrl: 'video-page.scss'
})
export class WebCamera {

  @Element() el: HTMLElement;

  @Prop({ connect: 'ion-toast-controller' }) toastCtrl: ToastController;
  @Prop({ connect: 'ion-alert-controller' }) alertCtrl: AlertController;

  @State() recording: boolean;

  stream: MediaStream;
  mediaRecorder: any;
  chunks: any[] = [];

  componentDidLoad() {
    navigator.mediaDevices.getUserMedia(
      {
        video: true,
        audio: true
      }
    ).then((stream) => {
      this.stream = stream;
      this.mediaRecorder = new (window as any).MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });

      (this.el.querySelector('#firstVideo') as HTMLVideoElement).srcObject = stream;
    }).catch((err) => {
      console.error(err);
    })
  }

  record() {
    this.mediaRecorder.start();

    this.recording = true;

    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        this.chunks.push(e.data);
      }
    }
  }

  stop() {
    this.mediaRecorder.stop();

    this.mediaRecorder.onstop = () => {
      this.toastCtrl.create({ message: 'Recording stopped', duration: 1000 }).then((toast) => {
        toast.present().then(() => {
          this.alertCtrl.create({
            title: 'Download',
            message: 'Download this video?',
            buttons: [
              {
                text: 'Download',
                handler: () => {
                  this.handleChunks()
                }
              }, 
              {
                text: 'Cancel',
                role: 'cancel',
                handler: () => {
                  console.log('Cancel clicked');
                  location.reload();
                }
              }
            ]
          }).then((alert) => {
            alert.present();
          })
        })
      })
    }
  }

  handleChunks() {
    console.log('here');

    this.recording = false;

    var blob = new Blob(this.chunks, {
      type: 'video/webm'
    });
    const url = URL.createObjectURL(blob);
    console.log(url);

    // hack way to get it to download
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.href = url;
    a.download = 'video.webm';
    a.click();
    console.log('im here');
    window.URL.revokeObjectURL(url);

    location.reload();
  }

  render() {
    if (this.recording === undefined || this.recording === false ) {
      return (
        <ion-app>
  
          <video id='firstVideo' autoplay></video>
  
          <ion-footer>
            <ion-toolbar color='dark'>
              <ion-button clear onClick={() => this.record()}>
                Start
              </ion-button>

            </ion-toolbar>
          </ion-footer>
        </ion-app>
      );
    } else {
      return (
        <ion-app>
  
          <video id='firstVideo' autoplay></video>
  
          <ion-footer>
            <ion-toolbar color='dark'>
  
              <ion-button clear onClick={() => this.stop()}>
                Stop
              </ion-button>
            </ion-toolbar>
          </ion-footer>
        </ion-app>
      );
    }
  }
}
