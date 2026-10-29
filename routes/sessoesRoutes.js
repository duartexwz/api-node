import express from 'express';
<<<<<<< HEAD
import { cadastrarSessao, listarSessoes } from '../services/sessoesServices.js';

const router = express.Router();

router.get('/sessoes', listarSessoes);
router.post('/sessoes', cadastrarSessao);
=======
import { atualizarSessao, cadastrarSessao, deleteSessao, listarSessoes, filtrarSessoes } from '../services/sessoesServices.js';

const router = express.Router();

router.get('/sessoes/busca', listarSessoes, filtrarSessoes)
router.post('/sessoes', cadastrarSessao);
router.put('/sessoes/:id', atualizarSessao),
router.delete('/sessoes/:id', deleteSessao);

>>>>>>> edff194b049d45f1016cc33e6d4c3f0525ce40f9

export { router as sessoesRouter };