// Get things set up
// -------------------------------------------------------------------
    // Include Gulp
var gulp                    = require("gulp"),

    // HTML plugins
    fileinclude             = require("gulp-file-include"),
    htmlmin                 = require("gulp-htmlmin"),

    // CSS plugins
    sass                    = require("gulp-sass")(require("sass")),
    autoprefixer            = require("gulp-autoprefixer"),
    cssmin                  = require("gulp-clean-css"),
    rename                  = require("gulp-rename"),

    // JS plugins
    concat                  = require("gulp-concat"),
    uglify                  = require("gulp-uglify"),

    // General plugins
    plumber                 = require("gulp-plumber"),
    size                    = require("gulp-size"),
    browserSync             = require("browser-sync").create();

// Tasks
// -------------------------------------------------------------------
// Start server
function browserSyncServe(done) {
    browserSync.init({
        server: {
            baseDir: "dist"
        }
    });
    done();
}

function reload(done) {
    browserSync.reload();
    done();
}

// Notify on error with a beep
var onError = function(error) {
    console.error(error.message);
    // https://github.com/floatdrop/gulp-plumber/issues/17
    this.emit("end");
};

// HTML task
function html() {
    return gulp.src("src/html/*.html")
        // Prevent gulp.watch from crashing
        .pipe(plumber(onError))
        // Set up HTML templating
        .pipe(fileinclude({
            prefix: "@@",
            basepath: "src/html"
        }))
        // Clean up HTML a little
        .pipe(htmlmin({
            removeCommentsFromCDATA: true,
            removeRedundantAttributes: true,
            removeEmptyAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            caseSensitive: true,
            minifyCSS: true
        }))
        // Where to store the finalized HTML
        .pipe(gulp.dest("dist"));
}

// CSS task
function css() {
    return gulp.src("src/scss/main.scss")
        // Prevent gulp.watch from crashing
        .pipe(plumber(onError))
        // Compile Sass
        .pipe(sass({ outputStyle: "compressed" }))
        // parse CSS and add vendor-prefixed CSS properties
        .pipe(autoprefixer())
        // Minify CSS
        .pipe(cssmin())
        // Rename the file
        .pipe(rename("production.css"))
        // Show sizes of minified CSS files
        .pipe(size({ showFiles: true }))
        // Where to store the finalized CSS
        .pipe(gulp.dest("dist/css"));
}

// JS task
function js() {
    return gulp.src("src/js/**/*")
        // Prevent gulp.watch from crashing
        .pipe(plumber(onError))
        // Concatenate all JS files into one
        .pipe(concat("production.js"))
        // Where to store the finalized JS
        .pipe(gulp.dest("dist/js"));
}

// Image task
function images() {
    return gulp.src("src/img/**/*.+(png|jpeg|jpg|gif|svg)")
        // Where to store the finalized images
        .pipe(gulp.dest("dist/img"));
}

// Watch task
function watchFiles() {
    // All browsers reload after tasks are complete
    // Watch HTML files
    gulp.watch("src/html/**/*", gulp.series(html, reload));
    // Watch Sass files
    gulp.watch("src/scss/**/*", gulp.series(css, reload));
    // Watch JS files
    gulp.watch("src/js/**/*", gulp.series(js, reload));
    // Watch image files
    gulp.watch("src/img/**/*.+(png|jpeg|jpg|gif|svg)", gulp.series(images, reload));
}

var build = gulp.parallel(html, css, js, images);

// Use default task to launch BrowserSync and watch all files
exports.default = gulp.series(build, browserSyncServe, watchFiles);
exports.build = build;
exports.html = html;
exports.css = css;
exports.js = js;
exports.images = images;
