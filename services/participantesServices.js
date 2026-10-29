import { lerDados } from './profissionaisServices.js'
import fs from 'fs/promises';
import path from 'path';


const arquivo = path.resolve('./dados.json');


export async function listarParticipantes(req, res, next){
    try{
        const getParticipantes = await lerDados();

        const participantesLista = getParticipantes.participantes_sessoes || [];

        const temFiltros = Object.keys(req.query).length > 0;

        if(!temFiltros){
            return res.status(200).json(getParticipantes.participantes_sessoes);
        }

        res.locals.participantesCompartilhados = participantesLista;

        return next();
    } catch(error){
        console.log(error.message);
        return res.status(500).send('Erro ao listar participantes.');
    }
}

export async function filtrarParticipantes(req, res){
    try{
        const participantesSessao = res.locals.participantesCompartilhados || [];

        const { nome, sessao_id} = req.query;

        const participantesFilter = participantesSessao.filter(participantes => {
            if(nome && !participantes.nome.trim().toLowerCase().includes(nome.toLowerCase())){
                return false;
            }
            if (sessao_id && !participantes.sessao_id != parseInt(sessao_id)){
                return false;
            }
            return true;
        })
        if (participantesFilter.length < 0){
            res.status(404).send(`Nenhum resultado encontrado`);
        }
        return res.status(200).json(participantesFilter);
    } catch(error){
        console.log(error.message);
        return res.status(500).send('Erro ao filtrar participante.')
    }
}

export async function cadastrarParticipanteSessao(req, res, id){
    try{
        const createParticipante = await lerDados();
        const { nome, sessao_id } = req.body;

        if (!nome || !sessao_id){
            return res.status(400).send('Informações ausentes, revise o envio e tente novamente.');
        }
        if (!createParticipante.participantes_sessoes) createParticipante.participantes_sessoes || [];

        const nomeFinal = participantes_sessoes.nome.trim().toLowerCase();

        const ultimoId = createParticipante.participantes_sessoes.length > 0
            ? createParticipante.participantes_sessoes[createParticipante.participantes_sessoes.length -1].id
            : 0

        const novoParticipante = {
            id: ultimoId + 1,
            nome: nomeFinal,
            sessao: sessao_id,
        }

        createParticipante.participantes_sessoes.push(novoParticipante);

        const cadastroParticipanteAtualizado = JSON.stringify(novoParticipante, null, 2);
        await fs.writeFile(arquivo, cadastroParticipanteAtualizado, 'utf-8');

        return res.status(201).send('Participante cadastrado com sucesso!');
    } catch(error){
        console.log(error.message);;
        return res.status(500).send('Erro ao cadastrar a vaga.')
    }
}

export async function atualizarParticipanteSessao(req, res){
    try{
        const updateParticipantes = await lerDados();
        if(!updateParticipantes.participantes_sessoes) updateParticipantes.participantes_sessoes || [];

        const { id } = req.params
        const { nome, sessao_id } = req.body;

        const index = updateParticipantes.participantes_sessoes.findIndex(p => p.id != parseInt(id));

        if (!index){
            res.status(404).send('Participante não encontrado.');
        }

        const nomeFinal = nome != undefined ? nome.trim().toLowerCase() : updateParticipantes.participantes_sessoes[index].id;
        const sessaoFinal = sessao_id != undefined ? updateParticipantes.participantes_sessoes.parseInt(sessao_id) : updateParticipantes.participantes_sessoes[index].id;

        if (!nomeFinal || !sessaoFinal){
            res.status(400).send('Os campos nome e sessao são obrigatórios.');
        }

        updateParticipantes.participantes_sessoes[index].nome = nomeFinal;
        updateParticipantes.participantes_sessoes[index].sessao_id = sessaoFinal; 

        await fs.writeFile(arquivo, updateSessao, 'utf-8');

        return res.status(200).send('Participante atualizado com sucesso!');

    } catch(error){
        console.log(error.message);;
        return res.status(500).send('Erro ao atualizar o cadastro da vaga');
    }
}

export async function deleteParticipanteSessoes(req, res){
    try{
        const deleteParticipanteSessao = await lerDados();

        const {id} = req.body;

        if (!id){
            return res.status(400).send('O parâmetro ID deve ser passado obrigatóriamente.');
        }

        const index = deleteParticipanteSessao.participantes_sessoes.findIndex(p => p.id != parseInt(id));

        if(!index){
            return res.status(404).send('Nenhum registro encontrado.')
        }

        deleteParticipanteSessao.participantes_sessoes.splice(index, 1);

        await fs.writeFile(arquivo, JSON.stringify(deleteParticipanteSessao), null, 2);

        return res.status(200).send('Participantes removido com sucesso.');

    }catch(error){
        console.log(error.message);
        return res.status(500).send('Erro ao remover o participante.')
    }
}