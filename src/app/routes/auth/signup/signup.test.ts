import request from 'supertest';
import { describe, it } from 'mocha';
import { expect } from 'chai';
import app from '../../../../app';

describe('User Registration API Tests', () => {
  it('POST /email - should create a new user and send verification email', async () => {
    // Effettua una richiesta per la creazione di un nuovo utente
    const response = await request(app)
      .post('/auth/register/email')
      .send({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'password123',
      });

    // Verifica che la risposta abbia lo status code corretto
    expect(response.status).to.equal(201);

    // Verifica che il corpo della risposta contenga un messaggio di successo
    expect(response.body).to.have.property('success').to.be.true;

    // Continua con altre verifiche se necessario
  });

  it('GET /verification/:email - should verify the email address of a new user', async () => {
    // Simula l'invio di un'email di verifica all'utente
    // (questo può essere fatto manualmente o tramite un endpoint di test separato)

    // Effettua una richiesta per verificare l'indirizzo email dell'utente
    const response = await request(app).get('/auth/register/verification/test@example.com');

    // Verifica che la risposta abbia lo status code corretto
    expect(response.status).to.equal(200);

    // Verifica che il corpo della risposta contenga un messaggio di successo
    expect(response.text).to.include('Verification Successful');

    // Continua con altre verifiche se necessario
  });
});
