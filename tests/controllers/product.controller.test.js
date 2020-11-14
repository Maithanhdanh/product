const { Product } = require("../../models/product.model")
const server = require("../../index")
const request = require("supertest")
const mongoose = require("mongoose")

const sampleProduct = {
	productId: "6",
	name: "network hub",
	price: 2000,
	branch: "computer",
	color: ["black"],
}
const uid = 1

beforeAll(async () => {
	jest.useFakeTimers()
	await Product.checkToCreateProduct(sampleProduct.productId, sampleProduct)
})

afterAll(async () => {
	await Product.deleteMany({})
	server.close()
})

describe("Product", () => {
	describe("global app status", () => {
		it("should return ok", async () => {
			const res = await request(server).get("/status").expect(200)
			expect(res.body).toBe("OK")
		})
	})

	describe("product routes status", () => {
		it("should return ok", async () => {
			const res = await request(server).get("/product/status").expect(200)
			expect(res.body).toBe("OK")
		})
	})

	describe("/:productId => get product", () => {
		it("success", async () => {
			const res = await request(server)
				.get(`/product/${sampleProduct.productId}`)
				.set("Cookie", `uid=${uid}`)
				.expect(200)

			expect(res.body.error).toBe(false)
			expect(Object.keys(res.body.response).length).toBe(5)
		})
		describe("failed => missing information", () => {
			it("missing productId", async () => {
				await request(server)
					.get("/product/")
					.set("Cookie", `uid=${uid}`)
					.expect(404)
			})
			it("undefined productId", async () => {
				let productId
				await request(server)
					.get(`/product/${productId}`)
					.set("Cookie", `uid=${uid}`)
					.expect(400)
			})
			it("invalid productId", async () => {
				let productId = 100
				const res = await request(server)
					.get(`/product/${productId}`)
					.set("Cookie", `uid=${uid}`)
					.expect(400)
				expect(res.body.error).toBe(true)
				expect(res.body.response).toBe("invalid product Id")
			})

			it("missing / undefined uid", async () => {
				const res = await request(server)
					.get(`/product/${sampleProduct.productId}`)
					.set("Cookie", `uid=`)
					.expect(500)
				expect(res.body.error).toBe(true)
			})

			it("invalid uid", async () => {
				var uid = 100
				const res = await request(server)
					.get(`/product/${sampleProduct.productId}`)
					.set("Cookie", `uid=${uid}`)
					.expect(500)

				expect(res.body.error).toBe(true)
			})
		})
	})

	describe("/search => get list of product", () => {
		const queryString = "name=hub&price=0-1000"

		it("success => with query", async () => {
			const res = await request(server)
				.get(`/product/search?${queryString}`)
				.set("Cookie", `uid=${uid}`)
				.expect(200)
			expect(res.body.error).toBe(false)
			expect(res.body.response.length).toBe(1)
		})

		it("success => empty query", async () => {
			const res = await request(server)
				.get(`/product/search`)
				.set("Cookie", `uid=${uid}`)
				.expect(200)
			expect(res.body.error).toBe(false)
			expect(res.body.response.length).toBe(7)
		})
		it("success => invalid query", async () => {
			let queryString = "newName=asd"
			const res = await request(server)
				.get(`/product/search?${queryString}`)
				.set("Cookie", `uid=${uid}`)
				.expect(200)
			expect(res.body.error).toBe(false)
			expect(res.body.response.length).toBe(0)
		})

		describe("failed => missing information", () => {
			it("missing / undefined uid", async () => {
				const res = await request(server)
					.get(`/product/search?${queryString}`)
					.set("Cookie", `uid=`)
					.expect(500)

				expect(res.body.error).toBe(true)
			})

			it("invalid uid", async () => {
				var uid = 100
				const res = await request(server)
					.get(`/product/search?${queryString}`)
					.set("Cookie", `uid=${uid}`)
					.expect(500)

				expect(res.body.error).toBe(true)
			})
		})

		describe("failed => customer server is down", () => {
			it("missing / undefined uid", async () => {
				const res = await request(server)
					.get(`/product/search?${queryString}`)
					.set("Cookie", `uid=`)
					.expect(500)

				expect(res.body.error).toBe(true)
			})

			it("invalid uid", async () => {
				var uid = 100
				const res = await request(server)
					.get(`/product/search?${queryString}`)
					.set("Cookie", `uid=${uid}`)
					.expect(500)

				expect(res.body.error).toBe(true)
				expect(res.body.response).toBe('invalid uid')
			})
		})
	})
})
