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

  // const handleGitHubCallback = async () => {
  //   const urlParams = new URLSearchParams(window.location.search);
  //   const code = urlParams.get('code');

  //   console.log("code === ",code)

  //   if (code) {
  //     try {
  //       const tokenResponse = await axios.post('http://localhost:5000/auth/github/callback', { code });
  //       const { access_token } = tokenResponse.data;
  //       console.log("github callback sae acess token",access_token)
  //       if(localStorage.getItem('github_access_token')===null){
  //         console.log("guss gaya ");
  //         localStorage.setItem('github_access_token', access_token);
  //       }
        
  //       navigate('/repos');
  //     } catch (error) {
  //       console.error('Error fetching access token:', error);
  //     }
  //   }
  // };

  // useEffect(() => {
  //   handleGitHubCallback();
  // },[]);

  return (
    <div className="flex justify-center align-middle my-80">
      <button className="bg-green-500 text-xl rounded-md font-bold p-2 " onClick={loginWithGitHub}>
      Login with GitHub
    </button>
    </div>
    
  );
};

export default Home;
