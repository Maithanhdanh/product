const { Product } = require("../../models/product.model")
const mongoose = require("../../config/mongoose")

const sampleProduct = {
	productId: "1",
	name: "wi-fi hub",
	price: 500,
	branch: "computer",
	color: ["red", "blue", "black"],
}

beforeAll(async () => {
	jest.useFakeTimers()
	await mongoose.connect()
})

afterAll(async () => {
	await Product.deleteMany({})
})

describe("Product schema and transformed format", () => {
	beforeAll(async () => {
		var newProduct = new Product(sampleProduct)
		return (doc = await newProduct.save())
	})

	it("product schema", () => {
		expect(doc).toHaveProperty("createdAt")
		expect(doc).toHaveProperty("updatedAt")
	})

	it("transform method", () => {
		var transformedDoc = doc.transform()

		expect(Object.keys(transformedDoc).length).toBe(5)
		expect(transformedDoc).toHaveProperty("productId")
		expect(transformedDoc.productId).toBe(sampleProduct.productId)
		expect(transformedDoc).toHaveProperty("name")
		expect(transformedDoc.name).toBe(sampleProduct.name)
		expect(transformedDoc).toHaveProperty("price")
		expect(transformedDoc.price).toBe(sampleProduct.price)
		expect(transformedDoc).toHaveProperty("branch")
		expect(transformedDoc.branch).toBe(sampleProduct.branch)
		expect(transformedDoc).toHaveProperty("color")
		expect(transformedDoc.color.length).toBe(sampleProduct.color.length)
	})
})

describe("Product static", () => {
	var sampleProduct2 = {
		productId: "2",
		name: "thinkPad",
		price: 3000,
		branch: "computer",
		color: ["white", "black"],
	}

	describe("Check to create new product", () => {
		it("failed duel to missing data", async () => {
			const newProduct = await Product.checkToCreateProduct(
				sampleProduct2.productId
			)
			expect(newProduct).toBe("missing data")
		})

		it("failed duel to missing productId", async () => {
			const newProduct = await Product.checkToCreateProduct("", sampleProduct2)
			expect(newProduct).toBe("missing productId")
		})

		it("success", async () => {
			const newProduct = await Product.checkToCreateProduct(
				sampleProduct2.productId,
				sampleProduct2
			)
			expect(newProduct).not.toBeNull()
		})
		it("failed duel to duplicate productId", async () => {
			const newProduct = await Product.checkToCreateProduct(
				sampleProduct2.productId,
				sampleProduct2
			)
			expect(newProduct).toBeNull()
		})
	})

	describe("Get product by Id", () => {
		it("success", async () => {
			var productId = "2"
			const product = await Product.getProductById(productId)
			expect(product).not.toBeNull()
			expect(product.productId).toBe(productId)
		})
		it("failed => missing productId", async () => {
			const product = await Product.getProductById()
			expect(product).toBe("missing productId")
		})
		it("failed => invalid productId", async () => {
			const product = await Product.getProductById('3')
			expect(product).toBeNull()
		})
	})
	describe("Get list of product", () => {
		it("Get all product by ignore / empty input", async () => {
			const ignoreProduct = await Product.getListOfProduct({})
			expect(ignoreProduct.length).toBe(2)

			const emptyProduct = await Product.getListOfProduct()
			expect(emptyProduct.length).toBe(2)
		})
		it("Filter by name", async () => {
			const emptyProduct = await Product.getListOfProduct({name:'hub'})
			expect(emptyProduct.length).toBe(1)
		})
		it("Filter by price", async () => {
			const emptyProduct = await Product.getListOfProduct({price:[0,1000]})
			expect(emptyProduct.length).toBe(1)
		})
		it("missing bound in price", async () => {
			const emptyProduct = await Product.getListOfProduct({price:[0]})
			expect(emptyProduct).toBe('missing boundary on price')
		})
	})
})
