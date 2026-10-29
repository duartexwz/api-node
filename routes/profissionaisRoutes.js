import express from 'express';
import { cadastrarProfissionais, listarProfissionais, atualizarProfissionais, deleteProfissionais, filtrarProfissionais } from '../services/profissionaisServices.js';

// Cria as rotas da API
const router = express.Router();

router.get('/profissionais', listarProfissionais, filtrarProfissionais);
router.post('/profissionais',cadastrarProfissionais);
router.put('/profissionais/:id', atualizarProfissionais);
router.delete('/profissionais/:id', deleteProfissionais);

export { router as profissionaisRouter}