/**
 * Hero Carousel Banners Data Object
 * Transport Department, Government of Jharkhand
 */

const bannersData = [
    {
        id: 1,
        title: "SAFE ROADS, SAVE LIVES",
        subtitle: "Digitized citizen services for vehicle registration, driving licences, permits and road safety guidelines across Jharkhand.",
        badge: "NATIONAL ROAD SAFETY MISSION",
        highlight: "100% CONTACTLESS E-SERVICES",
        image: "img/banners/img1.jpeg",
        buttonText: "Access Services",
        buttonUrl: "how_do_i.html"
    },
    {
        id: 2,
        title: "DIGITAL TRANSPORT SERVICES",
        subtitle: "Provide Services to Get Permit of Stage Carriage Vehicles, Buses and Counter Signature Through Spermit Portal.",
        badge: "DIGITAL PARIVAHAN PORTAL",
        highlight: "SMART DIGITAL GOVERNANCE",
        image: "img/banners/img2.jpeg",
        buttonText: "Access Services",
        buttonUrl: "permit.html"
    },
    {
        id: 3,
        title: "ROAD SAFETY & SMART SURVEILLANCE",
        subtitle: "Promoting safer roads, automated pollution control centers, FASTag toll integration, and transparent administration.",
        badge: "ROAD SAFETY INITIATIVES",
        highlight: "SAFE ROADS, BETTER LIVES",
        image: "img/banners/Jharkhand%20Road%20Safety%20Awareness%20Campaign.png",
        buttonText: "Safety Guidelines",
        buttonUrl: "road-signs.html"
    }
];

if (typeof module !== 'undefined' && module.exports) {
    module.exports = bannersData;
}
