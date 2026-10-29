import { listarParticipantes, filtrarParticipantes, cadastrarParticipanteSessao, atualizarParticipanteSessao, deleteParticipanteSessoes } from "../services/participantesServices.js";
import express from 'express';

const router = express.Router();

router.get('/participantes/buscar', listarParticipantes, filtrarParticipantes);
router.post('/participantes', cadastrarParticipanteSessao);
router.put('/participantes/:id', atualizarParticipanteSessao);
router.delete('/participantes/:id', deleteParticipanteSessoes);

export { router as participantesSessaoRouter };
