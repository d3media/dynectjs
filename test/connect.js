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
			err.should.includeEql({ INFO: 'login: Credentials you entered did not match those in our database. Please try again', SOURCE: 'BLL', ERR_CD: 'INVALID_DATA', LVL: 'ERROR' });

			done();
		});
	});
});