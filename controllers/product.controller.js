const responseReturn = require("../response/responseReturn")
const { Product } = require("../models/product.model")
const resReturn = new responseReturn()

/**
 * Get product information
 *
 * @param {String} productId ProductId.
 * @returns {Promise<Re, Error>} new product
 */
exports.getProduct = async (req, res, next) => {
	try {
		const { productId } = req.params
		const product = await Product.getProductById(productId)
		if (!product) return resReturn.failure(req, res, 400, "invalid product Id")

		const transformedDoc = product.transform()

		resReturn.success(req, res, 200, transformedDoc)
	} catch (error) {
		resReturn.failure(req, res, error.statusCode, error.message)
	}
}
/**
 * Check to create new product
 *
 * @query {object} data - name, price, branch, color.
 * @returns {Promise<Product, Error>} new product
 */
exports.search = async (req, res, next) => {
	try {
		if (req.query.price) req.query.price = req.query.price.split("-")

		const product = await Product.getListOfProduct(req.query)

		resReturn.success(req, res, 200, product)
	} catch (error) {
		resReturn.failure(req, res, error.statusCode, error.message)
	}
}
