const { register, unregister } = require("../../helpers/registry")
const ENV_VAR = require("../../config/vars")
const { getIp } = require("../../helpers/ipDiscovery")

const ip = "localhost",
	port = ENV_VAR.PORT,
	service = "customer"

beforeAll(async () => {
	await register(ip, port, service)
})
afterAll(async () => {
	await unregister(ip, port, service)
})

describe("subscribe service", () => {
	it("success", async () => {
		const res = await getIp(service)

		expect(Object.keys(res).length).toBe(4)
		expect(res).toHaveProperty("type")
		expect(res).toHaveProperty("ip")
		expect(res).toHaveProperty("port")
		expect(res).toHaveProperty('service')
	})
	it("failed => non-existed service", async () => {
		var service = '123'
		const res = await register(service)

		expect(res).toBe("Request failed with status code 400")
	})
})