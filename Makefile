SRC = src/*.js src/core/*.js src/random/**/*.js
LIB = lib/*.js
REQUIRED = --require should --require should-http

TESTS = test/*.js test/route/*.js test/config/*.js

lint:
	@./node_modules/.bin/eslint src test

test:
	@NODE_ENV=test node \
		./node_modules/.bin/_mocha \
		$(REQUIRED) \
		$(TESTS) \
		--bail

test-cov:
	@NODE_ENV=test node \
		./node_modules/.bin/istanbul cover \
		./node_modules/.bin/_mocha \
		-- -u exports \
		$(REQUIRED) \
		$(TESTS) \
		--bail

test-travis: lint
	@NODE_ENV=test node \
		./node_modules/.bin/istanbul cover \
		./node_modules/.bin/_mocha \
		--report lcovonly \
		-- -u exports \
		$(REQUIRED) \
		$(TESTS) \
		--bail
