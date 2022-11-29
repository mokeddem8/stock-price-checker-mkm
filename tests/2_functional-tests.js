
let chaiHttp = require('chai-http');
let chai = require('chai');
let assert = chai.assert;
let server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    
    suite('GET /api/stock-prices => stockData object', function() {
      
      test('1 stock', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'goog'})
        .end(function(err, res){
          
          assert.equal(res.status, 200)
          assert.property(res.body, 'stockData')
          assert.property(res.body.stockData, 'stock')
          assert.property(res.body.stockData, 'price')
          assert.property(res.body.stockData, 'likes')
          assert.equal(res.body.stockData.stock, 'GOOG')
          assert.isNumber(parseFloat(res.body.stockData.price))
          assert.isNumber(res.body.stockData.likes)
          
          done()
        })
      })
      
      test('1 stock with like', function(done) {
        chai.request(server)
          .get('/api/stock-prices')
          .query({ stock: 'goog', like: true })
          .end(function(err, res){

            assert.equal(res.status, 200)
            assert.property(res.body, 'stockData')
            assert.property(res.body.stockData, 'stock')
            assert.property(res.body.stockData, 'price')
            assert.property(res.body.stockData, 'likes')
            assert.equal(res.body.stockData.stock, 'GOOG')
            assert.isNumber(parseFloat(res.body.stockData.price))
            assert.isNumber(res.body.stockData.likes)

            done()
          })
      })
      
      test('1 stock with like again (ensure that "likes" are not double counted)', function(done) {
        chai.request(server)
          .get('/api/stock-prices')
          .query({ stock: 'goog', like: true })
          .end(function(err, res){

            assert.equal(res.status, 200)
            assert.property(res.body, 'stockData')
            assert.property(res.body.stockData, 'stock')
            assert.property(res.body.stockData, 'price')
            assert.property(res.body.stockData, 'likes')
            assert.equal(res.body.stockData.stock, 'GOOG')
            assert.isNumber(parseFloat(res.body.stockData.price))
            assert.isNumber(res.body.stockData.likes)

            done()
          })
      })
      
      test('2 stocks', function(done) {
        chai.request(server)
          .get('/api/stock-prices')
          .query({ stock: ['aapl', 'msft'] })
          .end(function(err, res){

            assert.equal(res.status, 200)
            assert.property(res.body, 'stockData')
            assert.isArray(res.body.stockData)
            assert.property(res.body.stockData[0], 'stock')
            assert.property(res.body.stockData[0], 'price')
            assert.property(res.body.stockData[0], 'rel_likes')
            assert.equal(res.body.stockData[0].stock, 'AAPL')
            assert.isNumber(parseFloat(res.body.stockData[0].price))
            assert.isNumber(res.body.stockData[0].rel_likes)
            
            assert.property(res.body.stockData[1], 'stock')
            assert.property(res.body.stockData[1], 'price')
            assert.property(res.body.stockData[1], 'rel_likes')
            assert.equal(res.body.stockData[1].stock, 'MSFT')
            assert.isNumber(parseFloat(res.body.stockData[1].price))
            assert.isNumber(res.body.stockData[1].rel_likes)

            done()
          })
      })
      
      test('2 stocks with like', function(done) {
        chai.request(server)
          .get('/api/stock-prices')
          .query({ stock: ['aapl', 'msft'], like: true })
          .end(function(err, res){

            assert.equal(res.status, 200)
            assert.property(res.body, 'stockData')
            assert.isArray(res.body.stockData)
            assert.property(res.body.stockData[0], 'stock')
            assert.property(res.body.stockData[0], 'price')
            assert.property(res.body.stockData[0], 'rel_likes')
            assert.equal(res.body.stockData[0].stock, 'AAPL')
            assert.isNumber(parseFloat(res.body.stockData[0].price))
            assert.isNumber(res.body.stockData[0].rel_likes)
            
            assert.property(res.body.stockData[1], 'stock')
            assert.property(res.body.stockData[1], 'price')
            assert.property(res.body.stockData[1], 'rel_likes')
            assert.equal(res.body.stockData[1].stock, 'MSFT')
            assert.isNumber(parseFloat(res.body.stockData[1].price))
            assert.isNumber(res.body.stockData[1].rel_likes)

            done()
          })
      })
      
    });

});
