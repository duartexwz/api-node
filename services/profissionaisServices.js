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

export async function listarProfissionais(req, res){
    try{
        const profissionaisJson = await lerDados(); // chama o a função de leitura;

        return res.status(200).json(profissionaisJson.profissionais) // Retorna o status da requisicao
    } catch(error){
        res.status(500).send(`Erro ao listar profissionais ${error.message}`) // Retorna mensagem de erro 
    }
}

export async function cadastrarProfissionais(req, res, id){
    try{
        const { nome, profissao } = req.body; // pega os dados do corpo da requisicao


        if (!nome || !profissao){
            return res.status(400).send(`Os campos nome e profissao são obrigatórios no campo.`); // Mesagem de erro caso nome ou profissao nao estejam no body
        }

        // Ler os dados atuais
        const profissionaisJson = await lerDados();

        if(!profissionaisJson.profissionais) profissionaisJson.profissionais = [];

        
        const profissionalExiste = profissionaisJson.profissionais.some(p => p.id !== parseInt(id) && p.nome.trim().toLowerCase() === nome.trim().toLowerCase()); // Acessa o campo de profissionais dentro do arquivo json
        if (profissionalExiste){
            return res.status(409).send('O profissional já está cadastrado nos sistema.');
        }
        
        const ultimoId = profissionaisJson.profissionais.length > 0
        ? profissionaisJson.profissionais[profissionaisJson.profissionais.length - 1].id
        : 0;
        
        const novoProfissional = {
            id: ultimoId + 1, // Adiciona os dados inseridos
            nome: nome.trim(),
            profissao: profissao.trim()
        };
        // Adiciona o array na memoria
        profissionaisJson.profissionais.push(novoProfissional);
        
        const dadosAtualizados = JSON.stringify(profissionaisJson, null, 2); // Adicionam os dados com identacao
        await fs.writeFile(arquivo, dadosAtualizados, 'utf-8'); // Sobrescreve o arquivo

        return res.status(201).json({ 
            mensagem: "Profissional cadastrado com sucesso!",  // Retorna sucesso para que a api possa responder
            dados: novoProfissional 
        });    
    } catch (error){
        return res.status(500).send(`Erro ao cadastrar profissional: ${error.message}`,); // Mensagem de erro
    }
}


export async function atualizarProfissionais(req, res){
    const profissionaisJson = await lerDados();
    try{
        const { id }= req.params;
        const { nome } = req.body;
        const { profissao } = req.body;
        const index = profissionaisJson.profissionais.findIndex(p  => p.id === parseInt (id));

        if (index === -1){
            return res.status(404).send('Profissional não encontrado');
        }// Retonrna -1 se nao encontrar o index
        

        const nomeFinal = nome !== undefined ? nome.trim() : profissionaisJson.profissionais[index].nome;
        const profissaoFinal = profissao !== undefined ? profissao.trim() : profissionaisJson.profissionais[index].profissao;
        
        if (!nomeFinal || !profissaoFinal) {
            return res.status(400).send(`Os campos nome e profissao são obrigatórios no corpo da requisição.`);
        }
        
        const profissionalExiste = profissionaisJson.profissionais.some(p => p.id !== parseInt(id) && p.nome.trim().toLowerCase() === nomeFinal.toLowerCase()); // Verifica se existe outro profissional com o nome cadastrado
    
        if (profissionalExiste){
            return res.status(400).send('Ja existe um profissional com esse nome.');
        }
        profissionaisJson.profissionais[index].nome = nomeFinal;
        profissionaisJson.profissionais[index].profissao = profissaoFinal;

        await fs.writeFile(arquivo, JSON.stringify(profissionaisJson), null, 2);

        return res.status(200).json({
            message: 'Profissional atualizado com sucesso',
            dados: profissionaisJson.profissionais[index]
        });
        
    } catch (error){
            return res.status(500).send(`Erro ao conectar com a api erro: ${error.message}`);
        }
} 

export async function deleteProfissionais(req, res){
    try{
        const profissionaisJson = await lerDados();

        if (!profissionaisJson){
            return res.status(404).send(`Erro ao encontrar o arquivo ${profissionaisJson}`);
        }
        const { id } = req.params;

        const index = profissionaisJson.profissionais.findIndex(profissionais => profissionais.id === parseInt(id));
        profissionaisJson.profissionais.splice(index, 1) // Remove o profissional 

        await fs.writeFile(arquivo, JSON.stringify(profissionaisJson, null, 2));

        return res.status(200).json({ message: 'Profissional excluído com sucesso!'});
    } catch (error){
        res.status(500).send(`Erro ao conectar com a api: ${error.message}`);
    }
}

