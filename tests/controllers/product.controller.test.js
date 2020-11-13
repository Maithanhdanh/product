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

beforeAll(async () => {
	jest.useFakeTimers()
	await Product.checkToCreateProduct(sampleProduct.productId,sampleProduct)
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
			const res = await request(server).get(`/product/${sampleProduct.productId}`).expect(200)

            expect(res.body.error).toBe(false)
            expect(Object.keys(res.body.response).length).toBe(5)
        })
        
        it("failed => missing productId", async () => {
            const res = await request(server).get('/product/').expect(404)
		})
        it("failed => undefined productId", async () => {
            let productId
            const res = await request(server).get(`/product/${productId}`).expect(400)
		})
        it("failed => invalid productId", async () => {
            let productId = 100
            const res = await request(server).get(`/product/${productId}`).expect(400)
            expect(res.body.error).toBe(true)
            expect(res.body.response).toBe("invalid product Id")
		})
    })
    
	describe("/search => get list of product", () => {
        const queryString = "name=hub&price=0-1000"

        it("success => with query", async () => {
			const res = await request(server).get(`/product/search?${queryString}`).expect(200)
            expect(res.body.error).toBe(false)
            expect(res.body.response.length).toBe(1)
        })

        it("success => empty query", async () => {
            const res = await request(server).get(`/product/search`).expect(200)
            expect(res.body.error).toBe(false)
            expect(res.body.response.length).toBe(7)
        })
        it("success => invalid query", async () => {
            let queryString = 'newName=asd'
            const res = await request(server).get(`/product/search?${queryString}`).expect(200)
            expect(res.body.error).toBe(false)
            expect(res.body.response.length).toBe(0)
        })
	})
})
