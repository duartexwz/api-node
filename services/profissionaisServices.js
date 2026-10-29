// Usar o módulo fs para sobrescrever o arquivo json
import fs from 'fs/promises';
import path from 'path';


const arquivo = path.resolve('./dados.json'); // Guarda o caminho do arquivo json

// Função auxiliar para ler dados
export async function lerDados(){
    try{
        const dados = await fs.readFile(arquivo, 'utf-8'); // Faz a leitura do arquivo
        return JSON.parse(dados); // Retorna os dados
    } catch(error){
        return { profissionais: [], sessoes: [], participantes_sessoes: [] };
    }
}

export async function listarProfissionais(req, res, next){
    try{
        const getProfissionais = await lerDados(); // chama o a função de leitura;

        const profissionaisLista = getProfissionais.profissionais || [];

        const temFiltros = Object.keys(req.query).length > 0;

        if(!temFiltros){
            return res.status(200).json(getProfissionais.profissionais);
        }

        res.locals.profissionaisCompartilhados = profissionaisLista;

        return next()
    } catch(error){
        console.log(error.message);
        return res.status(500).send('Erro ao listar profissionais' ) // Retorna mensagem de erro 
    }
}

export function filtrarProfissionais(req, res){
    try{
        const profissionaisFilter = res.locals.profissionaisCompartilhados || [];

        const { nome, profissao } = req.query;

        const profissionaisFiltrados = profissionaisFilter.filter(profissionais => {

            if (nome && !profissionais.nome.toLowerCase().includes(nome.toLowerCase())){
                return false;
            };
            if (profissao && !profissionais.profissao.toLowerCase().includes(profissao.toLowerCase())){
                return false;
            };
            return true;
        });
        if(profissionaisFiltrados.length === 0){
            return res.status(404).send(`Nenhum registro encontrado`);
        }
        return res.status(200).json(profissionaisFiltrados);
    } catch(error){
        console.log(error.message);
        return res.status(500).send('Erro ao realizar a busca')
    }
}

export async function cadastrarProfissionais(req, res){
    try{
        const createProfissional = await lerDados();

        if(!createProfissional.profissionais) createProfissional.profissionais = [];

        const { id, nome, profissao } = req.body; // pega os dados do corpo da requisicao

        if (!nome || !profissao){
            return res.status(400).send(`Os campos nome e profissao são obrigatórios no campo.`); // Mesagem de erro caso nome ou profissao nao estejam no body
        }

        // Ler os dados atuais
        const profissionalExiste = createProfissional.profissionais.some(p => p.id !== parseInt(id) && p.nome.trim().toLowerCase() === nome.trim().toLowerCase()); // Acessa o campo de profissionais dentro do arquivo json
        if (profissionalExiste){
            return res.status(409).send('O profissional já está cadastrado nos sistema.');
        }
        
        const ultimoId = createProfissional.profissionais.length > 0
        ? createProfissional.profissionais[createProfissional.profissionais.length - 1].id
        : 0;
        
        const novoProfissional = {
            id: ultimoId + 1, // Adiciona os dados inseridos
            nome: nome.trim(),
            profissao: profissao.trim()
        };
        // Adiciona o array na memoria
        createProfissional.profissionais.push(novoProfissional);
        
        const dadosAtualizados = JSON.stringify(createProfissional, null, 2); // Adicionam os dados com identacao
        await fs.writeFile(arquivo, dadosAtualizados, 'utf-8'); // Sobrescreve o arquivo

        return res.status(201).json({ 
            mensagem: "Profissional cadastrado com sucesso!",  // Retorna sucesso para que a api possa responder
            dados: novoProfissional 
        });    
    } catch (error){
        console.log(error.message);
        return res.status(500).send('Erro ao cadastrar profissional'); // Mensagem de erro
    }
}


export async function atualizarProfissionais(req, res){
    try{
        const updateProfissional = await lerDados();
        const { id } = req.params;
        const { nome, profissao } = req.body;

        const index = updateProfissional.profissionais.findIndex(p  => p.id === parseInt (id));

        if (index === -1){
            return res.status(404).send('Profissional não encontrado');
        }// Retorna -1 se nao encontrar o index
        

        const nomeFinal = nome !== undefined ? nome.trim() : updateProfissional.profissionais[index].nome;
        const profissaoFinal = profissao !== undefined ? profissao.trim() : updateProfissional.profissionais[index].profissao;
        
        if (!nomeFinal || !profissaoFinal) {
            return res.status(400).send('Os campos nome e profissao são obrigatórios no corpo da requisição.');
        }
        
        const profissionalExiste = updateProfissional.profissionais.some(p => p.id !== parseInt(id) && p.nome.trim().toLowerCase() === nomeFinal.toLowerCase()); // Verifica se existe outro profissional com o nome cadastrado
    
        if (profissionalExiste){
            return res.status(400).send('Ja existe um profissional com esse nome.');
        }
        updateProfissional.profissionais[index].nome = nomeFinal;
        updateProfissional.profissionais[index].profissao = profissaoFinal;

        await fs.writeFile(arquivo, JSON.stringify(updateProfissional), null, 2);

        return res.status(200).json({
            message: 'Profissional atualizado com sucesso',
            dados: updateProfissional.profissionais[index]
        });
        
    } catch (error){
            console.log(error.message);
            return res.status(500).send('Erro ao atualizar o profissional');
        }
} 

export async function deleteProfissionais(req, res){
    try{
        const deleteProfissional = await lerDados();

        if (!deleteProfissional){
            return res.status(404).send(`Erro ao encontrar o arquivo ${deleteProfissional}`);
        }
        const { id } = req.params;

        const index = deleteProfissional.profissionais.findIndex(profissionais => profissionais.id === parseInt(id));
        if (index === -1){
            return res.status(404).send('Profissional não encontrado');
        }// Retonrna -1 se nao encontrar o index
        

        deleteProfissional.profissionais.splice(index, 1) // Remove o profissional 

        await fs.writeFile(arquivo, JSON.stringify(deleteProfissional, null, 2));

        return res.status(200).json({ message: 'Profissional excluído com sucesso!'});
    } catch (error){
        console.log(error.message);
        return res.status(500).send('Erro ao atualizar o profissional');
    }
}

