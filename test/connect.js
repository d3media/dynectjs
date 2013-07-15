var Dynectjs = require('../index'),
	should = require('should');

var dynectjs;

beforeEach(function(){
	dynectjs = new Dynectjs();
});

describe('#connect', function() {
	it('Should throw error with invalid credentials', function(done)
	{
		dynectjs.connect('invalid', 'invalid', 'invalid', function(err, response)
		{
			should.exist(err);
			should.not.exist(response);
			dynectjs.__token.should.be.empty;

			err.should.be.an.instanceOf(Array);
			//err.should.includeEql({ INFO: 'login: Credentials you entered did not match those in our database. Please try again', SOURCE: 'BLL', ERR_CD: 'INVALID_DATA', LVL: 'ERROR' });

			done();
		});
	});
});

describe('#send', function() {
	it('Should throw error while having no token', function(done)
	{
		dynectjs.send('GET', '/Something', function(err, response)
		{
			should.exist(err);

			err.should.equal('Please do an connect first, before sending commands.');

			done();
		});
	});

	it('Should pass because we are doing an session request', function(done)
	{
		dynectjs.send('GET', '/Session', function(err, response)
		{
			err.should.not.equal('Please do an connect first, before sending commands.');
			done();
		});
	});
});

describe('Checking params handling (callback should be called)', function()
{
	it('Should work without params', function(done)
	{
		dynectjs.send('GET', '/Session', function(err, response)
		{
			should.exist(err);
			done();			
		});
	});

	it('Should work with params', function(done)
	{
		dynectjs.send('GET', '/Session', {test: 'param'}, function(err, response)
		{
			should.exist(err);
			done();			
		});
	});
});