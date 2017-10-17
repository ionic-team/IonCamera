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
          <stencil-route url='/' component='auth-page' exact={true}>
          </stencil-route>

          <stencil-route url='/main' component='main-page'>
          </stencil-route>

          <stencil-route url='/images' component='images-page'>
          </stencil-route>
        </stencil-router>
      </ion-app>
    );
  }
}
