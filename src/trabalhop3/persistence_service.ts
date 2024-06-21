/*
Basic Data Persistence Service
Autor: Fabrício G. M. de Carvalho, Ph.D
*/

/* Importing express framework */
const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');
const app = express();

/* Each application must be executed in different ports if they are
at the same machine. */
const port = 5002;

/* Persistence class models */
import {UserDAO, UserDAOMariaDB, UserDAOMongo, UserDAOPG} from "./models/dao";



/* Configuração para leitura de parâmetros em requisição do tipo post em form */
app.use(bodyParser.urlencoded({extended: false}));
/* Habilitação de requisições partindo de outras aplicações */
app.use(cors({
    oringin: '*',
    credentials: true
})); 

/* Service route creation . */
app.get('/persist', persistence_handler);
/* Server execution */
app.listen(port, listenHandler);


/* Request handlers: */
/* Persistence Service Handler */
async function persistence_handler(req:any, res:any){ 
    console.log("Persistence service request received"); //Only for debug
    let natureza_chamado: string = req.query.natureza_chamado;
    let descricao: string = req.query.descricao;
    let bd_type:string = req.query.bd_type;
    let user_dao: UserDAO;
    if (bd_type === "pg") {
        user_dao = new UserDAOPG();
    } else if (bd_type === "mongo") {
        user_dao = new UserDAOMongo();
    } else if (bd_type === "mariadb") {
        user_dao = new UserDAOMariaDB();
    } else {
        res.status(400).send("Unsupported db_type: " + bd_type);
        return;
    }
    await user_dao.insert_user(natureza_chamado, descricao);
    res.end("Data successfully inserted");     
}

function listenHandler(){
    console.log(`Listening port ${port}!`);
}
export{}