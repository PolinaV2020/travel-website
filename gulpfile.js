const { src, dest, series, watch} = require("gulp")
const sass = require("gulp-sass")
const csso = require("gulp-csso")
const include = require("gulp-file-include")
const htmlmin = require("gulp-htmlmin")
const del = require("del")
const autoprefixer = require("gulp-autoprefixer")
const concat = require("gulp-concat")
const sync = require("browser-sync").create()

    

function html() {
  return src("src/**.html")
    .pipe(include({
      prefix: "@@"
    }))
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(dest("dist"))
}


function scss() {
  return src("src/scss/**.scss")
  .pipe(sass())
  .pipe(autoprefixer({
    cascade: false
  }))
  .pipe(csso())
  .pipe(concat("index.css"))
  .pipe(dest("dist"))
}

exports.html = html
exports.scss = scss


function clear() {
  return del("dist")
}


function serve() {
  sync.init({
    server: "./dist"
  })

  watch("src/**.html", series(html)).on("change", sync.reload)
  watch("src/img/", series(html, scss)).on("change", sync.reload)
  watch("src/scss/**.scss", series(scss)).on("change", sync.reload)
}

exports.clear = clear
exports.build = series(clear, scss, html)
exports.serve = series(clear, scss, html, serve)
