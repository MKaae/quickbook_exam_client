import { API_URL } from "../../settings.js";
import { handleHttpErrors, makeOptions, sanitizer } from "../../utility.js";

const URL = API_URL + "/hotel";

export function initCreateHotel() {
    document.querySelector("#btn-create-hotel").addEventListener("click", createHotel); //Initialize the button for creating a hotel
}

async function createHotel(){ //Async means it returns a promise
    event.preventDefault(); //Prevent the default button action, because inside a form - reloading the page

    document.querySelector("#invalid-feedback1").innerHTML = "";
    document.querySelector("#invalid-feedback2").innerHTML = "";
    document.querySelector("#invalid-feedback3").innerHTML = "";
    document.querySelector("#invalid-feedback4").innerHTML = "";
    document.querySelector("#invalid-feedback5").innerHTML = "";

    const name = sanitizer(document.querySelector("#input-name").value);
    const street = sanitizer(document.querySelector("#input-street").value);
    const city = sanitizer(document.querySelector("#input-city").value);
    const zip = sanitizer(document.querySelector("#input-zip").value);
    const country = sanitizer(document.querySelector("#input-country").value);

    if (!isHotelValid(name, street, city, zip, country)) {
        return;
    }

    const hotelRequest = {
        name: name,
        street: street,
        city: city,
        zip: zip,
        country: country
    };

    try { //Await means it waits for the promise to be resolved
        await fetch(URL, makeOptions("POST", hotelRequest, true)).then((r) =>
            handleHttpErrors(r)
        );
    } catch (err) {
        console.log(err)
    }
    document.querySelector("#input-name").value = ""; //Clear the input fields
    document.querySelector("#input-street").value = "";
    document.querySelector("#input-city").value = "";
    document.querySelector("#input-zip").value = "";
    document.querySelector("#input-country").value = "";
    window.router.navigate("/");
}

function isHotelValid(
    name,
    street,
    city,
    zip,
    country
    ){
    if (!name || name.trim() === "" || name.length < 1) {
        document.querySelector("#invalid-feedback1").innerHTML = "Navn skal udfyldes";
        return false;
    }
    if (!street || street.trim() === "" || street.length < 2) {
        document.querySelector("#invalid-feedback2").innerHTML = "Addressen skal udfyldes.";
        return false;
    }
    if (!city || city.trim() === "" || city.length < 2) {
        document.querySelector("#invalid-feedback3").innerHTML = "Bynavn skal udfyldes.";
        return false;
    }
    if (!zip || zip.trim() === "" || zip.length < 4) {
        document.querySelector("#invalid-feedback4").innerHTML = "Zipkoden skal minimum være 4 karakterer.";
        return false;
    }
    if(!country || country.trim() === "" || country.length < 2) {
        document.querySelector("#invalid-feedback5").innerHTML = "Land skal udfyldes.";
        return false;
    }
    return true;
}
