const APILINK = 'http://127.0.0.1:5000/api/reviews';
const url = new URL(location.href);
const movieId = url.searchParams.get("id");
const movieTitle = url.searchParams.get("title");

class ReviewApp {
  constructor(apiLink, movieId, movieTitle) {
    this.apiLink = apiLink;
    this.movieId = movieId;
    this.movieTitle = movieTitle;

    this.main = document.getElementById("section");
    this.titleElement = document.getElementById("title");
    this.titleElement.innerText = this.movieTitle;

    this.init();
  }

  init() {
    this.createReviewForm();
    this.returnReviews();
  }

  createReviewForm() {
    const div_new = document.createElement('div');
    div_new.innerHTML = `
            <div class="row">
                <div class="column">
                    <div class="card">
                        New Review
                        <p><strong>Review: </strong>
                            <input type="text" id="new_review" value="">
                        </p>
                        <p><strong>User: </strong>
                            <input type="text" id="new_user" value="">
                        </p>
                        <p><a href="#" onclick="reviewApp.saveReview('new_review', 'new_user')">  <i class="fas fa-save"></i></a></p>
                    </div>
                </div>
            </div>
        `;
    this.main.appendChild(div_new);
  }

  returnReviews() {
    fetch(`${this.apiLink}/${this.movieId}`)
      .then(res => res.json())
      .then(data => {
        data.forEach(review => {
          this.renderReview(review);
        });
      });
  }

  renderReview(review) {
    const div_card = document.createElement('div');
    div_card.innerHTML = `
            <div class="row">
                <div class="column">
                    <div class="card" id="${review._id}">
                        <p><strong>Review: </strong>${review.text}</p>
                        <p><strong>User: </strong>${review.name}</p>
                        <p>
                            <a href="#" onclick="reviewApp.editReview('${review._id}', '${review.text}', '${review.name}')">   <i class="fas fa-edit"></i></a> 
                            <a href="#" onclick="reviewApp.deleteReview('${review._id}')"> <i class="fas fa-trash-alt"></i></a>
                        </p>
                    </div>
                </div>
            </div>
        `;
    this.main.appendChild(div_card);
  }

  editReview(id, reviewText, userName) {
    const element = document.getElementById(id);
    const reviewInputId = "review" + id;
    const userInputId = "user" + id;

    element.innerHTML = `
            <p><strong>Review: </strong>
                <input type="text" id="${reviewInputId}" value="${reviewText}">
            </p>
            <p><strong>User: </strong>
                <input type="text" id="${userInputId}" value="${userName}">
            </p>
            <p><a href="#" onclick="reviewApp.saveReview('${reviewInputId}', '${userInputId}', '${id}')">  <i class="fas fa-save"></i></a></p>
        `;
  }

  saveReview(reviewInputId, userInputId, id = "") {
    const review = document.getElementById(reviewInputId).value;
    const user = document.getElementById(userInputId).value;


    if (id) {


      fetch(`${this.apiLink}/${id}`, {
        method: 'PUT',

        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "name": user, "email": "7767@gmail.com", "book_id": this.movieId, "text": review })
      }).then(res => res.json())
        .then(res => {
          console.log(res)
          location.reload();
        });






    } else {

      fetch(`${this.apiLink}/add`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "name": user, "email": "7767@gmail.com", "book_id": this.movieId, "text": review })
      })
        .then(res => res.json())
        .then(res => {
          console.log(res);
          location.reload();
        });
    }
  }

  deleteReview(id) {
    alert(1);
    fetch(`${this.apiLink}/${id}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(res => {
        console.log(res);
        location.reload();
      });
  }
}

// Instantiate the ReviewApp class
const reviewApp = new ReviewApp(APILINK, movieId, movieTitle);
