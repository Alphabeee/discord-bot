const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('gameData');

db.serialize(() => {
    db.run("CREATE TABLE players (pId CHAR(20),money INT,unique(pId))");
});

db.close();