// Sample PG data (you can replace with real data from backend)

const express = require('express')
const pgListings = [
    {
        id: 1,
        location: "Delhi",
        price: 8000,
        image: "https://via.placeholder.com/200x150",
        description: "Luxurious PG with AC facilities",
        amenities: ["Wi-Fi", "Laundry", "Food Service"]
    },
    {
        id: 2,
        location: "Patna",
        price: 8000,
        image: "https://via.placeholder.com/200x150",
        description: "Luxurious PG with AC facilities",
        amenities: ["Wi-Fi", "Laundry", "Food Service"]
    },
    {
        id: 3,
        location: "Mumbai",
        price: 10000,
        image: "https://via.placeholder.com/200x150",
        description: "Girls PG near college area",
        amenities: ["Security", "Parking", "TV Lounge"]
    },
    // Add more listings...
];

async function searchPG() {
    const locationInput = document.getElementById('location').value;
    const budgetInput = document.getElementById('budget').value;
  
    try {
      const response = await fetch(`/api/rooms?location=${locationInput}&maxPrice=${budgetInput}`);
      const filteredPGs = await response.json();
      displayResults(filteredPGs);
    } catch (error) {
      console.error('Error:', error);
    }
  }

function displayResults(results) {
    const resultsSection = document.getElementById('results');
    resultsSection.innerHTML = '';

    if(results.length === 0) {
        resultsSection.innerHTML = '<p class="no-results">No PG found matching your criteria</p>';
        return;
    }

    results.forEach(pg => {
        const pgCard = document.createElement('div');
        pgCard.className = 'pg-card';
        pgCard.innerHTML = `
            <img src="${pg.image}" class="pg-image" alt="PG Image">
            <div class="pg-details">
                <h3>${pg.location} PG</h3>
                <p>${pg.description}</p>
                <div class="amenities">
                    ${pg.amenities.map(amenity => `<span class="amenity">${amenity}</span>`).join(' ')}
                </div>
            </div>
            <div class="price">
                ₹${pg.price}/mo
            </div>
        `;
        resultsSection.appendChild(pgCard);
    });
}
async function createRoomListing(roomData) {
    try {
      const response = await fetch('/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(roomData)
      });
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
    }
  }