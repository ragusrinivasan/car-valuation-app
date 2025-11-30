// data-source.ts
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from './src/users/entities/user.entity';
import { Report } from './src/reports/entities/report.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [User, Report],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  migrationsRun: false,
});
