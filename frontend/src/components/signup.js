const signup = async (username, password, github) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('github', github);    

    const response = await fetch('https://distributed-social-net.herokuapp.com/auth/signup/', {

      method: 'POST',
      body: formData,
      //credentials: 'include',
    });
  
    const data = await response.json();
    return data;
  };
  
  export default signup;
  