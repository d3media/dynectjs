var Https	= require('https'),
	Async	= require('async');

var Dynect = module.exports = function Dynect() {
	this.__token = '';
	this.api = 'api2.dynect.net';
	this.port = 443;
};

Dynect.prototype.send = function(method, path, params, callback)
{
	if(typeof params === 'function')
	{
		callback = params;
		params = {};
	}

	if (this.__token === '' && path !== '/Session')
		return callback('Please do an connect first, before sending commands.');

	if (params)
	{
		try
		{
			params = JSON.stringify(params);
		}
		catch (error)
		{
			return callback('error while stringifying params: ' + error.message);
		}
	}

	var options = {
		hostname: this.api,
		port: this.port,
		path: '/REST' + path,
		method: method,
		headers: {
			'Content-Type': 'application/json',
			'Content-Length': (params ? params.length : 0),
			'Auth-Token': this.__token
		}
	};

	var req = Https.request(options, function(res)
	{

		res.on('data', function(data)
		{
			try
			{
				data = JSON.parse(data.toString('utf8'));
			}
			catch (error)
			{
				return callback('error while parsing response: ' + error.message);
			}

			if(data.status === 'success')
			{
				return callback(null, data);
			}
			else
			{
				return callback(data.msgs);
			}
		});
	});

	req.write(params);

	req.on('error', function(error)
	{
		return callback(error);
	});

	return req.end();
};

Dynect.prototype.connect = function(customer, username, password, callback)
{
	if(this.__token && this.__token !== '')
		return callback(null, this.__token);

	var self = this;

	// - sending login request
	return this.send('POST', '/Session', {customer_name: customer, user_name: username, password: password}, function(err, response)
	{
		if(err)
			return callback(err);

		self.__token = response.data.token;
		return callback(null, self.__token);
	}); 
};

Dynect.prototype.get = function(zone, callback)
{
	return this.send('GET', '/NodeList/' + zone, function(err, response)
	{
		return callback(err, response);
	});
};

Dynect.prototype.getCNameRecord = function(zone, node, callback)
{
	this.send('GET', '/CNAMERecord/' + zone + '/' + node, function(err, response)
	{
		return callback(err, response);
	});
};

Dynect.prototype.removeCNameRecord = function(zone, node, callback)
{
	var self = this;

	this.getCNameRecord(zone, node, function(err, response)
	{
		if(err)
			return callback(err);

		var records = [];
		var recordSplit;
		var record = '';

		// - iterate throw records
		for (var i = response.data.length - 1; i >= 0; i--)
		{
			record = response.data[i];
			recordSplit = record.split('/');
			record = recordSplit[recordSplit.length - 1];

			if(/[0-9]+/.test(record))
			{
				records.push(record);
			}
		}

		// - delete all valid records
		Async.each(records, function(record, callback)
		{
			self.send('DELETE', '/CNAMERecord/' + zone + '/' + node + '/' + record + '/', function(err) {
				if (err)
					return callback(err);

				else return callback();
			});
		},
		function(err)
		{
			if (err)
				return callback(err);

			// - publish
			self.send('PUT', '/Zone/' + zone, {publish: 'true'}, function(err)
			{
				return callback(err);
			});
			return callback(err);
		});
	});
};