"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show story submission form and list of all stories on clicking submit */

function navSubmitClick(evt) {
  hidePageComponents();
  putStoriesOnPage();
  $submitForm.show();
}

$navSubmit.on("click", navSubmitClick);

/** Show list of favorite stories on clicking favorites */

function navFavoritesClick(evt) {
  hidePageComponents();
  putFavoriteStoriesOnPage();
}

$navFavorites.on("click", navFavoritesClick);

/** Show list of user's stories on clicking my stories */

function navMyStoriesClick(evt) {
  hidePageComponents();
  putMyStoriesOnPage();
}

$navMyStories.on("click", navMyStoriesClick);

/** Show current user's profile on clicking username */

function navUserProfileClick(evt) {
  hidePageComponents();
  updateUserInfo();
  $userProfile.show();
  $accountDeletionButton.show()
  $accountDeletionConfirmationButton.hide()
}

$navUserProfile.on("click", navUserProfileClick);


/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}
