document.addEventListener("DOMContentLoaded", function () {
    function fetchMovieDetails() {
        fetch("http://localhost:3000/films/1")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(movieData => {
                const posterElement = document.getElementById("poster");
                const titleElement = document.getElementById("title");
                const runtimeElement = document.getElementById("runtime");
                const showtimeElement = document.getElementById("showtime");
                const ticketNumElement = document.getElementById("ticket-num");

                posterElement.src = movieData.poster;
                titleElement.textContent = movieData.title;
                runtimeElement.textContent = `${movieData.runtime} minutes`;
                showtimeElement.textContent = movieData.showtime;

                const availableTickets = movieData.capacity - movieData.tickets_sold;
                ticketNumElement.textContent = `${availableTickets} remaining tickets`;
            })
            .catch(error => {
                console.error("Error fetching movie details:", error);
            });
    }

    fetchMovieDetails();
});

document.addEventListener("DOMContentLoaded", function () {
    function fetchAllMovies() {
        fetch("http://localhost:3000/films")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(movieList => {
                const filmsListElement = document.getElementById("films");
                filmsListElement.innerHTML = '';

                movieList.forEach(movie => {
                    const listItem = document.createElement("li");
                    listItem.textContent = movie.title;
                    listItem.classList.add("film", "item");
                    filmsListElement.appendChild(listItem);
                });
            })
            .catch(error => {
                console.error("Error fetching movie list:", error);
            });
    }

    fetchAllMovies();
});

document.addEventListener("DOMContentLoaded", function () {
    function buyTicket() {
        const buyButton = document.getElementById("buy-ticket");
        buyButton.addEventListener("click", function () {
            const ticketNumElement = document.getElementById("ticket-num");
            const availableTickets = parseInt(ticketNumElement.textContent);
            if (availableTickets > 0) {
                const newAvailableTickets = availableTickets - 1;
                ticketNumElement.textContent = `${newAvailableTickets} remaining tickets`;

                const filmId = 1;
                fetch(`http://localhost:3000/films/${filmId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        tickets_sold: newAvailableTickets
                    })
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error("Network response was not ok");
                        }
                        return response.json();
                    })
                    .then(updatedFilm => {
                        fetch('http://localhost:3000/tickets', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                film_id: filmId,
                                number_of_tickets: 1
                            })
                        })
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error("Network response was not ok");
                                }
                                return response.json();
                            })
                            .then(newTicket => {
                                console.log("Ticket purchased successfully:", newTicket);
                            })
                            .catch(error => {
                                console.error("Error purchasing ticket:", error);
                            });
                    })
                    .catch(error => {
                        console.error("Error updating tickets_sold count:", error);
                    });
            } else {
                console.log("No available tickets");
            }
        });
    }

    buyTicket();
});

document.addEventListener("DOMContentLoaded", function () {
    function deleteFilm() {
        const filmsListElement = document.getElementById("films");
        filmsListElement.addEventListener("click", function (event) {
            if (event.target.classList.contains("delete-button")) {
                const filmId = event.target.getAttribute("data-id");
                const filmItem = event.target.closest(".film.item");
                filmItem.remove();

                fetch(`http://localhost:3000/films/${filmId}`, {
                    method: 'DELETE'
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error("Network response was not ok");
                        }
                        return response.json();
                    })
                    .then(deletedFilm => {
                        console.log("Film deleted successfully:", deletedFilm);
                    })
                    .catch(error => {
                        console.error("Error deleting film:", error);
                    });
            }
        });
    }

    deleteFilm();
});

document.addEventListener("DOMContentLoaded", function () {
    function indicateSoldOut() {
        const filmsList = document.getElementById("films");
        const filmItems = filmsList.querySelectorAll(".film.item");

        filmItems.forEach(item => {
            const ticketNumElement = item.querySelector("#ticket-num");
            const availableTickets = parseInt(ticketNumElement.textContent);

            if (availableTickets === 0) {
                const buyButton = item.querySelector("#buy-ticket");
                buyButton.textContent = "Sold Out";
                item.classList.add("sold-out");
            }
        });
    }

    indicateSoldOut();
});

const availableTickets = 0;

const buyButton = document.getElementById("buy-ticket");
const filmItem = document.querySelector("#films .film.item");

if (availableTickets === 0) {
    buyButton.textContent = "Sold Out";
    filmItem.classList.add("sold-out");
}