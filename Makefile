build:
	@npm install
	@./node_modules/.bin/browserify index.js -o scquery.js -s scquery
	@npm test

.PHONY: build