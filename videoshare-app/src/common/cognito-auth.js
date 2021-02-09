import {CognitoUserPool, CognitoUser, AuthenticationDetails} from "amazon-cognito-identity-js";
import AWSConfig from '../config';

function createCognitoUser(email) {
    const poolData = {
        UserPoolId: AWSConfig.UserPoolId,
        ClientId: AWSConfig.ClientId,
    };

    const userPool = new CognitoUserPool(poolData);

    return new CognitoUser({
        Username: email,
        Pool: userPool
    });
}


export function signin(email, password, onSuccess, onFailure) {
    var authenticationDetails = new AuthenticationDetails({
        Username: email,
        Password: password
    });

    var cognitoUser = createCognitoUser(email);
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: onSuccess,
        onFailure: onFailure,
        newPasswordRequired: function (userAttributes, requiredAttributes) {
            alert("newPasswordRequired");
        }
    });
}