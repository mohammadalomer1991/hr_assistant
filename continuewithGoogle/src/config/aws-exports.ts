// src/config/aws-exports.ts

const awsconfig = {
    Auth: {
      Cognito: {
        userPoolId: 'ap-northeast-1_FFd7WlEqM', // Replace with your User Pool ID
        userPoolClientId: '6n181cttnt8g2f3fppdphk5m15', // Replace with your App Client ID
        loginWith: {
          oauth: {
            domain: 'ap-northeast-1ffd7wleqm.auth.ap-northeast-1.amazoncognito.com', // Your Cognito domain
            scopes: ['openid', 'email', 'profile'],
            redirectSignIn: ['http://localhost:5173/'],
            redirectSignOut: ['http://localhost:5173/'],
            responseType: 'code' as const,
          }
        }
      }
    }
  };
  
  export default awsconfig;