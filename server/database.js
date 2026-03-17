"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
var kysely_1 = require("kysely");
var serverless_1 = require("@neondatabase/serverless");
var dotenv_1 = require("dotenv");
dotenv_1.default.config({ quiet: true });
exports.db = new kysely_1.Kysely({
    dialect: new kysely_1.PostgresDialect({
        pool: new serverless_1.Pool({
            connectionString: process.env.DATABASE_URL,
        }),
    }),
});
