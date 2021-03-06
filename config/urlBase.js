const URL_BASE = {
	CUSTOMER: "/customer",
	REGISTRY: "/registry",
}

const ROUTES_CUSTOMER = {
	ADD_SEARCH: "/add_search",
	ADD_VIEW: "/add_view",
}

const ROUTES_REGISTRY = {
	REGISTER: "/register",
	UNREGISTER: "/unregister",
	GET_IP: "/get_ip",
}

const ROUTE_MAP = {
	CUSTOMER: {
		ADD_SEARCH: {
			PATH: URL_BASE.CUSTOMER + ROUTES_CUSTOMER.ADD_SEARCH,
			METHOD: "POST",
		},
		ADD_VIEW: {
			PATH: URL_BASE.CUSTOMER + ROUTES_CUSTOMER.ADD_VIEW,
			METHOD: "POST",
		},
	},
	REGISTRY: {
		REGISTER: {
			PATH: URL_BASE.REGISTRY + ROUTES_REGISTRY.REGISTER,
			METHOD: "POST",
		},
		UNREGISTER: {
			PATH: URL_BASE.REGISTRY + ROUTES_REGISTRY.UNREGISTER,
			METHOD: "POST",
		},
		GET_IP: {
			PATH: URL_BASE.REGISTRY + ROUTES_REGISTRY.GET_IP,
			METHOD: "POST",
		},
	},
}

module.exports = ROUTE_MAP
