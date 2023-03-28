// When the page loads, get a list of books from http://localhost:3000/books and display their titles by creating a li for each book and adding each li to the ul#list element.
window.addEventListener('load', () => {
    fetch('http://localhost:3000/books')
      .then(response => response.json())
      .then(books => {
        const list = document.querySelector('#list');
        books.forEach(book => {
          const li = document.createElement('li');
          li.textContent = book.title;
          li.dataset.id = book.id;
          list.appendChild(li);
        });
      })
      .catch(error => console.error(error));
  });
  
  // When a user clicks the title of a book, display the book's thumbnail, description, and a list of users who have liked the book. This information should be displayed in the div#show-panel element.
  const showPanel = document.querySelector('#show-panel');
  
  document.addEventListener('click', event => {
    if (event.target.matches('#list li')) {
      const bookId = event.target.dataset.id;
      fetch(`http://localhost:3000/books/${bookId}`)
        .then(response => response.json())
        .then(book => {
          showPanel.innerHTML = `
            <img src="${book.img_url}" alt="${book.title}">
            <h2>${book.title}</h2>
            <p>${book.description}</p>
            <button data-id="${book.id}" class="like-btn">LIKE</button>
            <h3>Liked by:</h3>
            <ul class="liked-users">
              ${book.users.map(user => `<li>${user.username}</li>`).join('')}
            </ul>
          `;
        })
        .catch(error => console.error(error));
    }
  });
  
  // A user can like a book by clicking on a button. Display a LIKE button along with the book details. When the button is clicked, send a PATCH request to the URL with an array of users who like the book, and add a new user to the list.
  document.addEventListener('click', event => {
    if (event.target.matches('.like-btn')) {
      const bookId = event.target.dataset.id;
      fetch(`http://localhost:3000/books/${bookId}`)
        .then(response => response.json())
        .then(book => {
          const currentUserId = 1; // Replace with the actual current user id
          book.users.push({ id: currentUserId, username: 'pouros' }); // Replace with the actual current user information
          return fetch(`http://localhost:3000/books/${bookId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ users: book.users })
          });
        })
        .then(response => response.json())
        .then(book => {
          const likedUsersList = showPanel.querySelector('.liked-users');
          likedUsersList.innerHTML = book.users.map(user => `<li>${user.username}</li>`).join('');
        })
        .catch(error => console.error(error));
    }
  });
  