import { API_URL } from "../../settings.js";
import { handleHttpErrors, makeOptions, sanitizer } from "../../utility.js";

const URL = API_URL + "/hotel";
let hotelId = "";

export function initHotelEdit(match){
    if (match.params && match.params.hotelId) { //Redundant if block -> if match.params.hotelId exists, then it will always be true. And does nothing otherwise.
        hotelId = match.params.hotelId;
        getHotelDetails(hotelId);
    }
}
async function getHotelDetails(hotelId){
    try{
        const hotel = await fetch(`${URL}/${hotelId}`, makeOptions("GET", null)).then((r) =>handleHttpErrors(r));
        document.querySelector('#input-name').value = hotel.name; //Set value fields to the hotel details
        document.querySelector('#input-street').value = hotel.street;
        document.querySelector('#input-city').value = hotel.city;
        document.querySelector('#input-zip').value = hotel.zip;
        document.querySelector('#input-country').value = hotel.country;
        document.querySelector('#input-id').value = hotel.id;
    } catch (error){
        if(error.message === "Hotel not found"){
            document.querySelector("#invalid-feedback6").innerHTML = "Hotel not found"; //If hotel not found, display error message
        }
    }
    hotelId = "";
    document.querySelector('#btn-edit-hotel').addEventListener('click', saveHotel); //Why is this not in initHotelEdit?
}
async function saveHotel(){
    event.preventDefault(); //Form prevent default - Prevents reloading page
    document.querySelector("#invalid-feedback1").innerHTML = "";
    document.querySelector("#invalid-feedback2").innerHTML = "";
    document.querySelector("#invalid-feedback3").innerHTML = "";
    document.querySelector("#invalid-feedback4").innerHTML = "";
    document.querySelector("#invalid-feedback5").innerHTML = "";
    document.querySelector("#invalid-feedback6").innerHTML = "";

    const name = sanitizer(document.querySelector('#input-name').value);
    const street = sanitizer(document.querySelector('#input-street').value);
    const city = sanitizer(document.querySelector('#input-city').value);
    const zip = sanitizer(document.querySelector('#input-zip').value);
    const country = sanitizer(document.querySelector('#input-country').value);
    const id = sanitizer(document.querySelector('#input-id').value);
    
    const hotelRequest = {
        id: id
    }
    //Checks if the fields are empty, if not, then it checks if the input is valid. If not, then it sets the field to null.
    if (name.trim() !== "") hotelRequest.name = isHotelInfoValid(name, "invalid-feedback1") ? name : null; 
    if (street.trim() !== "") hotelRequest.street = isHotelInfoValid(street, "invalid-feedback2") ? street : null;
    if (city.trim() !== "") hotelRequest.city = isHotelInfoValid(city, "invalid-feedback3") ? city : null;
    if (zip.trim() !== "") hotelRequest.zip = isHotelZipValid(zip) ? zip : null;
    if (country.trim() !== "") hotelRequest.country = isHotelInfoValid(country, "invalid-feedback5") ? country : null;

    if ( //Checks if all the fields are null
        hotelRequest.name == null &&
        hotelRequest.street == null &&
        hotelRequest.city == null &&
        hotelRequest.zip == null &&
        hotelRequest.country == null
    ) {
        document.querySelector("#invalid-feedback6").innerHTML = "Du skal udfylde mindst et felt.";
        return;
    }


    try{
        await fetch(`${URL}`, makeOptions("PATCH", hotelRequest, true)).then(handleHttpErrors);
    } catch (error){
        if(error.message === "Hotel not found"){
            document.querySelector("#invalid-feedback6").innerHTML = "Hotel not found";
        }
        if(error.message === "Not the same hotel id"){
            document.querySelector("#invalid-feedback6").innerHTML = "Not the same hotel id";
        }

    }
    document.querySelector('#input-name').value = "";
    document.querySelector('#input-street').value = "";
    document.querySelector('#input-city').value = "";
    document.querySelector('#input-zip').value = "";
    document.querySelector('#input-country').value = "";
    document.querySelector('#input-id').value = "";
    router.navigate('/hotel-edit-delete');
}
function isHotelInfoValid(value, feedbackId) {
    if (!value || value.trim() === "" || value.length < 2) {
        document.querySelector(`#${feedbackId}`).innerHTML = "Dette felt skal udfyldes og være mindst 2 karakterer.";
        return false;
    }
    return true;
}
function isHotelZipValid(value) {
    if (!value || value.trim() === "" || value.length < 4) {
        document.querySelector(`#invalid-feedback4`).innerHTML = "Dette felt skal udfyldes og være mindst 4 karakterer.";
        return false;
    }
    return true;
}