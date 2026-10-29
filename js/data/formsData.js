/**
 * Citizen Forms & Quick Links Data Object
 * Transport Department, Government of Jharkhand
 */

const formsData = [
    {
        id: "form-1",
        title: "Registration Forms (Form 20, 28, 29, 30 & NOC)",
        subtitle: "Application for vehicle registration, NOC & ownership transfer",
        url: "forms.html",
        icon: "fa-file-pdf-o",
        color: "#e83b50",
        category: "Forms",
        type: "PDF Forms"
    },
    {
        id: "form-2",
        title: "Driving Licence Forms (Form 2 & Renewal Form 9)",
        subtitle: "Learner licence & driving licence renewal application forms",
        url: "forms.html",
        icon: "fa-id-card-o",
        color: "#007541",
        category: "Forms",
        type: "PDF Forms"
    },
    {
        id: "form-3",
        title: "Complete Fee Structure & Tariff Schedule",
        subtitle: "Official prescribed fees for registration, DL, permits & fitness",
        url: "fee.html",
        icon: "fa-table",
        color: "#1670f5",
        category: "Forms",
        type: "Tariff Guide"
    },
    {
        id: "form-4",
        title: "District RTO Series Codes (JH-01 to JH-24)",
        subtitle: "Complete district registration code map & office details",
        url: "dist-codes-vehicle-registration.html",
        icon: "fa-map-marker",
        color: "#d89f00",
        category: "Portals",
        type: "RTO Map"
    },
    {
        id: "form-5",
        title: "Mandatory & Cautionary Road Safety Signs Manual",
        subtitle: "Road sign index, regulatory signs and driver safety rules",
        url: "road-signs.html",
        icon: "fa-shield",
        color: "#8e44ad",
        category: "Traffic & DL",
        type: "Safety Signs"
    }
];

if (typeof module !== 'undefined' && module.exports) {
    module.exports = formsData;
}
