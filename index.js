import "./navigo.js";

import { setActiveLink, loadHtml, renderHtml } from "./utility.js";

import { initHome } from "./pages/home/home.js";
import { initSignup } from "./pages/signup/signup.js";
import { initCreateHotel } from "./pages/hotel-create/hotel-create.js";
import { initLogin, toggleLoginStatus, logout } from "./pages/login/login.js";
import { initHotels } from "./pages/hotels/hotels.js";
import { initHotelDetails } from "./pages/hotel-details/hotel-details.js";
import { initHotelEditDelete } from "./pages/hotel-edit-delete/hotel-edit-delete.js";
import { initHotelEdit } from "./pages/hotel-edit/hotel-edit.js";
import { initRooms } from "./pages/rooms/rooms.js";
import { initReservations } from "./pages/reservations/reservations.js";
import { initProfile } from "./pages/profile/profile.js";

window.addEventListener("load", async () => {
  const templateHome = await loadHtml("./pages/home/home.html");
  const templateSignup = await loadHtml("./pages/signup/signup.html");
  const templateNotFound = await loadHtml("./pages/notFound/notFound.html");
  const templateLogin = await loadHtml("./pages/login/login.html");
  const templateCreateHotel = await loadHtml("./pages/hotel-create/hotel-create.html");
  const templateHotels = await loadHtml("./pages/hotels/hotels.html");
  const templateHotelDetails = await loadHtml("./pages/hotel-details/hotel-details.html");
  const templateHotelEditDelete = await loadHtml("./pages/hotel-edit-delete/hotel-edit-delete.html");
  const templateHotelEdit = await loadHtml("./pages/hotel-edit/hotel-edit.html");
  const templateRooms = await loadHtml("./pages/rooms/rooms.html");
  const templateReservations = await loadHtml("./pages/reservations/reservations.html");
  const templateProfile = await loadHtml("./pages/profile/profile.html");

  //If token existed, for example after a refresh, set UI accordingly
  const token = localStorage.getItem("token");
  toggleLoginStatus(token);

  const router = new Navigo("/", { hash: true });
  window.router = router;

  router
    .hooks({
      before(done, match) {
        setActiveLink("menu", match.url);
        done();
      },
    })
    .on({
      "/": () => {
        renderHtml(templateHome, "content");
        initHome(); //Might as well comment this out never used, didn't have time to do any design feautures with JS on the home page
      },
      "/signup": () => {
        renderHtml(templateSignup, "content");
        initSignup();
      },
      "/login": (match) => { //Match not used
        renderHtml(templateLogin, "content");
        initLogin();
      },
      "/logout": () => {
        renderHtml(templateLogin, "content");
        logout();
      },
      "/hotel-create": () => {
        renderHtml(templateCreateHotel, "content");
        initCreateHotel();
      },
      "/hotels": () => {
        renderHtml(templateHotels, "content");
        initHotels();
      },
      "/hotels-details": (match) => {
        renderHtml(templateHotelDetails, "content");
        initHotelDetails(match);
      },
      "/hotel-edit-delete": () => {
        renderHtml(templateHotelEditDelete, "content");
        initHotelEditDelete();
      },
      "/hotel-edit": (match) => {
        renderHtml(templateHotelEdit, "content");
        initHotelEdit(match);
      },
      "/rooms": () => {
        renderHtml(templateRooms, "content");
        initRooms();
      },
      "/reservations": (match) => {
        renderHtml(templateReservations, "content");
        initReservations(match);
      },
      "/profile": () => {
        renderHtml(templateProfile, "content");
        initProfile();
      },
    })
    .notFound(() => {
      renderHtml(templateNotFound, "content");
    })
    .resolve();
});

window.onerror = function (errorMsg, url, lineNumber, column, errorObj) { //This is never used. It is just for debugging purposes, if needed
  alert( //Can be used with try catch block to catch errors in router
    "Error: " +
      errorMsg +
      " Script: " +
      url +
      " Line: " +
      lineNumber +
      " Column: " +
      column +
      " StackTrace: " +
      errorObj
  );
};
