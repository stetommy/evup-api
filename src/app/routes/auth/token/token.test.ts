import request from 'supertest';
import { describe, it } from 'mocha';
import { expect } from 'chai';
import jwt from 'jsonwebtoken';
import app from '../../../../app';

describe('Token Refresh API Tests', () => {
  it('POST /refresh - should refresh auth token by refresh token', async () => {
    // Effettua il login e ottieni il refresh token valido
    const loginResponse = await request(app)
      .post('/login') // Assicurati di avere un endpoint per il login nel tuo server
      .send({ username: 'example_username', password: 'example_password' });

    // Estrai il refresh token dalla risposta del login
    const refreshToken = loginResponse.body.refreshToken;

    // Effettua una richiesta per aggiornare il token di autenticazione utilizzando il refresh token
    const response = await request(app)
      .post('/auth/refresh')
      .set('Cookie', [`refresh-token=${refreshToken}`]);

    // Verifica che la risposta abbia lo status code corretto
    expect(response.status).to.equal(200);

    // Verifica che il corpo della risposta contenga success: true
    expect(response.body).to.have.property('success').to.be.true;

    // Continua con altre verifiche se necessario
  });
});
