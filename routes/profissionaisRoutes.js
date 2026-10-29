import express from 'express';
import { cadastrarProfissionais, listarProfissionais, atualizarProfissionais, deleteProfissionais, filtrarProfissionais } from '../services/profissionaisServices.js';

// Cria as rotas da API
const router = express.Router();

router.get('/profissionais/buscar', listarProfissionais, filtrarProfissionais);
router.post('/profissionais',cadastrarProfissionais);
router.put('/profissionais/atualizar/:id', atualizarProfissionais);
router.delete('/profissionais/deletar/:id', deleteProfissionais);

export { router as profissionaisRouter }