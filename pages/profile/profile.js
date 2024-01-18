import { API_URL } from "../../settings.js";
import { handleHttpErrors, makeOptions, sanitizeStringWithTableRows, sanitizer } from "../../utility.js";

const URL = API_URL + "/reservations/reservations-for-guest";
const URL2 = API_URL + "/reservations/guest-as-authenticated";
let reservations = [];

export function initProfile(){
    getReservations();
}
async function getReservations(){
    document.querySelector('#reservation-delete-body').innerHTML = "";
    try{
        reservations = await fetch(URL, makeOptions("GET", null, true)).then((r) =>handleHttpErrors(r));
        const reservationsDetails = reservations.map(reservation => `
        <tr>
            <td>${reservation.id}</td>
            <td>${reservation.reservationDate}</td>
            <td>${reservation.price}</td>
            <td>${reservation.roomNumber}</td>
            <td><button id="${reservation.id}_reservation-id" class="btn btn-outline-dark" data-bs-toggle="modal" data-bs-target="#reservationsModal">Slet reservation</button><td>
        </tr>    
        `).join('');
        if(reservationsDetails === '') return;
        document.querySelector('#reservation-delete-body').innerHTML = sanitizeStringWithTableRows(reservationsDetails);
    } catch(error){
        if(error.message === "Guest not found"){
            console.log("Guest not found");
        }
    }
    document.querySelector('#reservation-delete-body').addEventListener('click', setupDeleteModal);
}
function setupDeleteModal(event){ //Without event bubbling you can't use the dynamically generated eventlistener on the button
    const target = event.target;
    const deleteButton = target.closest('.btn-outline-dark');
    if (!deleteButton) return;
    const reservationId = deleteButton.id.split('_')[0];
    const reservation = reservations.find(reservations => reservations.id == reservationId);
    const bodytext = `Reservations id: ${reservation.id}\nReservations dato: ${reservation.reservationDate}\nPris: ${reservation.price}\nVærelsesnummer: ${reservation.roomNumber}`;
    document.querySelector('.modal-body').innerText = sanitizer(bodytext);
    document.querySelector('#delete-res-btn').removeEventListener('click', handleDeteleteClick); //Issue with data saved had to remove eventlistener
    document.querySelector('#delete-res-btn').addEventListener('click', handleDeteleteClick);
}
function handleDeteleteClick(){
    const deleteId = document.querySelector('.btn-outline-dark').id.split('_')[0];
    deleteReservation(deleteId);
}
async function deleteReservation(deleteId){
    const deleteRequest = {
        id: deleteId
    }
    try{
        await fetch(URL2, makeOptions("DELETE", deleteRequest, true)).then((r) =>handleHttpErrors(r));
        document.querySelector('.btn-close').click();
        reservations = [];
        getReservations();
    } catch(error){
        if(error.message === "Reservation not found"){
            console.log("Reservation not found");
        }
        if(error.message === "You are not allowed to delete this reservation"){
            console.log("You are not allowed to delete this reservation");
        }
        else{
            console.log(error.message);
        }
    }
}
