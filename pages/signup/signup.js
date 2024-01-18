import { API_URL } from "../../settings.js";
import { handleHttpErrors, makeOptions, sanitizer } from "../../utility.js";

const URL = API_URL + "/guests";

export function initSignup() {
    document.querySelector("#btn-signup").addEventListener("click", signup);
}

async function signup() {
    event.preventDefault();

    document.querySelector("#invalid-feedback1").innerHTML = ""; //Clears the error messages
    document.querySelector("#invalid-feedback2").innerHTML = "";
    document.querySelector("#invalid-feedback3").innerHTML = "";
    document.querySelector("#invalid-feedback4").innerHTML = "";
    document.querySelector("#invalid-feedback5").innerHTML = "";
    document.querySelector("#invalid-feedback6").innerHTML = "";
    document.querySelector("#invalid-feedback7").innerHTML = "";

    const firstName = sanitizer(document.querySelector("#input-firstname").value);
    const lastName = sanitizer(document.querySelector("#input-lastname").value);
    const email = sanitizer(document.querySelector("#input-email").value);
    const username = sanitizer(document.querySelector("#input-username").value);
    const password = sanitizer(document.querySelector("#input-password").value);
    const passwordCheck = sanitizer(document.querySelector("#input-password2").value);
    const phoneNumber = sanitizer(document.querySelector("#input-phone-number").value);

    if (!isSignupValid //Checks if the signup is valid, if not it returns to the signup page
        (
            firstName,
            lastName,
            email,
            username,
            password,
            passwordCheck,
            phoneNumber
        )
        ) {
        return;
    }

    const signupRequest = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        username: username,
        password: password,
        phoneNumber: phoneNumber
    };

    try {
        const res = await fetch(URL, makeOptions("POST", signupRequest, false)).then((r) =>
            handleHttpErrors(r)
        );
    } catch (err) {
        if (err.message === "User already exists") {
            document.querySelector("#invalid-feedback3").innerHTML = "Brugernavn er allerede i brug.";
            return;
        }
        else if (err.message === "Email already exists") {
            document.querySelector("#invalid-feedback4").innerHTML = "Email er allerede i brug.";
            return;
        }
    }
    document.querySelector("#input-firstname").value = ""; //Clears the input fields
    document.querySelector("#input-lastname").value = "";
    document.querySelector("#input-email").value = "";
    document.querySelector("#input-username").value = "";
    document.querySelector("#input-password").value = "";
    document.querySelector("#input-password2").value = "";
    document.querySelector("#input-phone-number").value = "";
    window.router.navigate("/login");
}

function isSignupValid(
    firstName,
    lastName,
    email,
    username,
    password,
    passwordCheck,
    phoneNumber
) {
    if (!firstName || firstName.trim() === "") {
        document.querySelector("#invalid-feedback1").innerHTML =
            "Indtast venligst gyldigt fornavn.";
        return false;
    }

    if (!lastName || lastName.trim() === "") {
        document.querySelector("#invalid-feedback2").innerHTML =
            "Indtast venligst gyldigt efternavn.";
        return false;
    }

    if (!username || username.trim() === "" || username.length < 2) {
        document.querySelector("#invalid-feedback3").innerHTML =
            "Indtast venligst gyldigt brugernavn.";
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; //Regex for email it checks if the email is valid by checking if it contains @ and .
    if (!email || email.trim() === "" || !emailRegex.test(email)) {
        document.querySelector("#invalid-feedback4").innerHTML =
            "Indtast venlist en gyldig emailadresse.";
        return false;
    }

    if (!password || password.length < 4) {
        document.querySelector("#invalid-feedback5").innerHTML =
            "Kodeord skal være mindst 4 karakterer.";
        return false;
    }

    if (password !== passwordCheck) {
        document.querySelector("#invalid-feedback6").innerHTML =
            "Kodeord er ikke ens.";
        return false;
    }
    if(phoneNumber === ""){
        return true;
    }
    else if(phoneNumber.length < 8 || phoneNumber.length > 20){
        document.querySelector("#invalid-feedback7").innerHTML =
            "Indtast venligst et gyldigt telefonnummer.";
        return false;
    }

    return true;
}