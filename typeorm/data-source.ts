import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';


dotenv.config();

const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    migrations: [`${__dirname}/migrations/**/*.ts`]
});

export default dataSource;

dataSource.initialize()
.then(() => console.log("Data Source has been initialized"))
.catch((error) => console.error("Error initializing Data Source", error));