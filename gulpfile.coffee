coffee = require 'gulp-coffee'
gutil = require 'gulp-util'
concat = require 'gulp-concat'
del = require 'del'



gulp = require 'gulp'



.task 'default' , ['scripts']



.task 'clean', (callback) ->
	del ['dist'], callback



.task "scripts", ['clean'], ->
	gulp.src("src/**/*.coffee")
	.pipe coffee(bare: true).on("error", gutil.log)
	.pipe concat('userTracker.js')
	.pipe gulp.dest('dist')
