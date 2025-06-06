const { src, dest, watch, series } = require('gulp');

// CSS y SASS
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const cssnano = require('cssnano');
const terser = require('gulp-terser');
const replace = require('gulp-replace');
require('dotenv').config();

// Imágenes
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');

// Detectar si estamos en Netlify
const isNetlify = process.env.NETLIFY === 'true';

function css() {
  return src('src/scss/app.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('build/css'));
}

function imagenes() {
    return src('src/img/**/*')
        .pipe(imagemin({ optimizationLevel: 3 }))
        .pipe(dest('build/img'));
}

function versionWebp() {
    const opciones = { quality: 50 };
    return src('src/img/**/*.{png,jpg}')
        .pipe(webp(opciones))
        .pipe(dest('build/img'));
}

function versionAvif() {
    if (isNetlify) {
        console.log('⚠️  Saltando generación AVIF en Netlify');
        return Promise.resolve();
    }
    
    const opciones = { quality: 50 };
    return src('src/img/**/*.{png,jpg}')
        .pipe(avif(opciones))
        .pipe(dest('build/img'));
}

function dev() {
    watch('src/scss/**/*.scss', css);
    watch('src/img/**/*', imagenes);
}

function html() {
  return src('src/index.html')
    // Corregir rutas que empiezan con /build/
    .pipe(replace(/href="\/build\/css\//g, 'href="css/'))
    .pipe(replace(/src="\/build\/img\//g, 'src="img/'))
    .pipe(replace(/src="\/build\/js\//g, 'src="js/'))
    // También manejar rutas sin la barra inicial por si acaso
    .pipe(replace(/href="build\/css\//g, 'href="css/'))
    .pipe(replace(/src="build\/img\//g, 'src="img/'))
    .pipe(replace(/src="build\/js\//g, 'src="js/'))
    .pipe(dest('build'));
}

function javascript() {
    return src('src/js/app.js')
        .pipe(sourcemaps.init())
        .pipe(replace('process.env.EMAILJS_USER', `"${process.env.EMAILJS_USER}"`))
        .pipe(replace('process.env.SERVICE_ID', `"${process.env.SERVICE_ID}"`))
        .pipe(replace('process.env.TEMPLATE_ID', `"${process.env.TEMPLATE_ID}"`))
        .pipe(terser())
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/js'));
}

exports.build = series(imagenes, versionWebp, versionAvif, css, javascript, html);
exports.dev = series(exports.build, dev);
exports.default = exports.build;