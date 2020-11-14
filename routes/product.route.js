const express = require("express")
const router = express.Router()

const controller = require("../controllers/product.controller")

router.route("/status").get((req, res) => res.json("OK"))

router.route("/search").get(controller.search)

router.route("/:productId").get(controller.getProduct)

module.exports = router
