import fs from 'fs';
import path from 'path';
import gutil from 'gulp-util';
import { DOMParser } from 'xmldom';

function readFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, { encoding: 'utf-8' }, (error, contents) => {
      if (error) {
        reject(error);
      } else {
        resolve(contents);
      }
    });
  });
}

function toObject(keyValuePairs) {
  return keyValuePairs.reduce((result, keyValuePair) => {
    const key = keyValuePair[0];
    const value = keyValuePair[1];
    result[key] = value;
    return result;
  }, {});
}

function parseList(str, defaultValue) {
  return str ? str.split(';') : defaultValue;
}

function parseConfig(projectPath) {
  return Promise.resolve()
    .then(() => {
      const webConfig = path.resolve(projectPath, 'web.config');
      return readFile(webConfig);
    })
    .catch(() => {
      // if web.config not exist, try app.config
      const appConfig = path.resolve(projectPath, 'app.config');
      return readFile(appConfig);
    })
    .catch(() => {
      // if app.config not exist too, return empty contents
      return '<contents></contents>';
    })
    .then(contents => {
      const doc = new DOMParser().parseFromString(contents, 'text/xml');
      const entries = Array.from(doc.getElementsByTagName('add'))
        .filter(entry => entry.hasAttribute('key'))
        .map(entry => [entry.getAttribute('key'), entry.getAttribute('value')]);

      const result = toObject(entries);
      return result;
    });
}

const randomString = Math.random().toString().slice(2, 10);

export default {
  debug: gutil.env.configuration !== 'Release',
  tfsBuild: process.env.TF_BUILD === 'True',
  projectFile: (gutil.env.projectFile || __filename).trim(), // default value for testing only
  indexFileName: `__index_${randomString}.js`,

  initialize() {
    const options = this;
    const projectPath = path.dirname(options.projectFile);
    options.projectPath = projectPath;

    return parseConfig(projectPath).then(config => {
      const outputPath = (gutil.env.outputPath || 'bin').trim();
      const clientRelativePath = config.clientPath || 'client';
      const clientPath = path.resolve(projectPath, outputPath, clientRelativePath);

      options.clientPath = clientPath;
      options.indexPath = path.resolve(clientPath, options.indexFileName);
      options.webpackLockPath = path.resolve(clientPath, 'webpack.lock');

      options.extensions = parseList(config.extensions, ['jsx']).map(x => `.${x.trim('.')}`);
      options.clientLibraries = parseList(config.clientLibraries, []);
      options.layout = config.layout || path.resolve(__dirname, './layout.jsx');
      options.scriptBundleName = config.scriptBundleName || 'script.js';

      // TODO only support one pure CSS file now, support LESS and SCSS process in the future
      options.stylePath = config.styleFile ? path.resolve(projectPath, config.styleFile) : '';
      options.styleBundleName = config.styleBundleName || 'style.css';

      options.publicPath = config.publicPath || 'assets';
    });
  }
};