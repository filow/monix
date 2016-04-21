TESTS = test/random test/util.js test/loader.js test/route test/config

lint:
	@./node_modules/.bin/eslint src test

test:
	@NODE_ENV=test node \
		./node_modules/.bin/_mocha \
		$(TESTS) --recursive\
		--bail

test-cov:
	@NODE_ENV=test node \
		./node_modules/.bin/istanbul cover \
		./node_modules/.bin/_mocha \
		-- -u exports \
		$(TESTS)  --recursive\
		--bail

test-travis: lint
	@NODE_ENV=test node \
		./node_modules/.bin/istanbul cover \
		./node_modules/.bin/_mocha \
		--report lcovonly \
		-- -u exports \
		$(TESTS)  --recursive\
		--bail
