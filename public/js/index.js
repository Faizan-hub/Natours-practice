import '@babel/polyfill';
import { bookTour } from './stripe';
import { login } from './login';
import { mapDisplay } from './mapbox';
import { logOut } from './login';
import { updateSettings } from './updateSettings';

const mapbox = document.getElementById('map');
const loginform = document.querySelector('.form--login');
const logOutbtn = document.querySelector('.nav__el--logOut');
const update = document.querySelector('.form-user-data');
const userDataSettings = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');

if (mapbox) {
  const locations = JSON.parse(
    document.getElementById('map').dataset.locations
  );
  mapDisplay(locations);
}

if (loginform) {
  loginform.addEventListener('submit', (el) => {
    el.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    //console.log(email, password);
    login(email, password);
  });
}
if (logOutbtn) {
  logOutbtn.addEventListener('click', logOut);
}
if (update) {
  update.addEventListener('submit', (el) => {
    el.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const photo = document.getElementById('photo').files[0];
    const form = new FormData();
    form.append('name', name);
    form.append('email', email);
    form.append('photo', photo);
    updateSettings(form, 'data');
  });
}

if (userDataSettings) {
  userDataSettings.addEventListener('submit', async (el) => {
    el.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating....';
    const currentPassword = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { currentPassword, password, passwordConfirm },
      'password'
    );
    document.querySelector('.btn--save-password').textContent = 'Save Password';
    document.getElementById('password-current').value = ' ';
    document.getElementById('password').value = ' ';
    document.getElementById('password-confirm').value = ' ';
  });
}
if (bookBtn) {
  bookBtn.addEventListener('click', (element) => {
    element.target.textContent = 'Processing.....';
    const { tourId } = element.target.dataset;
    bookTour(tourId);
  });
}
