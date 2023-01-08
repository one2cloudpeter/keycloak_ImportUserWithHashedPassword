import KcAdminClient from '@keycloak/keycloak-admin-client'
import database from './database.json' assert { type: 'json' };

// Reference: https://dev.to/carnewal/import-existing-users-with-bcrypt-hashed-passwords-in-keycloak-17oo
const adminClient = new KcAdminClient({
    baseUrl: 'http://localhost:80/auth',
    realmName: 'hexadefence'
})

  let startMigration = async ({ database }) => {
    await adminClient.auth({
        username: 'hexa',
        password: '$ecure2KT',
        grantType: 'password',
        clientId: 'nodejs-admin-client'
    })

    for (let existingUser of database) {
        const user = {
          realm: "hexadefence",
          credentials: [
            {
              algorithm: 'bcrypt',
              hashedSaltedValue: existingUser.password, // the bcrypt-hashed password
              hashIterations: 0,
              type: 'password',
            },
          ],
          email: existingUser.email,
          username: existingUser.username,
          emailVerified: false,
          enabled: true,
        };
        await adminClient.users.create(user);

        console.log(user)
      }
  }
  
    startMigration({ database });
