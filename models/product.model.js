const mongoose = require("mongoose")
const Schema = mongoose.Schema
const ENV_VAR = require("../config/vars")

const productSchema = new Schema(
	{
		productId: { type: String, required: [true, "missing productId"] },
		name: { type: String, required: [true, "missing name"] },
		price: { type: Number, required: [true, "missing price"] },
		branch: { type: String, required: [true, "missing branch"] },
		color: { type: Array, required: [true, "missing color"] },
	},
	{
		timestamps: true,
	}
)

/**
 * Methods
 */
productSchema.method({
	/**
	 * remove non-public info
	 */
	transform() {
		const transformed = {}
		const fields = ["productId", "name", "price", "branch", "color"]

		fields.forEach((field) => {
			transformed[field] = this[field]
		})

		return transformed
	},
})

/**
 * Statics
 */
productSchema.statics = {
	/**
	 * Check to create new product
	 *
	 * @param {String} productId - ProductId.
	 * @param {object} data - name, price, branch, color.
	 * @returns {Promise<Product, Error>} - new product
	 */
	async checkToCreateProduct(productId, data) {
		try {
			if (!productId || productId === "") throw new Error("missing productId")
			if (!data || data === {}) throw new Error("missing data")
			//<!-- Get product based on email -->
			const productModel = await this.findOne({ productId }).exec()

			if (productModel) return null
			const newProduct = new Product({ ...data })
			const doc = await newProduct.save()

			return doc
		} catch (error) {
			return error.message
		}
	},
	/**
	 * Get product by productId
	 *
	 * @param {String} productId - ObjectId of product.
	 * @returns {Promise<Product, Error>} - a product
	 */
	async getProductById(productId) {
		try {
			if (!productId || productId === "") throw new Error("missing productId")
			//<!-- Get product based on ObjectId -->
			const productModel = await this.findOne({ productId }).exec()

			if (!productModel) return null

			return productModel
		} catch (error) {
			return error.message
		}
	},

	/**
	 * Get list of products
	 *
	 * @param {object} data filter.
	 * @param {Number} page (default 1) pagination.
	 * @param {Number} perPage (default get from /config/vars) pagination.
	 * @returns {Promise<Array<Product>,Error>} List of products
	 */
	async getListOfProduct(
		data = {},
		page = 1,
		perPage = ENV_VAR.DEFAULT_PAGINATION_PERPAGE
	) {
		try {
			const keys = Object.keys(data)
			const queryString = {}

			keys.map((key) => {
				if (key === "price") {
					if (data[key].length === 1)
						throw new Error("missing boundary on price")
					return (queryString["price"] = {
						$gte: data[key][0],
						$lte: data[key][1],
					})
				}
				queryString[key] = { $regex: `.*${data[key]}.*`, $options: "i" }
			})

			const listHistory = await this.find(queryString).sort({
				date: "descending",
			})
			const paginatedList = listHistory.slice(
				(page - 1) * perPage,
				page * perPage
			)
			return paginatedList.map((his) => his.transform())
		} catch (err) {
			return err.message
		}
	},
}

const Product = mongoose.model("profile", productSchema, "product")
module.exports = { Product }
