import { API_URL } from "../../settings.js";
import { handleHttpErrors, makeOptions, sanitizeStringWithTableRows, sanitizer } from "../../utility.js";

const URL = API_URL + "/room";
const URL2 = API_URL + "/reservations";
let hotelId = "";
let rooms = [];

export function initReservations(match){
    if (match.params && match.params.hotelId) { //Checks if the hotelId is in the URL otherwise it will show no rooms
        hotelId = match.params.hotelId;
        getRooms(hotelId);
    }
    document.querySelector('#reservation-date').addEventListener('change', validateDate);
    // document.querySelector('#date-input').addEventListener('change', validateDate2);
}
async function getRooms(hotelId){
    try{
    rooms = await fetch(`${URL}/${hotelId}`, makeOptions("GET", null, true)).then((r) =>handleHttpErrors(r));
    const roomsDetails = rooms.map(room => `
    <tr>
        <td>${room.roomNumber}</td>
        <td>${room.numberOfBeds}</td>
        <td>${room.price}</td>
        <td><button id="${room.id}_room-id" class="btn btn-outline-dark" data-bs-toggle="modal" data-bs-target="#reservationModal">Reserver værelse</button><td>
    </tr>    
    `).join('');
    document.querySelector('#room-details-body').innerHTML = sanitizeStringWithTableRows(roomsDetails);
    } catch(error){
        if(error.message === "Hotel not found"){
            console.log("Hotel not found");
        }
        else{
            console.log(error.message);
        }
    }
    hotelId = "";
    document.querySelector('#room-details-body').addEventListener('click', reservationModal);
}
function reservationModal(event){
    const target = event.target;
    const reservationButton = target.closest('.btn-outline-dark');
    
    if (!reservationButton) return;

    let roomId = reservationButton.id.split('_')[0];
    const roomToRent = rooms.find(room => room.id == roomId); //Finds the room that matches the id, and saves it in a variable
    const bodyText = `Reserver værelse: ${roomToRent.roomNumber}, Senge: ${roomToRent.numberOfBeds}, Pris: ${roomToRent.price}`;
    document.querySelector('.modal-body').innerText = bodyText;
    document.querySelector('#reservation-btn').removeEventListener('click', handleReservationClick);
    document.querySelector('#reservation-btn').addEventListener('click', handleReservationClick);

}
function handleReservationClick() {
    const roomId = document.querySelector('.btn-outline-dark').id.split('_')[0];
    reserveRoom(roomId);
}
async function reserveRoom(roomId){
    const reservationDate = document.querySelector('#reservation-date').value;
    if(reservationDate === ""){ //Forgot this in the original project. People could reserve without a date added.
        document.querySelector('#error-text').innerHTML = "Vælg en dato";
        return;
    }
    const reservationRequest = {
        reservationDate: reservationDate,
        roomId: roomId
    }
    try{
        await fetch(URL2, makeOptions("POST", reservationRequest, true)).then((r) =>handleHttpErrors(r));
        rooms = [];
        document.querySelector('.btn-close').click();
        router.navigate("/profile");
    } catch(error){
        if(error.messsage === "Room not found"){
            document.querySelector('#error-text').innerHTM = "Room not found";
        }
        if(error.message === "Guest not found"){
            document.querySelector('#error-text').innerHTM = "Guest not found";
        }
        if(error.message === "Room is already reserved"){
            document.querySelector('#error-text').innerHTML = "Room is already reserved";
        }
    }
}
function validateDate() {
    document.querySelector('#error-text').innerHTML = "";
    const reservationDateInput = document.querySelector('#reservation-date');
    const selectedDate = new Date(reservationDateInput.value); 
    const currentDate = new Date();

    if (selectedDate < currentDate) { //Checks if the selected date is in the past
        document.querySelector('#error-text').innerHTML = sanitizer("Du kan ikke vælge en dato i fortiden. Vælg venligst en fremtidig dato.");
        reservationDateInput.value = ''; 
    }
}
// function validateDate2() {
//     document.querySelector('#error-text2').innerHTML = "";
//     const reservationDateInput = document.querySelector('#date-input');
//     const selectedDate = new Date(reservationDateInput.value); 
//     const currentDate = new Date();

//     if (selectedDate < currentDate) { //Checks if the selected date is in the past
//         document.querySelector('#error-text2').innerHTML = sanitizer("Du kan ikke vælge en dato i fortiden. Vælg venligst en fremtidig dato.");
//         reservationDateInput.value = ''; 
//     }
//     else{
//         getReservations2();
//     }
// }
// async function getReservations2(){
//     const reservationDateInput = document.querySelector('#date-input');
//     const reservationDate = reservationDateInput.value;
//     try{
//         const reservations = await fetch(`${URL2}/${hotelId}/${reservationDate}`, makeOptions("GET", null, true)).then((r) =>handleHttpErrors(r));
//         const reservationsDetails = reservations.map(reservation => `
//         <tr>
//             <td>${reservation.room.roomNumber}</td>
//             <td>${reservation.room.numberOfBeds}</td>
//             <td>${reservation.room.price}</td>
//         </tr>    
//         `).join('');
//         document.querySelector('#room-details-body').innerHTML = sanitizeStringWithTableRows(reservationsDetails);
//     } catch(error){
//         if(error.message === "Hotel not found"){
//             console.log("Hotel not found");
//         }
//         else{
//             console.log(error.message);
//         }
//     }
// }