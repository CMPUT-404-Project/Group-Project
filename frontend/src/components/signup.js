const signup = async (username, password, github) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('github', github);    
  
    const response = await fetch('http://127.0.0.1:8000/service/authors/signup/', {
      method: 'POST',
      body: formData,
      //credentials: 'include',
    });
  
    const data = await response.json();
    return data;
  };
  
  export default signup;
  