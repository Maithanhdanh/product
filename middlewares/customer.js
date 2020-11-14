const axiosCustomer = require("../config/axiosCustomer")
const ROUTE_MAP = require("../config/urlBase")
const responseReturn = require("../response/responseReturn")
const resReturn = new responseReturn()

exports.importUserSearchActivity = async (req, res, next) => {
	try {
		const queryString = req.url.replace("/search?", "")
		const uid = req.cookies.uid
		const res = await axiosCustomer({
			method: ROUTE_MAP.CUSTOMER.ADD_SEARCH.METHOD,
			url: ROUTE_MAP.CUSTOMER.ADD_SEARCH.PATH,
			data: { queryString },
			headers: {
				Cookie: `uid=${uid}`,
			},
        })
		if (res.error) throw new Error(res.response)

		next()
	} catch (errors) {
		return next(
			resReturn.failure(req, res, 500, errors.message)
		)
	}
}

exports.importUserViewActivity = async (req, res, next) => {
	try {
		const productId = req.params
		const uid = req.cookies.uid
		const res = await axiosCustomer({
			method: ROUTE_MAP.CUSTOMER.ADD_VIEW.METHOD,
			url: ROUTE_MAP.CUSTOMER.ADD_VIEW.PATH,
			data: { productId },
			headers: {
				Cookie: `uid=${uid}`,
			},
		})
		if (res.error) throw new Error(res.response)

		next()
	} catch (errors) {
		return next(
			resReturn.failure(req, res, 500, errors.message)
		)
	}
}
