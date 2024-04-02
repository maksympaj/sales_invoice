import axios from 'axios';

export const login = (data) => (dispatch) => {
  return new Promise((resolve, reject) => {
    axios
      .post('/user/login', data)
      .then((response) => {
        // handle success
        const { token, type } = response.data;
        const isAdmin = type === 'admin' ? true : false;
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        dispatch({ type: 'auth/loginSuccess', payload: { token, isAdmin } });
        resolve();
      })
      .catch(function (error) {
        // handle error
        reject(error);
      })
      .then(function () {
        // always executed
      });
  });
};

export const logout = () => (dispatch) => {
  delete axios.defaults.headers.common['Authorization'];
  dispatch({ type: 'auth/logout' });
};
