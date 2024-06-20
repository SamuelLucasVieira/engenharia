/*
Basic string capitalization service
Autor: Fabrício G. M. de Carvalho, Ph.D
*/

/* Importing express framework */
const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');
const app = express();

/* Each application must be executed in different ports if they are
at the same machine. */
const port = 5001;

/* Model import */



/* Configuração para leitura de parâmetros em requisição do tipo post em form */
app.use(bodyParser.urlencoded({extended: false}));
/* Habilitação de requisições partindo de outras aplicações */
app.use(cors({
    oringin: '*',
    credentials: true
})); 
/* Server execution */
app.listen(port, listenHandler);


/* Request handlers: */
/* Capitalization service handler */


function listenHandler(){
    console.log(`Listening port ${port}!`);
}
export{}