// amplify-config.js
import Amplify from 'aws-amplify';

Amplify.configure({
  Auth: {
    region: 'us-east-1',
    userPoolId: 'us-east-1_HsvN77ciA',
    userPoolWebClientId: '79svo07u2k8h4oea15mh3krra7',
    authenticationFlowType: 'USER_SRP_AUTH',
  },
});




