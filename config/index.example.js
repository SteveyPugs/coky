var config = {
	server:{
		host: "localhost",
		port: 9999
	},
	database:{
		host: "localhost",
		username: "username",
		password: "password",
		database: "database"
	},
	amazon:{
		accessKeyId: "accessKeyId",
		secretAccessKey: "secretAccessKey",
		Bucket: "Bucket"
	},
	mail:{
		from: "test@test.com"
	},
	stripe:{
		sk: "KEY"
	},
	ssl:{
		key: fs.readFileSync('file.key'),
		cert: fs.readFileSync('file.crt'),
		ca: fs.readFileSync('file.crt')
	}
};

module.exports = config;