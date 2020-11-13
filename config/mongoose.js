const ENV_VAR = require('./vars')
const { Product } = require("../models/product.model")
const mongoose = require('mongoose');
const logger = require('./logger');
const exampleProduct = require('../data/exampleData')
const URL = ENV_VAR.MONGODB_URL;

mongoose.Promise = Promise;

mongoose.connection.on('error', err =>{
    logger.info(`MongoDB connection error: ${err}`)
    process.exit(-1)
})

// <!-- Connect to MongoDB database -->
exports.connect = () => {
    mongoose.connect(URL, { 
        useCreateIndex:true,
        keepAlive:1,
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => logger.info('MongoDB connected...'));
    return mongoose.connection
}

// <!-- Initiate database -->
exports.initialize= async () => {
    exampleProduct.map(async product => {
        await Product.checkToCreateProduct(product.productId,product)
    })
    
	logger.info('Initialized database done...')
}