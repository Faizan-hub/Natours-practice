import axios from 'axios';
import { showAlert } from './alert';
export const login = async (email, password) => {
  try {
    const response = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email,
        password,
      },
    });

    if (response.data.status === 'success') {
      showAlert('success', 'Logged In Successfully');
      //console.log('Hello');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
    console.log(response);
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};

export const logOut = async () => {
  try {
    const response = await axios({
      method: 'GET',
      url: '/api/v1/users/logOut',
    });
    if (response.data.status === 'success') {
      location.reload(true);
    }
  } catch (error) {
    //console.log(error);
    showAlert('error', 'Error! Logging Out! Try Again!');
  }
};
