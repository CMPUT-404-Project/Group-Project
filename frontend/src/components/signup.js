const signup = async (username, password, displayName, host, github, url) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('displayName', displayName);
    formData.append('host', host);
    formData.append('github', github);
    
    formData.append('url', url);
    
  
    const response = await fetch('http://127.0.0.1:8000/authors/signup/', {
      method: 'POST',
      body: formData,
      //credentials: 'include',
    });
  
    const data = await response.json();
    return data;
  };
  
  export default signup;
  