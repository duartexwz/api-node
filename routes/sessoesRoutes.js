import express from 'express';
import { atualizarSessao, cadastrarSessao, deleteSessao, listarSessoes, filtrarSessoes } from '../services/sessoesServices.js';

const router = express.Router();

router.get('/sessoes/buscar', listarSessoes, filtrarSessoes)
router.post('/sessoes', cadastrarSessao);
router.put('/sessoes/atualizar/:id', atualizarSessao),
router.delete('/sessoes/delete/:id', deleteSessao);

export { router as sessoesRouter };