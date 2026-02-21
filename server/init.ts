import { sql } from "kysely";
import { db } from "./database.ts";

export async function main() {
  await db.schema
    .createTable("users")
    .ifNotExists()

    .addColumn("id", "uuid", (cb) =>
      cb
        .primaryKey()
        .notNull()
        .defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn("default_address_id", "uuid")
    .addForeignKeyConstraint(
      "user_default_address_id_foreign",
      ["default_address_id"],
      "addresses",
      ["id"],
      (cb) => cb.onUpdate("cascade").onDelete("cascade"),
    )
    .addColumn("name", "text", (cb) => cb.notNull())
    .addColumn("email", "text", (cb) => cb.notNull())
    .addColumn("password", "text", (cb) => cb.notNull())
    .addColumn("admin", "boolean", (cb) => cb.defaultTo(false))
    .addColumn("created_at", "timestamp", (cb) =>
      cb.notNull().defaultTo(sql`current_timestamp`),
    )
    .execute();

  await db.schema
    .createTable("addresses")
    .ifNotExists()

    .addColumn("id", "uuid", (cb) =>
      cb
        .primaryKey()
        .notNull()
        .defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn("user_id", "uuid")
    .addForeignKeyConstraint(
      "user_id_foreign",
      ["user_id"],
      "users",
      ["id"],
      (cb) => cb.onDelete("cascade"),
    )
    .addColumn("label", "text", (cb) => cb.notNull())
    .addColumn("full_name", "text", (cb) => cb.notNull())
    .addColumn("email", "text", (cb) => cb.notNull())
    .addColumn("address_one", "text", (cb) => cb.notNull())
    .addColumn("address_two", "text", (cb) => cb.notNull())
    .addColumn("city", "text", (cb) => cb.notNull())
    .addColumn("province", "text", (cb) => cb.notNull())
    .addColumn("country", "text", (cb) => cb.notNull())
    .addColumn("zipcode", "text", (cb) => cb.notNull())
    .addColumn("phonenumber", "integer", (cb) => cb.notNull())
    .addColumn("created_at", "timestamp", (cb) =>
      cb.notNull().defaultTo(sql`current_timestamp`),
    )
    .execute();

  await db.schema
    .createTable("products")
    .ifNotExists()
    .addColumn("id", "uuid", (cb) =>
      cb
        .primaryKey()
        .notNull()
        .defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn("user_id", "uuid")
    .addForeignKeyConstraint(
      "user_id_foreign",
      ["user_id"],
      "users",
      ["id"],
      (cb) => cb.onDelete("cascade"),
    )
    .addColumn("name", "text", (cb) => cb.notNull())
    .addColumn("description", "text", (cb) => cb.notNull())
    .addColumn("images", "json")
    .addColumn("price", "integer", (cb) => cb.notNull())
    .addColumn("details", "json")
    .addColumn("created_at", "timestamp", (cb) =>
      cb.notNull().defaultTo(sql`current_timestamp`),
    )
    .execute();

  await db.schema
    .createTable("categories")
    .ifNotExists()
    .addColumn("id", "uuid", (cb) =>
      cb
        .primaryKey()
        .notNull()
        .defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn("name", "text", (cb) => cb.notNull())
    .addColumn("description", "text")
    .addColumn("images", "json")

    .addColumn("details", "json")

    .addColumn("created_at", "timestamp", (cb) =>
      cb.notNull().defaultTo(sql`current_timestamp`),
    )
    .execute();

  await db.schema
    .createTable("product_category")
    .ifNotExists()

    .addColumn("product_id", "uuid")
    .addForeignKeyConstraint(
      "product_id_foreign",
      ["product_id"],
      "products",
      ["id"],
      (cb) => cb.onUpdate("cascade").onDelete("cascade"),
    )
    .addColumn("category_id", "uuid")
    .addForeignKeyConstraint(
      "category_id_foreign",
      ["category_id"],
      "categories",
      ["id"],
      (cb) => cb.onUpdate("cascade").onDelete("cascade"),
    )
    .addColumn("amount", "integer")
    .addPrimaryKeyConstraint("product_category_pkey", [
      "product_id",
      "category_id",
    ])
    .execute();

  await db.schema
    .createTable("cart")
    .ifNotExists()

    .addColumn("id", "uuid", (cb) =>
      cb
        .primaryKey()
        .notNull()
        .defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn("user_id", "uuid")
    .addForeignKeyConstraint(
      "user_id_foreign",
      ["user_id"],
      "users",
      ["id"],
      (cb) => cb.onDelete("cascade"),
    )
    .addColumn("session_id", "text")
    .addColumn("total_value", "integer")
    .addColumn("created_at", "timestamp", (cb) =>
      cb.notNull().defaultTo(sql`current_timestamp`),
    )
    .addColumn("updated_at", "timestamp", (cb) =>
      cb.notNull().defaultTo(sql`current_timestamp`),
    )

    .execute();

  await db.schema
    .createTable("cart_items")
    .ifNotExists()

    .addColumn("id", "uuid", (cb) =>
      cb
        .primaryKey()
        .notNull()
        .defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn("cart_id", "uuid")
    .addForeignKeyConstraint(
      "cart_id_foreign",
      ["cart_id"],
      "cart",
      ["id"],
      (cb) => cb.onDelete("cascade").onDelete("cascade"),
    )
    .addColumn("product_id", "uuid")
    .addForeignKeyConstraint(
      "product_id_foreign",
      ["product_id"],
      "products",
      ["id"],
      (cb) => cb.onUpdate("cascade").onDelete("cascade"),
    )
    .addColumn("quantity", "integer")
    .addColumn("price", "integer")
    .addColumn("total_price", "integer", (cb) =>
      cb.generatedAlwaysAs(sql`quantity * price`).stored(),
    )
    .addColumn("created_at", "timestamp", (cb) =>
      cb.notNull().defaultTo(sql`current_timestamp`),
    )
    .addColumn("updated_at", "timestamp", (cb) =>
      cb.notNull().defaultTo(sql`current_timestamp`),
    )

    .execute();

  await db.schema
    .createTable("orders")
    .ifNotExists()

    .addColumn("id", "uuid", (cb) =>
      cb
        .primaryKey()
        .notNull()
        .defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn("user_id", "uuid")
    .addForeignKeyConstraint(
      "user_id_foreign",
      ["user_id"],
      "users",
      ["id"],
      (cb) => cb.onDelete("cascade"),
    )
    .addColumn("address_id", "uuid", (cb) => cb.references("addresses.id"))
    .addColumn("value", "integer", (cb) => cb.notNull())
    .addColumn("status", "text", (cb) => cb.defaultTo("Pending"))
    .addColumn("created_at", "timestamp", (cb) =>
      cb.notNull().defaultTo(sql`current_timestamp`),
    )
    .addColumn("updated_at", "timestamp", (cb) =>
      cb.notNull().defaultTo(sql`current_timestamp`),
    )
    .execute();

  await db.schema
    .createTable("order_items")
    .ifNotExists()

    .addColumn("id", "uuid", (cb) =>
      cb
        .primaryKey()
        .notNull()
        .defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn("order_id", "uuid")
    .addForeignKeyConstraint(
      "order_id_foreign",
      ["order_id"],
      "orders",
      ["id"],
      (cb) => cb.onDelete("cascade"),
    )
    .addColumn("product_id", "uuid")
    .addForeignKeyConstraint(
      "product_id_foreign",
      ["product_id"],
      "products",
      ["id"],
      (cb) => cb.onUpdate("cascade").onDelete("cascade"),
    )
    .addColumn("quantity", "integer")
    .addColumn("price", "integer")
    .addColumn("created_at", "timestamp", (cb) =>
      cb.notNull().defaultTo(sql`current_timestamp`),
    )
    .addColumn("updated_at", "timestamp", (cb) =>
      cb.notNull().defaultTo(sql`current_timestamp`),
    )
    .execute();

  await db.schema
    .createTable("frontpage")
    .ifNotExists()

    .addColumn("id", "uuid", (cb) =>
      cb
        .primaryKey()
        .notNull()
        .defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn("name", "text", (cb) => cb.notNull())
    .addColumn("categories", "json")

    .addColumn("products", "json")
    .addColumn("current", "boolean", (cb) =>
      cb.unique().check(sql`standard_true_or_null`),
    )
    .execute();

  console.log("Tables added");
}

main()
  .catch((err) => console.error(err))
  .finally(async () => await db.destroy());
