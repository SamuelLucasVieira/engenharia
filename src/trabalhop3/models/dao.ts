import * as mariadb from 'mariadb';
import { MongoClient } from 'mongodb';
import { Client as PGClient } from 'pg';

// Define the UserDAO interface
interface UserDAO {
    insert_user(natureza_chamado: string, descricao: string): Promise<void>;
    listUser(): Promise<{ natureza_chamado: string; descricao: string; }[]>;
}

// PostgreSQL implementation
class UserDAOPG implements UserDAO {
    private dbConfig = {
        user: 'postgres',
        host: 'localhost',
        database: 'uml',
        password: '123',
        port: 5432,
    };

    async insert_user(natureza_chamado: string, descricao: string) {
        const client = new PGClient(this.dbConfig);
        try {
            if (!descricao) {
                throw new Error('Descricao cannot be null or empty');
            }

            await client.connect();
            console.log('Connected to PostgreSQL');

            const insertQuery = 'INSERT INTO service(natureza_chamado, descricao) VALUES ($1, $2)';
            const result = await client.query(insertQuery, [natureza_chamado, descricao]);
            console.log('Data inserted successfully:', result.rowCount);
        } catch (error) {
            console.error('Error inserting data into PostgreSQL', error);
            throw error;
        } finally {
            await client.end();
            console.log('PostgreSQL connection closed');
        }
    }

    async listUser(): Promise<{ natureza_chamado: string; descricao: string; }[]> {
        const client = new PGClient(this.dbConfig);
        try {
            await client.connect();
            console.log('Connected to PostgreSQL');

            const query = 'SELECT natureza_chamado, descricao FROM service';
            const result = await client.query(query);

            const users = result.rows.map(row => ({
                natureza_chamado: row.natureza_chamado,
                descricao: row.descricao
            }));

            console.log('Data fetched successfully:', users);
            return users;
        } catch (error) {
            console.error('Error fetching data from PostgreSQL', error);
            throw error;
        } finally {
            await client.end();
            console.log('PostgreSQL connection closed');
        }
    }
}

// MongoDB implementation
class UserDAOMongo implements UserDAO {
    private dbConfig:any= process.env.MONGO_DB_CONFIG 
    private dbName: string = 'uml';

    async insert_user(natureza_chamado: string, descricao: string): Promise<void> {
        const client = new MongoClient(this.dbConfig);

        try {
            await client.connect();
            console.log('Connected to MongoDB');

            const db = client.db(this.dbName);
            const collection = db.collection('uml');

            const result = await collection.insertOne({ natureza_chamado, descricao });
            console.log('Data inserted successfully:', result.insertedId);
        } catch (error) {
            console.error('Error inserting data into MongoDB', error);
            throw error;
        } finally {
            await client.close();
            console.log('MongoDB connection closed');
        }
    }

    async listUser(): Promise<{ natureza_chamado: string; descricao: string; }[]> {
        const client = new MongoClient(this.dbConfig);

        try {
            await client.connect();
            console.log('Connected to MongoDB');

            const db = client.db(this.dbName);
            const collection = db.collection('uml');

            const users = await collection.find().toArray();
            const userNames: { natureza_chamado: string; descricao: string; }[] = users.map(user => ({
                natureza_chamado: user.natureza_chamado,
                descricao: user.descricao
            }));

            console.log('Data fetched successfully:', userNames);
            return userNames;
        } catch (error) {
            console.error('Error fetching data from MongoDB', error);
            throw error;
        } finally {
            await client.close();
            console.log('MongoDB connection closed');
        }
    }
}

// MariaDB implementation
class UserDAOMariaDB implements UserDAO {
    private dbConfig = {
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'uml',
        port: 3306,
    };

    async insert_user(natureza_chamado: string, descricao: string) {
        const pool = mariadb.createPool(this.dbConfig);
        let conn;
        try {
            conn = await pool.getConnection();
            console.log('Connected to MariaDB');

            const query = 'INSERT INTO service(natureza_chamado, descricao) VALUES (?, ?)';
            const result = await conn.query(query, [natureza_chamado, descricao]);
            console.log('Data inserted successfully:', result);
        } catch (error) {
            console.error('Error inserting data into MariaDB', error);
            throw error;
        } finally {
            if (conn) conn.end();
            console.log('MariaDB connection closed');
        }
    }

    async listUser(): Promise<{ natureza_chamado: string; descricao: string; }[]> {
        const pool = mariadb.createPool(this.dbConfig);
        let conn;
        try {
            conn = await pool.getConnection();
            console.log('Connected to MariaDB');

            const query = 'SELECT natureza_chamado, descricao FROM service';
            const rows = await conn.query(query);

            const userNames: { natureza_chamado: string; descricao: string; }[] = rows.map((row: { natureza_chamado: string; descricao: string; }) => ({
                natureza_chamado: row.natureza_chamado,
                descricao: row.descricao
            }));

            console.log('Data fetched successfully:', userNames);
            return userNames;
        } catch (error) {
            console.error('Error fetching data from MariaDB', error);
            throw error;
        } finally {
            if (conn) conn.end();
            console.log('MariaDB connection closed');
        }
    }
}

export {
    UserDAO, UserDAOPG, UserDAOMongo, UserDAOMariaDB
};
