import  { profissionaisRouter }  from './routes/profissionaisRoutes.js';
import  express from 'express';
import cors from 'cors';


const app = express();

const PORT = 3000;

app.use(cors()); //Libera a API para qualquer front usar
app.use(express.json());

app.use('/api', profissionaisRouter);


app.listen(PORT, () => {
    console.log(`A aplicação está rodando na porta ${PORT}`)
})