import { API_URL } from "../../settings.js";
import { handleHttpErrors, makeOptions, sanitizeStringWithTableRows } from "../../utility.js";

const URL = API_URL + "/hotel";
let hotelId = ""; //Global variable to store hotelId - let varibles vs const variables - let variables can be reassigned, const variables can't be reassigned

export function initHotelDetails(match){ //Match object contains params.hotelId and query.hotelId you can use either.
    if(localStorage.getItem("roles") === null || localStorage.getItem("roles") == "ADMIN"){ //If token doesn't exist, redirect to login this is because i don't want users to get error auth
        router.navigate('/login') //Should have added admin redirect to login to prevent errors for happening since they can't use reservations.
    }
    else if (match.params && match.params.hotelId) { //If token exists, get hotel details
        hotelId = match.params.hotelId;
        getHotelDetails(hotelId);
    }
}
async function getHotelDetails(hotelId){
    try{
    const hotel = await fetch(`${URL}/${hotelId}`, makeOptions("GET", null)).then((r) =>handleHttpErrors(r));
    const hotelDetails = `
    <tr>
        <td>${hotel.name}</td>
        <td>${hotel.street}</td>
        <td>${hotel.city}</td>
        <td>${hotel.zip}</td>
        <td>${hotel.country}</td>
        <td>${hotel.numberOfRooms}</td>
        <td><button id="${hotel.id}_hotel-id" class="btn btn-outline-dark">Reserver værelse</button></td>
    </tr>    
    `;
    document.querySelector('#hotel-details-body').innerHTML = sanitizeStringWithTableRows(hotelDetails);
    document.querySelector('#hotel-details-body').addEventListener('click', reserveRoom);
    hotelId = "";
    } catch (error) {
       if(error.message === "Hotel not found"){
            console.log("Hotel not found");
        }
    } 
} //Event bubbling - Event handler on parent element and then check if the target is the button - Think of DOM as a tree
function reserveRoom(event){ //Contains event because it recieves event from event handler
    const target = event.target;
    const reserveButton = target.closest('.btn-outline-dark');
    if(!reserveButton) return;
    let hotelIdent = reserveButton.id.split('_')[0];
    router.navigate(`/reservations/?hotelId=${hotelIdent}`);
}
