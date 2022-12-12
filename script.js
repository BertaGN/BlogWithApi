let postModalTitle = document.getElementById("post-modal")
let postModalBody = document.getElementById("modal-post-body")
let postModalUserName = document.getElementById("modal-user-name")
let postModalUserEmail = document.getElementById("modal-user-email")
let postModalComments = document.getElementById("modal-comments-cont")
const postsContainer = document.getElementById("posts-container");
const loadComments = document.getElementById("load-comments");
loadComments.addEventListener("click", toggleCommentsVisibility);

function getPosts() {
  fetch("http://localhost:3000/posts")
    .then((response) => response.json())
    .then((posts) => {
      posts.forEach((post, index) => {
        fetch(`http://localhost:3000/images/${index}`)
        .then((response) => response.json())
        .then((image) => {
            let newPost = document.createElement("div");
            newPost.classList.add("card");
            newPost.classList.add("m-4");
            newPost.style.width = "18rem";
            newPost.innerHTML = `
            <img src="${image.download_url}" class="card-img-top" alt="imatge!">
            <div class="card-body">
            <p class="card-text">${post.title}</p>
            </div>
            <button type="button" onclick="getInfo(event)" userId='${post.userId}' postId='${post.id}' class="btn btn-primary view-more-btn" data-bs-toggle="modal" data-bs-target="#exampleModal">
            View More
            </button> 
            `;
            postsContainer.appendChild(newPost);
          });
      });
    });
}

getPosts();

function getInfo(event) {
    
    let userId = event.target.getAttribute("userId")
    let postId = event.target.getAttribute("postId")

    fetch(`http://localhost:3000/posts/${postId}`)
    .then((response) => response.json())
    .then((data) => {
        postModalTitle.innerText = data.title
        postModalBody.innerText = data.body
    })
    fetch(`http://localhost:3000/users/${userId}`)
    .then((response) => response.json())
    .then((data) => {
        postModalUserName.innerText = data.username +" - "+ data.name
        postModalUserEmail.innerText = data.email
    })
    fetch(`http://localhost:3000/posts/${postId}/comments`)
    .then((response) => response.json())
    .then((data) => {
        data.map(function(comment){
            postModalComments.innerHTML += ` <p>${comment.name}</p>
            <p>${comment.body}</p>
            <p>${comment.email}</p>
            `;
        }) 
    })
 
}
function toggleCommentsVisibility(e){
    postModalComments.classList.toggle("d-none")
    if (postModalComments.classList.contains("d-none")){
        loadComments.innerText = "Load Comments"
    }else {
        loadComments.innerText = "Hide Comments"
    }
    
}
 