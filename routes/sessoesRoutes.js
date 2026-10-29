import express from 'express';
import { atualizarSessao, cadastrarSessao, deleteSessao, listarSessoes, filtrarSessoes } from '../services/sessoesServices.js';

const router = express.Router();

router.get('/sessoes/busca', listarSessoes, filtrarSessoes)
router.post('/sessoes', cadastrarSessao);
router.put('/sessoes/:id', atualizarSessao),
router.delete('/sessoes/:id', deleteSessao);


export { router as sessoesRouter };