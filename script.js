const playMusicModal = document.getElementById("playMusicModal");
const playMusicBtn = document.getElementById("play-music-btn");
const song = document.getElementById("song");
const viewMoreModal = document.getElementById("viewMoreModal");
const postModalTitle = document.getElementById("post-modal");
const postModalBody = document.getElementById("modal-post-body");
const postModalUserName = document.getElementById("modal-user-name");
const postModalUserEmail = document.getElementById("modal-user-email");
const postModalComments = document.getElementById("modal-comments-cont");
const postsContainer = document.getElementById("posts-container");
const loadComments = document.getElementById("load-comments");
const saveUpdateModalBtn = document.getElementById("update-modal-save");
const updateModalTitle = document.getElementById("update-modal-title");
const updateModalText = document.getElementById("update-modal-text");
const confirmDeleteModal = document.getElementById("areYouSure");
const confirmDeleteModalBtn = document.getElementById("confirm-delete-btn");
const switchModeBtn = document.getElementById("dark-mode-btn");
const navbar = document.getElementById("navbar");
const userImg = document.getElementById("user-img");

let userId;
let userImages = [];

playMusicBtn.addEventListener("click", playMusic);
switchModeBtn.addEventListener("click", darkMode);

document.addEventListener("load", getPosts());
loadComments.addEventListener("click", toggleCommentsVisibility);
saveUpdateModalBtn.addEventListener("click", updatePost);

viewMoreModal.addEventListener("hidden.bs.modal", function () {
  postModalComments.innerHTML = "";
  postModalComments.classList.add("d-none");
  loadComments.innerText = "Load Comments";
});

confirmDeleteModalBtn.addEventListener("click", deletePostFromConfirmation);
/*addEventListener("click", darkMode)*/

function darkMode(e) {
  if (e.target.classList.contains("night")) {
    e.target.src = "assets/img/night-mode.png";
    e.target.classList.remove("night");
  } else {
    e.target.src = "assets/img/light-mode.png";
    e.target.classList.add("night");
  }

  let cards = document.getElementsByClassName("card-body");
  document.body.classList.toggle("dark-mode");
  navbar.classList.toggle("dark-mode-nav");
  for (let card of cards) {
    card.classList.toggle("dark-mode-card");
  }
}

function playMusic() {
  song.volume = 0.2;
  song.play();
}

