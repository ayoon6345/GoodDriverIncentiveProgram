import Amplify from 'aws-amplify';

Amplify.configure({
  Auth: {
    region: 'us-east-1', // Your AWS region
    userPoolId: 'us-east-1_HsvN77ciA', // Your User Pool ID
    userPoolWebClientId: '79svo07u2k8h4oea15mh3krra7', // Your App Client ID
  }
});
