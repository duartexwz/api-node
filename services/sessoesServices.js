import fs from 'fs/promises';
import path from 'path';
import { lerDados } from '../services/profissionaisServices.js'


const arquivo = path.resolve('./dados.json');


export async function listarSessoes(req, res){
    try{
        const sessoesJson = await fs.readFile(arquivo, 'utf-8');
        return res.status(200).json(sessoesJson.sessoes)
    } catch(error){
        res.status(500).send(`Erro ao listar sessoes ${error.message}`) 
    }
}

// Buscar Sessões

//Cadastrar uma nova sesão
export async function cadastrarSessao(req, res, id){
    try{
        const {nome, data, modalidade, profissional_id, vagas} = req.body;
        
        if(!nome || !data|| !modalidade || !profissional_id || !vagas){
            return res.status(400).send('Os campos nome, dia, horário, modalidade, profissional_id e vagas são obrigatórios')
        }
        
        const sessoesJson = await lerDados();
        
        
        if (!sessoesJson.sessoes) sessoesJson.sessoes = [];

        const conflitoHorario = sessoesJson.sessoes.some(s => s.id !== parseInt(id) && s.data === data );

        if (conflitoHorario){
            return res.status(409).send(`Já existe uma sessão cadastrada na data ${data}`);
        }

        const ultimoId = sessoesJson.sessoes.length > 0
            ? sessoesJson.sessoes[sessoesJson.sessoes.length -1].id
            : 0;


        const novaSessao = {
            id: ultimoId + 1,
            nome: nome.trim(),
            modalidade: modalidade.trim(),
            data: data,
            profissional_id: profissional_id,
            vagas: vagas,
        }

        sessoesJson.sessoes.push(novaSessao);

        const cadastroAtualizado = JSON.stringify(sessoesJson, null, 2);
        await fs.writeFile(arquivo, cadastroAtualizado, 'utf-8');

        return res.status(201).json({
            message: 'Sessão cadastrada com sucesso',
            dados: novaSessao
        })

    } catch(error){
        return res.status(500).send(`Erro na aplicação: ${error.message}`)
    }
}