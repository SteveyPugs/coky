var path = require("path");
module.exports = function(grunt){
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		ngAnnotate: {
			options: {
				singleQuotes: true
			},
			app: {
				files: {
					"./static/js/dist/portal.controller.min.js": ["./static/js/src/portal.controller.js"],
					"./static/js/dist/cart.controller.min.js": ["./static/js/src/cart.controller.js"],
					"./static/js/dist/confirm.controller.min.js": ["./static/js/src/confirm.controller.js"],
					"./static/js/dist/nav.controller.min.js": ["./static/js/src/nav.controller.js"],
					"./static/js/dist/order.controller.min.js": ["./static/js/src/order.controller.js"],
					"./static/js/dist/payment.controller.min.js": ["./static/js/src/payment.controller.js"],
					"./static/js/dist/profile.controller.min.js": ["./static/js/src/profile.controller.js"],
					"./static/js/dist/shipping.controller.min.js": ["./static/js/src/shipping.controller.js"],
					"./static/js/dist/store.controller.min.js": ["./static/js/src/store.controller.js"],
					"./static/js/dist/store.controller.min.js": ["./static/js/src/store.controller.js"],
					"./static/js/dist/app.min.js": ["./static/js/src/app.js"]
				}
			}
		},
		uglify: {
			js: {
				files: {
					"./static/js/dist/portal.controller.min.js": ["./static/js/dist/portal.controller.min.js"],
					"./static/js/dist/cart.controller.min.js": ["./static/js/dist/cart.controller.min.js"],
					"./static/js/dist/confirm.controller.min.js": ["./static/js/dist/confirm.controller.min.js"],
					"./static/js/dist/nav.controller.min.js": ["./static/js/dist/nav.controller.min.js"],
					"./static/js/dist/order.controller.min.js": ["./static/js/dist/order.controller.min.js"],
					"./static/js/dist/payment.controller.min.js": ["./static/js/dist/payment.controller.min.js"],
					"./static/js/dist/profile.controller.min.js": ["./static/js/dist/profile.controller.min.js"],
					"./static/js/dist/shipping.controller.min.js": ["./static/js/dist/shipping.controller.min.js"],
					"./static/js/dist/store.controller.min.js": ["./static/js/dist/store.controller.min.js"],
					"./static/js/dist/app.min.js": ["./static/js/dist/app.min.js"]
				}
			}
		},
		watch: {
			options: {
				livereload: true
			},
			express: {
				files: ["./static/js/src/*.js", "./views/*.html", "./routes/*.js"],
				tasks: ["ngAnnotate", "uglify", "express:run"],
				options: {
					spawn: false
				}
			}
		},
		express: {
			run: {
				options: {
					script: "index.js",
				}
			}
		}
	});
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-ng-annotate"); 
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-express-server");
	grunt.registerTask("default", ["ngAnnotate", "uglify", "express:run", "watch"])
};