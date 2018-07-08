const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');
const database = new Sequelize((process.argv[2] !== "--beta" ? "postgres://[redacted]@localhost:5432/zBotData" : "postgres://[redacted]@localhost:5433/data"), { logging: false });

class Database {
	static get db() {
		return database;
	}

	static recentUpdate() {
		try {
			console.log("Executing latest changes...")
			database.query(
				`CREATE TABLE "shop" (name TEXT, cost INT);`,
				{
					tableNames: ["shop"],
					type: database.QueryTypes.INSERT,
				}
			);

			database.query(
				`ALTER TABLE "users" RENAME COLUMN "g_experience" TO "balance";`,
				{
					tableNames: ["users"],
					type: database.QueryTypes.INSERT,
				}
			);

			database.query(
				`ALTER TABLE "users" RENAME COLUMN "slots" TO "inventory";`,
				{
					tableNames: ["users"],
					type: database.QueryTypes.INSERT,
				}
			);

			database.query(
				`ALTER TABLE "users" ADD COLUMN "daily" JSON;`,
				{
					tableNames: ["users"],
					type: database.QueryTypes.INSERT,
				}
			);

			database.query(
				`ALTER TABLE "punishments" ADD COLUMN "message" JSON;`,
				{
					tableNames: ["punishments"],
					type: database.QueryTypes.INSERT,
				}
			);

			database.query(
				`ALTER TABLE "users" ADD COLUMN "work" JSON;`,
				{
					tableNames: ["users"],
					type: database.QueryTypes.INSERT,
				}
			);

			database.query(
				`ALTER TABLE "shop" ADD COLUMN "description" TEXT;`,
				{
					tableNames: ["shop"],
					type: database.QueryTypes.INSERT,
				}
			);

			database.query(
				`ALTER TABLE "shop" ADD COLUMN "type" TEXT;`,
				{
					tableNames: ["shop"],
					type: database.QueryTypes.INSERT,
				}
			);

			database.query(
				`ALTER TABLE "settings" RENAME COLUMN "allowMentionsInTags" TO "allowMentions";`,
				{
					tableNames: ["settings"],
					type: database.QueryTypes.INSERT,
				}
			);

			database.query(
				`ALTER TABLE "settings" ADD COLUMN "punishConfirmation" BOOLEAN;`,
				{
					tableNames: ["settings"],
					type: database.QueryTypes.INSERT,
				}
			);

			database.query(
				`ALTER TABLE "settings" ADD COLUMN "dmPunishments" BOOLEAN;`,
				{
					tableNames: ["settings"],
					type: database.QueryTypes.INSERT,
				}
			);

			database.query(
				`ALTER TABLE "settings" ADD COLUMN "adminRole" TEXT;`,
				{
					tableNames: ["settings"],
					type: database.QueryTypes.INSERT,
				}
			);

			database.query(
				`ALTER TABLE "settings" ADD COLUMN "djRole" TEXT;`,
				{
					tableNames: ["settings"],
					type: database.QueryTypes.INSERT,
				}
			);

			database.query(
				`ALTER TABLE "users" ADD COLUMN "donator" JSON;`,
				{
					tableNames: ["users"],
					type: database.QueryTypes.INSERT,
				}
			);
		} catch (err) {
			return;
		}
	}

	static async start() {
		const CurrencyShop = require('../models/general/Shop');
		const Constants = require("./../util/Constants.js")
		database.authenticate()
			.then(() => console.log('[POSTGRES]: Connection to database has been established successfully.'))
			.then(() => console.log('[POSTGRES]: Synchronizing database...'))
			.then(() => database.sync()
				.then(async () => {
					this.recentUpdate();
					const shop = [];
					for (let first of Object.keys(Constants.Items)) {
						for (let [k, v] of Object.entries(Constants.Items[first])) {
							let current = Constants.Items[first][k];
							shop.push(CurrencyShop.upsert(current));
						}
					}
			 	 	Promise.all(shop).then(m => {
						console.log('[POSTGRES]: Done Synchronizing database!')
					})
				})
				.catch(error => console.log(`[POSTGRES]: Error synchronizing the database: \n${error}`))
			)
			.catch(error => {
				console.log(`[POSTGRES]: Unable to connect to the database: \n${error}`);
				console.log(`[POSTGRES]: Try reconnecting in 5 seconds...`);
				setTimeout(() => Database.start(), 5000);
			});
	}
}

module.exports = Database;
