const path = require("path")

// <!-- Import environment variables based on stage -->
if (process.env.NODE_ENV !== "production") {
	if (process.env.NODE_ENV === "test") {
		require("dotenv").config({
			path: path.join(__dirname, "../test.env"),
		})
	} else {
		require("dotenv").config({
			path: path.join(__dirname, "../.env"),
		})
	}
}

// <!-- Map data -->
module.exports = {
	NODE_ENV: process.env.NODE_ENV,
	PORT: process.env.PORT,
	DEFAULT_PAGINATION_PERPAGE: process.env.DEFAULT_PAGINATION_PERPAGE,
	MONGODB_URL: process.env.MONGODB_URL,
}
