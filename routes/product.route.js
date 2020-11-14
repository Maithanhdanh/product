const express = require("express")
const router = express.Router()
const {
	importUserSearchActivity,
	importUserViewActivity,
} = require("../middlewares/customer")

const controller = require("../controllers/product.controller")

router.route("/status").get((req, res) => res.json("OK"))

router.route("/search").get(importUserSearchActivity, controller.search)

router.route("/:productId").get(importUserViewActivity, controller.getProduct)

module.exports = router
