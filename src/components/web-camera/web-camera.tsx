import { Component } from '@stencil/core';


@Component({
  tag: 'web-camera',
  styleUrl: 'web-camera.scss'
})
export class WebCamera {

  render() {
    return (
      <ion-app>
        <stencil-router>
          <stencil-route url='/' component='main-page' exact={true}>
          </stencil-route>

          <stencil-route url='/images' component='images-page' exact={true}>
          </stencil-route>
        </stencil-router>
      </ion-app>
    );
  }
}
