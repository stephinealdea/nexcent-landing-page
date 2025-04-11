import gulp from 'gulp';
import gulpSass from 'gulp-sass';
import * as dartSass from 'sass';
import cleanCSS from 'gulp-clean-css';
import terser from 'gulp-terser';
import sourcemaps from 'gulp-sourcemaps';
import rename from 'gulp-rename';
import concat from 'gulp-concat';
import { deleteAsync } from 'del';

// Initialize Sass compiler (Dart Sass)
const sass = gulpSass(dartSass);

// Paths configuration
const paths = {
  src: 'src',
  dest: 'dist',
  scss: 'src/scss/**/*.scss',
  js: 'src/js/**/*.js',
  cleanable: ['dist/css', 'dist/js']
};

// Selective cleaning (won't touch fonts)
export const clean = () => deleteAsync(paths.cleanable);

// Compile SCSS to CSS + minify + sourcemaps
export const styles = () => {
  return gulp.src(paths.scss)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS({ 
      compatibility: 'ie11',
      level: 2 // more aggressive minification
    }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(`${paths.dest}/css`));
};

// Concatenate & minify JS
export const scripts = () => {
  return gulp.src(paths.js)
    .pipe(sourcemaps.init())
    .pipe(concat('bundle.min.js'))
    .pipe(terser({
      keep_fnames: false,
      mangle: true
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(`${paths.dest}/js`));
};

// Watch for changes
export const watch = () => {
  gulp.watch(paths.scss, styles);
  gulp.watch(paths.js, scripts);
};


// Default task (run all)
export const build = gulp.series(
  clean,
  gulp.parallel(styles, scripts)
);

// Dev task (build + watch)
export const dev = gulp.series(build, watch);

// Set 'build' as default task
export default build;