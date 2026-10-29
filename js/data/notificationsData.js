/**
 * Notifications & Bulletins Data Object
 * Transport Department, Government of Jharkhand
 */

const tickerNotifications = [
    {
        id: 1,
        text: "Transport services are now available online across Jharkhand.",
        highlight: "Apply Online",
        link: "how_do_i.html"
    },
    {
        id: 2,
        text: "Pay pending e-Challans through the official Parivahan e-Challan portal to avoid court summons.",
        highlight: "Pay e-Challan",
        link: "https://echallan.parivahan.gov.in/"
    },
    {
        id: 3,
        text: "FASTag mandatory on all National & State Toll Plazas across Jharkhand.",
        highlight: "FASTag Info",
        link: "https://parivahan.gov.in/"
    }
];

const departmentNotifications = [
    {
        id: "notif-1",
        title: "Process Flow of PUCC 2.0 Emission Standards",
        date: "2026-08-10",
        url: "pdf/Process Flow of PUCC 2.0.pdf",
        isNew: true,
        category: "Notifications",
        type: "PDF",
        size: "1.2 MB"
    },
    {
        id: "notif-2",
        title: "One Time Settlement (OTS) Scheme for Tax Defaulters",
        date: "2026-08-04",
        url: "pdf/OTS_NOTIFICATION.pdf",
        isNew: false,
        category: "Notifications",
        type: "PDF",
        size: "850 KB"
    },
    {
        id: "notif-3",
        title: "झारखण्ड मोटरयान निरीक्षक पदस्थापित सूची (MVI Posting List)",
        date: "2026-07-28",
        url: "pdf/MVI_POSTING.pdf",
        isNew: true,
        category: "Notifications",
        type: "PDF",
        size: "2.1 MB"
    },
    {
        id: "notif-4",
        title: "मोटरयान निरीक्षकों की अंतिम वरीयता सूची (MVI Seniority List)",
        date: "2026-07-15",
        url: "pdf/MVI_priorty.pdf",
        isNew: false,
        category: "Notifications",
        type: "PDF",
        size: "1.8 MB"
    },
    {
        id: "notif-5",
        title: "Pre-Owned Vehicle Dealer Authorisation Rules GSR 901(e)",
        date: "2026-07-02",
        url: "pdf/PREOWNED.pdf",
        isNew: false,
        category: "Notifications",
        type: "PDF",
        size: "16.2 MB"
    },
    {
        id: "notif-6",
        title: "Approved Bus Routes under Mukhyamantri Gram Gadi Yojna",
        date: "2026-06-20",
        url: "pdf/Route  notification under Mukhyamantri Gram Gadi Yojna5.pdf",
        isNew: false,
        category: "Notifications",
        type: "PDF",
        size: "135 KB"
    }
];

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { tickerNotifications, departmentNotifications };
}
