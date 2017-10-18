import { Component, Element, State, Prop } from '@stencil/core';

declare var idbKeyval: any;

@Component({
  tag: 'images-page',
  styleUrl: 'images-page.scss'
})
export class ImagesPage {

  @Element() el: HTMLElement;

  @State() images: any[] = [];

  @Prop({ context: 'isServer' }) private isServer: boolean;

  selectedImage: HTMLImageElement;

  componentDidLoad() {
    if (!this.isServer) {
      idbKeyval.get('images').then((value) => {
        console.log(value);

        this.images = value;
      })
    }
  }

  removeImage() {
    const newArray = this.images.filter((image) => {
      console.log(image.size, parseInt(this.selectedImage.id));
      return image.size !== parseInt(this.selectedImage.id)
    });

    console.log(newArray);
    this.images = newArray;

    this.selectedImage.classList.remove('selected');
    this.el.querySelector('.animatedFooter').classList.remove('up');
    (this.el.querySelector('ion-content') as HTMLElement).style.pointerEvents = 'auto';

    idbKeyval.set('images', newArray);

  }

  imageClick(e) {
    this.selectedImage = e.target;
    this.selectedImage.classList.add('selected');
    this.el.querySelector('.animatedFooter').classList.add('up');
    (this.el.querySelector('ion-content') as HTMLElement).style.pointerEvents = 'none';
  }

  done() {
    this.selectedImage.classList.remove('selected');
    this.el.querySelector('.animatedFooter').classList.remove('up');
    (this.el.querySelector('ion-content') as HTMLElement).style.pointerEvents = 'auto';
  }

  save() {
    const reader = new FileReader();

    const newArray = this.images.filter((image) => {
      console.log(image.size, parseInt(this.selectedImage.id));
      return image.size === parseInt(this.selectedImage.id)
    });

    reader.onloadend = function () {
      const base64 = reader.result;
      const link = document.createElement("a");

      link.setAttribute("href", base64);
      link.setAttribute("download", `image${Math.random()}`);
      link.click();
    };

    reader.readAsDataURL(newArray[0]);
  }

  render() {
    if (this.images) {
      const images = this.images.map((image) => {
        console.log(image);
        const imageSrc = URL.createObjectURL(image);

        return (
          <img onClick={(e) => this.imageClick(e)} src={imageSrc} id={image.size}></img>
        )
      })

      return (
        <ion-page class='show-page'>
          <ion-header>
            <ion-toolbar color='dark'>
              <ion-title>
                Pictures
                </ion-title>
            </ion-toolbar>
          </ion-header>

          <ion-content>
            <div class='container'>
              {images}
            </div>
          </ion-content>

          <ion-footer class='animatedFooter'>
            <ion-toolbar color='primary'>
              <ion-buttons slot='start'>
                <ion-button clear color='danger' onClick={() => this.removeImage()}>
                  Delete
                  </ion-button>
              </ion-buttons>

              <ion-buttons slot='end'>
                <ion-button clear onClick={() => this.save()}>
                  Save to Gallery
                  </ion-button>
                <ion-button onClick={() => this.done()} clear>
                  Done
                  </ion-button>
              </ion-buttons>
            </ion-toolbar>
          </ion-footer>
        </ion-page>
      );
    }
  }
}
