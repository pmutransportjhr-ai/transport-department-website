/**
 * Public Repository Desk Data Objects (8 Cards Grid)
 * Transport Department, Government of Jharkhand
 */

const repositoryCardsData = [
    {
        id: "repo-1",
        category: "Notifications",
        title: "Notifications & Orders",
        badge: "PDF",
        badgeColor: "#e83b50",
        icon: "fa-bell",
        moreLink: "archive.html",
        items: [
            { title: "Process Flow of PUCC 2.0 Emission Standards", url: "pdf/Process Flow of PUCC 2.0.pdf", isNew: true, date: "Published: 10 Aug 2026" },
            { title: "Objection invited for provisional route of RTA Dumka", url: "pdf/Objection _Dumka.pdf", isNew: true, date: "Published: 08 Aug 2026" },
            { title: "Process flow of Dealer Authorisation Certificate", url: "pdf/PREOWNED.pdf", isNew: true, date: "Published: 04 Aug 2026" },
            { title: "Hearing Notice against vehicle BR27P6288", url: "pdf/BR27P6288.pdf", isNew: false, date: "Published: 28 Jul 2026" },
            { title: "Notification Regarding One Time Settlement (OTS) Scheme", url: "pdf/OTS_NOTIFICATION.pdf", isNew: false, date: "Published: 15 Jul 2026" }
        ]
    },
    {
        id: "repo-2",
        category: "Traffic & DL",
        title: "Traffic Rules & Licensing",
        badge: "PDF",
        badgeColor: "#f3a800",
        icon: "fa-road",
        moreLink: "traffic-rules-regulations.html",
        items: [
            { title: "Learner Licence (LL) Computer Test Question Bank", url: "driving-license.html", isNew: false, date: "Published: Recent" },
            { title: "Do's and Don'ts for Highway & Expressway Traveling", url: "dodoes.html", isNew: false, date: "" },
            { title: "Driving Licence Online Booking & Slot Information", url: "driving-license.html", isNew: false, date: "" },
            { title: "Standard Road Signs & Mandatory Signals Manual", url: "road-signs.html", isNew: true, date: "" },
            { title: "Automated Vehicle Fitness Testing Norms", url: "vehicle-fitness.html", isNew: false, date: "" }
        ]
    },
    {
        id: "repo-3",
        category: "Forms",
        title: "Forms & Departmental Docs",
        badge: "PDF",
        badgeColor: "#1670f5",
        icon: "fa-file-text",
        moreLink: "forms.html",
        items: [
            { title: "HSRP Fitment Flow at Authorized Dealer Point", url: "forms.html", isNew: false, date: "" },
            { title: "State Transport Departmental Public Documents", url: "departmental-documents.html", isNew: false, date: "" },
            { title: "Downloadable Motor Vehicle Forms (Form 20, 26, 28, 29, 30)", url: "forms.html", isNew: false, date: "" },
            { title: "Central Motor Vehicles Rules & Amendments", url: "acts-rules.html", isNew: false, date: "" },
            { title: "How Do I Apply Online Citizen Guide", url: "how_do_i.html", isNew: true, date: "" }
        ]
    },
    {
        id: "repo-4",
        category: "Portals",
        title: "Online Citizen Portals",
        badge: "PDF",
        badgeColor: "#e83b50",
        icon: "fa-cogs",
        moreLink: "how_do_i.html",
        items: [
            { title: "Jharkhand State Permit Application (spermit)", url: "https://parivahan.gov.in/", isExternal: true },
            { title: "VAHAN 4.0 Vehicle Registration Services", url: "https://vahan.parivahan.gov.in/", isExternal: true },
            { title: "SARATHI 4.0 Driving Licence Online Gateway", url: "https://sarathi.parivahan.gov.in/", isExternal: true },
            { title: "National Checkpost Tax Online Payment", url: "https://vahan.parivahan.gov.in/checkpost/", isExternal: true }
        ]
    },
    {
        id: "repo-5",
        category: "Notifications",
        title: "Departmental Proceedings",
        badge: "PDF",
        badgeColor: "#1670f5",
        icon: "fa-envelope-open",
        moreLink: "departmental-documents.html",
        items: [
            { title: "Transfer of Vehicle Ownership Meeting Proceedings", url: "departmental-documents.html", isNew: true, date: "Published: 06 Mar 2026" },
            { title: "Transport Revenue Collection Review Meeting", url: "departmental-documents.html", isNew: true, date: "Published: 02 Mar 2026" },
            { title: "FASTag Digital Toll Payment Implementation Letter", url: "departmental-documents.html", isNew: false, date: "" }
        ]
    },
    {
        id: "repo-6",
        category: "Traffic & DL",
        title: "Act & Gazette Rules",
        badge: "PDF",
        badgeColor: "#007541",
        icon: "fa-university",
        moreLink: "acts-rules.html",
        items: [
            { title: "Gazette Notification regarding HSRP Implementation", url: "pdf/Jharkhand Motor Vehicles(Amendment) Rules,2023.pdf", isNew: true },
            { title: "Motor Vehicles (Amendment) Act 2019 Complete Gazette", url: "pdf/the-central-motor-vehicles-rules-1989.pdf", isNew: false },
            { title: "Jharkhand Motor Vehicles Amendment Rule 2021", url: "pdf/Jharkhand Motor Vehicles(Amendment) Rules,2023.pdf", isNew: false }
        ]
    },
    {
        id: "repo-7",
        category: "Forms",
        title: "MoRTH Central Gazette",
        badge: "PDF",
        badgeColor: "#8e44ad",
        icon: "fa-book",
        moreLink: "acts-rules.html",
        items: [
            { title: "GSR 200(E) Central Motor Vehicles Rules Update", url: "pdf/the-central-motor-vehicles-rules-1989.pdf", isNew: false },
            { title: "Automated Testing Station (ATS) Governance Rules", url: "pdf/the-central-motor-vehicles-rules-1989.pdf", isNew: false },
            { title: "Registered Vehicle Scrapping Facility (RVSF) Policy", url: "pdf/PREOWNED.pdf", isNew: false }
        ]
    },
    {
        id: "repo-8",
        category: "Traffic & DL",
        title: "Road Safety Mission",
        badge: "PDF",
        badgeColor: "#27ae60",
        icon: "fa-shield",
        moreLink: "road-signs.html",
        items: [
            { title: "Implementation of Road Safety Enforcement SOP", url: "pdf/Good Samaritan Jharkhand Gazette 23.09.2022.pdf", isNew: true },
            { title: "Good Samaritan Protection Gazette Guidelines", url: "pdf/Good Samaritan Jharkhand Gazette 23.09.2022.pdf", isNew: false },
            { title: "Road Safety Advocacy & Public Awareness Manual", url: "road-signs.html", isNew: false }
        ]
    }
];

if (typeof module !== 'undefined' && module.exports) {
    module.exports = repositoryCardsData;
}
