import express from 'express';
import { cadastrarProfissionais, listarProfissionais } from '../services/dadosServices.js';

// Cria as rotas da API
const router = express.Router();

router.get('/profissionais', listarProfissionais)
router.post('/profissionais',cadastrarProfissionais)

export { router as profissionaisRouter}