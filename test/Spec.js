"use strict"

var assert = chai.assert
var Test

suite('Chambr', function() {

	setup(function(){
		Test = Test || $.Test
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
})
