// components/GoogleSignInButton.js

function GoogleSignInButton() {
    return (
      <div 
        className="g-signin2" 
        data-onsuccess="onSignIn"
        data-theme="dark" 
        data-width="200" 
        data-height="40"
        data-longtitle="true"
      ></div>
    );
  }
  
  export default GoogleSignInButton;
  