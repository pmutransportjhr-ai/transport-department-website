/**
 * Quick Services & Citizen Online Transport Portals Data Objects
 * Transport Department, Government of Jharkhand
 */

const quickServicesData = [
    {
        id: "echallan-quick",
        title: "e-Challan Payment",
        subtitle: "Pay Traffic Challan Online",
        icon: "fa-credit-card",
        image: "img/services/echallan.jfif",
        url: "https://echallan.parivahan.gov.in/index/accused-challan",
        external: true,
        badge: "Challan"
    },
    {
        id: "roadtax-quick",
        title: "Road Tax Payment",
        subtitle: "Online MV Tax Payment",
        icon: "fa-calculator",
        image: "img/services/tax-online.jpg",
        url: "https://vahan.parivahan.gov.in/vahanservice",
        external: true,
        badge: "Tax"
    },
    {
        id: "vahan-quick",
        title: "VAHAN 4 Services",
        subtitle: "RC & Vehicle Related Services",
        icon: "fa-car",
        image: "img/services/vehicle-reg.jpg",
        url: "https://vahan.parivahan.gov.in/vahanservice/",
        external: true,
        badge: "Vehicle"
    },
    {
        id: "sarathi-quick",
        title: "SARATHI Services",
        subtitle: "DL & Learner License Services",
        icon: "fa-id-badge",
        image: "img/services/driving-license.jpg",
        url: "https://parivahan.gov.in/sarathi",
        external: true,
        badge: "Licence"
    },
    {
        id: "checkpost-quick",
        title: "Online Checkpost",
        subtitle: "Interstate Checkpost Tax",
        icon: "fa-shield",
        image: "img/services/check-post.jpg",
        url: "https://vahan.parivahan.gov.in/checkpost/",
        external: true,
        badge: "Border"
    },
    {
        id: "ggy-quick",
        title: "Gram Gadi Yojna",
        subtitle: "Rural Transport Scheme",
        icon: "fa-bus",
        image: "img/services/ggy.jpg",
        url: "pdf/Route  notification under Mukhyamantri Gram Gadi Yojna5.pdf",
        external: true,
        badge: "Scheme"
    }
];

const citizenPortalsData = [
    {
        id: "echallan-portal",
        title: "e-Challan",
        subtitle: "Pay challan online",
        description: "Instant online traffic challan search and payment gateway.",
        iconClass: "fa-credit-card",
        iconColor: "#e83b50",
        iconBg: "#fde8eb",
        url: "https://echallan.parivahan.gov.in/index/accused-challan",
        external: true,
        badgeText: "Instant Pay"
    },
    {
        id: "tax-portal",
        title: "Tax Payment",
        subtitle: "Road tax payment",
        description: "Motor vehicle tax payment, tax calculation and receipt print.",
        iconClass: "fa-calculator",
        iconColor: "#007541",
        iconBg: "#e6f4ed",
        url: "https://vahan.parivahan.gov.in/vahanservice/",
        external: true,
        badgeText: "MV Tax"
    },
    {
        id: "vahan-portal",
        title: "VAHAN Portal",
        subtitle: "Vehicle related services",
        description: "Vehicle registration, ownership transfer, NOC & duplicate RC.",
        iconClass: "fa-car",
        iconColor: "#1670f5",
        iconBg: "#e8f1fd",
        url: "https://vahan.parivahan.gov.in/vahanservice/",
        external: true,
        badgeText: "RC Services"
    },
    {
        id: "sarathi-portal",
        title: "SARATHI Portal",
        subtitle: "Driving licence services",
        description: "Learner licence, permanent DL, DL renewal and slot booking.",
        iconClass: "fa-id-card",
        iconColor: "#d89f00",
        iconBg: "#fef6e6",
        url: "https://parivahan.gov.in/sarathiservice/",
        external: true,
        badgeText: "DL Services"
    },
    {
        id: "checkpost-portal",
        title: "Checkpost",
        subtitle: "Online checkpost services",
        description: "Interstate checkpost entry tax and border permit payments.",
        iconClass: "fa-shield",
        iconColor: "#8e44ad",
        iconBg: "#f4eaf9",
        url: "https://parivahan.gov.in/checkpost/",
        external: true,
        badgeText: "Border Tax"
    },
    {
        id: "gram-gadi-portal",
        title: "Gram Gadi Yojna",
        subtitle: "Rural transport scheme",
        description: "Mukhyamantri Gram Gadi Yojna approved bus routes and info.",
        iconClass: "fa-bus",
        iconColor: "#27ae60",
        iconBg: "#eafaf1",
        url: "pdf/Route  notification under Mukhyamantri Gram Gadi Yojna5.pdf",
        external: true,
        badgeText: "Rural Bus"
    },
    {
        id: "permit-portal",
        title: "National Permit",
        subtitle: "Online Permit Gateway",
        description: "Goods & stage carriage permits, counter signatures & authorization.",
        iconClass: "fa-truck",
        iconColor: "#e67e22",
        iconBg: "#fdf2e9",
        url: "https://parivahan.gov.in/npermit/",
        external: true,
        badgeText: "Permit"
    },
    {
        id: "edar-portal",
        title: "e-DAR & Safety",
        subtitle: "Accident Data & Safety",
        description: "Detailed accident reporting, road safety guidelines & victim support.",
        iconClass: "fa-heartbeat",
        iconColor: "#c0392b",
        iconBg: "#fadbd8",
        url: "road-signs.html",
        external: false,
        badgeText: "Safety"
    }
];

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { quickServicesData, citizenPortalsData };
}

