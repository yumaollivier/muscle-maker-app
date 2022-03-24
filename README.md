# muscle-maker-app

To migrate db : 
  - create migration skeleton : npx sequelize-cli migration:generate --name migrationName
  - in migration file : replace with migration's datas
  => don't forget to import sequelize and datatypes with const { Sequelize, DataTypes } = require('sequelize');
  - run command : npx sequelize-cli db:migrate
  
  
