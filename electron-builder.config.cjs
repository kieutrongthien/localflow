/** @type {import('electron-builder').Configuration} */
const config = {
  appId: 'com.localflow.desktop',
  productName: 'LocalFlow',
  artifactName: 'LocalFlow-${version}-${os}-${arch}.${ext}',
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
  extraResources: [
    {
      from: 'build',
      to: 'resources',
      filter: ['**/*.png', '**/*.icns', '**/*.ico']
    },
    {
      from: 'node_modules/better-sqlite3/build/Release',
      to: 'resources',
      filter: ['better_sqlite3.node']
    }
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
      },
      {
        target: 'deb',
        arch: ['x64']
      }
    ],
    category: 'Development',
    maintainer: 'LocalFlow Team',
    synopsis: 'Local-first backlog manager',
    description: 'LocalFlow – quản lý backlog ngay trong máy tính của bạn',
    artifactName: 'LocalFlow-${version}-linux-${arch}.${ext}'
  },
  win: {
    target: [
      {
        target: 'nsis',
        arch: ['x64']
      },
      {
        target: 'zip',
        arch: ['x64']
      }
    ],
    artifactName: 'LocalFlow-${version}-win-${arch}.${ext}'
  },
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true,
    perMachine: false,
    createDesktopShortcut: true,
    createStartMenuShortcut: true,
    uninstallDisplayName: 'LocalFlow'
  },
  mac: {
    target: [
      {
        target: 'dmg',
        arch: ['arm64', 'x64']
      },
      {
        target: 'zip',
        arch: ['arm64', 'x64']
      }
    ],
    category: 'public.app-category.developer-tools',
    darkModeSupport: true,
    artifactName: 'LocalFlow-${version}-mac-${arch}.${ext}'
  },
  dmg: {
    sign: false,
    contents: [
      { x: 130, y: 220 },
      { x: 410, y: 220, type: 'link', path: '/Applications' }
    ]
  },
  publish: {
    provider: 'generic',
    url: ''
  }
}

module.exports = config
