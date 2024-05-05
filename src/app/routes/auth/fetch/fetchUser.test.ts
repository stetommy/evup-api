import request from 'supertest';
import UserModel from '../../../models/user/user.model';
import app from '../../../../app';

describe('User API Tests', () => {
  it('GET /user - should fetch user data successfully', async () => {
    // Simula un utente autenticato
    const authenticatedUser = request.agent(app);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const loginResponse = await authenticatedUser
      .post('/login') // Assicurati di avere un endpoint per il login nel tuo server
      .send({ username: 'example_username', password: 'example_password' });

    // Ottieni il token di accesso dal loginResponse, se necessario, per autenticare il test

    // Simula la richiesta GET /user
    const response = await authenticatedUser.get('/user');

    // Verifica che la risposta abbia lo status code corretto
    expect(response.status).toBe(200);

    // Verifica la struttura della risposta
    expect(response.body.success).toBe(true);
    expect(response.body).toHaveProperty('lastLogin');
    expect(response.body).toHaveProperty('firstName');
    expect(response.body).toHaveProperty('lastName');
    expect(response.body).toHaveProperty('email');
    expect(response.body).toHaveProperty('role');
    expect(response.body).toHaveProperty('isActive');
    expect(response.body).toHaveProperty('emailVerified');
    expect(response.body).toHaveProperty('conditionAccepted');
    expect(response.body).toHaveProperty('plan');
    expect(response.body).toHaveProperty('dateRenew');
    expect(response.body).toHaveProperty('changePassword');
    expect(response.body).toHaveProperty('description');
    expect(response.body).toHaveProperty('picture');

    // Se necessario, verifica il contenuto specifico della risposta

    // Verifica che l'utente sia stato trovato nel database
    const user = await UserModel.findOne({ email: 'example@example.com' }); // Sostituisci con un'email esistente nel tuo database
    expect(user).toBeTruthy();

    // Verifica che i dettagli dell'utente corrispondano alla risposta
    expect(response.body.firstName).toEqual(user?.firstName);
    expect(response.body.lastName).toEqual(user?.lastName);
    expect(response.body.email).toEqual(user?.email);
    // Continua con altre verifiche se necessario
  });
});
