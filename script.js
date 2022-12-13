const postModalTitle = document.getElementById("post-modal");
const postModalBody = document.getElementById("modal-post-body");
const postModalUserName = document.getElementById("modal-user-name");
const postModalUserEmail = document.getElementById("modal-user-email");
const postModalComments = document.getElementById("modal-comments-cont");
const postsContainer = document.getElementById("posts-container");
const loadComments = document.getElementById("load-comments");
const saveUpdateModalBtn = document.getElementById("update-modal-save");

loadComments.addEventListener("click", toggleCommentsVisibility);

function getPosts() {
  fetch("http://localhost:3000/posts")
    .then((response) => response.json())
    .then((posts) => {
      posts.forEach((post) => {
        fetch(`http://localhost:3000/images/${post.id}`)
          .then((response) => response.json())
          .then((image) => {
            let newPost = document.createElement("div");
            newPost.classList.add("card");
            newPost.classList.add("m-4");
            newPost.style.width = "18rem";
            newPost.id = post.id;
            newPost.innerHTML = `
            <img src="${image.download_url}" class="card-img-top" alt="imatge! load="lazy"">
            <div class="card-body">
            <p class="card-text">${post.title}</p>
            </div>
            <button type="button" onclick="getInfo(event)" userId='${post.userId}' postId='${post.id}' class="btn btn-primary view-more-btn" data-bs-toggle="modal" data-bs-target="#exampleModal">
            View More
            </button> 
            <button type="button" postId='${post.id}' onclick="deletePost(event)" class="btn btn-danger">Delete</button>
            <button type="button" onclick="getUpdateModalInfo(event)" postId='${post.id}' class="btn btn-warning view-more-btn" data-bs-toggle="modal" data-bs-target="#updateModal"> 
            Update
            </button> 
            
            `;
            postsContainer.appendChild(newPost);
          });
      });
    });
}

getPosts();

function getInfo(event) {
  let userId = event.target.getAttribute("userId");
  let postId = event.target.getAttribute("postId");

  fetch(`http://localhost:3000/posts/${postId}`)
    .then((response) => response.json())
    .then((data) => {
      postModalTitle.innerText = data.title;
      postModalBody.innerText = data.body;
    });
  fetch(`http://localhost:3000/users/${userId}`)
    .then((response) => response.json())
    .then((data) => {
      postModalUserName.innerText = data.username + " - " + data.name;
      postModalUserEmail.innerText = data.email;
    });
  fetch(`http://localhost:3000/posts/${postId}/comments`)
    .then((response) => response.json())
    .then((data) => {
      data.map(function (comment) {
        postModalComments.innerHTML += ` <p style="font-weight:bold;">${comment.name}</p>
            <p>${comment.body}</p>
            <p>${comment.email}</p>
            <hr style="border: 1px solid black;">
            `;
      });
    });
}

function toggleCommentsVisibility(e) {
  postModalComments.classList.toggle("d-none");
  if (postModalComments.classList.contains("d-none")) {
    loadComments.innerText = "Load Comments";
  } else {
    loadComments.innerText = "Hide Comments";
  }
}

function deletePost(e) {
  let postId = parseInt(e.target.getAttribute("postId"));

  fetch(`http://localhost:3000/posts/${postId}`, {
    method: "DELETE",
  }).then(() => document.getElementById(postId).remove());

  fetch(`http://localhost:3000/images/${postId}`, {
    method: "DELETE",
  });
}

// function updatePost(e) {
//   let postId = parseInt(e.target.getAttribute("postId"));

//   fetch(`http://localhost:3000/posts/${postId}`, {
//   method: 'PUT',
//   body: JSON.stringify({
//     id: postId,
//     title: 'foo',
//     body: 'bar',
//     userId: 1,
//   }),
//   headers: {
//     'Content-type': 'application/json; charset=UTF-8',
//   },
// })
//   .then((response) => response.json())
//   .then((json) => console.log(json));

//   console.log(postId);
// }

function getUpdateModalInfo(event) {
  const postId = event.target.getAttribute("postId");

  saveUpdateModalBtn.setAttribute("postId", postId);
}
