import request from 'supertest';
import { describe, it } from 'mocha';
import { expect } from 'chai';
import app from '../../../../app';

describe('User Description Update API Tests', () => {
  it('POST /description - should update the user description', async () => {
    // Effettua il login e ottieni il token JWT valido
    const loginResponse = await request(app)
      .post('/login') // Assicurati di avere un endpoint per il login nel tuo server
      .send({ username: 'example_username', password: 'example_password' });

    // Estrai il token JWT dalla risposta del login
    const accessToken = loginResponse.body.accessToken;

    // Effettua una richiesta per aggiornare la descrizione dell'utente utilizzando il token JWT
    const response = await request(app)
      .post('/user/description')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ description: 'New user description' });

    // Verifica che la risposta abbia lo status code corretto
    expect(response.status).to.equal(200);

    // Verifica che il corpo della risposta contenga success: true
    expect(response.body).to.have.property('success').to.be.true;

    // Continua con altre verifiche se necessario
  });

  it('POST /description - should return an error if no description is provided', async () => {
    // Effettua il login e ottieni il token JWT valido
    const loginResponse = await request(app)
      .post('/login') // Assicurati di avere un endpoint per il login nel tuo server
      .send({ username: 'example_username', password: 'example_password' });

    // Estrai il token JWT dalla risposta del login
    const accessToken = loginResponse.body.accessToken;

    // Effettua una richiesta per aggiornare la descrizione dell'utente senza fornire una descrizione
    const response = await request(app)
      .post('/user/description')
      .set('Authorization', `Bearer ${accessToken}`);

    // Verifica che la risposta abbia lo status code corretto
    expect(response.status).to.equal(400);

    // Verifica che il corpo della risposta contenga un messaggio di errore
    expect(response.body).to.have.property('success').to.be.false;
    expect(response.body).to.have.property('error').to.equal('No description provided');

    // Continua con altre verifiche se necessario
  });
});
