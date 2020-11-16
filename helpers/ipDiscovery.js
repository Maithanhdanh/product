const axiosRegistry = require("../config/axiosRegistry")
const ROUTE_MAP = require("../config/urlBase")

exports.getIp = async (service) => {
	try {
		const response = await axiosRegistry({
			method: ROUTE_MAP.REGISTRY.GET_IP.METHOD,
			url: ROUTE_MAP.REGISTRY.GET_IP.PATH,
			data: { service },
		})
        if(response.error) throw new Error(response.response)
        
        return response.response
	} catch (errors) {
		return errors.message
	}
}
