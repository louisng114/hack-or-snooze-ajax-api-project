"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <i class="${isFavorite(story.storyId) ? 'fa-solid' : 'fa-regular'} fa-star fav"></i>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Handle story submission. */

async function submitFormHandler(evt) {
  console.debug("submitFormHandler");

  evt.preventDefault();

  const submitAuthor = $("#submit-author").val();
  const submitTitle = $("#submit-title").val();
  const submitUrl = $("#submit-url").val();

  const returnedStory = await storyList.addStory(currentUser,
    {author : submitAuthor,
      title : submitTitle,
      url : submitUrl,});
  const $story = generateStoryMarkup(returnedStory);
  $allStoriesList.prepend($story);
};

$submitStoryButton.on("click", submitFormHandler);

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** Gets list of favorite stories from server, generate their HTML, and puts on page. */

function putFavoriteStoriesOnPage() {
  console.debug("putFavoriteStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    if (isFavorite(story.storyId)) {
      const $story = generateStoryMarkup(story);
      $allStoriesList.append($story);
    }
  }

  if ($allStoriesList.text() === "") {
    $allStoriesList.append($("<p>").text("No favorite added!"));
  }

  $allStoriesList.show();
}

/** Gets list of the user stories from server, generate their HTML, and puts on page. */

function putMyStoriesOnPage() {
  console.debug("putMyStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    if (story.username === currentUser.username) {
      const $story = generateStoryMarkup(story);
      $story.prepend('<i class="fa-solid fa-trash-can delete"></i>');
      $allStoriesList.append($story);
    }
  }

  if ($allStoriesList.text() === "") {
    $allStoriesList.append($("<p>").text("No stories added by user yet!"));
  }

  $allStoriesList.show();
}

/** Toggle favorite stories */

async function toggleFavoriteHandler(evt) {
  if (currentUser !== undefined && currentUser !== null) {
    console.debug("toggleFavoriteHandler");

    const storyId = evt.target.parentElement.id;
    toggleFavorite(storyId);
    evt.target.classList.toggle("fa-regular");
    evt.target.classList.toggle("fa-solid");
  }
}

async function toggleFavorite(storyId) {
  const token = currentUser.loginToken;

  if (isFavorite(storyId)) {
    await axios({
      url: `${BASE_URL}/users/${currentUser.username}/favorites/${storyId}`,
      method: "DELETE",
      data: {token}
    });
    currentUser.favorites = currentUser.favorites.filter(story => story.storyId !== storyId);
  } else {
    await axios({
      url: `${BASE_URL}/users/${currentUser.username}/favorites/${storyId}`,
      method: "POST",
      data: {token}
    });
    const response = await axios({
      url: `${BASE_URL}/stories/${storyId}`,
      method: "GET"
    });
    const story = new Story(response.data.story);
    currentUser.favorites.push(story);
  }
}

function isFavorite(storyId){
  if (currentUser !== undefined && currentUser !== null) {
    return currentUser.favorites.some(story => story.storyId === storyId);
  } else {
    return false;
  }
}

$allStoriesList.on("click",".fav",toggleFavoriteHandler)

/** Delete user's stories */

function deleteStoryHandler(evt) {
  console.debug("deleteStoryHandler");
  const storyId = evt.target.parentElement.id;
  deleteStory(storyId);
  evt.target.parentElement.remove();
}

async function deleteStory(storyId) {
  const token = currentUser.loginToken;

  await axios({
    url: `${BASE_URL}/stories/${storyId}`,
    method: "DELETE",
    data: {token}
  });
}

$allStoriesList.on("click",".delete",deleteStoryHandler);