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

            if(nome && !participantes.nome.toLowerCase().includes(nome.toLowerCase())){
                return false;
            }
            if (sessao_id && !participantes.sessao_id != parseInt(sessao_id)){
                return false;
            }
            return true;
        })
        if (participantesFilter.length === 0){
            return res.status(404).send(`Nenhum resultado encontrado`);
        }
        return res.status(200).json(participantesFilter);
    } catch(error){
        console.log(error.message);
        return res.status(500).send('Erro ao filtrar participante.')
    }
}

export async function cadastrarParticipanteSessao(req, res){
    try{
        
        const { nome, sessao_id } = req.body;
        if (!nome || !sessao_id){
            return res.status(400).send('Informações ausentes, revise o envio e tente novamente.');
        }
        
        const createParticipante = await lerDados();

        if (!createParticipante.participantes_sessoes) createParticipante.participantes_sessoes = [];

        const participanteJaCadastrado = createParticipante.participantes_sessoes.some(p => p.sessao_id !== parseInt(sessao_id) && p.nome.trim().toLowerCase() === nome.trim().toLowerCase()) 

        if (participanteJaCadastrado){
            return res.status(409).send('Participante já cadastrado na sessão');
        }

        const ultimoId = createParticipante.participantes_sessoes.length > 0
            ? createParticipante.participantes_sessoes[createParticipante.participantes_sessoes.length -1].id
            : 0

        const novoParticipante = {
            id: ultimoId + 1,
            nome: nome.trim(),
            sessao_id: sessao_id,
        }

        createParticipante.participantes_sessoes.push(novoParticipante);
        
        await fs.writeFile(arquivo, JSON.stringify(createParticipante, null, 2), 'utf-8');

        return res.status(201).json({
            message: 'Participante cadastrado com sucesso!',
            dados: novoParticipante
        })
    } catch(error){
        console.log(error.message);
        return res.status(500).send('Erro ao cadastrar a vaga.')
    }
}

export async function atualizarParticipanteSessao(req, res){
    try{
        const updateParticipantes = await lerDados();

        const { id } = req.params
        const { nome, sessao_id } = req.body;

        const index = updateParticipantes.participantes_sessoes.findIndex(p => p.id === parseInt(id));

        if (index === -1){
            return res.status(404).send('Participante não encontrado.');
        }

        const nomeFinal = nome != undefined ? nome.trim().toLowerCase() : updateParticipantes.participantes_sessoes[index].id;
        const sessaoFinal = sessao_id != undefined ? updateParticipantes.participantes_sessoes.parseInt(sessao_id) : updateParticipantes.participantes_sessoes[index].id;


        const participanteExiste = updateParticipantes.participantes_sessoes.some(participantes => participantes.id !== parseInt(id) && participantes.nome.trim().toLowerCase() === nomeFinal.toLowerCase());

        if(participanteExiste){
            return res.status(409).send('Participante já cadastrado na sessão.')
        }

        if (!nomeFinal || !sessaoFinal){
            return res.status(400).send('Os campos nome e sessao são obrigatórios.');
        }

        updateParticipantes.participantes_sessoes[index].nome = nomeFinal;
        updateParticipantes.participantes_sessoes[index].sessao_id = sessaoFinal; 

        await fs.writeFile(arquivo, JSON.stringify(updateParticipantes, null, 2), 'utf-8');

         return res.status(200).json({
            message: 'Participante atualizado com sucesso',
            dados: updateParticipantes.participantes_sessoes[index]
        });

    } catch(error){
        console.log(error.message);
        return res.status(500).send('Erro ao atualizar o cadastro da vaga');
    }
}

export async function deleteParticipanteSessoes(req, res){
    try{
        const deleteParticipanteSessao = await lerDados();

        const {id} = req.params;

        if (!id){
            return res.status(400).send('O parâmetro ID deve ser passado obrigatóriamente.');
        }

        const index = deleteParticipanteSessao.participantes_sessoes.findIndex(p => p.id === parseInt(id));

        if(index === -1){
            return res.status(404).send('Nenhum registro encontrado.')
        }

        deleteParticipanteSessao.participantes_sessoes.splice(index, 1);

        await fs.writeFile(arquivo, JSON.stringify(deleteParticipanteSessao, null, 2), 'utf-8');

        return res.status(200).send('Participantes removido com sucesso.');

    }catch(error){
        console.log(error.message);
        return res.status(500).send('Erro ao remover o participante.')
    }
}