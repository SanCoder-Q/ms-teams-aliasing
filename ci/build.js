var fs = require('fs'),
  path = require('path'),
  manifestPath = `${__dirname}/../manifest.json`,
  archiver = require('archiver'),
  buildPath = `${__dirname}/../dist/build`,
  compiledPath = `${__dirname}/../dist/compiled`,
  srcPath = `${__dirname}/../src`,
  manifest = JSON.parse(fs.readFileSync(manifestPath));

var isLocalBuild = process.env.TRAVIS_BRANCH === undefined;
var BUILD_VERSION = process.argv[2];

copy();
addManifest();
pack();

function addManifest() {
  if (!isLocalBuild) {
    var version = manifest.version.split('.');
    manifest.version = `${version[0]}.${version[1]}.${BUILD_VERSION}`;
    fs.writeFileSync(`${compiledPath}/manifest.json`, JSON.stringify(manifest, null, 4));
  } else {
    fs.writeFileSync(`${compiledPath}/manifest.json`, JSON.stringify(manifest, null, 4));
  }
  console.log('Current Version: ' + manifest.version);
}

function copy() {
  console.log('Copy ...');
  fs.mkdirSync(compiledPath, { recursive: true });
  const items = fs.readdirSync(srcPath, { withFileTypes: true });
  items.forEach((item) => {
    const src = path.join(srcPath, item.name);
    const dest = path.join(compiledPath, item.name);
    fs.copyFileSync(src, dest);
  });
}

function pack() {
  console.log('Zipping ...');
  fs.existsSync(buildPath) || fs.mkdirSync(buildPath, { recursive: true });
  var output = fs.createWriteStream(`${buildPath}/ms-teams-aliasing.zip`);
  var archive = archiver('zip', { zlib: { level: 9 } });
  output.on('close', function() {
    console.log(`Artifact: build/ms-teams-aliasing.zip (${archive.pointer()} bytes)`);
  });
  archive.on('error', function(err) {
    throw err;
  });
  archive.pipe(output);
  archive.glob(`**/*`, { cwd:compiledPath });
  archive.finalize();
}
