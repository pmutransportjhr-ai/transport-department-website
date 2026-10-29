/**
 * Transport Department Live Dashboard Statistics Object
 * Transport Department, Government of Jharkhand
 */

const dashboardData = [
    {
        id: "vehicles",
        count: "3,85,200+",
        label: "Registered Vehicles (VAHAN)",
        subtext: "State Transport Repository",
        icon: "fa-car",
        iconColor: "#1670f5",
        iconBg: "#e8f1fd",
        borderColor: "#b2d1fd"
    },
    {
        id: "licences",
        count: "1,42,850+",
        label: "Driving Licences Issued (SARATHI)",
        subtext: "Active DL & Learner Licenses",
        icon: "fa-id-card",
        iconColor: "#27ae60",
        iconBg: "#eafaf1",
        borderColor: "#a9dfbf"
    },
    {
        id: "fastag",
        count: "98.5%",
        label: "FASTag Electronic Toll Collection",
        subtext: "National & State Toll Plazas",
        icon: "fa-credit-card",
        iconColor: "#d89f00",
        iconBg: "#fef6e6",
        borderColor: "#f9e79f"
    },
    {
        id: "pucc",
        count: "450+",
        label: "PUCC & Fitness Testing Centers",
        subtext: "Automated Inspection System",
        icon: "fa-wrench",
        iconColor: "#8e44ad",
        iconBg: "#f4eaf9",
        borderColor: "#d7bde2"
    }
];

if (typeof module !== 'undefined' && module.exports) {
    module.exports = dashboardData;
}
