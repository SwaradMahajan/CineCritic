const url = new URL(location.href);
const movieId = url.searchParams.get("id");
const movieTitle = url.searchParams.get("title");
const APILINK = "https://cinecritic-lpua.onrender.com/api/v1/reviews/";

//generating section
const main = document.getElementById("section");
const title = document.getElementById("title");
title.innerText = movieTitle;
const div_new = document.createElement("div");
div_new.innerHTML = `
    <div class="row">
        <div class="column">
            <div class="review_card">
                <h2 class="new-review-title">Add a Review</h2>
                <p>
                    <label>Review</label>
                    <input type="text" id="new_review" value="">
                </p>
                <p>
                    <label>Reviewer</label>
                    <input type="text" id="new_user" value="">
                </p>
                <p>
                    <a href="#" onclick="saveReview('new_review', 'new_user')">
                    <button class="save-btn">
                         Save Review
                    </button></a>
                </p>

            </div>
        </div>
    </div>
`;
main.appendChild(div_new);

returnReviews(APILINK)
function returnReviews(url){
    fetch(url + 'movie/' + movieId).then(res => res.json())
    .then(function(data){
        console.log(data);
        data.forEach(review =>{
            const div_card = document.createElement('div');
            div_card.innerHTML = `
                <div class="row">
                    <div class="column">
                        <div class="review_card" id="${review._id}">
                            <p class="review-label">
                                <i class="fa-solid fa-file-lines"></i> REVIEW
                            </p>
                            <p class="review-content">${review.review}</p>
                            <p class="review-label">
                                <i class="fa-solid fa-user"></i> REVIEWER
                            </p>            
                            <p class="review-user">${review.user}</p>
                            <p>
                                <a class="action-btn edit-btn"
                                href="#"
                                onclick="editReview('${review._id}','${review.review}','${review.user}')">
                                    <i class="fa-solid fa-pen"></i>
                                </a>

                                <a class="action-btn delete-btn"
                                href="#"
                                onclick="deleteReview('${review._id}')">
                                    <i class="fa-solid fa-trash"></i>
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            `;
            main.appendChild(div_card);
        });
    });
}
function editReview(id, review, user) {

    const element = document.getElementById(id);

    const reviewInputId = "review" + id;
    const userInputId = "user" + id;

    element.innerHTML = `
        <h2 class="new-review-title">Edit Review</h2>

        <label>Review</label>
        <input type="text"
            id="${reviewInputId}"
            value="${review}">

        <label>Reviewer</label>
        <input type="text"
            id="${userInputId}"
            value="${user}">

        <button class="save-btn"
                onclick="saveReview('${reviewInputId}', '${userInputId}', '${id}')">
            Save Changes
        </button>
    `;
}
function saveReview(reviewInputId, userInputId, id='') {

    const review = document.getElementById(reviewInputId).value;
    const user = document.getElementById(userInputId).value;

    if(id){
        fetch(APILINK + id, {
            method: "PUT",
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user: user,
                review: review
            })
        })
        .then(res => res.json())
        .then(res => {
            console.log(res);
            location.reload();
        });
    }
    else {
        fetch(APILINK + "new", {
            method: "POST",
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user: user,
                review: review,
                movieId: movieId
            })
        })
        .then(res => res.json())
        .then(res => {
            console.log(res);
            location.reload();
        });
    }
}
function deleteReview(id) {

    fetch(APILINK + id, {
        method: "DELETE",
        headers: {
            "Accept": "application/json, text/plain, */*",
            "Content-Type": "application/json"
        }
    })
    .then(res => res.json())
    .then(res => {
        console.log(res);
        location.reload();
    });

}