/**
 * tests/setup.js
 * Loaded before every Jest test file via "setupFiles" in package.json.
 * Loads the staging .env.test so no production credentials are ever touched.
 */
require('dotenv').config({ path: `${__dirname}/../.env.test` })
