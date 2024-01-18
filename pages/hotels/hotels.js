import { API_URL } from "../../settings.js";
import { handleHttpErrors, makeOptions, sanitizeStringWithTableRows} from "../../utility.js";

const URL = API_URL + "/hotel";
const PAGE_SIZE = 10;
let sortColumn = "name";
let sortDirection = "asc";
let isInitialized = false;

export function initHotels(){
    const page = 0;
    if(!isInitialized){
        isInitialized = true;
        document.querySelector('#header-row').addEventListener('click', handleSort);
        document.querySelector('#pagination').addEventListener('click', handlePaginationClick);
    }
    fetchData(Number(page));
    // document.querySelector('#hotel-options-button').addEventListener('click', getOptions);
}
function handleSort(evt){
    const target = evt.target.closest('th');

    if (!target.id.startsWith('sort-')) return;
    sortColumn = target.id.split("-")[1];
    sortDirection = target.dataset.sort_direction === 'asc' ? 'desc' : 'asc';
    target.dataset.sort_direction = sortDirection;
    fetchData();
}

async function fetchData(page = 0/*, filter*/){
    const queryString = `?page=${page}&size=${PAGE_SIZE}&sort=${sortColumn},${sortDirection}`
    // const queryString = `?page=${page}&size=${PAGE_SIZE}&sort=${sortColumn},${sortDirection}&filter=${selectedFilter}`
    try{
    const hotels = await fetch(`${URL}${queryString}`, makeOptions("GET", null)).then((r) =>

        handleHttpErrors(r)
    );
    displayHotels(hotels.content)
    displayPagination(hotels.totalPages, page);
    } catch (error) {
        console.log(error)
    }      
}
function displayHotels(hotels){
    document.querySelector('#hotel-table-body').innerHTML = sanitizeStringWithTableRows(hotels.map(hotel => `
    <tr>
        <td>${hotel.name}</td>
        <td>${hotel.street}</td>
        <td>${hotel.city}</td>
        <td>${hotel.zip}</td>
        <td>${hotel.country}</td>
        <td>${hotel.numberOfRooms}</td>
        <td><button id="${hotel.id}_hotel-id" class="btn btn-outline-dark">Detaljer</button><td>
    </tr>    
    `).join(''));
    document.querySelector('#hotel-table-body').addEventListener('click', getDetails);
}
function getDetails(){
    const target = event.target;
    if(!target.id.endsWith('_hotel-id')) return;
    const hotelId = target.id.split('_')[0];
    router.navigate(`/hotels-details/?hotelId=${hotelId}`);
}
function displayPagination(totalPages, currentPage){
    let paginationHTML = '';
    if(currentPage > 0){
        paginationHTML += `<li class="page-item"><a class="page-link" data-page="${currentPage - 1}" href="#">Previous</li>`;
    }
    //Display page numbers
    let startPage = Math.max(0, currentPage - 2);
    let endPage = Math.min(totalPages - 1, currentPage + 2);
    for(let i = startPage; i <= endPage; i++){
        if(i === currentPage){
        paginationHTML += `<li class="page-item active"><a class="page-link" href="#">${i + 1}</a></li>`;
        } else {
        paginationHTML += `<li class="page-item"><a class="page-link" data-page="${i}" href="#">${i + 1}</a></li>`;
        }
    }
    if(currentPage < totalPages - 1){
        paginationHTML += `<li class="page-item"><a class="page-link" data-page="${currentPage + 1}" href="#">Next</li>`;
    }
    document.querySelector('#pagination').innerHTML = paginationHTML;
}
function handlePaginationClick(evt){
    evt.preventDefault();
    if (evt.target.tagName === 'A' && evt.target.hasAttribute('data-page')) {
        const page = parseInt(evt.target.getAttribute('data-page'));
        fetchData(page);
    }
}
//  function getOptions(){
//      event.preventDefault();
//      const filter = document.querySelector('#hotel-options').value
//      fetchData(filter, 0);
