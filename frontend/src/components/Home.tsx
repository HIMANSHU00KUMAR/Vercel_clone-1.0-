// import  { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

const Home: React.FC = () => {

  // const navigate = useNavigate();

  const loginWithGitHub = () => {

    console.log("click login....")
    const clientID = 'Ov23liRF2DZxKXgwErs3';
    const redirectURI = 'http://localhost:5173/auth/github/callback';
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientID}&redirect_uri=${redirectURI}`;
  };

 

  return (
    <div className="flex justify-center align-middle my-80">
      <button className="bg-green-500 text-xl rounded-md font-bold p-2 " onClick={loginWithGitHub}>
      Login with GitHub
    </button>
    </div>
    
  );
};

export default Home;
