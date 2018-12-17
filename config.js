const path = require('path')
const ROOT_DIR = path.resolve(__dirname, './')
const SRC_DIR = path.resolve(ROOT_DIR, './src')
const CLIENT_DIR = path.resolve(SRC_DIR, './client')
const PUBLIC_DIR = path.resolve(ROOT_DIR, './public')

module.exports = {
  ROOT_DIR,
  CLIENT_DIR,
  PUBLIC_DIR
}
