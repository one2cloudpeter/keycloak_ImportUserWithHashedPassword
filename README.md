# keycloak lab [import user with bcrypt hashed password]
Since Auth0 is hash the password with bcrypt (https://auth0.com/docs/authenticate/database-connections#:~:text=Passwords%20are%20never%20stored%20or%20logged%20in%20plain%20text%20but%20are%20hashed%20with%C2%A0bcrypt) this lab is try to emulate import user with hashed password user into keycloak.

## provision a default keycloak 15.0.2 in docker compose
run 15.0.2 keycloak in docker compose (ref:https://github.com/bitnami/bitnami-docker-keycloak/tree/15.0.2-debian-10-r106)
```
cd ./keycloak_ImportUserWithHashedPassword

docker-compose up
```

## install bcrypt to keycloak
remote access to the keycloak container
```
#check the keycloak home directory variable exist or not
KEYCLOAK_HOME=/opt/bitnami/keycloak
echo $KEYCLOAK_HOME

# you may choose between this version 1.5.1, 1.5.0, 1.4.0, 1.3.0, 1.2.0, 1.1.0, 1.0.0
KEYCLOAK_BCRYPT_VERSION=1.5.0

curl -L https://github.com/leroyguillaume/keycloak-bcrypt/releases/download/${KEYCLOAK_BCRYPT_VERSION}/keycloak-bcrypt-${KEYCLOAK_BCRYPT_VERSION}.jar > ${KEYCLOAK_HOME}/standalone/deployments/keycloak-bcrypt-${KEYCLOAK_BCRYPT_VERSION}.jar
```

then restart the keycloak  (ref:https://github.com/bitnami/bitnami-docker-keycloak/blob/15.0.2-debian-10-r106/15/debian-10/Dockerfile#:~:text=/opt/bitnami/scripts/keycloak/run.sh)
```
/opt/bitnami/scripts/keycloak/run.sh
```

open browser and type, access admin console, username and password are the same as "admin"
```
localhost:80
```

To verify the bcrypt is installed. login the keycloak. go to Authenitcation tab, then go to password policy tab, add Hashing algorthim, change the algorithmn to bcrypt and save, if it allow you to save, that mean you have successfully install the keycloak bcrypt provider.


Before install the bcrypt keycloak provider the hashing algorith bcrypt not work
![](https://i.imgur.com/Wyt04CR.png)

After install the bcrypt keycloak provider
![](https://i.imgur.com/pnfwc9R.png)

## test import users with bcrypt hashed password
follow this video to create a hexadefence realm, create a client and user, and assign role permission to the user.
https://youtu.be/nkvBy4wefbs?t=49


use keycloak-admin-client to import user
https://github.com/keycloak/keycloak-nodejs-admin-client
```
npm install @keycloak/keycloak-admin-client

npm start
```

You may now try to login the newly created user in http://localhost/auth/realms/hexadefence/account/#/ (e.g. username: user1, password: $ecure2KT)



## DEBUG

if show error code: 'ERR_UNHANDLED_REJECTION', which could mean one of the following: the user already created, email already exist,user inpersonate in adminclient don't have enought permission and the keycloak admin operation not able to perform.

By try to login to the newly created user, please go to the proper realm, for hexadefence realm login would be page http://localhost/auth/realms/hexadefence/account/#/

When sometime, after docker-compose down, when you try to docker-compose up it might have some error, try remove all the volume and docker up again.


## TODO
follow this guide to push the keycloak image with installed bcrypt provider https://github.com/leroyguillaume/keycloak-bcrypt
```
docker build . 
```
