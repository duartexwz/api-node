import express from 'express';
<<<<<<< HEAD
import { cadastrarProfissionais, listarProfissionais, atualizarProfissionais, deleteProfissionais } from '../services/profissionaisServices.js';
=======
import { cadastrarProfissionais, listarProfissionais, atualizarProfissionais, deleteProfissionais, filtrarProfissionais } from '../services/profissionaisServices.js';
>>>>>>> edff194b049d45f1016cc33e6d4c3f0525ce40f9

// Cria as rotas da API
const router = express.Router();

<<<<<<< HEAD
router.get('/profissionais', listarProfissionais);
=======
router.get('/profissionais', listarProfissionais, filtrarProfissionais);
>>>>>>> edff194b049d45f1016cc33e6d4c3f0525ce40f9
router.post('/profissionais',cadastrarProfissionais);
router.put('/profissionais/:id', atualizarProfissionais);
router.delete('/profissionais/:id', deleteProfissionais);

export { router as profissionaisRouter}