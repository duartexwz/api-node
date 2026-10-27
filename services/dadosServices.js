// Usar o módulo fs para sobrescrever o arquivo json
import fs from 'fs/promises';
import path from 'path';


const arquivo = path.resolve('./dados.json'); // Guarda o caminho do arquivo json

// Função auxiliar para ler dados
async function lerDados(){
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
        res.status(500).send(`Erro ao listar profissionais ${error.menssage}`) // Retorna mensagem de erro 
    }

}

export async function cadastrarProfissionais(req, res){
    try{
        const { nome, profissao } = req.body; // pega os dados do corpo da requisicao

        if (!nome || !profissao){
            return res.status(400).send(`Os campos ${nome} e ${profissao} são obrigatórios no campo.`); // Mesagem de erro caso nome ou profissao nao estejam no body
        }

        // Ler os dados atuais
        const profissionaisJson = await lerDados();

        if(!profissionaisJson.profissionais) profissionaisJson.profissionais = [];

        const novoProfissional = {
            id: profissionaisJson.length + 1, // Adiciona os dados inseridos
            nome: nome,
            profissao: profissao
        };

        const profissionalExiste = profissionaisJson.profissionais.some(p => p.nome.toLowerCase() === nome.toLowerCase()); // Acessa o campo de profissionais dentro do arquivo json
        if (profissionalExiste){
            return res.status(409).send('O profissional já está cadastrado nos sistema.');
        }
        

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