function getPosts() {
  fetch("https://randomuser.me/api/?results=10")
    .then((res) => {
      return res.json();
    })
    .then((users) => {
      users.results.forEach((user) => {
        userImages.push(user.picture.medium);
      });
    })
    .catch((err) => {
      console.log(err);
    });

  fetch("http://localhost:3000/posts")
    .then((response) => response.json())
    .then((posts) => {
      posts.forEach((post) => {
        fetch(`http://localhost:3000/images/${post.id}`)
          .then((response) => response.json())
          .then((image) => {
            let newPost = document.createElement("article");
            newPost.classList.add("card");
            newPost.classList.add("m-4");
            newPost.classList.add("border-0");
            //intersection effect
            newPost.classList.add("opacity-0");
            newPost.style.transform = "scale(0.85)";
            newPost.style.transitionDuration = "1s";
            //intersection effect
            newPost.style.width = "23rem";
            newPost.id = post.id;
            newPost.innerHTML = `
            <img src="${image.download_url}" class="card-img-top" style="width: 100%; height: 500px; object-fit: cover;" alt="image" load="lazy">
            <div class="card-body">
              <p class="card-text" id="main-post-title-${post.id}">${post.title}</p>
            </div>
            <div class="btn-group" role="group">
              <button type="button" onclick="getInfo(event)" userId='${post.userId}' postId='${post.id}' class="btn  btn-outline-secondary view-more-btn" data-bs-toggle="modal" data-bs-target="#viewMoreModal">
                <img src="https://www.shareicon.net/data/2015/09/20/104311_add_512x512.png" style="height:25px; pointer-events:none"/>
              </button> 
              <button type="button" onclick="getUpdateModalInfo(event)" postId='${post.id}' class="btn  btn-outline-secondary view-more-btn" data-bs-toggle="modal" data-bs-target="#updateModal"> 
                <img src="https://icons.veryicon.com/png/o/miscellaneous/linear-small-icon/edit-246.png" style="height:25px; pointer-events:none"/>
              </button> 
              <button type="button" postId='${post.id}' onclick="deletePost(event)" class="btn btn-outline-secondary ">
                <img src="https://cdn-icons-png.flaticon.com/512/1214/1214428.png" style="height:25px; pointer-events:none"/>
              </button>
            </div>
            `;
            observer.observe(newPost);
            postsContainer.appendChild(newPost);
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });

  setTimeout(() => {
    let musicModal = new bootstrap.Modal(playMusicModal);

    musicModal.show();
  }, 1000);
}

function getInfo(event) {
  let userId = event.target.getAttribute("userId");
  let postId = event.target.getAttribute("postId");

  userImg.src = `${userImages[userId]}`;

  fetch(`http://localhost:3000/posts/${postId}`)
    .then((response) => response.json())
    .then((data) => {
      postModalTitle.innerText = data.title;
      postModalBody.innerText = data.body;
    })
    .catch((err) => {
      console.log(err);
    });

  fetch(`http://localhost:3000/users/${userId}`)
    .then((response) => response.json())
    .then((data) => {
      postModalUserName.innerText = data.username + " - " + data.name;
      postModalUserEmail.innerText = data.email;
    })
    .catch((err) => {
      console.log(err);
    });

  fetch(`http://localhost:3000/posts/${postId}/comments`)
    .then((response) => response.json())
    .then((data) => {
      data.map(function (comment) {
        postModalComments.innerHTML += `
            <p style="font-weight:bold;">${comment.name}</p>
            <p>${comment.body}</p>
            <p>${comment.email}</p>
            <hr style="border: 1px solid black;">
            `;
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

function toggleCommentsVisibility() {
  postModalComments.classList.toggle("d-none");
  if (postModalComments.classList.contains("d-none")) {
    loadComments.innerText = "Load Comments";
  } else {
    loadComments.innerText = "Hide Comments";
  }
}

let postIdToDelete;

function deletePost(e) {
  postIdToDelete = parseInt(e.target.getAttribute("postId"));

  let deleteConfirmModal = new bootstrap.Modal(confirmDeleteModal);
  deleteConfirmModal.show();
}

function deletePostFromConfirmation() {
  let deleteConfirmModal = new bootstrap.Modal(confirmDeleteModal);
  deleteConfirmModal.hide();

  fetch(`http://localhost:3000/posts/${postIdToDelete}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.status === 200) {
        let deleteSuccessModal = document.getElementById(
          "deleted-successfully"
        );
        let deleteModal = new bootstrap.Modal(deleteSuccessModal);

        deleteModal.show();

        document.getElementById(postIdToDelete).remove();
      }
    })
    .catch((err) => {
      console.log(err);
    });

  fetch(`http://localhost:3000/images/${postIdToDelete}`, {
    method: "DELETE",
  }).catch((err) => {
    console.log(err);
  });
}

function getUpdateModalInfo(event) {
  const postId = event.target.getAttribute("postId");
  saveUpdateModalBtn.setAttribute("postId", postId);
  fetch(`http://localhost:3000/posts/${postId}`)
    .then((response) => response.json())
    .then((data) => {
      updateModalTitle.value = data.title;
      updateModalText.value = data.body;
      userId = data.userId;
    })
    .catch((err) => {
      console.log(err);
    });
}

function updatePost(event) {
  const postId = event.target.getAttribute("postId");
  let mainPostTitle = document.getElementById(`main-post-title-${postId}`);
  fetch(`http://localhost:3000/posts/${postId}`, {
    method: "PUT",
    body: JSON.stringify({
      id: postId,
      title: updateModalTitle.value,
      body: updateModalText.value,
      userId: userId,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => {
      if (response.status === 200) {
        let updateSuccessModal = document.getElementById(
          "updated-successfully"
        );
        let updateModal = new bootstrap.Modal(updateSuccessModal);
        updateModal.show();

        return response.json();
      }
    })
    .then((json) => {
      mainPostTitle.innerText = json.title;
    })
    .catch((err) => {
      console.log(err);
    });
}

let options = {
  threshold: 0.2,
};

let observer = new IntersectionObserver(fadeIn, options);

function fadeIn(entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.transform = "scale(1)";
      entry.target.classList.remove("opacity-0");
    }
  });
}
