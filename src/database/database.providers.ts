import { createConnection, ConnectionOptions } from 'typeorm';
import { join } from 'path';

const portdb = process.env.PORTDB || 5432;

// console.log(portdb);

const obj = {
    type: 'postgres',
    host: 'localhost',
    port: portdb,
    username: 'postgres',
    password: 'postgres',
    database: 'ideas',
    entities: [join(__dirname, '**/**.entity{.ts,.js}')],
    synchronize: true,
    logging: true,
    dropSchema: false
};

console.log(obj);

const connectionOptions: ConnectionOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'ideas',
    entities: [join(__dirname, '**/**.entity{.ts,.js}')],
    synchronize: true,
    logging: true,
    dropSchema: false
};


export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async () => await createConnection(connectionOptions),
  },
];
