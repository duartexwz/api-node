import fs from 'fs/promises';
import path from 'path';
import { lerDados } from '../services/profissionaisServices.js'



const arquivo = path.resolve('./dados.json');


export async function listarSessoes(req, res, next){
    try{
        const getSessoes = await lerDados();
        
        const sessoesLista = getSessoes.sessoes || [];

        const temFiltros = Object.keys(req.query).length > 0 

        if (!temFiltros){
            return res.status(200).json(getSessoes);
        }

        res.locals.sessoesCompartilhadas = sessoesLista; // Salva os parametros e passa para o filtro 
        

        return next();
    } catch(error){
        res.status(500).send(`Erro ao listar sessoes ${error.message}`) 
    }
}
// Buscar Sessões
export async function filtrarSessoes(req, res){
    try{
        const sessoes = res.locals.sessoesCompartilhadas || [];

        const {nome, dia, modalidade, profissional_id, vagas} = req.query;

        const sessoesFiltradas = sessoes.filter(sessao => {
            if (nome && !sessao.nome.toLowerCase().includes(nome.toLowerCase())) {
                return false;
            }
            if (dia && (!sessao.data || sessao.data.dia !== dia)) {
                return false;
            }
            
            if (modalidade && !sessao.modalidade.toLowerCase().includes(modalidade.toLowerCase())) {
                return false;
            }
            
            if (profissional_id && sessao.profissional_id !== parseInt(profissional_id)) {
                return false;
            }
            
            if (vagas && sessao.vagas !== parseInt(vagas)) {
                return false;
            }

            return true;
        });
 
        if (sessoesFiltradas.length === 0){
            return res.status(404).send(`Nenhum registro encontrado`);
        }

        return res.status(200).json(sessoesFiltradas);
    } catch(error){
        res.status(500).send(`Erro na busca de dados ${error.message}}`)
    }
}


//Cadastrar uma nova sesão
export async function cadastrarSessao(req, res, id){
    try{
        const {nome, data, modalidade, profissional_id, vagas} = req.body;
        
        if(!nome || !data|| !modalidade || !profissional_id || !vagas){
            return res.status(400).send('Os campos nome, dia, horário, modalidade, profissional_id e vagas são obrigatórios')
        }
        
        const createSessao = await lerDados();
        
        
        if (!createSessao.sessoes) createSessao.sessoes = [];

        const conflitoHorario = createSessao.sessoes.some(s => s.id !== parseInt(id) && s.data.dia.horario === data.dia.horario ); // busca o elemento e retorna verdadeiro ou falso

        if (conflitoHorario){
            return res.status(409).send('Já existe uma sessão cadastrada no horario solicitado.');
        }

        const ultimoId = createSessao.sessoes.length > 0
            ? createSessao.sessoes[createSessao.sessoes.length -1].id
            : 0;


        const novaSessao = {
            id: ultimoId + 1,
            nome: nome.trim(),
            modalidade: modalidade.trim(),
            data: data,
            profissional_id: profissional_id,
            vagas: vagas,
        }

        createSessao.sessoes.push(novaSessao);

        const cadastroAtualizado = JSON.stringify(createSessao, null, 2);
        await fs.writeFile(arquivo, cadastroAtualizado, 'utf-8');

        return res.status(201).json({
            message: 'Sessão cadastrada com sucesso',
            dados: novaSessao
        })

    } catch(error){
        return res.status(500).send(`Erro na aplicação: ${error.message}`)
    }
}

export async function atualizarSessao(req, res){
    try{
        const updateSessao = await lerDados();
        const {id, nome, data, modalidade, profissional_id, vagas} = req.body;

        const index = updateSessao.sessoes.findIndex(s => s.id === parseInt(id))

        if (!index){ 
            res.status(404).send(`Sessão não encontrada`);
        }

        const nomeSessaoFinal = nome != undefined ? nome.trim() : updateSessao.sessoes[index].nome;
        const modalidadeSessaoFinal = modalidade != undefined ?  modalidade.trim() : updateSessao.sessoes[index].modalidade;

        if(!nomeSessaoFinal || !data|| !modalidadeSessaoFinal || !profissional_id || !vagas){
            return res.status(400).send('Os campos nome, dia, horário, modalidade, profissional_id e vagas são obrigatórios')
        };

        const dataExiste = updateSessao.sessoes.some(d => d.id != parseInt(id) && p.data == data);

        if (dataExiste){
            res.status(409).send(`Já existe uma sessão cadastrada na data solicitada.`);
        }

        updateSessao.sessoes[index].nome = nomeSessaoFinal;
        updateSessao.sessoes[index].data = data;
        updateSessao.sessoes[index].modalidade = modalidadeSessaoFinal;
        updateSessao.sessoes[index].profissional_id =  profissional_id;
        updateSessao.sessoes[index].vagas = vagas;

        await fs.writeFile(arquivo, JSON.stringify(updateSessao), null, 2);

        return res.status(200).json({
            message: 'Dados atualizados com sucesso!',
            dados: updateSessao.sessoes[index]
        })
    } catch(error){
        return res.status(500).send(`Erro ao atualizar sessão ${error.message}`);
    }
}

export async function deleteSessao(req, res, id){
    try{
        const deleteSessao = await lerDados();
        const { id } = req.body;

        if (!id){
            return res.status(400).send('Parâmetros inválidos, passe todos os dados corretamente.');
        }

        
        const index = deleteSessao.sessoes.findIndex(sessoes => sessoes.id === parseInt(id)) //retorna o índice do primeiro elemento em uma matriz 
        if (index === -1){
            return res.status(404).send('Sessão não encontrada.');
        }

        deletesSessao.sessoes.splice(index, 1); // splice é um metodo nativo do js para remover ou substituir dados do arquivo json

        await fs.writeFile(arquivo, JSON.stringify(deleteSessoes), null, 2);

        return res.status(200).send('Sessão deletada com sucesso!');

    } catch(error){
        return res.status(500).send(`Erro ao deletar sessão ${error.message}}`);
    }
}