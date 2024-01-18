import { API_URL } from "../../settings.js";
import { handleHttpErrors, makeOptions, sanitizer } from "../../utility.js";
const URL = API_URL + "/room";
const URL2 = API_URL + "/hotel";

export function initRooms(){
    fetchHotels();
    document.querySelector("#btn-add-room").addEventListener("click", createRoom);
    document.querySelector("#hotelSelect").addEventListener("change", displayHotelDetails); 
}
async function fetchHotels(){
    try{
    const hotels = await fetch(`${URL2}/admin-hotels`, makeOptions("GET"), null).then((r) =>handleHttpErrors(r));
    const hotelList = `
    <option value="0">Vælg et hotel</option>` + //Sets the default value for the select element
    hotels.map(hotel => `
        <option value="${hotel.id}">${hotel.name}</option> 
    `).join(""); //Sets the options for the select element
    document.querySelector("#hotelSelect").innerHTML = sanitizer(hotelList);
    }catch(error){
        console.log(error);
    }
}
async function displayHotelDetails() { 
    const selectedHotelId = document.querySelector("#hotelSelect").value;
    if (selectedHotelId === "0") { //Checks if the selected hotel is the default value
        document.querySelector("#invalid-feedback3").innerHTML = "Du skal vælge et hotel.";
        return;
    }
    try {
        const hotelDetails = await fetch(`${URL2}/${selectedHotelId}`, makeOptions("GET")).then((r) => handleHttpErrors(r));
        const hotelDetailListed = `
        <h5 class="m-3 check-empty">Hotelnavn: ${hotelDetails.name}</h5>
        <p class="card-text">Adresse: ${hotelDetails.street}</p>
        <p class="card-text">By: ${hotelDetails.city}</p>
        <p class="card-text">Zipkode: ${hotelDetails.zip}</p>
        <p class="card-text">Land: ${hotelDetails.country}</p>
        <p class="card-text">Antal rum: ${hotelDetails.numberOfRooms}</p>
        </div>`
        document.querySelector("#hotel-information").innerHTML = sanitizer(hotelDetailListed);
    } catch (error) {
        console.log(error);
    }
}
async function createRoom(){
    event.preventDefault();

    document.querySelector("#invalid-feedback1").innerHTML = "";
    document.querySelector("#invalid-feedback2").innerHTML = "";
    document.querySelector("#invalid-feedback3").innerHTML = "";

    const selectedHotelId = document.querySelector("#hotelSelect").value;
    const roomNumber = document.querySelector("#input-room-number").value;
    const numberOfBeds = document.querySelector("#input-beds-amount").value;
    const price = document.querySelector("#input-price").value;
    if (selectedHotelId === "0") {
        document.querySelector("#invalid-feedback3").innerHTML = "Du skal vælge et hotel.";
        return;
    }

    if (!isRoomValid(roomNumber, numberOfBeds, price)) {  //Checks if the room is valid, except for the hotelId
        return;
    }

    const room = {
        roomNumber: roomNumber,
        numberOfBeds: numberOfBeds,
        price: price,
        hotelId: selectedHotelId
    }
    try{
        await fetch(URL, makeOptions("POST", room, true)).then((r) => handleHttpErrors(r));
    }catch(error){
        if(error.message === "Room number already exists"){
            document.querySelector("#invalid-feedback1").innerHTML = "Værelsesnummeret findes allerede."; //Forgot this is inital commit
        }
    }
    document.querySelector("#input-room-number").value = "";
    document.querySelector("#input-beds-amount").value = "";
    document.querySelector("#input-price").value = "";
    initRooms();
}
function isRoomValid(roomNumber, numberOfBeds, price){
    if (!roomNumber || roomNumber.trim() === "0") {
        document.querySelector("#invalid-feedback1").innerHTML = "Du skal vælge et værelsesnummer.";
        return false;
    }
    if (!numberOfBeds || numberOfBeds.trim() === "" || numberOfBeds < 1 || numberOfBeds > 4) {
        document.querySelector("#invalid-feedback2").innerHTML = "Du skal vælge mellem 1 og 4 senge.";
        return false;
    }
    if (!price || price.trim() === "" || price < 1) {
        document.querySelector("#invalid-feedback3").innerHTML = "Du skal vælge en pris.";
        return false;
    }
    return true;
}
