import 'core-js/stable';
import 'regenerator-runtime/runtime';

import * as model from './model.js'
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from "./views/AddRecipeView.js";
import {MODAL_CLOSE_SEC} from "./config.js";
// if (module.hot) {
//   module.hot.accept();
// }
// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
    try {
        const id = window.location.hash.slice(1);

        if (!id) return;
        recipeView.renderSpinner();

        // Update results view to mark selected recipe
        resultsView.update(model.getSearchResultPage());
        bookmarksView.update(model.state.bookmarks);

        // Loading recipe
        await model.loadRecipe(id);

        // 2) Rendering recipe
        recipeView.render(model.state.recipe);

    } catch (err) {
        recipeView.renderError();
        console.error(err);
    }
};

const controlSearchResults = async function () {
    try {
        resultsView.renderSpinner();

        // Get search query
        const query = searchView.getQuery();
        if (!query) return;

        // Load search results
        await model.loadSearchResults(query);

        // Render results
        resultsView.render(model.getSearchResultPage());

        // render initial pagination buttons
        paginationView.render(model.state.search);
    } catch (err) {
        console.log(err);
    }
}

const controlPagination = function (goToPage) {
    // Render new results
    resultsView.render(model.getSearchResultPage(goToPage));

    // render new pagination buttons
    paginationView.render(model.state.search);
}

const controlServings = function (newServings) {
    // update the recipe servings (in state)
    model.updateServings(newServings);

    // update the recipe view
    // recipeView.render(model.state.recipe);
    recipeView.update(model.state.recipe);
}

const controlAddBookmark = function () {
    // 1) Add/remove bookamrk
    if (!model.state.recipe.bookmarked) {
        model.addBookmark(model.state.recipe);
    } else {
        model.deleteBookmark(model.state.recipe.id);
    }

    // 2.) Update reicpe view
    recipeView.update(model.state.recipe);

    // 3) Render bookmarks
    bookmarksView.render(model.state.bookmarks);
}

const controlBookmarks = function () {
    bookmarksView.render(model.state.bookmarks);
}

const controlAddRecipe = async function (newRecipe) {
    try {
        // show spinner
        addRecipeView.renderSpinner();

        // upload new recipe data
        await model.uploadRecipe(newRecipe)
        console.log(model.state.recipe);

        // render recipe
        recipeView.render(model.state.recipe);

        // success message
        addRecipeView.renderMessage();

        // render bookmark view
        bookmarksView.render(model.state.bookmarks);

        // change ID in URL
        window.history.pushState(null, '', `#${model.state.recipe.id}`);

        // close upload recipe
        setTimeout(function () {
            addRecipeView.toggleWindow();
        }, MODAL_CLOSE_SEC)
    } catch (err) {
        console.log(`💥💥💥 ${err}`)
        addRecipeView.renderError(err.message);
    }
}

// publisher-subscriber pattern
const init = function () {
    bookmarksView.addHandlerRender(controlBookmarks);
    recipeView.addHandlerRender(controlRecipes);
    recipeView.addHandlerUpdateServings(controlServings);
    recipeView.addHandlerAddBookmark(controlAddBookmark);
    searchView.addHandlerSearch(controlSearchResults);
    paginationView.addHandlerClick(controlPagination);
    addRecipeView.addHandlerUpload(controlAddRecipe);
}
init();
