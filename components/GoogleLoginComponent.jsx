// components/GoogleLoginComponent.js
import { GoogleLogin } from 'react-google-login';

const GoogleLoginComponent = ({ onSuccess, onFailure }) => {
  return (
    <GoogleLogin
      clientId="79020461206-lnaqttalsh5vn8dr70k5neaojve09d2t"
      buttonText="Login with Google"
      onSuccess={onSuccess}
      onFailure={onFailure}
    />
  );
};

export default GoogleLoginComponent;


