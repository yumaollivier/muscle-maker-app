// module.exports = {
//     "development": {
//         "username": "localuser",
//         "password": "localpassword",
//         "database": "feuilledetemps",
//         "host": "localhost",
//         "dialect": "postgres"
//     },
//     "test": {
//         "username": "localuser",
//         "password": "localpassword",
//         "database": "feuilledetemps",
//         "host": "localhost",
//         "dialect": "postgres"
//     },
//     "staging": {
//         username: process.env.DB_USERNAME,
//         password: process.env.DB_PASSWORD,
//         database: "db",
//         dialect: "postgres",
//         host: process.env.DB_HOST,
//         logging: false,
//         port: 25060,
//         ssl: true,
//         dialectOptions: {
//             ssl: {
//                 rejectUnauthorized: false,
//                 ca: process.env.CA_CERT,
//             },
//         }
//     },
//     "production": {
//         username: process.env.DB_USERNAME,
//         password: process.env.DB_PASSWORD,
//         database: process.env.DB_NAME,
//         dialect: "postgres",
//         host: process.env.DB_HOST,
//         logging: false,
//         port: 25060,
//         ssl: true,
//         dialectOptions: {
//             ssl: {
//                 rejectUnauthorized: false,
//                 ca: process.env.CA_CERT,
//             },
//         }
//     }
// }
