import * as mariadb from 'mariadb';
import { MongoClient } from 'mongodb';
import { Client as PGClient } from 'pg';


// Define the UserDAO interface
interface UserDAO {
    insert_user(name: string, cpf: string): Promise<void>;
}

// PostgreSQL implementation
class UserDAOPG implements UserDAO {
    dbConfig = {
        user: 'postgres',
        host: 'localhost',
        database: 'uml',
        password: '123',
        port: 5432,
    };

    async insert_user(name: string, cpf: string) {
        const client = new PGClient(this.dbConfig);
        try {
            await client.connect();
            console.log('Connected to PostgreSQL');

            const insertQuery = 'INSERT INTO usuario(nome, cpf) VALUES ($1, $2)';
            const result = await client.query(insertQuery, [name, cpf]);
            console.log('Data inserted successfully:', result.rowCount);
        } catch (error) {
            console.error('Error inserting data into PostgreSQL', error);
            throw error;
        } finally {
            await client.end();
            console.log('PostgreSQL connection closed');
        }
    }
}

// MongoDB implementation
class UserDAOMongo implements UserDAO {
    private dbConfig: string = process.env.MONGO_DB_CONFIG || 'mongodb+srv://root:root@cluster0.0d0gtyq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
    private dbName: string = 'uml';

    async insert_user(name: string, cpf: string): Promise<void> {
        const client = new MongoClient(this.dbConfig);

        try {
            await client.connect();
            console.log('Connected to MongoDB');
            
            const db = client.db(this.dbName);
            const collection = db.collection('usuario');
            
            const result = await collection.insertOne({ nome: name, cpf: cpf });
            console.log('Data inserted successfully:', result.insertedId);
        } catch (error) {
            console.error('Error inserting data into MongoDB', error);
            throw error;
        } finally {
            await client.close();
            console.log('MongoDB connection closed');
        }
    }
}


// MariaDB implementation
class UserDAOMariaDB implements UserDAO {
    dbConfig = {
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'uml',
        port: 3306,
    };

    async insert_user(name: string, cpf: string) {
        const pool = mariadb.createPool(this.dbConfig);
        let conn;
        try {
            conn = await pool.getConnection();
            console.log('Connected to MariaDB');
            const query = 'INSERT INTO usuario(nome, cpf) VALUES (?, ?)';
            const result = await conn.query(query, [name, cpf]);
            console.log('Data inserted successfully:', result);
        } catch (error) {
            console.error('Error inserting data into MariaDB', error);
            throw error;
        } finally {
            if (conn) conn.end();
        }
    }
}

export {
    UserDAO, UserDAOPG, UserDAOMongo, UserDAOMariaDB
}
