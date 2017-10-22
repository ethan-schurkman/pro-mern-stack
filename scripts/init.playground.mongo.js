db = new Mongo().getDB('playground');

db.employees.remove({});
