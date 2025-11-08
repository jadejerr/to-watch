// Selecting elements
const inputForm = document.querySelector(".input-form");
const userInput = document.querySelector(".user-input");
const searchBtn = document.querySelector(".search-btn");
const listContainer = document.querySelector(".show-list");
const watchListWrapper = document.querySelector(".watch-list-wrapper");
const noShowsAddedText = document.querySelector(".no-show-added");
const myWatchlistHeading = document.querySelector(".my-watchlist");
let modal = document.querySelector(".modal");
let closeModal = document.querySelector(".close");
let modalRadios = document.querySelectorAll('input[name="watch_status"]');
let modalConfirmBtn = document.querySelector(".confirm-btn");

// TV Genre IDs
const tvGenreMap = {
  10759: "Action & Adv.",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  10762: "Kids",
  9648: "Mystery",
  10763: "News",
  10764: "Reality",
  10765: "Sci-Fi & Fantasy",
  10766: "Soap",
  10767: "Talk",
  10768: "War & Politics",
  37: "Western",
};

// Get watchlist from localStorage
const getWatchlist = () => {
  return JSON.parse(localStorage.getItem("watchlist")) || [];
};

// Save watchlist to localStorage
const saveWatchlist = (watchlist) => {
  localStorage.setItem("watchlist", JSON.stringify(watchlist));
};

// Open modal
const openEditModal = (showTitle, statusBadge) => {
  // Clone modal to avoid stacking listeners
  const newModal = modal.cloneNode(true);
  modal.parentNode.replaceChild(newModal, modal);
  modal = newModal;

  // Reselect elements
  closeModal = document.querySelector(".close");
  modalRadios = document.querySelectorAll('input[name="watch_status"]');
  modalConfirmBtn = document.querySelector(".confirm-btn");

  // Show modal
  modal.style.display = "block";

  // Close modal
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Confirm changes and close modal
  modalConfirmBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Make changes to status
  modalRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      statusBadge.textContent = radio.value;

      switch (radio.value) {
        case "Not Watched":
          statusBadge.style.backgroundColor = "var(--status-notwatched-bg)";
          statusBadge.style.color = "var(--status-notwatched-text)";
          break;
        case "Ongoing":
          statusBadge.style.backgroundColor = "var(--status-ongoing-bg)";
          statusBadge.style.color = "var(--status-ongoing-text)";
          break;
        case "Finished":
          statusBadge.style.backgroundColor = "var(--status-finished-bg)";
          statusBadge.style.color = "var(--status-finished-text)";
          break;
      }

      // Update status in localStorage
      const currentList = getWatchlist();
      const showIndex = currentList.findIndex((item) => item.title === showTitle);
      if (showIndex !== -1) {
        currentList[showIndex].status = radio.value;
        saveWatchlist(currentList);
      }
    });
  });
};

