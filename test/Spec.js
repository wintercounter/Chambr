"use strict"

var assert = chai.assert
var Test, TestExt

mocha.setup({
	ui: 'tdd'
})

suite('Chambr', function() {

	setup(function(){
		Test    = Test || $.Test
		TestExt = TestExt || $.TestExtended
	})

	teardown(function(){
		
	})

	test('has Test model', function(done){
		assert.isOk($.hasOwnProperty('Test'))
		done()
	})

	test('model has CRUD methods', function(done){
		assert.isFunction(Test.create)
		assert.isFunction(Test.read)
		assert.isFunction(Test.update)
		assert.isFunction(Test.delete)
		done()
	})

	test('model has no private method', function(done){
		assert.isUndefined(Test._calcPrivate)
		done()
	})

	test('model has defaults', function(done){
		assert.equal(-1, Test.total)
		done()
	})

	test('model has proper data', function(done){
		Test()
		Test.one('*', function(){
			assert.equal('one', Test[0])
			assert.equal('two', Test[1])
			done()
		})
	})

	test('model create', function(done){
		Test.create('three').then(function(){
			assert.equal('three', Test[2])
			done()
		})
	})

	test('model read', function(done){
		Test.read(0).then(function(val){
			assert.equal('one', val)
			done()
		})
	})

	test('model update', function(done){
		Test.update(0, 'notOne').then(function(){
			assert.equal('notOne', Test[0])
			done()
		})
	})

	test('model delete', function(done){
		Test.delete(0).then(function(){
			assert.equal('two', Test[0])
			done()
		})
	})

	test('model total', function(done){
		assert.equal(2, Test.total)
		done()
	})

	test('model @Trigger customEvent', function(done){
		Test.one('customEvent', function(){
			done()
		})
		Test.delete(10)
	})

	test('model @On triggerer', function(done){
		Test.one('remoteUpdated', function(){
			done()
		})
		Test.triggerOnTest()
	})

	test('model @Peel', function(done){
		var ev = {
			item: {
				value: 'four'
			}
		}
		Test.create(ev).then(function(){
			assert.equal('four', Test[2])
			done()
		})
	})

	test('extended model', function(done){
		assert.isOk($.hasOwnProperty('TestExtended'))
		assert.isFunction(TestExt.create)
		assert.isFunction(TestExt.read)
		assert.isFunction(TestExt.update)
		assert.isFunction(TestExt.delete)
		assert.isFunction(TestExt.extended)
		done()
	})
})
