import {CognitoUserPool, CognitoUser, AuthenticationDetails} from "amazon-cognito-identity-js";
import AWSConfig from '../config';



export function signin(email, password, onSuccess, onFailure) {
    var authenticationDetails = new AuthenticationDetails({
        Username: email,
        Password: password
    });

    const poolData = {
        UserPoolId: AWSConfig.UserPoolId,
        ClientId: AWSConfig.ClientId,
    };

    const userPool = new CognitoUserPool(poolData);
    var cognitoUser = new CognitoUser({
        Username: email,
        Pool: userPool
    });

    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: onSuccess,
        onFailure: onFailure,
        newPasswordRequired: function (userAttributes, requiredAttributes) {
            alert("newPasswordRequired");
        }
    });
}


export const getAWSToken = () => {
    return new Promise(function fetchCurrentAuthToken(resolve, reject) {
        const poolData = {
            UserPoolId: AWSConfig.UserPoolId,
            ClientId: AWSConfig.ClientId,
        };

        const userPool = new CognitoUserPool(poolData);
        const cognitoUser = userPool.getCurrentUser();
        if (cognitoUser) {
            cognitoUser.getSession(function sessionCallback(err, session) {
                if (err) {
                    reject(err);
                } else if (!session.isValid()) {
                    resolve(null);
                } else {
                    cognitoUser.getUserAttributes(
                        function (err, result) {
                            if (!err) {
                                // if (!VrcId) {
                                //     VrcId = cognitoUser.getUsername();
                                //     // console.log("VrcId=" + VrcId);
                                // }
                                // for (var i = 0; i < result.length; i++) {
                                //   console.log(result[i].getName() + "=" + result[i].getValue());
                                // }
                                const jwtToken = session.getIdToken().getJwtToken();
                                // console.log("jwtToken=" + jwtToken);
                                resolve(jwtToken);
                            } else {
                                resolve(null);
                            }
                        }
                    );
                }
            });
        } else {
            resolve(null);
        }
    });
};

