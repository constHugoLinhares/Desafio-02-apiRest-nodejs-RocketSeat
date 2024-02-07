"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/app.ts
var app_exports = {};
__export(app_exports, {
  app: () => app
});
module.exports = __toCommonJS(app_exports);
var import_fastify = __toESM(require("fastify"));
var import_cookie = __toESM(require("@fastify/cookie"));

// src/routes/meals.ts
var import_node_crypto = require("crypto");

// src/database.ts
var import_knex = require("knex");

// src/env/index.ts
var import_dotenv = require("dotenv");
var import_zod = require("zod");
if (process.env.NODE_ENV === "test") {
  (0, import_dotenv.config)({ path: ".env.test" });
} else {
  (0, import_dotenv.config)();
}
var envSchema = import_zod.z.object({
  NODE_ENV: import_zod.z.enum(["development", "test", "production"]).default("production"),
  DATABASE_CLIENT: import_zod.z.enum(["sqlite", "pg"]).default("sqlite"),
  DATABASE_URL: import_zod.z.string(),
  PORT: import_zod.z.coerce.number().default(3333)
});
var _env = envSchema.safeParse(process.env);
if (_env.success === false) {
  console.error("\u26A0\uFE0F Invalid environment variables", _env.error.format());
  throw new Error("Invalid environment variables.");
}
var env = _env.data;

// src/database.ts
var config2 = {
  client: env.DATABASE_CLIENT,
  connection: env.DATABASE_CLIENT === "sqlite" ? {
    filename: env.DATABASE_URL
  } : env.DATABASE_URL,
  useNullAsDefault: true,
  migrations: {
    extension: "ts",
    directory: "./database/migrations"
  }
};
var knex = (0, import_knex.knex)(config2);

// src/middlewares/check-session-id-exists.ts
async function checkSessionIdExists(request, reply) {
  const sessionId = request.cookies.sessionId;
  if (!sessionId) {
    return reply.status(401).send({
      error: "Unauthorized."
    });
  }
  const users = await knex("users").where("session_id", sessionId).select();
  if (users.length === 0) {
    return reply.status(404).send({
      error: "User doesn't exists! // Clean the Cookies!"
    });
  }
}

// src/routes/meals.ts
var import_moment = __toESM(require("moment"));

// src/schemas/getMealsParams.ts
var import_zod2 = require("zod");
var getMealsParamsSchema = import_zod2.z.object({
  id: import_zod2.z.string().uuid()
});

// src/schemas/getMealsBody.ts
var import_zod3 = require("zod");
var getMealsBodySchema = import_zod3.z.object({
  description: import_zod3.z.string().optional(),
  inDiet: import_zod3.z.boolean().optional()
});

// src/routes/meals.ts
async function mealsRoutes(app2) {
  app2.get(
    "/",
    {
      preHandler: [checkSessionIdExists]
    },
    async (request, reply) => {
      const { sessionId } = request.cookies;
      const meals = await knex("meals").where("session_id", sessionId).select();
      if (meals.length <= 0)
        return reply.status(406).send({
          error: "No meal yet!"
        });
      return { meals };
    }
  );
  app2.get(
    "/specificMeal/:id",
    {
      preHandler: [checkSessionIdExists]
    },
    async (request) => {
      const { id } = getMealsParamsSchema.parse(request.params);
      const { sessionId } = request.cookies;
      const meals = await knex("meals").where({
        session_id: sessionId,
        id
      }).first();
      return { meals };
    }
  );
  app2.get(
    "/summary",
    {
      preHandler: [checkSessionIdExists]
    },
    async (request) => {
      const { sessionId } = request.cookies;
      const summary = {
        totalMeals: 0,
        totalMealsInDiet: 0,
        totalMealsOutDiet: 0,
        bestSequence: 0
      };
      const meals = await knex("meals").where("session_id", sessionId).select({
        description: "description",
        inDiet: "inDiet"
      });
      for (const meal of meals) {
        summary.totalMeals++;
        if (meal.inDiet === 1) {
          summary.totalMealsInDiet++;
          summary.bestSequence++;
        } else {
          summary.totalMealsOutDiet++;
          summary.bestSequence = 0;
        }
      }
      return { summary };
    }
  );
  app2.put(
    "/edit/:id",
    {
      preHandler: [checkSessionIdExists]
    },
    async (request, reply) => {
      const updated_at = (0, import_moment.default)().format("YYYY-MM-DD HH:mm:ss");
      const { id } = getMealsParamsSchema.parse(request.params);
      const { description, inDiet } = getMealsBodySchema.parse(request.body);
      const { sessionId } = request.cookies;
      const meal = await knex("meals").where({
        session_id: sessionId,
        id
      }).first();
      await knex("meals").update({
        description,
        inDiet,
        updated_at
      }).where({
        session_id: sessionId,
        id
      });
      return reply.status(202).send({
        message: `Success on edit the meal: ${meal.description}`
      });
    }
  );
  app2.post(
    "/",
    async (request, reply) => {
      const { description, inDiet } = getMealsBodySchema.parse(request.body);
      const sessionId = request.cookies.sessionId;
      if (!sessionId) {
        return reply.status(401).send({
          error: "No Session ID provided! / No user"
        });
      }
      await knex("meals").insert({
        id: (0, import_node_crypto.randomUUID)(),
        description,
        inDiet,
        session_id: sessionId
      });
      return reply.status(201).send();
    }
  );
  app2.delete(
    "/delete/:id",
    async (request, reply) => {
      const { id } = getMealsParamsSchema.parse(request.params);
      const { sessionId } = request.cookies;
      const meals = await knex("meals").where({
        session_id: sessionId,
        id
      }).first();
      if (meals.length <= 0) {
        return reply.status(406).send({
          message: "Meal doesn't exist!"
        });
      }
      await knex("meals").where({
        session_id: sessionId,
        id
      }).del();
      return reply.status(200).send({
        message: `Success on delete the meal: ${meals.description}`
      });
    }
  );
}

// src/routes/users.ts
var import_zod4 = require("zod");
var import_node_crypto2 = require("crypto");
async function usersRoutes(app2) {
  app2.get(
    "/",
    {
      preHandler: [checkSessionIdExists]
    },
    async (request) => {
      const { sessionId } = request.cookies;
      const users = await knex("users").where("session_id", sessionId).select();
      return { users };
    }
  );
  app2.post(
    "/",
    async (request, reply) => {
      const createUsersBodySchema = import_zod4.z.object({
        name: import_zod4.z.string()
      });
      const { name } = createUsersBodySchema.parse(request.body);
      let sessionId = request.cookies.sessionId;
      if (!sessionId) {
        sessionId = (0, import_node_crypto2.randomUUID)();
        reply.setCookie("sessionId", sessionId, {
          path: "/",
          maxAge: 1e3 * 60 * 60 * 24 * 7
          // 7 days
        });
      } else {
        return reply.status(201).send({
          message: "User already logged in!"
        });
      }
      await knex("users").insert({
        id: (0, import_node_crypto2.randomUUID)(),
        name,
        session_id: sessionId
      });
      return reply.status(201).send();
    }
  );
}

// src/app.ts
var app = (0, import_fastify.default)();
app.register(import_cookie.default);
app.register(mealsRoutes, {
  prefix: "meals"
});
app.register(usersRoutes, {
  prefix: "users"
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  app
});