// Load saved watchlist (if any) upon refreshing or reopening tab
const loadWatchList = () => {
  const savedList = getWatchlist();

  // If watchlist is empty
  if (savedList.length === 0) {
    myWatchlistHeading.style.display = "none";
    noShowsAddedText.style.display = "block";
    return;
  }

  // If watchlist has items
  myWatchlistHeading.style.display = "block";
  noShowsAddedText.style.display = "none";

  savedList.forEach((show) => {
    // Create elements
    const tvList = document.createElement("li");
    const tvImg = document.createElement("img");
    const textDiv = document.createElement("div");
    const tvTitle = document.createElement("h3");
    const genreDiv = document.createElement("div");
    const deleteBtn = document.createElement("i");
    const editBtn = document.createElement("i");
    const actionBtnDiv = document.createElement("div");
    const contentDiv = document.createElement("div");
    const statusBadge = document.createElement("p");

    // Add classes
    tvList.classList.add("tv-list", "watchlist-added");
    tvImg.classList.add("tv-img");
    textDiv.classList.add("text-wrapper");
    genreDiv.classList.add("genre-wrapper");
    deleteBtn.classList.add("fa-solid", "fa-trash", "fa-lg", "delete-btn");
    editBtn.classList.add("fa-solid", "fa-pen", "fa-lg", "edit-btn");
    actionBtnDiv.classList.add("action-btn-div");
    contentDiv.classList.add("content-div");
    statusBadge.classList.add("status-badge");

    // Assign content
    tvImg.src = show.poster;
    tvTitle.textContent = show.title;
    statusBadge.textContent = show.status;

    // Create genre badges
    show.genres.forEach((genre) => {
      const genreTag = document.createElement("p");
      genreTag.classList.add("tv-genre");
      genreTag.textContent = genre;
      genreDiv.append(genreTag);
    });

    // Apply status colors
    switch (show.status) {
      case "Not Watched":
        statusBadge.style.backgroundColor = "var(--status-notwatched-bg)";
        statusBadge.style.color = "var(--status-notwatched-text)";
        break;
      case "Ongoing":
        statusBadge.style.backgroundColor = "var(--status-ongoing-bg)";
        statusBadge.style.color = "var(--status-ongoing-text)";
        break;
      case "Finished":
        statusBadge.style.backgroundColor = "var(--status-finished-bg)";
        statusBadge.style.color = "var(--status-finished-text)";
        break;
    }

    // Assemble card
    actionBtnDiv.append(editBtn, deleteBtn);
    textDiv.append(tvTitle, statusBadge, genreDiv);
    contentDiv.append(textDiv, actionBtnDiv);
    tvList.append(tvImg, contentDiv);
    watchListWrapper.append(tvList);

    // Delete button
    deleteBtn.addEventListener("click", () => {
      tvList.remove();
      const currentList = getWatchlist().filter((item) => item.title !== show.title);
      saveWatchlist(currentList);

      // If watchlist is empty
      if (currentList.length === 0) {
        myWatchlistHeading.style.display = "none";
        noShowsAddedText.style.display = "block";
      }

      // Searched shows cards
      const searchItems = document.querySelectorAll(".show-list .tv-list");
      searchItems.forEach((item) => {
        const title = item.querySelector("h3")?.textContent;
        if (title === show.title) {
          const tickIcon = item.querySelector(".show-added-tick");
          if (tickIcon) {
            tickIcon.classList.remove("fa-solid", "fa-check", "fa-2xl", "show-added-tick");
            tickIcon.classList.add("fa-solid", "fa-plus", "fa-2xl", "add-btn");
          }
        }

        // Re-add the add button after deleting a show from watchlist
        const reAddBtn = item.querySelector(".add-btn");
        reAddBtn.addEventListener("click", () => {
          addToWatchlist(item);
        });
      });
    });

    // Edit button
    editBtn.addEventListener("click", () => openEditModal(show.title, statusBadge));
  });
};

// Add show to watchlist
const addToWatchlist = (tvList) => {
  const tv = JSON.parse(tvList.dataset.tvData);

  // Selecting elements
  const addBtn = tvList.querySelector(".add-btn");
  const contentDiv = tvList.querySelector(".content-div");
  const textDiv = tvList.querySelector(".text-wrapper");
  const tvTitle = tvList.querySelector("h3");
  const tvImg = tvList.querySelector(".tv-img");
  const genreDiv = tvList.querySelector(".genre-wrapper");
  const genreArr = tv.genre_ids;

  // Add the "My Watchlist" heading
  myWatchlistHeading.style.display = "block";
  noShowsAddedText.style.display = "none";

  // Create action buttons and status badges
  const deleteBtn = document.createElement("i");
  const editBtn = document.createElement("i");
  const actionBtnDiv = document.createElement("div");
  const statusBadge = document.createElement("p");

  // Add classes
  tvList.classList.add("watchlist-added");
  deleteBtn.classList.add("fa-solid", "fa-trash", "fa-lg", "delete-btn");
  editBtn.classList.add("fa-solid", "fa-pen", "fa-lg", "edit-btn");
  actionBtnDiv.classList.add("action-btn-div");
  statusBadge.classList.add("status-badge");

  // Remove add button and set status to default "Not Watched"
  addBtn.remove();
  contentDiv.innerHTML = "";
  statusBadge.textContent = "Not Watched";

  // Assemble card
  actionBtnDiv.append(editBtn, deleteBtn);
  textDiv.innerHTML = "";
  textDiv.append(tvTitle, statusBadge, genreDiv);
  contentDiv.append(textDiv, actionBtnDiv);
  tvList.innerHTML = "";
  tvList.append(tvImg, contentDiv);
  watchListWrapper.append(tvList);

  // Create a new show object
  const newShow = {
    title: tv.name,
    poster: tv.poster_path ? `https://image.tmdb.org/t/p/w500${tv.poster_path}` : "/empty-poster.png",
    genres: tv.genre_ids.map((id) => tvGenreMap[id]),
    status: "Not Watched",
  };

  // Get the current watchlist and push the new show
  const currentList = getWatchlist();
  currentList.push(newShow);

  // Then save the updated list
  saveWatchlist(currentList);

  // Delete button
  deleteBtn.addEventListener("click", () => {
    actionBtnDiv.remove();
    tvList.remove();

    // Update the list
    const updated = getWatchlist().filter((show) => show.title !== tv.name);
    saveWatchlist(updated);

    // If watchlist is empty
    if (updated.length === 0) {
      myWatchlistHeading.style.display = "none";
      noShowsAddedText.style.display = "block";
    }

    // Searched shows cards
    const searchItems = document.querySelectorAll(".show-list .tv-list");
    searchItems.forEach((show) => {
      const title = show.querySelector("h3")?.textContent;
      if (title === tv.name) {
        const tickIcon = show.querySelector(".show-added-tick");
        if (tickIcon) {
          tickIcon.classList.remove("fa-solid", "fa-check", "fa-2xl", "show-added-tick");
          tickIcon.classList.add("fa-solid", "fa-plus", "fa-2xl", "add-btn");
        }
      }

      // Re-add the add button after deleting a show from watchlist
      const reAddBtn = show.querySelector(".add-btn");
      reAddBtn.addEventListener("click", () => {
        addToWatchlist(show);
      });
    });
  });

  // Edit button
  editBtn.addEventListener("click", () => openEditModal(tv.name, statusBadge));
};

