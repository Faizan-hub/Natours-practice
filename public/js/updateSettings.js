import axios from 'axios';
import { showAlert } from './alert';
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? 'http://127.0.0.1:7676/api/v1/users/updatePassword'
        : 'http://127.0.0.1:7676/api/v1/users/updateCurrent';
    //console.log(url);
    const response = await axios({
      method: 'PATCH',
      url,
      data,
    });
    if (response.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully`);
    }
    return url;
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};
