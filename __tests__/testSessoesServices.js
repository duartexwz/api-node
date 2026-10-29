import request from 'supertest';
import { app } from '../app.js';


describe('Testes de CRUD da API', () => {
    let createSessaoId;
    it('C - Deve criar uma nova sessão', async () => {
        const response = await request(app)
            .post('/api/v1/sessoes/')
            .send({
                nome: "Teste post",
                modalidade: "Saude da mulher",
                data: {
                    "dia": "20/11/2050",
                    "horario": "10:30"
                },
                profissional_id: 1,
                vagas: 10
            });
        console.log(response.body);

        // expect(response.statusCode).toEqual(201);
        expect(response.body).toEqual({
            nome: "Teste post",
                modalidade: "Saude da mulher",
                data: {
                    "dia": "20/11/2050",
                    "horario": "10:30"
                },
                profissional_id: 1,
                vagas: 10
        });

        createSessaoId = response.body;
    });
    it('R - Deve Listar todos os usuarios', async () => {
        const listResponse = await request(app).get('/api/v1/sessoes/buscar');

        expect(listResponse.statusCode).toBe(200);
        expect(Array.isArray(listResponse.body)).toBe(true);

        const filterResponse = await request(app).get(`/api/v1/sessoes/buscar/?nome=Teste post`);
        expect(filterResponse.statusCode).toBe(200);
        expect(filterResponse.body.nome).toBe(Teste);
    });
    it('U - Deve atualizar a sessao', async () => {
        const updateResponse = await request(app)
            .put(`/api/v1/sessoes/atualizar/${createSessaoId.id}`)
            .send({
                nome: 'Teste Atualização'
            });

        expect(updateResponse.statusCode).toBe(200);
        expect(updateResponse.body).toBe('Teste Atualização')
    });
    it('D - Deve deletar a sessao', async () => {
        const deleteSessao = await request(app)
            .delete(`/api/v1/sessoes/delete/${createSessaoId.id}`)
            
            expect(deleteSessao.statusCode).toBe(200);

            const getResponse = await request(app).get(`/api/v1/sessoes/delete/${createSessaoId.id}`);
            expect(getResponse.statusCode).toBe(404);

    })
})