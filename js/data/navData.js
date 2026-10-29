/**
 * Navigation Menu & Portal Links Data Object
 * Transport Department, Government of Jharkhand
 */

const navData = {
    topStrip: {
        helpline: "1033",
        helplineText: "National Highway Helpline: 1033",
        skipId: "#main-content",
        languages: [
            { code: "en", name: "English" },
            { code: "hi", name: "हिन्दी (Hindi)" }
        ]
    },
    headerBranding: {
        hindiTitle: "परिवहन विभाग, झारखण्ड सरकार",
        englishTitle: "DEPARTMENT OF TRANSPORT, GOVT. OF JHARKHAND",
        subtitle: "Ministry of Road Transport & Highways Partner Agency",
        logo: "img/brand/logo_new.jpg",
        parivahanLink: "https://parivahan.gov.in/",
        digitalIndiaLink: "https://www.digitalindia.gov.in/"
    },
    mainMenu: [
        {
            title: "Home",
            url: "index.html",
            icon: "fa-home",
            activeOn: ["index.html", ""]
        },
        {
            title: "About Us",
            url: "about-us.html",
            icon: "fa-info-circle",
            activeOn: ["about-us.html"]
        },
        {
            title: "Online Services",
            url: "how_do_i.html",
            icon: "fa-desktop",
            dropdown: [
                { title: "Online Services Guide", url: "how_do_i.html" },
                { title: "Vehicle Registration (VAHAN)", url: "vehicle-registration.html" },
                { title: "Driving License (SARATHI)", url: "driving-license.html" },
                { title: "Permits & Road Tax Payment", url: "permit.html" },
                { title: "Forms, Fitness & PUC 2.0", url: "forms.html" }
            ]
        },
        {
            title: "Citizen Services",
            url: "citizen-charter.html",
            icon: "fa-users",
            dropdown: [
                { title: "Citizen Charter", url: "citizen-charter.html" },
                { title: "How to Obtain Driving License", url: "how-to-obtain-driving-license.html" },
                { title: "District Codes & RTO Directory", url: "dist-codes-vehicle-registration.html" },
                { title: "Enforcement & Penalties", url: "enforcement.html" },
                { title: "Vahan 4 & Sarathi Info", url: "vahan4.html" }
            ]
        },
        {
            title: "For Your Safety",
            url: "road-signs.html",
            icon: "fa-shield",
            dropdown: [
                { title: "Road Signs & Traffic Signals", url: "road-signs.html" },
                { title: "Traffic Rules & Driver Guidelines", url: "traffic-rules-regulations.html" },
                { title: "Accident Prevention & Victim Support", url: "causes-of-road-accidents.html" },
                { title: "Pedestrian, Cyclist & Bus Safety", url: "safety-tips-pedestrian.html" }
            ]
        },
        {
            title: "Knowledge Center",
            url: "departmental-documents.html",
            icon: "fa-book",
            dropdown: [
                { title: "Departmental Documents", url: "departmental-documents.html" },
                { title: "Acts & MV Rules", url: "acts-rules.html" },
                { title: "Archive Notifications", url: "archive.html" },
                { title: "Photo & Video Gallery", url: "galary.html" }
            ]
        },
        {
            title: "Acts & Rules",
            url: "acts-rules.html",
            icon: "fa-gavel",
            activeOn: ["acts-rules.html"]
        },
        {
            title: "Contact",
            url: "contact-details.html",
            icon: "fa-phone",
            activeOn: ["contact-details.html"]
        }
    ],
    ctaButton: {
        title: "Parivahan Portal",
        url: "https://parivahan.gov.in/",
        external: true,
        icon: "fa-external-link"
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = navData;
}
