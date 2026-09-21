const modal = document.getElementById("modal");
const modalShow = document.getElementById("show-modal");
const modalClose = document.getElementById("close-modal");
const bookmarkForm = document.getElementById("bookmark-form");
const websiteNameEl = document.getElementById("website-name");
const websiteUrlEl = document.getElementById("website-url");
const bookmarksContainer = document.getElementById("bookmarks-container");

let bookmarks = [];

const showModal = () => {
  modal.classList.add("show-modal");
  websiteNameEl.focus();
};

const closeModal = (e) => {
  if (e.target === modal || e.target === modalClose) {
    modal.classList.remove("show-modal");
  }
};

const validate = (nameValue, urlValue) => {
  const expression =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
  const regex = new RegExp(expression);
  if (!nameValue || !urlValue) {
    alert("Please submit values for both fields");
    return false;
  }
  if (!urlValue.match(regex)) {
    alert("Please provide a valid web address");
    return false;
  }
  return true;
};

const deleteBookmark = (url) => {
  bookmarks.forEach((bookmark, i) => {
    if (bookmark.url === url) {
      bookmarks.splice(i, 1);
    }
  });
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  fetchBookmarks();
};

const buildBookmarks = () => {
  bookmarksContainer.textContent = "";
  bookmarks.forEach((bookmark) => {
    bookmarksContainer.innerHTML += `
      <div class="item">
        <i class="fas fa-times" id="delete-bookmark" title="Delete Bookmark" onclick="deleteBookmark('${bookmark.url}')"></i>
        <div class="name">
          <img src="https://s2.googleusercontent.com/s2/favicons?domain=${bookmark.url}&sz=64" alt="Favicon">
          <a href="${bookmark.url}" target="_blank">${bookmark.name}</a>
        </div>
      </div>`;
  });
};

const fetchBookmarks = () => {
  if (localStorage.getItem("bookmarks")) {
    bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
  } else {
    bookmarks = [
      {
        name: "Portfolio",
        url: "https://miroslawsocha.pl",
      },
    ];
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }
  buildBookmarks();
};

const storeBookmark = (e) => {
  e.preventDefault();
  const nameValue = websiteNameEl.value;
  let urlValue = websiteUrlEl.value;
  if (!urlValue.includes("http://") && !urlValue.includes("https://")) {
    urlValue = `https://${urlValue}`;
  }
  if (!validate(nameValue, urlValue)) {
    return false;
  }
  const bookmark = {
    name: nameValue,
    url: urlValue,
  };
  bookmarks.push(bookmark);
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  fetchBookmarks();
  bookmarkForm.reset();
  websiteNameEl.focus();
};

modalShow.addEventListener("click", showModal);
modalClose.addEventListener("click", closeModal);
window.addEventListener("click", closeModal);

bookmarkForm.addEventListener("submit", storeBookmark);

fetchBookmarks();
