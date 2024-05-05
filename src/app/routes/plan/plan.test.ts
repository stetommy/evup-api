import request from 'supertest';
import express from 'express';
import { describe, it } from 'mocha';
import { expect } from 'chai';
import app from '../../../../app';

describe('Plan Management API Tests', () => {
  it('POST /create - should create a new plan', async () => {
    // Effettua il login e ottieni il token JWT valido per l'utente admin
    const adminLoginResponse = await request(app)
      .post('/login') // Assicurati di avere un endpoint per il login nel tuo server
      .send({ username: 'admin@example.com', password: 'admin_password' });

    // Estrai il token JWT dalla risposta del login
    const adminAccessToken = adminLoginResponse.body.accessToken;

    // Effettua una richiesta per creare un nuovo piano
    const response = await request(app)
      .post('/plan/create')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send({
        name: 'Test Plan',
        description: 'This is a test plan',
        price: 10.99,
        billingRenew: 'monthly',
        includedItems: ['Item 1', 'Item 2'],
      });

    // Verifica che la risposta abbia lo status code corretto
    expect(response.status).to.equal(201);

    // Verifica che il corpo della risposta contenga success: true
    expect(response.body).to.have.property('success').to.be.true;

    // Continua con altre verifiche se necessario
  });

  it('GET /read - should return all plans', async () => {
    // Effettua una richiesta per ottenere tutti i piani
    const response = await request(app)
      .get('/plan/read')
      .set('Authorization', `Bearer ${adminAccessToken}`); // Assicurati che adminAccessToken sia definito

    // Verifica che la risposta abbia lo status code corretto
    expect(response.status).to.equal(200);

    // Verifica che il corpo della risposta sia un array di piani
    expect(response.body).to.be.an('array');

    // Continua con altre verifiche se necessario
  });

  it('DELETE /remove/:planSlug - should remove a plan', async () => {
    // Effettua una richiesta per rimuovere un piano
    const response = await request(app)
      .delete('/plan/remove/test-plan')
      .set('Authorization', `Bearer ${adminAccessToken}`); // Assicurati che adminAccessToken sia definito

    // Verifica che la risposta abbia lo status code corretto
    expect(response.status).to.equal(200);

    // Verifica che il corpo della risposta contenga success: true
    expect(response.body).to.have.property('success').to.be.true;

    // Continua con altre verifiche se necessario
  });

  it('POST /buy/:userEmail/:planSlug - should buy a plan', async () => {
    // Effettua il login e ottieni il token JWT valido per l'utente
    const userLoginResponse = await request(app)
      .post('/login') // Assicurati di avere un endpoint per il login nel tuo server
      .send({ username: 'user@example.com', password: 'user_password' });

    // Estrai il token JWT dalla risposta del login
    const userAccessToken = userLoginResponse.body.accessToken;

    // Effettua una richiesta per acquistare un piano
    const response = await request(app)
      .post('/plan/buy/user@example.com/test-plan')
      .set('Authorization', `Bearer ${userAccessToken}`);

    // Verifica che la risposta abbia lo status code corretto
    expect(response.status).to.equal(200);

    // Verifica che il corpo della risposta contenga success: true
    expect(response.body).to.have.property('success').to.be.true;

    // Continua con altre verifiche se necessario
  });

  it('GET /stripe/success/:userEmail - should handle stripe success', async () => {
    // Effettua il login e ottieni il token JWT valido per l'utente
    const userLoginResponse = await request(app)
      .post('/login') // Assicurati di avere un endpoint per il login nel tuo server
      .send({ username: 'user@example.com', password: 'user_password' });

    // Estrai il token JWT dalla risposta del login
    const userAccessToken = userLoginResponse.body.accessToken;

    // Effettua una richiesta per gestire il successo di stripe
    const response = await request(app)
      .get('/plan/stripe/success/user@example.com')
      .set('Authorization', `Bearer ${userAccessToken}`);

    // Verifica che la risposta abbia lo status code corretto
    expect(response.status).to.equal(200);

    // Continua con altre verifiche se necessario
  });
});
