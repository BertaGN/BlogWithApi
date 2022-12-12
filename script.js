const postsContainer = document.getElementById("posts-container");

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
                            `;
                            postsContainer.appendChild(newPost);
                        });
      });
    });
}

getPosts();
