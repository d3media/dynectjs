ifdef TYPE
	REPORTER = $(TYPE)
else
	REPORTER = spec
endif

all: clean test

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER)

acceptance:
	@NODE_ENV=test REPORTER=spec ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		test/acceptance

test-cov: lib-cov
	@D3SERVE_COV=1 $(MAKE) test REPORTER=html-cov > coverage.html && rm -rf lib-cov

lib-cov:
	@type jscoverage >/dev/null 2>&1 || { echo >&2 "I require jscoverage  but it's not installed. " \
		" Aborting.\n install https://github.com/visionmedia/node-jscoverage"; exit 1; }
	@rm -rf lib-cov
	@jscoverage lib lib-cov

test-w:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		--growl \
		--watch

clean:
	rm -rf *.csv

.PHONY: all test test-w test-cov
