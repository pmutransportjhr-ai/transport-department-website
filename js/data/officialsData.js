/**
 * Key Officials Data Object
 * Transport Department, Government of Jharkhand
 */
const officialsData = [
    {
        id: "cm",
        name: "Shri Hemant Soren",
        designation: "Hon'ble Chief Minister",
        department: "Government of Jharkhand",
        image: "img/officials/cm_HS.jpg",
        badge: "Govt",
        badgeClass: "badge-gold",
        profileLink: "contact-details.html#cm"
    },
    {
        id: "minister",
        name: "Shri Deepak Birua",
        designation: "Hon'ble Minister",
        department: "Transport Department",
        image: "img/officials/tm2.jpg",
        badge: "Minister",
        badgeClass: "badge-green",
        profileLink: "contact-details.html#minister"
    },
    {
        id: "secretary",
        name: "Shri Rajeev Ranjan",
        designation: "Transport Secretary",
        department: "Department of Transport",
        image: "img/officials/sec2.jpeg",
        badge: "Secretary",
        badgeClass: "badge-blue",
        profileLink: "contact-details.html#secretary"
    },
    {
        id: "commissioner",
        name: "Shri Sanjeev Kumar Besra",
        designation: "Transport Commissioner",
        department: "State Transport Authority",
        image: "img/officials/com.png",
        badge: "Commissioner",
        badgeClass: "badge-blue",
        profileLink: "contact-details.html#commissioner"
    }
];

if (typeof module !== 'undefined' && module.exports) {
    module.exports = officialsData;
}
