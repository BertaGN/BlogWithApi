fetch('http://localhost:3000/posts')
.then((response) => response.json())
.then ((post) => console.log(post))
