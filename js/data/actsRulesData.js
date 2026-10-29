/**
 * Acts, Rules & Gazette Desk Data Object
 * Transport Department, Government of Jharkhand
 */

const actsRulesData = [
    {
        id: "act-1",
        title: "Central Motor Vehicles Rules 1989",
        subtitle: "Ministry of Road Transport & Highways, Govt of India",
        url: "pdf/the-central-motor-vehicles-rules-1989.pdf",
        type: "Act/Rule",
        icon: "fa-book",
        category: "Traffic & DL",
        year: "1989"
    },
    {
        id: "act-2",
        title: "Jharkhand Motor Vehicles (Amendment) Rules 2023",
        subtitle: "State gazette notification and state amendments",
        url: "pdf/Jharkhand Motor Vehicles(Amendment) Rules,2023.pdf",
        type: "Gazette",
        icon: "fa-gavel",
        category: "Notifications",
        year: "2023"
    },
    {
        id: "act-3",
        title: "Jharkhand Motor Vehicle Inspector (MVI) Cadre Rules 2014",
        subtitle: "Service conditions and recruitment guidelines",
        url: "pdf/mvi-cadre-rules.pdf",
        type: "Rule",
        icon: "fa-file-text-o",
        category: "Traffic & DL",
        year: "2014"
    },
    {
        id: "act-4",
        title: "Good Samaritan Jharkhand Gazette Notification 2022",
        subtitle: "Legal protection for road crash responders",
        url: "pdf/Good Samaritan Jharkhand Gazette 23.09.2022.pdf",
        type: "Gazette",
        icon: "fa-shield",
        category: "Notifications",
        year: "2022"
    },
    {
        id: "act-5",
        title: "Gazette Notification for RTA Routes (Ranchi & Kolhan)",
        subtitle: "Regional Transport Authority notified routes",
        url: "pdf/Gazette related to route of RTA Ranchi & Kolhan.pdf",
        type: "Gazette",
        icon: "fa-road",
        category: "Portals",
        year: "2022"
    }
];

if (typeof module !== 'undefined' && module.exports) {
    module.exports = actsRulesData;
}
