const APILINK = 'http://127.0.0.1:5000/api/books';
const SEARCHAPI = "https://api.themoviedb.org/3/search/movie?&api_key=41ee980e4b5f05f6693fda00eb7c4fd4&query=";

class SessionManager {
    static setItem(key, value) {
        sessionStorage.setItem(key, JSON.stringify(value));
    }

    static getItem(key) {
        const value = sessionStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    }

    static removeItem(key) {
        sessionStorage.removeItem(key);
    }

    static clear() {
        sessionStorage.clear();
    }

    static isLoggedIn() {
      return this.getItem('username') !== null; // Check if username is set
  }
}

class ModalHandler {
    constructor(modalId) {
        this.modal = document.getElementById(modalId);
        window.onclick = (event) => {
            if (event.target === this.modal) {
                this.hide();
            }
        };
    }

    show() {
        this.modal.style.display = "block";
    }

    hide() {
        this.modal.style.display = "none";
    }
}

class AuthManager {
    constructor(loginUrl) {
        this.loginUrl = loginUrl;
    }

    async login(email, password) {
        const response = await fetch(this.loginUrl, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            SessionManager.setItem('username', data.username);
            this.showReviewLinks();
            return data;
        }
        throw new Error('Login failed');
    }

    showReviewLinks() {
      const reviewLinks = document.querySelectorAll('a[href*="book.html"]');
      reviewLinks.forEach(link => {
          link.classList.remove('hidden');
          link.classList.add('visible'); // Optional if you want to add a visible class
      });
  }
}

class MovieFetcher {
  constructor(apiLink) {
      this.apiLink = apiLink;
  }

  async fetchMovies(url) {
      const response = await fetch(url);
      return response.json();
  }

  renderMovies(data) {
      const main = document.getElementById("main");
      main.innerHTML = ''; // Clear previous movies

      data.forEach(element => {
          const div_card = document.createElement('div');
          div_card.setAttribute('class', 'card');

          const div_row = document.createElement('div');
          div_row.setAttribute('class', 'row');

          const div_column = document.createElement('div');
          div_column.setAttribute('class', 'column');

          const image = document.createElement('img');
          image.setAttribute('class', 'thumbnail');
          image.setAttribute('id', 'image');

          const title = document.createElement('h3');
          title.setAttribute('id', 'title');

          const center = document.createElement('center');

          if (SessionManager.isLoggedIn()) {
            // User is logged in, show the reviews link
            title.innerHTML = `${element.title}<br><a href="book.html?id=${element._id}&title=${element.title}">reviews</a>`;
        } else {
            // User is not logged in, hide the reviews link
            title.innerHTML = `${element.title}<br><a class="hidden" href="book.html?id=${element._id}&title=${element.title}">reviews</a>`;
        }
          // Set image source
          image.src = element.poster_path;

          center.appendChild(image);
          div_card.appendChild(center);
          div_card.appendChild(title);
          div_column.appendChild(div_card);
          div_row.appendChild(div_column);

          main.appendChild(div_row);  // Assuming there's a 'main' element in your HTML
      });

      // Attach event listener only once
      const loginLink = document.getElementById('loginLink');
      if (loginLink) {
          loginLink.onclick = (e) => {
              e.preventDefault();
              this.showLoginModal();
          };
      }
  }

  showLoginModal() {
      const modalHandler = new ModalHandler('loginModal');
      modalHandler.show();
  }
}

class App {
  constructor() {
      this.authManager = new AuthManager('http://127.0.0.1:5000/api/users/login');
      this.movieFetcher = new MovieFetcher(APILINK);
      this.modalHandler = new ModalHandler('loginModal');

      this.init();
  }

  init() {
      this.setupEventListeners();
      this.checkAuthStatus();
      this.returnMovies(APILINK);
  }

  setupEventListeners() {
      document.getElementById('submitBtn').onclick = async (event) => {
          event.preventDefault();
          const email = document.getElementById('username').value;
          const password = document.getElementById('password').value;

          try {
              const data = await this.authManager.login(email, password);
              this.modalHandler.hide();
              this.updateUI(data.username);
          } catch (error) {
              console.error('Error occurred:', error);
              alert('An error occurred: ' + error.message);
          }
      };

      document.getElementById('form').addEventListener("submit", async (e) => {
          e.preventDefault();
          const searchItem = document.getElementById("query").value;
          if (searchItem) {
              const movies = await this.movieFetcher.fetchMovies(SEARCHAPI + searchItem);
              this.movieFetcher.renderMovies(movies);
          }
      });
  }

  checkAuthStatus() {
      const username = SessionManager.getItem('username');
      const authButton = document.getElementById('auth-button');
      authButton.textContent = username ? 'Logout' : 'Login';

      authButton.onclick = () => {
          if (username) {
              this.logout();
          } else {
              this.modalHandler.show();
          }
      };
  }

  updateUI(username) {
      const usernameDisplay = document.getElementById('user-name');
      usernameDisplay.textContent = `Welcome, ${username}`;
      this.checkAuthStatus();
  }

  logout() {
      SessionManager.removeItem('username');
      this.updateUI('Guest');
      this.hideReviewLinks(); // Hide review links on logout
  }

  async returnMovies(url) {
      const data = await this.movieFetcher.fetchMovies(url);
      this.movieFetcher.renderMovies(data);
  }

  hideReviewLinks() {
    const reviewLinks = document.querySelectorAll('a[href*="book.html"]');
    reviewLinks.forEach(link => {
        link.classList.add('hidden'); // Add hidden class to all review links
        link.classList.remove('visible'); // Optional: Remove visible class if you're using it
    });
}

}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  new App();
});



