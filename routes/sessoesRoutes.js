import express from 'express';
import { cadastrarSessao, listarSessoes } from '../services/sessoesServices.js';

const router = express.Router();

router.get('/sessoes', listarSessoes);
router.post('/sessoes', cadastrarSessao);

export { router as sessoesRouter };