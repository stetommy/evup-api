import request from 'supertest';
import { describe, it } from 'mocha';
import { expect } from 'chai';
import app from '../../../../app';

describe('Password Management API Tests', () => {
  it('POST /change - should change the password for authorized users', async () => {
    // Effettua l'accesso e ottieni il token JWT
    const loginResponse = await request(app)
      .post('/login') // Assicurati di avere un endpoint per il login nel tuo server
      .send({ email: 'test@example.com', password: 'password123' });

    // Estrai il token JWT dalla risposta del login
    const accessToken = loginResponse.body.accessToken;

    // Effettua una richiesta con il token JWT per cambiare la password
    const response = await request(app)
      .post('/auth/password/change')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ password: 'newpassword123' });

    // Verifica che la risposta abbia lo status code corretto
    expect(response.status).to.equal(200);

    // Verifica che il corpo della risposta contenga un messaggio di successo
    expect(response.body).to.include('SUCCESS');

    // Continua con altre verifiche se necessario
  });

  it('POST /recover - should create a temporary recovery pin to login and change the password', async () => {
    // Effettua una richiesta per il recupero della password
    const response = await request(app)
      .post('/auth/password/recover')
      .send({ email: 'test@example.com' });

    // Verifica che la risposta abbia lo status code corretto
    expect(response.status).to.equal(200);

    // Verifica che il corpo della risposta contenga un messaggio di email inviata
    expect(response.body).to.include('EMAIL_SENT');

    // Continua con altre verifiche se necessario
  });
});
