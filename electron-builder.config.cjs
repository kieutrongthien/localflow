/** @type {import('electron-builder').Configuration} */
const config = {
  appId: 'com.localflow.desktop',
  productName: 'LocalFlow',
  directories: {
    output: 'release',
    buildResources: 'build'
  },
  files: [
    {
      from: 'out/main',
      to: 'dist/main',
      filter: ['**/*']
    },
    {
      from: 'out/preload',
      to: 'dist/preload',
      filter: ['**/*']
    },
    {
      from: 'dist/renderer',
      to: 'dist/renderer',
      filter: ['**/*']
    },
    'package.json'
  ],
  asar: true,
  extraMetadata: {
    main: 'dist/main/index.js'
  },
  linux: {
    target: [
      {
        target: 'AppImage',
        arch: ['x64']
      }
    ],
    category: 'Development',
    artifactName: 'LocalFlow-${version}-linux-${arch}.${ext}'
  },
  win: {
    target: [
      {
        target: 'nsis',
        arch: ['x64']
      }
    ],
    artifactName: 'LocalFlow-${version}-win-${arch}.${ext}'
  },
  mac: {
    target: [
      {
        target: 'dmg',
        arch: ['arm64', 'x64']
      }
    ],
    category: 'public.app-category.developer-tools',
    artifactName: 'LocalFlow-${version}-mac-${arch}.${ext}'
  },
  publish: {
    provider: 'generic',
    url: ''
  }
}

module.exports = config
