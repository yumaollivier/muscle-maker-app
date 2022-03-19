const Sequelize = require("sequelize");

console.log('Setting up sequelize')

const sequelizeConfig =  ["staging", "production"].includes(process.env.NODE_ENV) ?
    // prod and staging config
    {
        dialect: "postgres",
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        logging: false,
        port: 25060,
        ssl: true,
        dialectOptions: {
            ssl: {
                rejectUnauthorized: false,
                ca: process.env.CA_CERT,
            },
        }

    }
    :
    // local config
    {
        dialect: "postgres",
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        logging: false,
        port: 5432,
        ssl: false,
    }

const sequelize = new Sequelize(
    sequelizeConfig
);

module.exports = sequelize;
