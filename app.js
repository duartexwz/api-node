import  { profissionaisRouter }  from './routes/profissionaisRoutes.js';
import { sessoesRouter } from './routes/sessoesRoutes.js';
import { participantesSessaoRouter } from './routes/participantesSessaoRoutes.js';
import  express from 'express';
import cors from 'cors';

const app = express();


const corsOptions = {
    origin: 'http://172.16.50.36:3000'
}

app.use(cors(corsOptions)); //Libera a API para qualquer front usar
app.use(express.json());

app.use('/api/v1', profissionaisRouter, sessoesRouter, participantesSessaoRouter);

console.log('==== ROTAS REGISTRADAS === ');
app._router.stack.forEach(function(r){
    if (r.route && r.route.path){
        console.log(`Rota encontrada: ${r.route.path}`)
    } else if (r.name == 'router'){
        console.log('Router montado (prefixo de rota)')
    }
})
console.log('========================')
export { app }