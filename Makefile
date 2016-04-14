SRC = src/*.js src/core/*.js src/random/**/*.js
LIB = lib/*.js
REQUIRED = --require should --require should-http

TESTS = test/random.js test/util.js test/route test/config

lint:
	@./node_modules/.bin/eslint src test

test:
	@NODE_ENV=test node \
		./node_modules/.bin/_mocha \
		$(REQUIRED) \
		$(TESTS) --recursive\
		--bail

test-cov:
	@NODE_ENV=test node \
		./node_modules/.bin/istanbul cover \
		./node_modules/.bin/_mocha \
		-- -u exports \
		$(REQUIRED) \
		$(TESTS)  --recursive\
		--bail

test-travis: lint
	@NODE_ENV=test node \
		./node_modules/.bin/istanbul cover \
		./node_modules/.bin/_mocha \
		--report lcovonly \
		-- -u exports \
		$(REQUIRED) \
		$(TESTS)  --recursive\
		--bail
