import request from 'supertest';
import { describe, it } from 'mocha';
import { expect } from 'chai';
import app from '../../../../app';

describe('Authentication API Tests', () => {
  it('POST /email - should authenticate user with email and password', async () => {
    const response = await request(app)
      .post('/auth/email')
      .send({ email: 'test@example.com', password: 'password123' });

    // Verifica che la risposta abbia lo status code corretto
    expect(response.status).to.equal(200);

    // Verifica la struttura della risposta
    expect(response.body).to.have.property('success').to.be.true;
    expect(response.body).to.have.property('lastLogin');
    expect(response.body).to.have.property('firstName');
    expect(response.body).to.have.property('lastName');
    expect(response.body).to.have.property('email');
    expect(response.body).to.have.property('role');
    expect(response.body).to.have.property('isActive');
    expect(response.body).to.have.property('emailVerified');
    expect(response.body).to.have.property('conditionAccepted');
    expect(response.body).to.have.property('plan');
    expect(response.body).to.have.property('dateRenew');
    expect(response.body).to.have.property('changePassword');
    expect(response.body).to.have.property('description');
    expect(response.body).to.have.property('picture');

    // Se necessario, verifica il contenuto specifico della risposta

    // Verifica che i cookie siano stati impostati correttamente
    expect(response.headers['set-cookie']).to.exist;

    // Continua con altre verifiche se necessario
  });

  it('GET /logout - should destroy saved cookie', async () => {
    const response = await request(app).get('/auth/logout');

    // Verifica che la risposta abbia lo status code corretto
    expect(response.status).to.equal(200);

    // Verifica che i cookie siano stati eliminati correttamente
    expect(response.headers['set-cookie']).to.exist;

    // Verifica che il corpo della risposta contenga success: true
    expect(response.body).to.have.property('success').to.be.true;

    // Continua con altre verifiche se necessario
  });
});