// Fetch data (based on user's input) from API
async function fetchData(userPrompt) {
  const response = await fetch(`/.netlify/functions/tmdb?query=${userPrompt}`);
  const data = await response.json();

  // Refresh the searched shows after user enter another input
  if (listContainer.querySelectorAll("li").length > 0) {
    listContainer.innerHTML = "";
  }

  // Append show to searched shows container
  const appendTvList = (tvTitle, genreDiv, textDiv, addBtn, tvImg, contentDiv, tvList) => {
    textDiv.append(tvTitle, genreDiv);
    contentDiv.append(textDiv, addBtn);
    tvList.append(tvImg, contentDiv);
    listContainer.append(tvList);
  };

  // For each shows that appeared after searched query
  data.results.forEach((tv) => {
    // Load current watchlist to see if a show has already been added
    const currentList = getWatchlist();
    // If yes, return true
    const isAlreadyAdded = currentList.some((item) => item.title === tv.name);

    // store genre IDs in an array
    const genreArr = tv.genre_ids;

    // Creating elements
    const tvList = document.createElement("li");
    tvList.dataset.tvData = JSON.stringify(tv); // Saves the entire 'tv' object onto the element itself
    const tvImg = document.createElement("img");
    const textDiv = document.createElement("div");
    const tvTitle = document.createElement("h3");
    const genreDiv = document.createElement("div");
    const contentDiv = document.createElement("div");
    let addBtn;

    // Check whether the searched shows should have add button or tick indicator
    if (isAlreadyAdded) {
      addBtn = document.createElement("i");
      addBtn.classList.add("fa-solid", "fa-check", "fa-2xl", "show-added-tick");
    } else {
      addBtn = document.createElement("i");
      addBtn.classList.add("fa-solid", "fa-plus", "fa-2xl", "add-btn");
    }

    // Add classes
    tvList.classList.add("tv-list");
    tvImg.classList.add("tv-img");
    textDiv.classList.add("text-wrapper");
    genreDiv.classList.add("genre-wrapper");
    contentDiv.classList.add("content-div");

    // Assign content
    tvImg.src = tv.poster_path? `https://image.tmdb.org/t/p/w500${tv.poster_path}`: "/empty-poster.png";
    tvTitle.textContent = tv.name;

    // Create genre badges
    genreArr.forEach((value) => {
      const tvGenre = document.createElement("p");
      tvGenre.classList.add("tv-genre");
      tvGenre.textContent = tvGenreMap[value];
      genreDiv.append(tvGenre);
    });

    // Call helper function
    appendTvList(tvTitle, genreDiv, textDiv, addBtn, tvImg, contentDiv, tvList);

    // Add show to watchlist (if haven't been added)
    if (!isAlreadyAdded) {
      addBtn.addEventListener("click", () => {
        addToWatchlist(tvList);
      });
    }
  });
}

// Form event listener
inputForm.addEventListener("submit", (e) => {
  // Prevent page reload
  e.preventDefault();

  // Encode user's input and trim
  const userPrompt = encodeURIComponent(userInput.value.trim());
  if (!userPrompt) return;
  userInput.value = "";

  // Fetch and display data from user's input
  fetchData(userPrompt);
});

// Load any saved watchlist after DOM loaded
window.addEventListener("DOMContentLoaded", loadWatchList);

// When entire page is loaded, add splash screen
window.addEventListener("load", () => {
  const splash = document.querySelector(".splash");

  setTimeout(() => {
    splash.classList.add("hidden");
    document.body.classList.add("loaded");
  }, 2500);
});
