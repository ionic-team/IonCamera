import { Component, Element, State } from '@stencil/core';

declare var idbKeyval: any;

@Component({
  tag: 'images-page',
  styleUrl: 'images-page.scss'
})
export class ImagesPage {

  @Element() el: HTMLElement;

  @State() images: any[] = [];

  selectedImage: HTMLImageElement;

  componentDidLoad() {
    /*idbKeyval.get('images').then((value) => {
      console.log(value);

      this.images = value;
    })*/

    (window as any).db.collection('images').get().then((querySnapshot) => {
      this.images = querySnapshot;
    });
  }

  removeImage() {
    this.delete().then(() => {
      (window as any).requestIdleCallback(() => {
        const newArray = this.images.filter((image) => {
          console.log(image.size, parseInt(this.selectedImage.id));
          return image.size !== parseInt(this.selectedImage.id)
        });

        idbKeyval.set('images', newArray);

        setTimeout(() => {
          this.images = newArray;
        }, 1000);

      })
    });
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

  delete(): Promise<any> {
    return new Promise((resolve) => {
      this.selectedImage.parentNode.removeChild(this.selectedImage);
      this.el.querySelector('.animatedFooter').classList.remove('up');
      (this.el.querySelector('ion-content') as HTMLElement).style.pointerEvents = 'auto';

      resolve();
    })
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
    /*const images = this.images.map((image) => {
      console.log(image);
      const imageSrc = image;

      return (
        <img onClick={(e) => this.imageClick(e)} src={imageSrc} id={image.size}></img>
      )
    })*/

    const images = this.images.forEach((doc) => {
      const data = JSON.parse(JSON.stringify(doc.data()));
      const imageSrc = data.image;

      return (
        <img onClick={(e) => this.imageClick(e)} src={imageSrc} id={data.id}></img>
      )
    });

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
