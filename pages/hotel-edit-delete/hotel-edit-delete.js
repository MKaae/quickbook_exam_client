import { API_URL } from "../../settings.js";
import { handleHttpErrors, makeOptions, sanitizeStringWithTableRows} from "../../utility.js";

const URL = API_URL + "/hotel";
const PAGE_SIZE = 10; //Number of hotels per page
let sortColumn = "name"; //Default sort column
let sortDirection = "asc"; //Ascending order
let isInitialized = false; //Checks if the event listeners are initialized

export function initHotelEditDelete(){
    const page = 0; //This is not needed here, as it is set in the fetchData function. But it is needed in the handlePaginationClick function.
    if(!isInitialized){ //Preventing duplicate event bindings, unexpected behavior. 
        isInitialized = true;
        document.querySelector('#header-row').addEventListener('click', handleSort);
        document.querySelector('#pagination').addEventListener('click', handlePaginationClick);
    }
    fetchData(Number(page)); //Fetches the hotels, with the page number. Starts at 0.
}
function handleSort(evt){ //Event bubbling on sort buttons. Sets sortColumn and sortDirection
    const target = evt.target.closest('th');

    if (!target.id.startsWith('sort-')) return;
    sortColumn = target.id.split("-")[1];
    sortDirection = target.dataset.sort_direction === 'asc' ? 'desc' : 'asc';
    target.dataset.sort_direction = sortDirection;
    fetchData();
}

async function fetchData(page = 0){ //Fetches the hotels, with the page number. Starts at 0.
    const queryString = `?page=${page}&size=${PAGE_SIZE}&sort=${sortColumn},${sortDirection}` //Query string for pagination
    try{
    const hotels = await fetch(`${URL}${queryString}`, makeOptions("GET", null)).then((r) =>
        handleHttpErrors(r)
    );
    displayHotels(hotels.content) //Displays the hotels
    displayPagination(hotels.totalPages, page); //Displays the pagination
    } catch (error) {
        console.log(error.message)
    }
}
function displayHotels(hotels){ //Fictive return before => can be written as hotel => {(return hotel.name)} shorthand used
    document.querySelector('#hotel-table-body').innerHTML = sanitizeStringWithTableRows(hotels.map(hotel => `
    <tr>
        <td>${hotel.name}</td>
        <td>${hotel.street}</td>
        <td>${hotel.city}</td>
        <td>${hotel.zip}</td>
        <td>${hotel.country}</td>
        <td>${hotel.numberOfRooms}</td>
        <td><button class="btn edit-button" id="${hotel.id}_edit-id"><i class="bi bi-pencil-square"></i></button></td>
        <td><button class="btn delete-button" id="${hotel.id}_delete-id" data-bs-toggle="modal" data-bs-target="#editModal"><i class="bi bi-trash"></i></button></td>
    </tr>    
    `).join(''));
    document.querySelector('#hotel-table-body').addEventListener('click', getDetails); //Not used, leftover from refactoring.
    document.querySelector('#hotel-table-body').addEventListener('click', setupDeleteModal); 
    document.querySelector('#hotel-table-body').addEventListener('click', editHotel);
}
function editHotel(event){
    const target = event.target;
    const editButton = target.closest('.edit-button');
    
    if (!editButton) return;

    let hotelId = editButton.id.split('_')[0];
    router.navigate(`/hotel-edit/?hotelId=${hotelId}`); //Send match object to router to navigate to edit page
}
async function setupDeleteModal(event){
    const target = event.target;
    const deleteButton = target.closest('.delete-button');
    
    if (!deleteButton) return;

    let hotelId = deleteButton.id.split('_')[0];
    document.querySelector('#delete-button').removeEventListener('click', onDeleteButtonClick);
    const hotel = await fetch(`${URL}/${hotelId}`, makeOptions("GET", null)).then((r) =>handleHttpErrors(r));
    const hotelModalInfo = `
            <div class="mb-1">
                Hotelnavn: ${hotel.name}
            </div>
            <div class="mb-1">
                Addresse: ${hotel.street}
            </div>
            <div class="mb-1">
                By: ${hotel.city}
            </div>
            <div class="mb-1">
                Zipkode: ${hotel.zip}
            </div>
            <div class="mb-1">
                Land: ${hotel.country}
            </div>
            <div class="mb-1">
                Antal værelser: ${hotel.numberOfRooms}
            </div>
        `;
        document.querySelector('.modal-body').innerHTML = sanitizeStringWithTableRows(hotelModalInfo);
        document.querySelector('#delete-button').addEventListener('click', onDeleteButtonClick);
        function onDeleteButtonClick() { //This shouldn't be inside the function. Should be outside. Used for removing the event listener.
            deleteHotel(hotelId); //This part of code exist to remove and add event listeneres otherwise i had duplicate data on the eventlisteners.
            document.querySelector('#delete-button').removeEventListener('click', onDeleteButtonClick);
        }
}
async function deleteHotel(hotelId){
    try { 
        await fetch(`${URL}/${hotelId}`, makeOptions("DELETE", null, true)).then(handleHttpErrors);
        document.querySelector('#close-modal-button').click();
        initHotelEditDelete();
      } catch (error) {
        if(error.message === "Hotel has reservations"){
            document.querySelector('.modal-body').innerHTML = "Hotellet har reservationer og kan derfor ikke slettes"
        }
    }
}
function getDetails(){ //Not used, leftover from refactoring.
    const target = event.target;
    if(!target.id.endsWith('_hotel-id')) return;
    const hotelId = target.id.split('_')[0];
    router.navigate(`/hotels-details/?hotelId=${hotelId}`);
}
function displayPagination(totalPages, currentPage){
    let paginationHTML = ''; 
    if(currentPage > 0){ //Checks if the currentPage is greater than 0. If it is, then it displays the previous button.
        paginationHTML += `<li class="page-item"><a class="page-link" data-page="${currentPage - 1}" href="#">Previous</li>`;
    }
    //Display page numbers
    let startPage = Math.max(0, currentPage - 2); //Checks if the currentPage is greater than 2. If it is, then it sets the startPage to currentPage - 2. If not, then it sets it to 0.
    let endPage = Math.min(totalPages - 1, currentPage + 2); //Checks if the currentPage is less than totalPages - 1. If it is, then it sets the endPage to currentPage + 2. If not, then it sets it to totalPages - 1.
    for(let i = startPage; i <= endPage; i++){ //Loops through the pages
        if(i === currentPage){ //Checks if the page is the currentPage. If it is, then it sets the class to active.
        paginationHTML += `<li class="page-item active"><a class="page-link" href="#">${i + 1}</a></li>`;
        } else { //If not, then it sets the class to empty.
        paginationHTML += `<li class="page-item"><a class="page-link" data-page="${i}" href="#">${i + 1}</a></li>`;
        }
    }
    if(currentPage < totalPages - 1){ //Checks if the currentPage is less than totalPages - 1. If it is, then it displays the next button.
        paginationHTML += `<li class="page-item"><a class="page-link" data-page="${currentPage + 1}" href="#">Next</li>`;
    }
    document.querySelector('#pagination').innerHTML = paginationHTML; //Displays the paginationHTML
}
function handlePaginationClick(evt){ //Event bubbling on pagination buttons. Sets page number
    evt.preventDefault();
    if (evt.target.tagName === 'A' && evt.target.hasAttribute('data-page')) { //Checks if the target is an anchor tag and has the attribute data-page
        const page = parseInt(evt.target.getAttribute('data-page')); 
        fetchData(page); //Fetches the hotels, with the page number.
    }
}
