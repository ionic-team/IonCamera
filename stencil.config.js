exports.config = {
  bundles: [
    { components: ['main-page']},
    { components: ['web-camera', 'auth-page'] },
    { components: ['images-page'] }
  ],
  collections: [
    { name: '@stencil/router' },
    { name: '@ionic/core' }
  ]
};

exports.devServer = {
  root: 'www',
  watchGlob: '**/**'
}
