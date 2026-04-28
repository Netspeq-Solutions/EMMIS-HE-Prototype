/* ============================================================
   EMMIS HE — College Admin Portal
   jQuery Application Logic (Single-Page Architecture)
   ============================================================ */
(function ($) {
    'use strict';

    // ============================================================
    // 1. MOCK DATA
    // ============================================================

    // All colleges — mirrors app.js COLLEGES (lightweight: only fields needed by admin)
    var ALL_COLLEGES = [
        { id: 1,  name: "Sikkim Government College",         code: "SGC-TAD",  location: "Tadong, Gangtok",          district: "Gangtok",  type: "Government" },
        { id: 2,  name: "Dentam College",                    code: "DEN-COL",  location: "Rangpo, East Sikkim",       district: "Pakyong",  type: "Government" },
        { id: 3,  name: "Sikkim Arts College",               code: "SAC-GYL",  location: "Gyalshing, West Sikkim",   district: "Gyalshing",type: "Government" },
        { id: 4,  name: "Namchi Govt. College",              code: "NGC-NAM",  location: "Namchi, South Sikkim",      district: "Namchi",   type: "Government" },
        { id: 5,  name: "Mangan College",                    code: "MAN-COL",  location: "Mangan, North Sikkim",      district: "Mangan",   type: "Government" },
        { id: 6,  name: "Soreng College",                    code: "SOR-COL",  location: "Soreng, West Sikkim",       district: "Soreng",   type: "Government" },
        { id: 7,  name: "Nar Bahadur Bhandari Degree College",code: "NBB-COL", location: "Tadong, Gangtok",           district: "Gangtok",  type: "Government" },
        { id: 8,  name: "Rhenock College",                   code: "RHE-COL",  location: "Rhenock, East Sikkim",      district: "Pakyong",  type: "Government" },
        { id: 9,  name: "Government College Burtuk",         code: "SGC-BTK",  location: "Burtuk, Gangtok",           district: "Gangtok",  type: "Government" },
        { id: 10, name: "West Point College",                code: "WPC-GYL",  location: "Gyalshing, West Sikkim",   district: "Gyalshing",type: "Private"    },
        { id: 11, name: "Lingtam College",                   code: "LIN-COL",  location: "Lingtam, East Sikkim",      district: "Pakyong",  type: "Government" },
        { id: 12, name: "South Sikkim Govt. College",        code: "SSG-COL",  location: "Ravangla, South Sikkim",   district: "Namchi",   type: "Government" }
    ];

    // COLLEGE_INFO is populated dynamically from sessionStorage / college picker
    var COLLEGE_INFO = {
        id: null,
        name: "",
        code: "",
        session: "2026-27",
        district: ""
    };

    var COURSES = [
        { id: "bcom", name: "B.Com (Hons)", seats: 60, fee: 5000 },
        { id: "ba-polsci", name: "B.A. Political Science", seats: 48, fee: 4500 },
        { id: "bsc-phy", name: "B.Sc. Physics", seats: 40, fee: 6000 },
        { id: "ba-eng", name: "B.A. English (Hons)", seats: 50, fee: 4500 }
    ];

    var ELECTIVES = {
        "bcom": ["Financial Accounting", "Cost Accounting", "Business Law", "Taxation", "Marketing", "Entrepreneurship"],
        "ba-polsci": ["Indian Govt & Politics", "International Relations", "Political Theory", "Public Admin", "Comparative Govt"],
        "bsc-phy": ["Quantum Mechanics", "Optics", "Thermodynamics", "Electronics", "Mathematical Physics"],
        "ba-eng": ["British Literature", "Indian Writing", "Linguistics", "Postcolonial Studies", "Creative Writing"]
    };

    var STUDENTS = [
        {
            appNo: "SK-2026-1001", name: "Tshering Dorjee Bhutia", course: "bcom", marks: 78.5, status: "applied", photo: "",
            rollNo: "12345/24", board: "CBSE", stream: "Commerce", gender: "Male", mobile: "9876543210", email: "tshering.bhutia@gmail.com",
            category: "Sikkimese", coiNumber: "COI/SK/2024/0012", pwd: "No", dob: "2006-05-12", community: "ST",
            fatherName: "Karma Sangay Bhutia", fatherContact: "9876000001", motherName: "Doma Bhutia",
            district: "Gangtok", pincode: "737101", permanentAddress: "House No 42, Burtuk Bypass, Gangtok", state: "Sikkim",
            subjects: [{name:"English",marks:82,total:100},{name:"Accountancy",marks:78,total:100},{name:"Business Studies",marks:76,total:100},{name:"Economics",marks:80,total:100},{name:"Mathematics",marks:70,total:100}],
            pref1: "B.Com (Hons) — Accounting & Finance", pref2: "B.Com (Hons) — General", pref3: "",
            appFee: {txn:"TXN2024100112",amount:200,status:"Paid",method:"Online"}
        },
        {
            appNo: "SK-2026-1002", name: "Pema Wangchuk Lepcha", course: "bcom", marks: 76.2, status: "applied", photo: "",
            rollNo: "12346/24", board: "Sikkim Board", stream: "Commerce", gender: "Male", mobile: "9876543211", email: "pema.lepcha@yahoo.com",
            category: "Sikkimese", coiNumber: "COI/SK/2024/0034", pwd: "No", dob: "2006-03-22", community: "ST",
            fatherName: "Sonam Lepcha", fatherContact: "9876000002", motherName: "Yangki Lepcha",
            district: "Gangtok", pincode: "737102", permanentAddress: "Tadong, Near Tadong Bazaar, Gangtok", state: "Sikkim",
            subjects: [{name:"English",marks:75,total:100},{name:"Accountancy",marks:80,total:100},{name:"Business Studies",marks:72,total:100},{name:"Economics",marks:78,total:100},{name:"Mathematics",marks:76,total:100}],
            pref1: "B.Com (Hons) — Business Management", pref2: "B.Com (Hons) — Accounting & Finance", pref3: "",
            appFee: {txn:"TXN2024100215",amount:200,status:"Paid",method:"Online"}
        },
        {
            appNo: "SK-2026-1003", name: "Diki Yangzom Sherpa", course: "bcom", marks: 82.1, status: "applied", photo: "",
            rollNo: "12347/24", board: "ICSE", stream: "Commerce", gender: "Female", mobile: "9876543212", email: "diki.sherpa@gmail.com",
            category: "Sikkimese", coiNumber: "COI/SK/2024/0056", pwd: "No", dob: "2005-11-15", community: "OBC",
            fatherName: "Dawa Sherpa", fatherContact: "9876000003", motherName: "Phuti Sherpa",
            district: "Gangtok", pincode: "737135", permanentAddress: "Below Ranipool, NH10, East Sikkim", state: "Sikkim",
            subjects: [{name:"English",marks:85,total:100},{name:"Accountancy",marks:82,total:100},{name:"Business Studies",marks:80,total:100},{name:"Economics",marks:84,total:100},{name:"Mathematics",marks:79,total:100}],
            pref1: "B.Com (Hons) — Accounting & Finance", pref2: "B.A. Political Science", pref3: "",
            appFee: {txn:"TXN2024100309",amount:200,status:"Paid",method:"Online"}
        },
        {
            appNo: "SK-2026-1004", name: "Rajesh Kumar Rai", course: "ba-polsci", marks: 71.3, status: "applied", photo: "",
            rollNo: "12348/24", board: "Sikkim Board", stream: "Arts", gender: "Male", mobile: "9876543213", email: "rajesh.rai04@gmail.com",
            category: "Sikkimese", coiNumber: "COI/SK/2024/0078", pwd: "No", dob: "2006-07-08", community: "OBC",
            fatherName: "Hari Kumar Rai", fatherContact: "9876000004", motherName: "Sita Rai",
            district: "Pakyong", pincode: "737106", permanentAddress: "Singtam Bazaar, East Sikkim", state: "Sikkim",
            subjects: [{name:"English",marks:70,total:100},{name:"Political Science",marks:75,total:100},{name:"History",marks:68,total:100},{name:"Economics",marks:72,total:100},{name:"Nepali",marks:71,total:100}],
            pref1: "B.A. Political Science", pref2: "B.A. English (Hons)", pref3: "",
            appFee: {txn:"TXN2024100418",amount:200,status:"Paid",method:"Cash"}
        },
        {
            appNo: "SK-2026-1005", name: "Anjali Tamang", course: "ba-polsci", marks: 68.9, status: "applied", photo: "",
            rollNo: "12349/24", board: "CBSE", stream: "Arts", gender: "Female", mobile: "9876543214", email: "anjali.tamang@gmail.com",
            category: "Sikkimese", coiNumber: "COI/SK/2024/0090", pwd: "No", dob: "2006-01-30", community: "SC",
            fatherName: "Bikram Tamang", fatherContact: "9876000005", motherName: "Kamala Tamang",
            district: "Namchi", pincode: "737126", permanentAddress: "Jorethang, South Sikkim", state: "Sikkim",
            subjects: [{name:"English",marks:72,total:100},{name:"Political Science",marks:70,total:100},{name:"History",marks:65,total:100},{name:"Sociology",marks:68,total:100},{name:"Nepali",marks:69,total:100}],
            pref1: "B.A. Political Science", pref2: "B.A. English (Hons)", pref3: "",
            appFee: {txn:"TXN2024100522",amount:200,status:"Paid",method:"Online"}
        },
        {
            appNo: "SK-2026-1006", name: "Sonam Tshering Bhutia", course: "bsc-phy", marks: 85.4, status: "applied", photo: "",
            rollNo: "12350/24", board: "CBSE", stream: "Science", gender: "Male", mobile: "9876543215", email: "sonam.tshering@gmail.com",
            category: "Sikkimese", coiNumber: "COI/SK/2024/0102", pwd: "No", dob: "2005-09-18", community: "ST",
            fatherName: "Passang Bhutia", fatherContact: "9876000006", motherName: "Lhamu Bhutia",
            district: "Gangtok", pincode: "737102", permanentAddress: "Deorali, Above Deorali Bazaar, Gangtok", state: "Sikkim",
            subjects: [{name:"English",marks:80,total:100},{name:"Physics",marks:88,total:100},{name:"Chemistry",marks:85,total:100},{name:"Mathematics",marks:90,total:100},{name:"Computer Science",marks:84,total:100}],
            pref1: "B.Sc. Physics", pref2: "B.Sc. Mathematics", pref3: "",
            appFee: {txn:"TXN2024100603",amount:200,status:"Paid",method:"Online"}
        },
        {
            appNo: "SK-2026-1007", name: "Nima Doma Bhutia", course: "bsc-phy", marks: 79.8, status: "applied", photo: "",
            rollNo: "12351/24", board: "Sikkim Board", stream: "Science", gender: "Female", mobile: "9876543216", email: "nima.doma@yahoo.com",
            category: "Sikkimese", coiNumber: "COI/SK/2024/0114", pwd: "No", dob: "2006-04-05", community: "ST",
            fatherName: "Thendup Bhutia", fatherContact: "9876000007", motherName: "Passang Lhamu Bhutia",
            district: "Gangtok", pincode: "737135", permanentAddress: "Rumtek, Near Rumtek Monastery, East Sikkim", state: "Sikkim",
            subjects: [{name:"English",marks:76,total:100},{name:"Physics",marks:82,total:100},{name:"Chemistry",marks:80,total:100},{name:"Mathematics",marks:81,total:100},{name:"Biology",marks:80,total:100}],
            pref1: "B.Sc. Physics", pref2: "B.Sc. Chemistry", pref3: "",
            appFee: {txn:"TXN2024100711",amount:200,status:"Paid",method:"Online"}
        },
        {
            appNo: "SK-2026-1008", name: "Prakash Chettri", course: "ba-eng", marks: 74.6, status: "applied", photo: "",
            rollNo: "12352/24", board: "ICSE", stream: "Arts", gender: "Male", mobile: "9876543217", email: "prakash.chettri@gmail.com",
            category: "Sikkimese", coiNumber: "COI/SK/2024/0126", pwd: "No", dob: "2006-06-25", community: "General",
            fatherName: "Gopal Chettri", fatherContact: "9876000008", motherName: "Maya Chettri",
            district: "Namchi", pincode: "737126", permanentAddress: "Namchi Bazaar, South Sikkim", state: "Sikkim",
            subjects: [{name:"English",marks:78,total:100},{name:"History",marks:72,total:100},{name:"Geography",marks:74,total:100},{name:"Economics",marks:70,total:100},{name:"Nepali",marks:79,total:100}],
            pref1: "B.A. English (Hons)", pref2: "B.A. Political Science", pref3: "",
            appFee: {txn:"TXN2024100818",amount:200,status:"Paid",method:"Cash"}
        },
        {
            appNo: "SK-2026-1009", name: "Lhamu Diki Sherpa", course: "ba-eng", marks: 81.0, status: "applied", photo: "",
            rollNo: "12353/24", board: "CBSE", stream: "Arts", gender: "Female", mobile: "9876543218", email: "lhamu.sherpa@gmail.com",
            category: "Sikkimese", coiNumber: "COI/SK/2024/0138", pwd: "No", dob: "2005-12-10", community: "OBC",
            fatherName: "Mingma Sherpa", fatherContact: "9876000009", motherName: "Dawa Sherpa",
            district: "Mangan", pincode: "737116", permanentAddress: "Mangan Bazaar, North Sikkim", state: "Sikkim",
            subjects: [{name:"English",marks:85,total:100},{name:"History",marks:78,total:100},{name:"Political Science",marks:82,total:100},{name:"Sociology",marks:80,total:100},{name:"Nepali",marks:80,total:100}],
            pref1: "B.A. English (Hons)", pref2: "B.A. Political Science", pref3: "",
            appFee: {txn:"TXN2024100905",amount:200,status:"Paid",method:"Online"}
        },
        {
            appNo: "SK-2026-1010", name: "Tenzing Norgay Lepcha", course: "bcom", marks: 69.5, status: "applied", photo: "",
            rollNo: "12354/24", board: "Sikkim Board", stream: "Commerce", gender: "Male", mobile: "9876543219", email: "tenzing.lepcha@gmail.com",
            category: "Sikkimese", coiNumber: "COI/SK/2024/0150", pwd: "No", dob: "2006-02-14", community: "ST",
            fatherName: "Dawa Lepcha", fatherContact: "9876000010", motherName: "Chungki Lepcha",
            district: "Gyalshing", pincode: "737111", permanentAddress: "Gyalshing Bazaar, West Sikkim", state: "Sikkim",
            subjects: [{name:"English",marks:68,total:100},{name:"Accountancy",marks:72,total:100},{name:"Business Studies",marks:70,total:100},{name:"Economics",marks:65,total:100},{name:"Nepali",marks:72,total:100}],
            pref1: "B.Com (Hons) — General", pref2: "B.A. English (Hons)", pref3: "",
            appFee: {txn:"TXN2024101015",amount:200,status:"Paid",method:"Online"}
        },
        {
            appNo: "SK-2026-1011", name: "Kesang Ongmu", course: "ba-polsci", marks: 73.2, status: "applied", photo: "",
            rollNo: "12355/24", board: "Sikkim Board", stream: "Arts", gender: "Female", mobile: "9876543220", email: "kesang.ongmu@gmail.com",
            category: "Sikkimese", coiNumber: "COI/SK/2024/0162", pwd: "No", dob: "2006-08-19", community: "ST",
            fatherName: "Norbu Ongmu", fatherContact: "9876000011", motherName: "Dolma Ongmu",
            district: "Soreng", pincode: "737121", permanentAddress: "Soreng Bazaar, West Sikkim", state: "Sikkim",
            subjects: [{name:"English",marks:74,total:100},{name:"Political Science",marks:76,total:100},{name:"History",marks:70,total:100},{name:"Sociology",marks:72,total:100},{name:"Nepali",marks:74,total:100}],
            pref1: "B.A. Political Science", pref2: "B.A. English (Hons)", pref3: "",
            appFee: {txn:"TXN2024101122",amount:200,status:"Paid",method:"Online"}
        },
        {
            appNo: "SK-2026-1012", name: "Bikash Gurung", course: "bsc-phy", marks: 77.1, status: "applied", photo: "",
            rollNo: "12356/24", board: "CBSE", stream: "Science", gender: "Male", mobile: "9876543221", email: "bikash.gurung@yahoo.com",
            category: "Sikkimese", coiNumber: "COI/SK/2024/0174", pwd: "No", dob: "2006-10-03", community: "OBC",
            fatherName: "Ram Gurung", fatherContact: "9876000012", motherName: "Sarita Gurung",
            district: "Pakyong", pincode: "737106", permanentAddress: "Pakyong Town, East Sikkim", state: "Sikkim",
            subjects: [{name:"English",marks:74,total:100},{name:"Physics",marks:80,total:100},{name:"Chemistry",marks:76,total:100},{name:"Mathematics",marks:78,total:100},{name:"Biology",marks:77,total:100}],
            pref1: "B.Sc. Physics", pref2: "B.Sc. Chemistry", pref3: "",
            appFee: {txn:"TXN2024101209",amount:200,status:"Paid",method:"Online"}
        },
        {
            appNo: "SK-2026-1013", name: "Yangchen Dolma", course: "ba-eng", marks: 88.3, status: "applied", photo: "",
            rollNo: "12357/24", board: "CBSE", stream: "Arts", gender: "Female", mobile: "9876543222", email: "yangchen.dolma@gmail.com",
            category: "Sikkimese", coiNumber: "COI/SK/2024/0186", pwd: "No", dob: "2005-07-28", community: "ST",
            fatherName: "Paljor Dolma", fatherContact: "9876000013", motherName: "Sonam Dolma",
            district: "Gangtok", pincode: "737101", permanentAddress: "M.G. Marg, Gangtok, East Sikkim", state: "Sikkim",
            subjects: [{name:"English",marks:92,total:100},{name:"History",marks:86,total:100},{name:"Political Science",marks:88,total:100},{name:"Sociology",marks:85,total:100},{name:"Nepali",marks:90,total:100}],
            pref1: "B.A. English (Hons)", pref2: "B.A. Political Science", pref3: "",
            appFee: {txn:"TXN2024101316",amount:200,status:"Paid",method:"Online"}
        },
        {
            appNo: "SK-2026-1014", name: "Sanjay Subba", course: "bcom", marks: 65.7, status: "applied", photo: "", isRecommendation: true,
            rollNo: "12358/24", board: "Sikkim Board", stream: "Commerce", gender: "Male", mobile: "9876543223", email: "sanjay.subba@gmail.com",
            category: "Sikkimese", coiNumber: "COI/SK/2024/0198", pwd: "No", dob: "2006-11-11", community: "SC",
            fatherName: "Man Bahadur Subba", fatherContact: "9876000014", motherName: "Dhan Maya Subba",
            district: "Namchi", pincode: "737126", permanentAddress: "Namchi Town, South Sikkim", state: "Sikkim",
            subjects: [{name:"English",marks:65,total:100},{name:"Accountancy",marks:68,total:100},{name:"Business Studies",marks:64,total:100},{name:"Economics",marks:62,total:100},{name:"Nepali",marks:70,total:100}],
            pref1: "B.Com (Hons) — General", pref2: "B.A. Political Science", pref3: "",
            appFee: {txn:"TXN2024101420",amount:200,status:"Paid",method:"Cash"}
        },
        {
            appNo: "SK-2026-1015", name: "Phurba Lhamu Tamang", course: "ba-polsci", marks: 70.4, status: "applied", photo: "",
            rollNo: "12359/24", board: "CBSE", stream: "Arts", gender: "Female", mobile: "9876543224", email: "phurba.tamang@gmail.com",
            category: "Sikkimese", coiNumber: "COI/SK/2024/0210", pwd: "No", dob: "2006-05-01", community: "SC",
            fatherName: "Dorjee Tamang", fatherContact: "9876000015", motherName: "Yangchen Tamang",
            district: "Pakyong", pincode: "737106", permanentAddress: "Singtam, Pakyong District, East Sikkim", state: "Sikkim",
            subjects: [{name:"English",marks:72,total:100},{name:"Political Science",marks:70,total:100},{name:"History",marks:68,total:100},{name:"Economics",marks:74,total:100},{name:"Nepali",marks:68,total:100}],
            pref1: "B.A. Political Science", pref2: "B.A. English (Hons)", pref3: "",
            appFee: {txn:"TXN2024101508",amount:200,status:"Paid",method:"Online"}
        },
        {
            appNo: "SK-2026-1016", name: "Rinzin Dorjee", course: "bsc-phy", marks: 83.9, status: "applied", photo: "",
            rollNo: "12360/24", board: "ICSE", stream: "Science", gender: "Male", mobile: "9876543225", email: "rinzin.dorjee@gmail.com",
            category: "Sikkimese", coiNumber: "COI/SK/2024/0222", pwd: "No", dob: "2005-08-16", community: "General",
            fatherName: "Lopsang Dorjee", fatherContact: "9876000016", motherName: "Lhaki Dorjee",
            district: "Mangan", pincode: "737116", permanentAddress: "Mangan Town, North Sikkim", state: "Sikkim",
            subjects: [{name:"English",marks:80,total:100},{name:"Physics",marks:86,total:100},{name:"Chemistry",marks:84,total:100},{name:"Mathematics",marks:88,total:100},{name:"Computer Science",marks:82,total:100}],
            pref1: "B.Sc. Physics", pref2: "B.Sc. Mathematics", pref3: "",
            appFee: {txn:"TXN2024101612",amount:200,status:"Paid",method:"Online"}
        },
        {
            appNo: "SK-2026-1017", name: "Dechen Wangmo", course: "ba-eng", marks: 79.2, status: "applied", photo: "",
            rollNo: "12361/24", board: "CBSE", stream: "Arts", gender: "Female", mobile: "9876543226", email: "dechen.wangmo@gmail.com",
            category: "Sikkimese", coiNumber: "COI/SK/2024/0234", pwd: "No", dob: "2006-03-09", community: "General",
            fatherName: "Jigme Wangmo", fatherContact: "9876000017", motherName: "Karma Wangmo",
            district: "Gangtok", pincode: "737101", permanentAddress: "Tibet Road, Gangtok, East Sikkim", state: "Sikkim",
            subjects: [{name:"English",marks:82,total:100},{name:"History",marks:78,total:100},{name:"Political Science",marks:80,total:100},{name:"Sociology",marks:76,total:100},{name:"Nepali",marks:80,total:100}],
            pref1: "B.A. English (Hons)", pref2: "B.A. Political Science", pref3: "",
            appFee: {txn:"TXN2024101718",amount:200,status:"Paid",method:"Online"}
        },
        {
            appNo: "SK-2026-1018", name: "Karma Tshering Lepcha", course: "bcom", marks: 72.8, status: "applied", photo: "",
            rollNo: "12362/24", board: "Sikkim Board", stream: "Commerce", gender: "Male", mobile: "9876543227", email: "karma.lepcha@yahoo.com",
            category: "Sikkimese", coiNumber: "COI/SK/2024/0246", pwd: "No", dob: "2006-09-22", community: "ST",
            fatherName: "Sonam Tshering", fatherContact: "9876000018", motherName: "Mingma Lepcha",
            district: "Gyalshing", pincode: "737111", permanentAddress: "Pelling Road, Gyalshing, West Sikkim", state: "Sikkim",
            subjects: [{name:"English",marks:70,total:100},{name:"Accountancy",marks:74,total:100},{name:"Business Studies",marks:72,total:100},{name:"Economics",marks:76,total:100},{name:"Nepali",marks:72,total:100}],
            pref1: "B.Com (Hons) — General", pref2: "B.Com (Hons) — Accounting & Finance", pref3: "",
            appFee: {txn:"TXN2024101822",amount:200,status:"Paid",method:"Online"}
        },
        {
            appNo: "SK-2026-1019", name: "Passang Diki", course: "ba-polsci", marks: 67.5, status: "applied", photo: "", isRecommendation: true,
            rollNo: "12363/24", board: "Sikkim Board", stream: "Arts", gender: "Female", mobile: "9876543228", email: "passang.diki@gmail.com",
            category: "Sikkimese", coiNumber: "COI/SK/2024/0258", pwd: "No", dob: "2006-01-15", community: "ST",
            fatherName: "Tashi Diki", fatherContact: "9876000019", motherName: "Pema Diki",
            district: "Soreng", pincode: "737121", permanentAddress: "Soreng Town, West Sikkim", state: "Sikkim",
            subjects: [{name:"English",marks:68,total:100},{name:"Political Science",marks:66,total:100},{name:"History",marks:70,total:100},{name:"Sociology",marks:65,total:100},{name:"Nepali",marks:68,total:100}],
            pref1: "B.A. Political Science", pref2: "B.A. English (Hons)", pref3: "",
            appFee: {txn:"TXN2024101905",amount:200,status:"Paid",method:"Cash"}
        },
        {
            appNo: "SK-2026-1020", name: "Suraj Pradhan", course: "bcom", marks: 75.0, status: "applied", photo: "",
            rollNo: "12364/24", board: "CBSE", stream: "Commerce", gender: "Male", mobile: "9876543229", email: "suraj.pradhan@gmail.com",
            category: "Sikkimese", coiNumber: "COI/SK/2024/0270", pwd: "No", dob: "2006-04-18", community: "General",
            fatherName: "Krishna Pradhan", fatherContact: "9876000020", motherName: "Gita Pradhan",
            district: "Gangtok", pincode: "737102", permanentAddress: "Tadong, Near SRM University, Gangtok", state: "Sikkim",
            subjects: [{name:"English",marks:76,total:100},{name:"Accountancy",marks:75,total:100},{name:"Business Studies",marks:74,total:100},{name:"Economics",marks:78,total:100},{name:"Mathematics",marks:72,total:100}],
            pref1: "B.Com (Hons) — Business Management", pref2: "B.Com (Hons) — Accounting & Finance", pref3: "",
            appFee: {txn:"TXN2024102015",amount:200,status:"Paid",method:"Online"}
        }
    ];

    // Pre-built merit lists (entries-based: each entry has appNo, program, course)
    var MERIT_LISTS = [
        {
            id: "ML-001", name: "Merit List 1", date: "2024-10-20", session: "2026-27", program: "",
            entries: [
                { appNo: "SK-2026-1003", program: "B.Com (Hons)", course: "Accounting & Finance" },
                { appNo: "SK-2026-1001", program: "B.Com (Hons)", course: "Accounting & Finance" },
                { appNo: "SK-2026-1020", program: "B.Com (Hons)", course: "General" },
                { appNo: "SK-2026-1011", program: "B.A. Political Science", course: "Political Science" },
                { appNo: "SK-2026-1004", program: "B.A. Political Science", course: "Political Science" },
                { appNo: "SK-2026-1006", program: "B.Sc. Physics", course: "Physics" },
                { appNo: "SK-2026-1016", program: "B.Sc. Physics", course: "Physics" },
                { appNo: "SK-2026-1013", program: "B.A. English (Hons)", course: "English Literature" },
                { appNo: "SK-2026-1009", program: "B.A. English (Hons)", course: "English Literature" }
            ]
        },
        {
            id: "ML-002", name: "Merit List 2", date: "2024-11-05", session: "2026-27", program: "",
            entries: [
                { appNo: "SK-2026-1002", program: "B.Com (Hons)", course: "Business Management" },
                { appNo: "SK-2026-1018", program: "B.Com (Hons)", course: "General" },
                { appNo: "SK-2026-1015", program: "B.A. Political Science", course: "Political Science" },
                { appNo: "SK-2026-1005", program: "B.A. Political Science", course: "Political Science" },
                { appNo: "SK-2026-1007", program: "B.Sc. Physics", course: "Physics" },
                { appNo: "SK-2026-1012", program: "B.Sc. Physics", course: "Physics" },
                { appNo: "SK-2026-1008", program: "B.A. English (Hons)", course: "English Literature" },
                { appNo: "SK-2026-1017", program: "B.A. English (Hons)", course: "English Literature" }
            ]
        }
    ];

    // Registration data (keyed by appNo)
    var REGISTRATIONS = {};
    // Session-wise admission schedule configurations
    var ADMISSION_SCHEDULES = {};
    var editingScheduleSession = null;

    // ============================================================
    // 2. HELPERS
    // ============================================================

    function getStudentByApp(appNo) {
        for (var i = 0; i < STUDENTS.length; i++) { if (STUDENTS[i].appNo === appNo) return STUDENTS[i]; }
        return null;
    }
    function getCourseName(cid) {
        for (var i = 0; i < COURSES.length; i++) { if (COURSES[i].id === cid) return COURSES[i].name; }
        return cid;
    }
    function getCourseById(cid) {
        for (var i = 0; i < COURSES.length; i++) { if (COURSES[i].id === cid) return COURSES[i]; }
        return null;
    }
    function generateRollNo() { return "SGC-" + (2024000 + Math.floor(Math.random() * 999)); }
    function generateReceiptNo() { return "RCP-" + Date.now().toString().slice(-8); }

    // Returns the session string (e.g. "2024-25") for the current ongoing admission.
    // Priority: active ADMISSION_SCHEDULE → most recent MERIT_LIST session → COLLEGE_INFO.session
    function getCurrentAdmissionSession() {
        var activeSession = null;
        $.each(ADMISSION_SCHEDULES, function(k, s) {
            if (s && s.collegeId === COLLEGE_INFO.id && s.status === 'active') {
                activeSession = s.session;
                return false; // break
            }
        });
        if (activeSession) return activeSession;
        // Fall back to most recent merit list session
        var latestSession = null;
        $.each(MERIT_LISTS, function(_, ml) {
            if (!latestSession || ml.session > latestSession) latestSession = ml.session;
        });
        if (latestSession) return latestSession;
        // Final fallback
        return COLLEGE_INFO.session || null;
    }

    // Returns true if the student's appNo belongs to the current ongoing session.
    // Students are matched by the start-year embedded in their appNo (e.g. "SK-2026-" → session "2024-25").
    function isStudentCurrentSession(student) {
        var session = getCurrentAdmissionSession();
        if (!session) return true; // no session info at all — show everyone
        var year = session.split('-')[0];
        if (!year) return true;
        return student.appNo.indexOf('-' + year + '-') >= 0;
    }

    function getMeritListsForApp(appNo) {
        var lists = [];
        $.each(MERIT_LISTS, function(_, ml) {
            $.each(ml.entries, function(__, entry) {
                if (entry.appNo === appNo) {
                    lists.push({ id: ml.id, name: ml.name });
                }
            });
        });
        return lists;
    }

    function loadRegistrations() {
        var d = localStorage.getItem('emmis_ca_registrations');
        if (d) { try { REGISTRATIONS = JSON.parse(d); } catch(e) { REGISTRATIONS = {}; } }
    }
    function saveRegistrations() { localStorage.setItem('emmis_ca_registrations', JSON.stringify(REGISTRATIONS)); }

    // Recommendations: keyed by appNo — from invite-link applications (app.js) + seed data
    var RECOMMENDATIONS_SET = {};
    function loadRecommendations() {
        // From shared store written by app.js when student arrives via invite link
        var recs = JSON.parse(localStorage.getItem('emmis_ca_recommendations') || '[]');
        $.each(recs, function(_, r) { RECOMMENDATIONS_SET[r.appNo] = r; });
        // Also mark seed students that have isRecommendation:true in STUDENTS array
        $.each(STUDENTS, function(_, s) {
            if (s.isRecommendation) RECOMMENDATIONS_SET[s.appNo] = { appNo: s.appNo, seed: true };
        });
    }
    function isStudentRecommendation(appNo) {
        return !!RECOMMENDATIONS_SET[appNo];
    }

    // Recommendations: load appNos that came via invite link (from student portal)
    var RECOMMENDATIONS_SET = {}; // keyed by appNo
    function loadRecommendations() {
        // From shared store written by app.js
        var recs = JSON.parse(localStorage.getItem('emmis_ca_recommendations') || '[]');
        $.each(recs, function(_, r) { RECOMMENDATIONS_SET[r.appNo] = r; });
        // Also mark seed students that have isRecommendation:true in STUDENTS array
        $.each(STUDENTS, function(_, s) {
            if (s.isRecommendation) RECOMMENDATIONS_SET[s.appNo] = { appNo: s.appNo, seed: true };
        });
    }
    function isStudentRecommendation(appNo) {
        return !!RECOMMENDATIONS_SET[appNo] || !!(REGISTRATIONS[appNo] && REGISTRATIONS[appNo].isRecommendation);
    }

    function loadMeritLists() {
        var d = localStorage.getItem('emmis_ca_meritlists');
        if (d) {
            try {
                var parsed = JSON.parse(d);
                // Validate new format (entries-based); discard old format (students/statuses)
                if (parsed.length > 0 && parsed[0].entries) {
                    MERIT_LISTS = parsed;
                    // Backward compat: ensure session and program fields exist
                    $.each(MERIT_LISTS, function(_, ml) {
                        if (!ml.session) ml.session = '2024-25';
                        if (ml.program === undefined) ml.program = '';
                    });
                } else {
                    localStorage.removeItem('emmis_ca_meritlists');
                }
            } catch(e) {}
        }
    }
    function saveMeritLists() { localStorage.setItem('emmis_ca_meritlists', JSON.stringify(MERIT_LISTS)); }

    function loadAdmissionSchedules() {
        var d = localStorage.getItem('emmis_ca_admission_schedules');
        if (d) {
            try {
                ADMISSION_SCHEDULES = JSON.parse(d) || {};
            } catch(e) {
                ADMISSION_SCHEDULES = {};
            }
        }
    }
    function saveAdmissionSchedules() {
        localStorage.setItem('emmis_ca_admission_schedules', JSON.stringify(ADMISSION_SCHEDULES));
    }

    /** Determine the current registration stage for a student */
    function getRegStage(appNo) {
        var reg = REGISTRATIONS[appNo];
        if (!reg) return { stage: 'new', label: 'Not Started', booth: 1, color: 'var(--clr-outline)', bg: 'var(--clr-surface-container)' };
        if (reg.feeCollected) return { stage: 'complete', label: 'Completed', booth: 3, color: '#fff', bg: 'var(--clr-primary)' };
        if (reg.seatAllocated) return { stage: 'fee-pending', label: 'Fee Pending', booth: 3, color: 'var(--clr-on-tertiary-container)', bg: 'var(--clr-tertiary-container)' };
        if (reg.verified) return { stage: 'seat-pending', label: 'Seat Pending', booth: 2, color: 'var(--clr-on-primary-container)', bg: 'var(--clr-primary-container)' };
        return { stage: 'verification', label: 'Verification', booth: 1, color: 'var(--clr-on-surface-variant)', bg: 'var(--clr-surface-variant)' };
    }

    // ============================================================
    // 3. SECTION NAVIGATION
    // ============================================================

    var currentSection = 'section-ca-dashboard';

    function showSection(sectionId) {
        currentSection = sectionId;
        $('.ca-section').hide();
        $('#' + sectionId).fadeIn(250);
        $('html, body').scrollTop(0);

        // Sidebar highlight
        $('.sidebar-admin .sidebar-nav-item').removeClass('active');
        $('.sidebar-admin .sidebar-nav-item[data-section="' + sectionId + '"]').addClass('active');

        // Trigger section-specific init
        if (sectionId === 'section-ca-dashboard') renderDashboard();
        if (sectionId === 'section-ca-admission-schedule') renderAdmissionScheduleSection();
        if (sectionId === 'section-ca-merit-manage') renderMeritListDashboard();
        if (sectionId === 'section-ca-register-search') renderRegisteredList();
        if (sectionId === 'section-ca-all-applications') renderAllApplications();
    }

    // ============================================================
    // 4. DASHBOARD
    // ============================================================

    function renderDashboard() {
        // KPIs
        var totalApps = STUDENTS.length;
        var meritListedSet = {}, registered = 0;
        $.each(MERIT_LISTS, function(_, ml) {
            $.each(ml.entries, function(__, entry) {
                meritListedSet[entry.appNo] = true;
            });
        });
        var admitted = Object.keys(meritListedSet).length;
        $.each(REGISTRATIONS, function(app, reg) {
            if (reg.feeCollected) registered++;
        });
        var totalSeats = 0;
        $.each(COURSES, function(_, c) { totalSeats += c.seats; });

        $('#kpiTotalApps').text(totalApps);
        $('#kpiTotalApps2').text(totalApps);
        $('#kpiAdmitted').text(admitted);
        $('#kpiRegistered').text(registered);
        $('#kpiSeatsLeft').text(totalSeats - registered);

        // Course-wise table
        var $tbody = $('#courseStatsBody').empty();
        $.each(COURSES, function(_, c) {
            var apps = 0, adm = 0, reg = 0;
            var admSet = {};
            $.each(STUDENTS, function(__, s) { if (s.course === c.id) apps++; });
            $.each(MERIT_LISTS, function(__, ml) {
                $.each(ml.entries, function(___, entry) {
                    var s = getStudentByApp(entry.appNo);
                    if (s && s.course === c.id) admSet[entry.appNo] = true;
                });
            });
            adm = Object.keys(admSet).length;
            $.each(REGISTRATIONS, function(app, r) {
                var s = getStudentByApp(app);
                if (s && s.course === c.id && r.feeCollected) reg++;
            });
            $tbody.append(
                '<tr><td class="fw-semibold">' + c.name + '</td>' +
                '<td class="cell-number">' + apps + '</td>' +
                '<td class="cell-number">' + adm + '</td>' +
                '<td class="cell-number">' + reg + '</td></tr>'
            );
        });

        // Gender donut
        var male = 0, female = 0;
        $.each(STUDENTS, function(_, s) {
            if (s.gender === 'Male') male++;
            else if (s.gender === 'Female') female++;
        });
        var mPct = Math.round((male / totalApps) * 360);
        var fPct = mPct + Math.round((female / totalApps) * 360);
        $('#genderDonut').css({
            '--seg1-color': 'var(--clr-primary)',
            '--seg1-end': mPct + 'deg',
            '--seg2-color': 'var(--clr-tertiary)',
            '--seg2-end': fPct + 'deg',
            '--seg3-color': 'var(--clr-outline-variant)',
            '--seg3-end': '360deg'
        });
        $('#genderMaleCount').text(male);
        $('#genderFemaleCount').text(female);

        // Community bars
        var communities = {};
        $.each(STUDENTS, function(_, s) { communities[s.community] = (communities[s.community] || 0) + 1; });
        var $bars = $('#communityBars').empty();
        var maxComm = Math.max.apply(null, $.map(communities, function(v) { return v; }));
        var barColors = { 'ST': 'var(--clr-primary)', 'SC': 'var(--clr-tertiary)', 'OBC': 'var(--clr-secondary)', 'General': 'var(--clr-outline)' };
        $.each(communities, function(comm, count) {
            var pct = Math.round((count / maxComm) * 100);
            $bars.append(
                '<div class="bar-row"><span class="bar-label">' + comm + '</span>' +
                '<div class="bar-track"><div class="bar-fill" style="width:' + pct + '%;background:' + (barColors[comm] || 'var(--clr-primary)') + '"><span>' + count + '</span></div></div>' +
                '<span class="bar-value">' + Math.round((count / totalApps) * 100) + '%</span></div>'
            );
        });
    }

    // ============================================================
    // 5. ADMISSION SCHEDULE CONFIGURATION
    // ============================================================

    function courseToProgramLabel(courseName) {
        if (!courseName) return '';
        if (courseName.indexOf('B.Com') === 0) return 'B.Com';
        if (courseName.indexOf('B.A.') === 0 || courseName.indexOf('B.A ') === 0) return 'B.A';
        if (courseName.indexOf('B.Sc.') === 0 || courseName.indexOf('B.Sc ') === 0) return 'B.Sc';
        return 'Other';
    }

    function getProgramCatalog() {
        var map = {};
        $.each(COURSES, function(_, c) {
            var p = courseToProgramLabel(c.name);
            if (!map[p]) map[p] = [];
            map[p].push({ id: c.id, name: c.name });
        });
        return map;
    }

    function getSelectiveRowHtml(row) {
        row = row || {};
        var catalog = getProgramCatalog();
        var selectedProgram = row.program || '';
        // Support legacy courseId (string) and new courseIds (array)
        var selectedCourseIds = row.courseIds || (row.courseId ? [row.courseId] : []);
        var applyToAll = !!row.applyToAll;

        var programOptions = '<option value="">All Programs</option>';
        $.each(Object.keys(catalog), function(_, p) {
            programOptions += '<option value="' + p + '"' + (p === selectedProgram ? ' selected' : '') + '>' + p + '</option>';
        });

        var courseOptions = '';
        var courseHint = '<div class="text-on-surface-variant mt-1" style="font-size:.72rem;">Select a program first to pick courses</div>';
        if (selectedProgram && catalog[selectedProgram]) {
            courseHint = '';
            $.each(catalog[selectedProgram], function(_, c) {
                var isSel = selectedCourseIds.indexOf(c.id) >= 0 ? ' selected' : '';
                courseOptions += '<option value="' + c.id + '"' + isSel + '>' + c.name + '</option>';
            });
        }

        var idx = $('#cfgSelectiveBody .selective-window-card').length + 1;
        var disabledAttr   = applyToAll ? ' disabled' : '';
        var wrapStyle      = applyToAll ? ' style="opacity:.45;pointer-events:none;"' : '';
        var courseDisabled = (applyToAll || !courseOptions) ? ' disabled' : '';
        var checkId        = 'applyAll_' + idx + '_' + Date.now();

        return '<div class="selective-window-card card rounded-3 border mb-3" data-idx="' + idx + '">' +
            '<div class="card-header d-flex justify-content-between align-items-center py-2 px-3" style="background:var(--clr-surface-low);">' +
                '<span class="fw-bold small d-flex align-items-center gap-2">' +
                    '<span class="material-symbols-outlined" style="font-size:16px;color:var(--clr-secondary);">tune</span>' +
                    'Override Window #' + idx +
                '</span>' +
                '<div class="d-flex align-items-center gap-3">' +
                    '<div class="form-check form-switch mb-0 d-flex align-items-center gap-2">' +
                        '<input class="form-check-input selective-apply-all" type="checkbox" role="switch" id="' + checkId + '"' + (applyToAll ? ' checked' : '') + ' style="cursor:pointer;">' +
                        '<label class="form-check-label small fw-semibold mb-0" for="' + checkId + '" style="cursor:pointer;white-space:nowrap;">All Programs &amp; Courses</label>' +
                    '</div>' +
                    '<button class="btn btn-link p-0 text-danger btn-remove-selective-row" title="Remove"><span class="material-symbols-outlined" style="font-size:18px;">delete</span></button>' +
                '</div>' +
            '</div>' +
            '<div class="card-body p-3">' +
                '<div class="selective-scope-wrap row g-2"' + wrapStyle + '>' +
                    '<div class="col-12 col-md-5">' +
                        '<label class="form-label fw-semibold small mb-1">Program <span class="fw-normal text-on-surface-variant">(blank = all)</span></label>' +
                        '<select class="form-select form-select-sm selective-program"' + disabledAttr + '>' + programOptions + '</select>' +
                    '</div>' +
                    '<div class="col-12 col-md-7">' +
                        '<label class="form-label fw-semibold small mb-1">Courses <span class="fw-normal text-on-surface-variant">(multi-select; none = all)</span></label>' +
                        '<select class="form-select selective-course" multiple size="3"' + courseDisabled + '>' + courseOptions + '</select>' +
                        courseHint +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>';
    }

    var SELECTIVE_EMPTY_HTML =
        '<div class="selective-empty-state text-center py-4 rounded-3" style="color:var(--clr-on-tertiary-fixed-var);border:1.5px dashed var(--clr-outline-variant);">' +
        '<span class="material-symbols-outlined d-block mb-1" style="font-size:32px;opacity:.4;">tune</span>' +
        '<span class="small fw-medium">No override windows configured. Click <strong>Add Window</strong> to define program-specific dates.</span>' +
        '</div>';

    function resetScheduleForm() {
        editingScheduleSession = null;
        $('#cfgSession').prop('readonly', false).val(COLLEGE_INFO.session || '');
        $('#cfgAppOpen').val('');
        $('#cfgAppClose').val('');
        $('#cfgRegOpen').val('');
        $('#cfgRegClose').val('');
        $('#cfgNotification').val('');
        $('#cfgRestricted').prop('checked', false);
        $('#cfgAppFee').val('');
        $('#cfgProspectusName').val('');
        $('#cfgSelectiveBody').html(SELECTIVE_EMPTY_HTML);
    }

    function populateScheduleForm(schedule) {
        editingScheduleSession = schedule.session;
        $('#cfgSession').val(schedule.session).prop('readonly', true);
        $('#cfgAppOpen').val(schedule.defaultWindow && schedule.defaultWindow.appOpen || '');
        $('#cfgAppClose').val(schedule.defaultWindow && schedule.defaultWindow.appClose || '');
        $('#cfgRegOpen').val(schedule.defaultWindow && schedule.defaultWindow.regOpen || '');
        $('#cfgRegClose').val(schedule.defaultWindow && schedule.defaultWindow.regClose || '');
        $('#cfgNotification').val(schedule.notification || '');
        $('#cfgRestricted').prop('checked', !!schedule.restricted);
        $('#cfgAppFee').val(schedule.appFee != null ? schedule.appFee : '');
        $('#cfgProspectusName').val(schedule.prospectusName || '');

        var $body = $('#cfgSelectiveBody').empty();
        if ((schedule.selectiveWindows || []).length === 0) {
            $body.html(SELECTIVE_EMPTY_HTML);
        } else {
            $.each(schedule.selectiveWindows, function(_, w) {
                $body.append(getSelectiveRowHtml(w));
            });
        }
    }

    function readSelectiveRows() {
        var rows = [];
        $('#cfgSelectiveBody .selective-window-card').each(function() {
            var $card = $(this);
            var applyToAll = $card.find('.selective-apply-all').is(':checked');
            var program    = applyToAll ? '' : ($card.find('.selective-program').val() || '');
            var courseIds  = applyToAll ? [] : ($card.find('.selective-course').val() || []);
            if (applyToAll || program || courseIds.length) {
                rows.push({
                    applyToAll: applyToAll,
                    program:    program,
                    courseIds:  courseIds
                });
            }
        });
        return rows;
    }

    function generateInviteToken() {
        var chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        var token = '';
        for (var i = 0; i < 24; i++) {
            token += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return token;
    }

    function renderScheduleCards() {
        var $wrap = $('#scheduleCards').empty();
        // Only show schedules belonging to the currently selected college
        var keys = $.grep(Object.keys(ADMISSION_SCHEDULES).sort().reverse(), function(k) {
            var s = ADMISSION_SCHEDULES[k];
            return s && s.collegeId === COLLEGE_INFO.id;
        });
        if (keys.length === 0) {
            $wrap.html('<div class="col-12"><div class="text-center py-4 text-on-surface-variant">No session schedules configured yet.</div></div>');
            return;
        }

        $.each(keys, function(_, schedKey) {
            var s = ADMISSION_SCHEDULES[schedKey];
            var statusColor = s.status === 'active' ? 'var(--clr-primary-container);color:var(--clr-on-primary-container);' :
                (s.status === 'closed' ? 'rgba(186,26,26,0.1);color:var(--clr-error);' : 'var(--clr-tertiary-container);color:var(--clr-on-tertiary-container);');
            var selectiveCount = (s.selectiveWindows || []).length;
            var selectiveHtml = '';

            $.each((s.selectiveWindows || []).slice(0, 4), function(__, w) {
                var programLabel, courseLabel;
                if (w.applyToAll) {
                    programLabel = 'All Programs';
                    courseLabel  = 'All Courses';
                } else {
                    programLabel = w.program || 'All Programs';
                    var ids = w.courseIds || (w.courseId ? [w.courseId] : []);
                    courseLabel = ids.length
                        ? $.map(ids, function(cid) { return getCourseName(cid) || cid; }).join(', ')
                        : 'All Courses';
                }
                selectiveHtml += '<li class="small mb-1"><strong>' + programLabel + '</strong> / ' + courseLabel + '</li>';
            });
            if (selectiveCount > 4) {
                selectiveHtml += '<li class="small text-on-surface-variant">+' + (selectiveCount - 4) + ' more window(s)</li>';
            }

            var notifLine = s.notification
                ? '<p class="small mb-0 mt-1" style="color:var(--clr-primary);"><span class="material-symbols-outlined align-middle" style="font-size:14px;vertical-align:-2px;">campaign</span> ' + $('<span>').text(s.notification).html() + '</p>'
                : '';

            var inviteBlock = '';
            if (s.restricted && s.inviteToken) {
                var inviteUrl = window.location.origin + window.location.pathname.replace(/\/[^/]+$/, '/') + 'index.html?invite=' + s.inviteToken;
                inviteBlock = '<div class="mt-2 p-2 rounded-3" style="background:rgba(186,26,26,0.05);border:1px solid rgba(186,26,26,0.15);">' +
                    '<div class="d-flex align-items-center justify-content-between gap-2 mb-1">' +
                    '<span class="small fw-bold" style="color:var(--clr-error);"><span class="material-symbols-outlined align-middle" style="font-size:13px;vertical-align:-2px;">link</span> Shareable Invite Link</span>' +
                    '<button class="btn btn-sm fw-bold btn-copy-invite d-flex align-items-center gap-1" data-url="' + inviteUrl + '" style="font-size:.7rem;padding:2px 8px;background:rgba(186,26,26,0.1);color:var(--clr-error);border:1px solid rgba(186,26,26,0.2);">' +
                    '<span class="material-symbols-outlined" style="font-size:13px;">content_copy</span>Copy</button>' +
                    '</div>' +
                    '<div class="small text-truncate" style="color:var(--clr-on-surface-variant);font-family:monospace;font-size:.7rem;" title="' + inviteUrl + '">' + inviteUrl + '</div>' +
                    '</div>';
            }

            $wrap.append(
                '<div class="col-md-6"><div class="card p-3 rounded-3 h-100">' +
                '<div class="d-flex justify-content-between align-items-start mb-2">' +
                '<div><h6 class="fw-bold mb-1">Session ' + s.session + '</h6>' +
                (s.restricted ? '<span class="badge rounded-pill me-1" style="background:rgba(186,26,26,0.1);color:var(--clr-error);font-size:.7rem;"><span class="material-symbols-outlined" style="font-size:11px;vertical-align:-1px;">lock</span> Restricted – Invite Only</span>' : '') +
                '<p class="small text-on-surface-variant mb-0">Default Application: ' + ((s.defaultWindow && s.defaultWindow.appOpen) || '—') + ' to ' + ((s.defaultWindow && s.defaultWindow.appClose) || '—') + '</p>' +
                '<p class="small text-on-surface-variant mb-0">Default Registration: ' + ((s.defaultWindow && s.defaultWindow.regOpen) || '—') + ' to ' + ((s.defaultWindow && s.defaultWindow.regClose) || '—') + '</p>' +
                notifLine + inviteBlock + '</div>' +
                '<span class="badge rounded-pill" style="' + statusColor + '">' + (s.status || 'draft').toUpperCase() + '</span>' +
                '</div>' +
                '<div class="small fw-semibold mb-2">Selective Windows: ' + selectiveCount + '</div>' +
                '<ul class="ps-3 mb-3">' + (selectiveHtml || '<li class="small text-on-surface-variant">No selective windows configured</li>') + '</ul>' +
                '<div class="d-flex gap-2 justify-content-end">' +
                '<button class="btn btn-sm btn-outline-primary fw-bold btn-edit-schedule" data-key="' + schedKey + '">Edit</button>' +
                '<button class="btn btn-sm btn-outline-danger fw-bold btn-delete-schedule" data-key="' + schedKey + '">Delete</button>' +
                '</div></div></div>'
            );
        });
    }

    function renderAdmissionScheduleSection() {
        if (!editingScheduleSession) {
            resetScheduleForm();
        }
        renderScheduleCards();
    }

    // ============================================================
    // 6. REGISTERED STUDENTS LIST
    // ============================================================

    function renderRegisteredList() {
        // Update session badge
        var curSession = getCurrentAdmissionSession();
        if (curSession) {
            $('#regSessionLabel').text(curSession);
            $('#regSessionIndicator').show();
            $('#regNoSessionNotice').hide();
        } else {
            $('#regSessionIndicator').hide();
            $('#regNoSessionNotice').show();
        }

        var $tbody = $('#registeredBody').empty();
        var hasAny = false;
        $.each(REGISTRATIONS, function(appNo, reg) {
            var s = getStudentByApp(appNo);
            if (!s) return;
            if (!isStudentCurrentSession(s)) return; // skip previous session students
            hasAny = true;
            var stage = getRegStage(appNo);
            $tbody.append(
                '<tr><td class="fw-semibold" style="font-family:monospace;color:var(--clr-primary);">' + appNo + '</td>' +
                '<td class="fw-semibold">' + s.name + '</td>' +
                '<td>' + getCourseName(s.course) + '</td>' +
                '<td class="cell-number">' + (reg.rollNo || '—') + '</td>' +
                '<td><span class="status-pill" style="background:' + stage.bg + ';color:' + stage.color + ';">' + stage.label + '</span>' +
                (reg.marksUpdated ? ' <span class="badge rounded-pill ms-1" style="background:var(--clr-tertiary-container);color:var(--clr-on-tertiary-container);font-size:.65rem;">✎ Marks</span>' : '') +
                '</td>' +
                '<td><button class="btn btn-sm btn-outline-primary fw-bold open-reg-btn" data-app="' + appNo + '">' + (stage.stage === 'complete' ? 'View' : 'Continue') + '</button></td></tr>'
            );
        });
        if (hasAny) {
            $('#registeredTableWrap').show();
            $('#registeredEmpty').hide();
        } else {
            $('#registeredTableWrap').hide();
            $('#registeredEmpty').show();
        }
    }

    // ============================================================
    // 7. AUTOCOMPLETE SEARCH (Shared across all search inputs)
    // ============================================================

    function initRegistrationSearch() {
        $(document).on('input', '.reg-search-input', function () {
            var $input = $(this);
            var $dropdown = $input.closest('.autocomplete-wrap').find('.reg-search-dropdown');
            var q = $input.val().toLowerCase().trim();
            if (q.length < 2) { $dropdown.removeClass('show').empty(); return; }
            var results = $.grep(STUDENTS, function (s) {
                if (!isStudentCurrentSession(s)) return false;
                return s.appNo.toLowerCase().indexOf(q) >= 0 || s.name.toLowerCase().indexOf(q) >= 0;
            });
            if (results.length === 0) {
                $dropdown.html('<div class="p-3 text-center text-on-surface-variant small">No applications found</div>').addClass('show');
                return;
            }
            var html = '';
            $.each(results.slice(0, 8), function (_, s) {
                var stage = getRegStage(s.appNo);
                var badgeClass = stage.stage === 'complete' ? 'badge-submitted' : stage.stage === 'new' ? 'badge-draft' : 'badge-draft';
                var badge = stage.stage !== 'new' ? '<span class="badge ' + badgeClass + ' rounded-pill ms-2" style="background:' + stage.bg + ';color:' + stage.color + ';">' + stage.label + '</span>' : '';
                // Merit list badge
                var mlBadges = '';
                var mls = getMeritListsForApp(s.appNo);
                if (mls.length > 0) {
                    $.each(mls, function(__, m) {
                        mlBadges += '<span class="badge rounded-pill ms-1" style="background:var(--clr-primary-container);color:var(--clr-on-primary-container);font-size:10px;">' + m.name + '</span>';
                    });
                } else {
                    mlBadges = '<span class="badge rounded-pill ms-1" style="background:rgba(186,26,26,0.08);color:var(--clr-error);font-size:10px;">No Merit List</span>';
                }
                html += '<div class="autocomplete-item" data-app="' + s.appNo + '">' +
                    '<div class="d-flex justify-content-between align-items-center">' +
                    '<div><span class="ac-id">' + s.appNo + '</span>' + badge + mlBadges + '<br><span class="ac-name">' + s.name + '</span></div>' +
                    '<span class="ac-course">' + getCourseName(s.course) + '</span></div></div>';
            });
            $dropdown.html(html).addClass('show');
        });

        $(document).on('click', '.autocomplete-item', function () {
            var appNo = $(this).data('app');
            $(this).closest('.autocomplete-wrap').find('.reg-search-dropdown').removeClass('show');
            $(this).closest('.autocomplete-wrap').find('.reg-search-input').val('');
            openRegistrationForm(appNo);
        });

        $(document).on('click', function (e) {
            if (!$(e.target).closest('.autocomplete-wrap').length) $('.reg-search-dropdown').removeClass('show');
        });

        // Click from registered list
        $(document).on('click', '.open-reg-btn', function() {
            openRegistrationForm($(this).data('app'));
        });
    }

    // ============================================================
    // 8. STUDENT REGISTRATION — FORM (3 Booths)
    // ============================================================

    var currentRegApp = null;

    function openRegistrationForm(appNo) {
        var student = getStudentByApp(appNo);
        if (!student) return;
        currentRegApp = appNo;

        // Initialize registration if not exists
        if (!REGISTRATIONS[appNo]) {
            REGISTRATIONS[appNo] = {
                verified: false, corrections: {}, documents: {},
                seatAllocated: false, rollNo: '', section: '', electives: [], allocatedCourse: student.course,
                feeCollected: false, paymentMode: '', receiptNo: '', amountPaid: 0
            };
            saveRegistrations();
        }
        var reg = REGISTRATIONS[appNo];
        var stage = getRegStage(appNo);

        // Populate header
        $('#regAppNo').text(student.appNo);
        $('#regName').text(student.name);
        $('#regCourse').text(getCourseName(student.course));
        $('#regMarks').text(student.marks + '%');
        $('#regGender').text(student.gender);
        $('#regCommunity').text(student.community);
        $('#regMobile').text(student.mobile);
        $('#regStageBadge').text(stage.label).css({ 'background': stage.bg, 'color': stage.color });

        // Recommendation banner
        if (isStudentRecommendation(appNo)) {
            $('#regRecommendationBanner').css('display', 'flex');
        } else {
            $('#regRecommendationBanner').hide();
        }

        // Merit list badges in registration header
        var $mb = $('#regMeritBadges').empty();
        var mls = getMeritListsForApp(appNo);
        if (mls.length > 0) {
            $.each(mls, function(_, m) {
                $mb.append('<span class="badge rounded-pill px-2 py-1 fw-bold" style="background:var(--clr-primary-container);color:var(--clr-on-primary-container);">' + m.name + '</span> ');
            });
        } else {
            $mb.append('<span class="badge rounded-pill px-2 py-1 fw-bold" style="background:rgba(186,26,26,0.08);color:var(--clr-error);">No Merit List</span>');
        }

        // Read-only application details — Primary Info (Step 1)
        $('#roAppNo').text(student.appNo);
        $('#roRollNo').text(student.rollNo || '—');
        $('#roName').text(student.name);
        $('#roBoard').text(student.board || '—');
        $('#roStream').text(student.stream || '—');
        $('#roMobile').text(student.mobile);
        $('#roGender').text(student.gender);
        $('#roEmail').text(student.email || '—');
        $('#roCategory').text(student.category || '—');
        $('#roCOI').text(student.coiNumber || '—');
        $('#roPWD').text(student.pwd || 'No');

        // Personal Details (Step 2)
        $('#roDob').text(student.dob);
        $('#roCommunity').text(student.community);
        $('#roFather').text(student.fatherName);
        $('#roFatherContact').text(student.fatherContact || '—');
        $('#roMother').text(student.motherName || '—');
        $('#roDistrict').text(student.district || '—');
        $('#roPincode').text(student.pincode || '—');
        $('#roAddress').text(student.permanentAddress || '—');
        $('#roState').text(student.state || 'Sikkim');

        // Academic History (Step 3) — use admin-updated marks if available
        var subjects = (reg.marksUpdated && reg.updatedMarks && reg.updatedMarks.length)
            ? reg.updatedMarks : (student.subjects || []);
        var $subBody = $('#roSubjectsBody').empty();
        var $editBody = $('#editMarksBody').empty();
        var totalMarksObt = 0, totalMarksFull = 0;
        $.each(subjects, function(i, sub) {
            var passClass = sub.marks >= 33 ? 'background:rgba(107,217,188,0.2);color:var(--clr-on-primary-container);' : 'background:rgba(186,26,26,0.1);color:var(--clr-error);';
            $subBody.append('<tr><td>' + sub.name + '</td><td class="text-center">' + sub.marks + '</td><td class="text-center">' + sub.total + '</td><td class="text-end"><span class="badge rounded-pill px-2 py-1" style="' + passClass + '">' + (sub.marks >= 33 ? 'Pass' : 'Fail') + '</span></td></tr>');
            $editBody.append(
                '<tr>' +
                '<td class="py-1">' + sub.name + '</td>' +
                '<td class="py-1 text-center"><input type="number" class="form-control form-control-sm text-center edit-sub-marks" data-idx="' + i + '" data-name="' + sub.name + '" data-total="' + sub.total + '" value="' + sub.marks + '" min="0" max="' + sub.total + '" style="width:80px;margin:auto;"></td>' +
                '<td class="py-1 text-center text-on-surface-variant">' + sub.total + '</td>' +
                '</tr>'
            );
            totalMarksObt += sub.marks;
            totalMarksFull += sub.total;
        });
        var aggPct = totalMarksFull > 0 ? ((totalMarksObt / totalMarksFull) * 100).toFixed(1) : '0.0';
        $('#roAggregate').text(aggPct + '% (' + totalMarksObt + '/' + totalMarksFull + ')');
        if (reg.marksUpdated) {
            var updAt = reg.marksUpdatedAt ? new Date(reg.marksUpdatedAt).toLocaleDateString('en-IN', {day:'2-digit', month:'short', year:'numeric'}) : '';
            $('#marksUpdatedBadge').css({'display':'flex','background':'rgba(186,26,26,0.08)'}).find('.upd-date').text(updAt ? ' (' + updAt + ')' : '');
            $('#btnEditMarksWrap').css('display','none');
        } else {
            $('#marksUpdatedBadge').css('display','none');
            $('#btnEditMarksWrap').css('display','flex');
        }
        $('#editMarksPanel').hide();

        // Course Preferences (Step 4)
        $('#roCourseApplied').text(getCourseName(student.course));
        $('#roMarks').text(student.marks + '%');
        $('#roPref1').text(student.pref1 || '—');
        $('#roPref2').text(student.pref2 || '—');
        $('#roPref3').text(student.pref3 || '—');

        // Application Fee (Step 5)
        var fee = student.appFee || {};
        $('#roTxnId').text(fee.txn || '—');
        $('#roFeeAmount').text(fee.amount ? '₹' + fee.amount : '—');
        $('#roFeeStatus').text(fee.status || '—');
        $('#roPayMethod').text(fee.method || '—');

        // Corrections — show only if corrections were made, otherwise leave blank
        $('#regEditName').val(reg.corrections.name || '');
        $('#regEditDob').val(reg.corrections.dob || '');
        $('#regEditFather').val(reg.corrections.fatherName || '');
        $('#regEditAddress').val(reg.corrections.address || '');
        $('#regEditMobile').val(reg.corrections.mobile || '');

        // Documents
        var docs = reg.documents || {};
        $('#docMarksheet').prop('checked', !!docs.marksheet);
        $('#docCommunity').prop('checked', !!docs.community);
        $('#docCOI').prop('checked', !!docs.coi);
        $('#docPhoto').prop('checked', !!docs.photo);
        $('#docTC').prop('checked', !!docs.tc);
        updateDocPendingAlert();

        // Remarks / notes for each step
        $('#regRemarksVerification').val(reg.remarksVerification || '');
        // Reset saved indicator unless remarks were previously saved
        if (reg.remarksVerificationSavedAt) {
            var savedStr = new Date(reg.remarksVerificationSavedAt).toLocaleTimeString('en-IN', {hour:'2-digit', minute:'2-digit'});
            $('#remarksVerificationSavedAt').show().find('.rmk-time').text('at ' + savedStr);
        } else {
            $('#remarksVerificationSavedAt').hide();
        }
        $('#regRemarksSeat').val(reg.remarksSeat || '');
        $('#regRemarksFee').val(reg.remarksFee || '');

        // Seat allocation tab
        var $courseSelect = $('#regAllocCourse').empty();
        $.each(COURSES, function(_, c) {
            $courseSelect.append('<option value="' + c.id + '"' + (c.id === (reg.allocatedCourse || student.course) ? ' selected' : '') + '>' + c.name + '</option>');
        });
        $('#regRollNo').val(reg.rollNo || generateRollNo());
        $('#regSection').val(reg.section || 'A');
        populateElectives(reg.allocatedCourse || student.course, reg.electives);

        // Fee tab
        var course = getCourseById(reg.allocatedCourse || student.course);
        $('#regFeeAmount').text('₹' + (course ? course.fee : 0).toLocaleString() + '.00');
        $('#regFeeTotal').text('₹' + (course ? course.fee : 0).toLocaleString() + '.00');
        $('#regPayMode').val(reg.paymentMode || '');
        $('#regReceiptNo').val(reg.receiptNo || '');
        $('#receiptSection').hide();

        // If complete, show receipt immediately on fee tab
        if (reg.feeCollected) {
            showReceiptOnForm(appNo, reg);
        }

        // Update booth stepper
        updateBoothStepper(reg);

        showSection('section-ca-register-form');

        // Auto-redirect to the appropriate booth based on stage
        switchBooth(stage.booth);
    }

    function showReceiptOnForm(appNo, reg) {
        var student = getStudentByApp(appNo);
        $('#receiptSection').show();
        $('#rcptName').text(student.name);
        $('#rcptAppNo').text(appNo);
        $('#rcptRollNo').text(reg.rollNo);
        $('#rcptCourse').text(getCourseName(reg.allocatedCourse));
        $('#rcptAmount').text('₹' + reg.amountPaid.toLocaleString() + '.00');
        $('#rcptMode').text(reg.paymentMode || 'Cash');
        $('#rcptNo').text(reg.receiptNo);
        $('#rcptDate').text(new Date().toLocaleDateString('en-IN', {day:'2-digit',month:'short',year:'numeric'}));
    }

    function updateDocPendingAlert() {
        var allDocs = ['docMarksheet', 'docCommunity', 'docCOI', 'docPhoto', 'docTC'];
        var docLabels = {
            docMarksheet: 'Class XII Marksheet',
            docCommunity: 'Community Certificate',
            docCOI: 'COI / Domicile Certificate',
            docPhoto: 'Passport Photo',
            docTC: 'Transfer Certificate'
        };
        var pending = [];
        $.each(allDocs, function(_, id) {
            if (!$('#' + id).is(':checked')) pending.push(docLabels[id]);
        });
        if (pending.length > 0) {
            $('#docPendingAlert').show();
            $('#docPendingText').html('<strong>' + pending.length + ' document(s) pending:</strong> ' + pending.join(', '));
        } else {
            $('#docPendingAlert').hide();
        }
    }

    function populateElectives(courseId, selected) {
        var $container = $('#regElectives').empty();
        var elecs = ELECTIVES[courseId] || [];
        $.each(elecs, function(i, e) {
            var checked = $.inArray(e, selected || []) >= 0 ? ' checked' : '';
            $container.append(
                '<div class="form-check"><input class="form-check-input elective-check" type="checkbox" value="' + e + '" id="elec' + i + '"' + checked + '>' +
                '<label class="form-check-label small" for="elec' + i + '">' + e + '</label></div>'
            );
        });
    }

    function updateBoothButtons(reg) {
        // Unregister button: visible only after Verification & Registration (Booth 1) is complete
        if (reg.verified) {
            $('#btnUnregister').css('display', 'inline-flex');
        } else {
            $('#btnUnregister').css('display', 'none');
        }

        // Seat Allocation: requires reg.verified
        var seatOk = !!reg.verified;
        $('#btnSaveSeat').prop('disabled', !seatOk);
        if (seatOk) {
            $('#seatLockNotice').hide();
            $('#btnSaveSeat').removeClass('btn-secondary').addClass('btn-primary').css('opacity', '');
        } else {
            $('#seatLockNotice').show();
            $('#btnSaveSeat').removeClass('btn-primary').addClass('btn-secondary').css('opacity', '0.65');
        }
        // Fee Collection: requires reg.seatAllocated
        var feeOk = !!reg.seatAllocated;
        $('#btnSaveFee').prop('disabled', !feeOk);
        if (feeOk) {
            $('#feeLockNotice').hide();
            $('#btnSaveFee').removeClass('btn-secondary').addClass('btn-primary').css('opacity', '');
        } else {
            $('#feeLockNotice').show();
            $('#btnSaveFee').removeClass('btn-primary').addClass('btn-secondary').css('opacity', '0.65');
        }
    }

    function updateBoothStepper(reg) {
        $('.booth-step').removeClass('active completed');
        $('.booth-connector').removeClass('completed');
        if (reg.verified) { $('[data-booth="1"]').addClass('completed'); $('[data-after-booth="1"]').addClass('completed'); }
        if (reg.seatAllocated) { $('[data-booth="2"]').addClass('completed'); $('[data-after-booth="2"]').addClass('completed'); }
        if (reg.feeCollected) { $('[data-booth="3"]').addClass('completed'); }
        updateBoothButtons(reg);
    }

    function switchBooth(boothNum) {
        $('.booth-tab').hide();
        $('#booth' + boothNum).fadeIn(200);
        $('.booth-step').removeClass('active');
        $('[data-booth="' + boothNum + '"]').addClass('active');
    }

    // ============================================================
    // 9. MERIT LIST MANAGEMENT
    // ============================================================

    function renderMeritListDashboard() {
        var filterSession = $('#mlFilterSession').val() || 'all';
        var filterProgram = $('#mlFilterProgram').val() || 'all';

        var visible = $.grep(MERIT_LISTS, function(ml) {
            if (filterSession !== 'all' && ml.session !== filterSession) return false;
            if (filterProgram !== 'all') {
                // Program filter: match if the list's assigned program matches,
                // OR (for combined lists) if any entry's program matches
                var mlProg = ml.program || '';
                if (mlProg && mlProg !== filterProgram) return false;
                if (!mlProg) {
                    var hasMatch = false;
                    $.each(ml.entries, function(_, e) { if (e.program === filterProgram) { hasMatch = true; return false; } });
                    if (!hasMatch) return false;
                }
            }
            return true;
        });

        var $container = $('#meritListCards').empty();
        $('#mlManageCount').text(visible.length + ' list' + (visible.length !== 1 ? 's' : ''));

        if (visible.length === 0) {
            $container.html('<div class="col-12 text-center py-5 text-on-surface-variant"><p class="fs-5 fw-semibold mb-2">No Merit Lists Found</p><p>' + (MERIT_LISTS.length === 0 ? 'Upload your first merit list to get started.' : 'No lists match the selected filters.') + '</p></div>');
            return;
        }
        $.each(visible, function(_, ml) {
            var total = ml.entries.length;
            var matched = 0, regCount = 0;
            $.each(ml.entries, function(__, entry) {
                if (getStudentByApp(entry.appNo)) matched++;
                if (REGISTRATIONS[entry.appNo] && REGISTRATIONS[entry.appNo].feeCollected) regCount++;
            });
            var unmatched = total - matched;
            // Collect unique programs in the list
            var programs = {};
            $.each(ml.entries, function(__, e) { programs[e.program] = true; });
            var progLabel = ml.program || Object.keys(programs).join(', ');

            $container.append(
                '<div class="col-md-6"><div class="merit-card" data-ml-id="' + ml.id + '">' +
                '<div class="d-flex justify-content-between align-items-start mb-2">' +
                '<div>' +
                '<h5 class="fw-bold mb-1">' + ml.name + '</h5>' +
                '<p class="small text-on-surface-variant mb-1">' + progLabel + '</p>' +
                '<p class="small text-on-surface-variant mb-0">' + ml.date + '</p>' +
                '</div>' +
                '<div class="d-flex flex-column align-items-end gap-1">' +
                '<span class="merit-badge" style="background:var(--clr-primary-container);color:var(--clr-on-primary-container);">' + total + ' Entries</span>' +
                '<span class="badge rounded-pill px-2 py-1" style="background:var(--clr-secondary-container);color:var(--clr-on-secondary-container);font-size:.7rem;">' + ml.session + '</span>' +
                '</div>' +
                '</div>' +
                '<div class="d-flex gap-3 flex-wrap">' +
                '<span class="status-pill admitted">✓ Matched: ' + matched + '</span>' +
                (unmatched > 0 ? '<span class="status-pill not-appeared">✗ Not Found: ' + unmatched + '</span>' : '') +
                '<span class="status-pill pending">📋 Registered: ' + regCount + '</span>' +
                '</div></div></div>'
            );
        });
    }

    var currentMlEntries = [];

    function renderMlDetailTable() {
        var q       = ($('#mlDetailSearch').val() || '').toLowerCase().trim();
        var prog    = $('#mlDetailFilterProgram').val() || 'all';
        var linked  = $('#mlDetailFilterLinked').val()  || 'all';

        var $tbody = $('#mlDetailBody').empty();
        var shown = 0;

        $.each(currentMlEntries, function(rank, entry) {
            var s = getStudentByApp(entry.appNo);
            var isMatched = !!s;
            var isReg = !!(REGISTRATIONS[entry.appNo] && REGISTRATIONS[entry.appNo].feeCollected);

            // Filters
            if (prog !== 'all' && entry.program !== prog) return;
            if (linked === 'linked'     && !isMatched)  return;
            if (linked === 'notfound'   && isMatched)   return;
            if (linked === 'registered' && !isReg)      return;
            if (q) {
                var name = s ? s.name.toLowerCase() : '';
                if (entry.appNo.toLowerCase().indexOf(q) < 0 && name.indexOf(q) < 0) return;
            }

            shown++;
            var linkedBadge = isMatched
                ? '<span class="badge rounded-pill px-2 py-1" style="background:var(--clr-primary-container);color:var(--clr-on-primary-container);">Linked</span>'
                : '<span class="badge rounded-pill px-2 py-1" style="background:rgba(186,26,26,0.1);color:var(--clr-error);">Not Found</span>';
            var regBadge = isReg
                ? '<span class="badge rounded-pill px-2 py-1" style="background:var(--clr-tertiary-container);color:var(--clr-on-tertiary-container);">Registered</span>'
                : (isMatched ? '<span class="text-on-surface-variant small">—</span>' : '');

            $tbody.append(
                '<tr' + (!isMatched ? ' style="opacity:0.6;"' : '') + '>' +
                '<td class="cell-number">' + shown + '</td>' +
                '<td class="fw-semibold" style="font-family:monospace;color:var(--clr-primary);">' + entry.appNo + '</td>' +
                '<td class="fw-semibold">' + (s ? s.name : '—') + '</td>' +
                '<td class="cell-number">' + (s ? s.marks + '%' : '—') + '</td>' +
                '<td>' + entry.program + '</td>' +
                '<td>' + entry.course + '</td>' +
                '<td>' + linkedBadge + '</td>' +
                '<td>' + regBadge + '</td></tr>'
            );
        });

        $('#mlDetailCount').text(shown + ' of ' + currentMlEntries.length + ' entr' + (currentMlEntries.length !== 1 ? 'ies' : 'y'));
        if (shown === 0) {
            $('#mlDetailEmpty').show();
            $tbody.closest('.table-responsive').hide();
        } else {
            $('#mlDetailEmpty').hide();
            $tbody.closest('.table-responsive').show();
        }
    }

    function openMeritListDetail(mlId) {
        var ml = null;
        $.each(MERIT_LISTS, function(_, m) { if (m.id === mlId) ml = m; });
        if (!ml) return;

        currentMlEntries = ml.entries;

        $('#mlDetailName').text(ml.name);
        $('#mlDetailDate').text(ml.date);
        $('#mlDetailTotal').text(ml.entries.length);
        $('#mlDetailSession').text(ml.session || '—');
        $('#mlDetailProgram').text(ml.program || 'All Programs');
        $('#btnDeleteMeritList').data('ml-id', mlId);

        // Reset filters
        $('#mlDetailSearch').val('');
        $('#mlDetailFilterProgram').val('all');
        $('#mlDetailFilterLinked').val('all');

        // Compute summary stats from full entry list
        var matched = 0, unmatched = 0, regCount = 0;
        $.each(ml.entries, function(_, entry) {
            var s = getStudentByApp(entry.appNo);
            if (s) matched++; else unmatched++;
            if (REGISTRATIONS[entry.appNo] && REGISTRATIONS[entry.appNo].feeCollected) regCount++;
        });
        $('#mlSummaryTotal').text(ml.entries.length);
        $('#mlSummaryMatched').text(matched);
        $('#mlSummaryUnmatched').text(unmatched);
        $('#mlSummaryRegistered').text(regCount);

        renderMlDetailTable();
        showSection('section-ca-merit-detail');
    }

    // ============================================================
    // 10. ALL APPLICATIONS
    // ============================================================

    var allAppsActiveView = 'all';
    var allAppsLastFiltered = [];

    function getStudentSession(s) {
        var m = s.appNo.match(/SK-(\d{4})-/);
        if (m) {
            var yr = parseInt(m[1], 10);
            return yr + '-' + String(yr + 1).slice(-2);
        }
        return 'Unknown';
    }

    function isStudentMeritListed(appNo) {
        for (var i = 0; i < MERIT_LISTS.length; i++) {
            for (var j = 0; j < MERIT_LISTS[i].entries.length; j++) {
                if (MERIT_LISTS[i].entries[j].appNo === appNo) return true;
            }
        }
        return false;
    }

    function getStudentAppStatus(appNo) {
        var reg = REGISTRATIONS[appNo];
        if (reg && reg.feeCollected)  return 'completed';
        if (reg && reg.seatAllocated) return 'registered';
        if (reg && reg.verified)      return 'verified';
        if (isStudentMeritListed(appNo)) return 'merit-listed';
        return 'applied';
    }

    function renderAllApplications() {
        var session     = $('#filterSession').val()      || 'all';
        var course      = $('#filterCourse').val()       || 'all';
        var status      = $('#filterStatus').val()       || 'all';
        var gender      = $('#filterGender').val()       || 'all';
        var community   = $('#filterCommunity').val()    || 'all';
        var board       = $('#filterBoard').val()        || 'all';
        var district    = $('#filterDistrict').val()     || 'all';
        var marksUpd    = $('#filterMarksUpdated').val() || 'all';
        var q           = ($('#filterSearch').val()      || '').toLowerCase().trim();
        var view        = allAppsActiveView;

        // Base filter (session, course, gender, community, board, district, marksUpdated, search)
        function baseFilter(s) {
            if (session   !== 'all' && getStudentSession(s) !== session)         return false;
            if (course    !== 'all' && s.course !== course)                       return false;
            if (gender    !== 'all' && s.gender.toLowerCase() !== gender)         return false;
            if (community !== 'all' && s.community !== community)                 return false;
            if (board     !== 'all' && s.board !== board)                         return false;
            if (district  !== 'all' && s.district !== district)                   return false;
            var hasMarksUpd = !!(REGISTRATIONS[s.appNo] && REGISTRATIONS[s.appNo].marksUpdated);
            if (marksUpd === 'updated'  && !hasMarksUpd) return false;
            if (marksUpd === 'original' && hasMarksUpd)  return false;
            if (q && s.name.toLowerCase().indexOf(q) < 0 &&
                     s.appNo.toLowerCase().indexOf(q) < 0 &&
                     s.rollNo.toLowerCase().indexOf(q) < 0) return false;
            return true;
        }

        // Tab counts (base filter only, ignoring status + view tab)
        var basePassed = $.grep(STUDENTS, baseFilter);
        var cntAll    = basePassed.length;
        var cntMerit  = $.grep(basePassed, function(s) { return isStudentMeritListed(s.appNo); }).length;
        var cntReg    = $.grep(basePassed, function(s) {
            return REGISTRATIONS[s.appNo] && REGISTRATIONS[s.appNo].verified;
        }).length;
        var cntRec    = $.grep(basePassed, function(s) { return isStudentRecommendation(s.appNo); }).length;
        $('#tabCountAll').text(cntAll);
        $('#tabCountMerit').text(cntMerit);
        $('#tabCountReg').text(cntReg);
        $('#tabCountRec').text(cntRec);

        // Full filter (adds status + view tab)
        var filtered = $.grep(basePassed, function(s) {
            var appStatus = getStudentAppStatus(s.appNo);
            if (status !== 'all' && appStatus !== status) return false;
            if (view === 'merit'           && !isStudentMeritListed(s.appNo))               return false;
            if (view === 'registered'      && !(REGISTRATIONS[s.appNo] && REGISTRATIONS[s.appNo].verified)) return false;
            if (view === 'recommendation'  && !isStudentRecommendation(s.appNo))             return false;
            return true;
        });

        allAppsLastFiltered = filtered;

        var n = filtered.length;
        $('#appsResultCount').text(n + ' result' + (n !== 1 ? 's' : ''));

        var $tbody = $('#allAppsBody').empty();
        if (n === 0) {
            $('#allAppsEmpty').show();
            $('#allAppsTableWrap').hide();
            return;
        }
        $('#allAppsEmpty').hide();
        $('#allAppsTableWrap').show();

        var statusMap = {
            'applied':      { label: 'Applied',       bg: 'var(--clr-surface-variant)',          color: 'var(--clr-on-surface-variant)' },
            'merit-listed': { label: 'Merit Listed',  bg: 'var(--clr-primary-container)',        color: 'var(--clr-on-primary-container)' },
            'verified':     { label: 'Verified',      bg: 'var(--clr-tertiary-container)',       color: 'var(--clr-on-tertiary-container)' },
            'registered':   { label: 'Seat Allotted', bg: 'rgba(63,102,90,0.15)',               color: 'var(--clr-secondary)' },
            'completed':    { label: 'Fee Collected', bg: 'var(--clr-primary)',                  color: '#fff' }
        };

        $.each(filtered, function(i, s) {
            var appStatus = getStudentAppStatus(s.appNo);
            var st = statusMap[appStatus] || statusMap['applied'];
            var mls = getMeritListsForApp(s.appNo);
            var mlHtml = mls.length
                ? $.map(mls, function(m) {
                    return '<span class="badge rounded-pill me-1" style="background:var(--clr-primary-container);color:var(--clr-on-primary-container);font-size:10px;">' + m.name + '</span>';
                }).join('')
                : '<span class="text-on-surface-variant" style="font-size:.75rem;">—</span>';

            // Marks: compute obtained / total / subject count from subjects array
            var obtained = 0, maxMarks = 0, subjectCount = (s.subjects || []).length;
            $.each(s.subjects || [], function(_, sub) { obtained += sub.marks; maxMarks += sub.total; });
            var marksUpdated = REGISTRATIONS[s.appNo] && REGISTRATIONS[s.appNo].marksUpdated;
            var marksCell = obtained + ' / ' + maxMarks +
                '<br><span class="text-on-surface-variant" style="font-size:.68rem;">' + subjectCount + ' subject' + (subjectCount !== 1 ? 's' : '') + '</span>' +
                (marksUpdated ? ' <span title="Marks updated by admin" style="color:var(--clr-tertiary);font-size:.7rem;cursor:help;">✎</span>' : '');

            // Program vs Course split
            var programLabel = courseToProgramLabel(getCourseName(s.course));
            var courseLabel  = getCourseName(s.course);

            $tbody.append(
                '<tr>' +
                '<td class="text-on-surface-variant small">' + (i + 1) + '</td>' +
                '<td style="font-family:monospace;color:var(--clr-primary);font-size:.8rem;white-space:nowrap;">' + s.appNo + '</td>' +
                '<td>' +
                    '<span class="fw-semibold d-block">' + s.name +
                    (isStudentRecommendation(s.appNo) ? ' <span class="badge rounded-pill ms-1" style="background:rgba(186,26,26,0.1);color:var(--clr-error);font-size:.62rem;vertical-align:middle;"><span class="material-symbols-outlined" style="font-size:10px;vertical-align:-1px;">star</span> Recommendation</span>' : '') +
                    '</span>' +
                    '<span class="text-on-surface-variant" style="font-size:.72rem;">' + s.board + ' · ' + s.district + '</span>' +
                '</td>' +
                '<td class="small fw-semibold">' + programLabel + '</td>' +
                '<td class="small">' + courseLabel + '</td>' +
                '<td class="cell-number" style="font-size:.8rem;">' + marksCell + '</td>' +
                '<td class="small">' + s.gender + '</td>' +
                '<td class="small">' + s.community + '</td>' +
                '<td>' + mlHtml + '</td>' +
                '<td><span class="status-pill" style="background:' + st.bg + ';color:' + st.color + ';white-space:nowrap;">' + st.label + '</span></td>' +
                '<td><button class="btn btn-sm btn-outline-primary fw-bold open-reg-btn py-1 px-2" data-app="' + s.appNo + '" style="font-size:.75rem;">View &rarr;</button></td>' +
                '</tr>'
            );
        });
    }

    function exportAppsCSV() {
        var data = allAppsLastFiltered;
        if (!data.length) { showToast('No records to export.', 'warn'); return; }

        // Collect all unique subject names across filtered students (preserving first-seen order)
        var subjectNames = [];
        var subjectIndex = {};
        $.each(data, function(i, s) {
            $.each(s.subjects || [], function(j, sub) {
                if (!subjectIndex.hasOwnProperty(sub.name)) {
                    subjectIndex[sub.name] = subjectNames.length;
                    subjectNames.push(sub.name);
                }
            });
        });

        // Build header row
        var header = [
            '#', 'Session', 'App No', 'Roll No', 'Name', 'Date of Birth', 'Gender',
            'Community', 'COI No.', 'PWD',
            'Mobile', 'Email',
            'Father Name', 'Father Contact', 'Mother Name',
            'District', 'State', 'Pincode', 'Permanent Address',
            'Board', 'Stream', 'Aggregate %'
        ];
        // Subject columns (marks only — total is always 100)
        $.each(subjectNames, function(i, name) {
            header.push(name + ' (Marks)');
            header.push(name + ' (Max)');
        });
        header = header.concat([
            'Program Applied', 'Preference 1', 'Preference 2', 'Preference 3',
            'App Fee Txn', 'App Fee Amount (₹)', 'App Fee Status', 'App Fee Method',
            'Merit Lists', 'Admission Status', 'Recommendation'
        ]);

        // Build data rows
        var rows = [header];
        $.each(data, function(idx, s) {
            // Build subject marks lookup
            var subMarks = {};
            var subTotal = {};
            $.each(s.subjects || [], function(j, sub) {
                subMarks[sub.name] = sub.marks;
                subTotal[sub.name] = sub.total;
            });

            // Merit lists
            var mls = getMeritListsForApp(s.appNo);
            var mlText = mls.length ? $.map(mls, function(m) { return m.name; }).join(' | ') : '';

            // Status label
            var statusLabelMap = {
                'applied': 'Applied', 'merit-listed': 'Merit Listed',
                'verified': 'Verified', 'registered': 'Seat Allotted', 'completed': 'Fee Collected'
            };
            var appStatus = getStudentAppStatus(s.appNo);
            var statusLabel = statusLabelMap[appStatus] || 'Applied';

            var fee = s.appFee || {};
            var row = [
                idx + 1,
                getStudentSession(s),
                s.appNo,
                s.rollNo || '',
                s.name,
                s.dob || '',
                s.gender,
                s.community,
                s.coiNumber || '',
                s.pwd || '',
                s.mobile || '',
                s.email || '',
                s.fatherName || '',
                s.fatherContact || '',
                s.motherName || '',
                s.district || '',
                s.state || '',
                s.pincode || '',
                s.permanentAddress || '',
                s.board,
                s.stream || '',
                s.marks
            ];
            // Subject columns
            $.each(subjectNames, function(i, name) {
                row.push(subMarks.hasOwnProperty(name) ? subMarks[name] : '');
                row.push(subTotal.hasOwnProperty(name) ? subTotal[name] : '');
            });
            row = row.concat([
                getCourseName(s.course),
                s.pref1 || '',
                s.pref2 || '',
                s.pref3 || '',
                fee.txn || '',
                fee.amount || '',
                fee.status || '',
                fee.method || '',
                mlText,
                statusLabel,
                isStudentRecommendation(s.appNo) ? 'Yes' : 'No'
            ]);
            rows.push(row);
        });

        var csv = rows.map(function(r) {
            return r.map(function(c) { return '"' + String(c).replace(/"/g, '""') + '"'; }).join(',');
        }).join('\r\n');

        var a = document.createElement('a');
        a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
        a.download = 'applications_' + (new Date().toISOString().slice(0, 10)) + '.csv';
        a.click();
    }

    function initAllApplications() {
        $(document).on('change', '#filterSession, #filterCourse, #filterStatus, #filterGender, #filterCommunity, #filterBoard, #filterDistrict, #filterMarksUpdated', function() {
            renderAllApplications();
        });
        $(document).on('input', '#filterSearch', function() {
            renderAllApplications();
        });
        $(document).on('click', '#btnClearFilters', function() {
            $('#filterSession, #filterCourse, #filterStatus, #filterGender, #filterCommunity, #filterBoard, #filterDistrict, #filterMarksUpdated').val('all');
            $('#filterSearch').val('');
            renderAllApplications();
        });
        $(document).on('click', '.app-view-tab', function() {
            allAppsActiveView = $(this).data('view');
            $('.app-view-tab').removeClass('active btn-primary').addClass('btn-outline-primary');
            $(this).removeClass('btn-outline-primary').addClass('active btn-primary');
            renderAllApplications();
        });
        $(document).on('click', '#btnExportApps', function() {
            exportAppsCSV();
        });
    }

    // ============================================================
    // 11. TOAST
    // ============================================================

    function showToast(msg, type) {
        type = type || 'success';
        var bg = type === 'success' ? 'bg-success' : type === 'warning' ? 'bg-warning text-dark' : 'bg-danger';
        var icon = type === 'success' ? 'check_circle' : 'warning';
        var $t = $('<div class="position-fixed bottom-0 end-0 m-4 px-4 py-3 rounded-3 shadow-lg d-flex align-items-center gap-2 ' + bg + ' text-white animate-fade-in-up" style="z-index:9999">' +
            '<span class="material-symbols-outlined">' + icon + '</span><span class="fw-semibold">' + msg + '</span></div>').appendTo('body');
        setTimeout(function () { $t.fadeOut(300, function () { $(this).remove(); }); }, 3000);
    }

    // ============================================================
    // 11. EVENT BINDINGS
    // ============================================================

    function initEvents() {
        // Sidebar nav
        $(document).on('click', '.sidebar-admin .sidebar-nav-item[data-section]', function (e) {
            e.preventDefault();
            showSection($(this).data('section'));
        });

        // Quick actions
        $(document).on('click', '#btnQuickRegister', function () {
            showSection('section-ca-register-search');
        });
        $(document).on('click', '#btnQuickMerit', function () {
            showSection('section-ca-merit-upload');
        });

        // Admission schedule: add selective row
        $(document).on('click', '#btnAddSelectiveWindow', function () {
            $('#cfgSelectiveBody .selective-empty-state').remove();
            $('#cfgSelectiveBody').append(getSelectiveRowHtml());
        });

        // Admission schedule: remove selective row
        $(document).on('click', '.btn-remove-selective-row', function () {
            $(this).closest('.selective-window-card').remove();
            if ($('#cfgSelectiveBody .selective-window-card').length === 0) {
                $('#cfgSelectiveBody').html(SELECTIVE_EMPTY_HTML);
            }
        });

        // Admission schedule: when program changes, refresh multi-select course options
        $(document).on('change', '.selective-program', function () {
            var catalog = getProgramCatalog();
            var program = $(this).val();
            var $card = $(this).closest('.selective-window-card');
            var $course = $card.find('.selective-course');
            $course.empty();
            if (program && catalog[program]) {
                $.each(catalog[program], function(_, c) {
                    $course.append('<option value="' + c.id + '">' + c.name + '</option>');
                });
                $course.prop('disabled', false);
                $card.find('.selective-scope-wrap .text-on-surface-variant').remove();
            } else {
                $course.prop('disabled', true);
            }
        });

        // Admission schedule: toggle All Programs & Courses switch
        $(document).on('change', '.selective-apply-all', function () {
            var $card   = $(this).closest('.selective-window-card');
            var checked = $(this).is(':checked');
            var $wrap   = $card.find('.selective-scope-wrap');
            if (checked) {
                $wrap.css({ opacity: '0.45', 'pointer-events': 'none' });
                $card.find('.selective-program, .selective-course').prop('disabled', true);
            } else {
                $wrap.css({ opacity: '', 'pointer-events': '' });
                $card.find('.selective-program').prop('disabled', false);
                // Only re-enable course select if a program is already chosen
                if ($card.find('.selective-program').val()) {
                    $card.find('.selective-course').prop('disabled', false);
                }
            }
        });

        // Admission schedule: reset form
        $(document).on('click', '#btnResetScheduleConfig', function () {
            resetScheduleForm();
        });

        // Prospectus file picker
        $(document).on('click', '#btnPickProspectus', function () {
            $('#cfgProspectusFile').val('').trigger('click');
        });
        $(document).on('change', '#cfgProspectusFile', function () {
            var file = this.files[0];
            if (file) $('#cfgProspectusName').val(file.name);
        });
        $(document).on('click', '#btnClearProspectus', function () {
            $('#cfgProspectusFile').val('');
            $('#cfgProspectusName').val('');
        });

        // Admission schedule: save config
        $(document).on('click', '#btnSaveScheduleConfig', function () {
            var session = ($('#cfgSession').val() || '').trim();
            if (!session) {
                showToast('Session is required', 'warning');
                return;
            }

            var cfg = {
                session: session,
                collegeId: COLLEGE_INFO.id,
                status: 'active',
                notification: ($('#cfgNotification').val() || '').trim(),
                restricted: $('#cfgRestricted').is(':checked'),
                appFee: parseFloat($('#cfgAppFee').val()) || 0,
                prospectusName: ($('#cfgProspectusName').val() || '').trim(),
                defaultWindow: {
                    appOpen: $('#cfgAppOpen').val() || '',
                    appClose: $('#cfgAppClose').val() || '',
                    regOpen: $('#cfgRegOpen').val() || '',
                    regClose: $('#cfgRegClose').val() || ''
                },
                selectiveWindows: readSelectiveRows(),
                updatedAt: new Date().toISOString()
            };

            var schedKey = COLLEGE_INFO.id + '_' + session;
            // Preserve existing inviteToken if already generated
            var existing = ADMISSION_SCHEDULES[schedKey];
            if (cfg.restricted) {
                cfg.inviteToken = (existing && existing.inviteToken) || generateInviteToken();
            } else {
                cfg.inviteToken = '';
            }
            ADMISSION_SCHEDULES[schedKey] = cfg;
            saveAdmissionSchedules();
            renderScheduleCards();
            showToast('Session schedule saved successfully');
        });

        // Admission schedule: edit
        $(document).on('click', '.btn-edit-schedule', function () {
            var key = $(this).data('key');
            if (!ADMISSION_SCHEDULES[key]) return;
            populateScheduleForm(ADMISSION_SCHEDULES[key]);
            $('html, body').scrollTop(0);
        });

        // Admission schedule: delete
        $(document).on('click', '.btn-delete-schedule', function () {
            var key = $(this).data('key');
            if (!ADMISSION_SCHEDULES[key]) return;
            var session = ADMISSION_SCHEDULES[key].session;
            if (!confirm('Delete schedule for session ' + session + '?')) return;
            delete ADMISSION_SCHEDULES[key];
            if (editingScheduleSession === session) resetScheduleForm();
            saveAdmissionSchedules();
            renderScheduleCards();
            showToast('Session schedule deleted', 'warning');
        });

        // Copy invite link
        $(document).on('click', '.btn-copy-invite', function () {
            var url = $(this).data('url');
            var $btn = $(this);
            navigator.clipboard.writeText(url).then(function () {
                $btn.html('<span class="material-symbols-outlined" style="font-size:13px;">check</span>Copied!');
                setTimeout(function () {
                    $btn.html('<span class="material-symbols-outlined" style="font-size:13px;">content_copy</span>Copy');
                }, 2000);
            });
        });

        // Booth tabs
        $(document).on('click', '.booth-step', function () {
            switchBooth(parseInt($(this).data('booth')));
        });

        // Save Verification Remarks independently (without registering)
        $(document).on('click', '#btnSaveRemarksVerification', function() {
            if (!currentRegApp) return;
            var reg = REGISTRATIONS[currentRegApp];
            reg.remarksVerification = $('#regRemarksVerification').val().trim();
            reg.remarksVerificationSavedAt = new Date().toISOString();
            saveRegistrations();
            var savedStr = new Date().toLocaleTimeString('en-IN', {hour:'2-digit', minute:'2-digit'});
            $('#remarksVerificationSavedAt').show().find('.rmk-time').text('at ' + savedStr);
            showToast('Remarks saved.');
        });

        // Edit Marks toggle
        $(document).on('click', '.btn-edit-marks', function() {
            $('#editMarksPanel').slideToggle(200);
        });
        $(document).on('click', '#btnCancelEditMarks', function() {
            $('#editMarksPanel').slideUp(200);
        });
        $(document).on('click', '#btnSaveMarks', function() {
            if (!currentRegApp) return;
            var reg = REGISTRATIONS[currentRegApp];
            var updatedMarks = [];
            var valid = true;
            $('.edit-sub-marks').each(function() {
                var name  = String($(this).data('name'));
                var total = parseInt($(this).data('total'));
                var marks = parseInt($(this).val());
                if (isNaN(marks) || marks < 0 || marks > total) {
                    valid = false;
                    $(this).addClass('is-invalid');
                } else {
                    $(this).removeClass('is-invalid');
                    updatedMarks.push({ name: name, marks: marks, total: total });
                }
            });
            if (!valid) { showToast('Please enter valid marks (0 – max) for all subjects.', 'warning'); return; }
            reg.updatedMarks  = updatedMarks;
            reg.marksUpdated  = true;
            reg.marksUpdatedAt = new Date().toISOString();
            saveRegistrations();
            // Re-render read-only subjects table
            var $subBody2 = $('#roSubjectsBody').empty();
            var totalObt = 0, totalFull = 0;
            $.each(updatedMarks, function(_, sub) {
                var passClass = sub.marks >= 33 ? 'background:rgba(107,217,188,0.2);color:var(--clr-on-primary-container);' : 'background:rgba(186,26,26,0.1);color:var(--clr-error);';
                $subBody2.append('<tr><td>' + sub.name + '</td><td class="text-center">' + sub.marks + '</td><td class="text-center">' + sub.total + '</td><td class="text-end"><span class="badge rounded-pill px-2 py-1" style="' + passClass + '">' + (sub.marks >= 33 ? 'Pass' : 'Fail') + '</span></td></tr>');
                totalObt  += sub.marks;
                totalFull += sub.total;
            });
            var newAgg = totalFull > 0 ? ((totalObt / totalFull) * 100).toFixed(1) : '0.0';
            $('#roAggregate').text(newAgg + '% (' + totalObt + '/' + totalFull + ')');
            $('#regMarks').text(newAgg + '%');
            var updAtStr = new Date().toLocaleDateString('en-IN', {day:'2-digit', month:'short', year:'numeric'});
            $('#marksUpdatedBadge').css({'display':'flex','background':'rgba(186,26,26,0.08)'}).find('.upd-date').text(' (' + updAtStr + ')');
            $('#btnEditMarksWrap').css('display','none');
            $('#editMarksPanel').slideUp(200);
            showToast('Class XII marks updated successfully.');
        });

        // Document checkbox change → update alert
        $(document).on('change', '.doc-check', function() {
            updateDocPendingAlert();
        });

        // Save Verification (now "Register")
        $(document).on('click', '#btnSaveVerification', function () {
            if (!currentRegApp) return;
            var reg = REGISTRATIONS[currentRegApp];
            // Save corrections (only non-empty values)
            var corrections = {};
            var editName = $('#regEditName').val().trim();
            var editDob = $('#regEditDob').val();
            var editFather = $('#regEditFather').val().trim();
            var editAddress = $('#regEditAddress').val().trim();
            var editMobile = $('#regEditMobile').val().trim();
            if (editName) corrections.name = editName;
            if (editDob) corrections.dob = editDob;
            if (editFather) corrections.fatherName = editFather;
            if (editAddress) corrections.address = editAddress;
            if (editMobile) corrections.mobile = editMobile;
            reg.corrections = corrections;
            reg.remarksVerification = $('#regRemarksVerification').val().trim();

            // Save document status
            reg.documents = {
                marksheet: $('#docMarksheet').is(':checked'),
                community: $('#docCommunity').is(':checked'),
                coi: $('#docCOI').is(':checked'),
                photo: $('#docPhoto').is(':checked'),
                tc: $('#docTC').is(':checked')
            };
            reg.verified = true;
            saveRegistrations();
            updateBoothStepper(reg);
            var stage = getRegStage(currentRegApp);
            $('#regStageBadge').text(stage.label).css({ 'background': stage.bg, 'color': stage.color });
            showToast('Registered successfully! Proceed to Seat Allocation.');
            // Auto-advance to next booth
            switchBooth(2);
        });

        // Save Seat Allocation
        $(document).on('click', '#btnSaveSeat', function () {
            if (!currentRegApp) return;
            var reg = REGISTRATIONS[currentRegApp];
            reg.allocatedCourse = $('#regAllocCourse').val();
            reg.rollNo = $('#regRollNo').val();
            reg.section = $('#regSection').val();
            reg.electives = [];
            $('.elective-check:checked').each(function () { reg.electives.push($(this).val()); });
            reg.remarksSeat = $('#regRemarksSeat').val().trim();
            reg.seatAllocated = true;
            saveRegistrations();
            updateBoothStepper(reg);
            var stage = getRegStage(currentRegApp);
            $('#regStageBadge').text(stage.label).css({ 'background': stage.bg, 'color': stage.color });
            showToast('Seat allocation saved!');
            // Auto-advance to fee collection
            switchBooth(3);
        });

        // Course change → update electives
        $(document).on('change', '#regAllocCourse', function () {
            populateElectives($(this).val(), []);
            var course = getCourseById($(this).val());
            if (course) {
                $('#regFeeAmount').text('₹' + course.fee.toLocaleString() + '.00');
                $('#regFeeTotal').text('₹' + course.fee.toLocaleString() + '.00');
            }
        });

        // Save Fee Collection
        $(document).on('click', '#btnSaveFee', function () {
            if (!currentRegApp) return;
            var reg = REGISTRATIONS[currentRegApp];
            var course = getCourseById(reg.allocatedCourse);
            reg.paymentMode = $('#regPayMode').val();
            reg.receiptNo = $('#regReceiptNo').val() || generateReceiptNo();
            reg.amountPaid = course ? course.fee : 0;
            reg.remarksFee = $('#regRemarksFee').val().trim();
            reg.feeCollected = true;
            saveRegistrations();
            updateBoothStepper(reg);
            var stage = getRegStage(currentRegApp);
            $('#regStageBadge').text(stage.label).css({ 'background': stage.bg, 'color': stage.color });
            showToast('Fee collected! Registration complete.');
            showReceiptOnForm(currentRegApp, reg);
        });

        // Print receipt
        $(document).on('click', '#btnPrintReceipt', function () { window.print(); });

        // Unregister — open modal
        $(document).on('click', '#btnUnregister', function () {
            if (!currentRegApp) return;
            var student = getStudentByApp(currentRegApp);
            $('#unregStudentName').text(student ? student.name + ' (' + currentRegApp + ')' : currentRegApp);
            $('#unregReason').val('').removeClass('is-invalid');
            var modal = new bootstrap.Modal(document.getElementById('unregisterModal'));
            modal.show();
        });

        // Unregister — confirm
        $(document).on('click', '#btnConfirmUnregister', function () {
            var reason = $('#unregReason').val().trim();
            if (!reason) {
                $('#unregReason').addClass('is-invalid');
                $('#unregReasonError').show();
                return;
            }
            if (!currentRegApp) return;
            // Preserve only a minimal audit record; wipe all booth data
            REGISTRATIONS[currentRegApp] = {
                verified: false, corrections: {}, documents: {},
                seatAllocated: false, rollNo: '', section: '', electives: [], allocatedCourse: '',
                feeCollected: false, paymentMode: '', receiptNo: '', amountPaid: 0,
                updatedMarks: [], marksUpdated: false, marksUpdatedAt: '',
                remarksVerification: '', remarksVerificationSavedAt: '',
                remarksSeat: '', remarksFee: '',
                unregisteredAt: new Date().toISOString(),
                unregisterReason: reason
            };
            saveRegistrations();
            bootstrap.Modal.getInstance(document.getElementById('unregisterModal')).hide();
            // Refresh form UI
            openRegistrationForm(currentRegApp);
            showToast('Student unregistered. All booth data has been cleared.');
        });

        // Back to search
        $(document).on('click', '#btnBackToSearch', function () {
            showSection('section-ca-register-search');
        });

        // Merit list detail search & filters
        $(document).on('input', '#mlDetailSearch', function () { renderMlDetailTable(); });
        $(document).on('change', '#mlDetailFilterProgram, #mlDetailFilterLinked', function () { renderMlDetailTable(); });

        // Merit list manage filters
        $(document).on('change', '#mlFilterSession, #mlFilterProgram', function () {
            renderMeritListDashboard();
        });

        // Merit list card click
        $(document).on('click', '.merit-card', function () {
            openMeritListDetail($(this).data('ml-id'));
        });

        // Back to merit list dashboard
        $(document).on('click', '#btnBackToMeritList', function () {
            showSection('section-ca-merit-manage');
        });

        // Delete merit list
        $(document).on('click', '#btnDeleteMeritList', function () {
            var mlId = $(this).data('ml-id');
            if (!confirm('Delete this merit list?')) return;
            MERIT_LISTS = $.grep(MERIT_LISTS, function(ml) { return ml.id !== mlId; });
            saveMeritLists();
            showToast('Merit list deleted', 'warning');
            showSection('section-ca-merit-manage');
        });

        // Validate merit list upload
        var pendingEntries = [];

        function processUploadedRows(rows) {
            pendingEntries = [];
            var matched = 0, unmatched = 0;
            var $tbody = $('#mlPreviewBody').empty();

            $.each(rows, function(i, row) {
                var appNo = String(row[0] || '').trim();
                var program = String(row[1] || '').trim();
                var course = String(row[2] || '').trim();
                if (!appNo) return;
                var s = getStudentByApp(appNo);
                var isMatched = !!s;
                if (isMatched) matched++; else unmatched++;

                pendingEntries.push({ appNo: appNo, program: program, course: course });

                var statusBadge = isMatched
                    ? '<span class="badge rounded-pill px-2 py-1" style="background:var(--clr-primary-container);color:var(--clr-on-primary-container);">Matched</span>'
                    : '<span class="badge rounded-pill px-2 py-1" style="background:rgba(186,26,26,0.1);color:var(--clr-error);">Not Found</span>';
                $tbody.append(
                    '<tr' + (!isMatched ? ' style="opacity:0.6;"' : '') + '>' +
                    '<td class="cell-number">' + (i + 1) + '</td>' +
                    '<td style="font-family:monospace;" class="fw-semibold">' + appNo + '</td>' +
                    '<td>' + (s ? s.name : '—') + '</td>' +
                    '<td class="cell-number">' + (s ? s.marks + '%' : '—') + '</td>' +
                    '<td>' + program + '</td><td>' + course + '</td>' +
                    '<td>' + statusBadge + '</td></tr>'
                );
            });

            $('#mlPreviewMatchCount').text(matched + ' matched');
            if (unmatched > 0) {
                $('#mlPreviewUnmatchBadge').show();
                $('#mlPreviewUnmatchCount').text(unmatched);
            } else {
                $('#mlPreviewUnmatchBadge').hide();
            }
            $('#mlPreviewArea').show();
            $('#btnUploadMerit').show();
        }

        // File upload handler
        $(document).on('change', '#mlFileInput', function (e) {
            var file = e.target.files[0];
            if (!file) return;
            if (file.size > 5 * 1024 * 1024) { showToast('File exceeds 5 MB limit', 'warning'); return; }

            // Update drop zone UI
            $('#mlDropIcon').text('description');
            $('#mlDropLabel').text(file.name);
            $('#mlDropHint').text((file.size / 1024).toFixed(1) + ' KB');

            var reader = new FileReader();
            reader.onload = function (evt) {
                try {
                    var wb = XLSX.read(evt.target.result, { type: 'array' });
                    var ws = wb.Sheets[wb.SheetNames[0]];
                    var data = XLSX.utils.sheet_to_json(ws, { header: 1 });
                    // Skip header row if first cell looks like a header
                    var firstCell = String(data[0] && data[0][0] || '').toLowerCase();
                    if (firstCell.indexOf('application') >= 0 || firstCell.indexOf('app') >= 0 || firstCell === 'sl' || firstCell === '#' || firstCell === 'sno') {
                        data.shift();
                    }
                    processUploadedRows(data);
                } catch (err) {
                    showToast('Could not read file. Check format.', 'warning');
                }
            };
            reader.readAsArrayBuffer(file);
        });

        // Drag & drop
        $(document).on('dragover', '#mlDropZone', function(e) { e.preventDefault(); $(this).css('border-color', 'var(--clr-primary)'); });
        $(document).on('dragleave', '#mlDropZone', function() { $(this).css('border-color', ''); });
        $(document).on('drop', '#mlDropZone', function(e) {
            e.preventDefault();
            $(this).css('border-color', '');
            var files = e.originalEvent.dataTransfer.files;
            if (files.length) { $('#mlFileInput')[0].files = files; $('#mlFileInput').trigger('change'); }
        });

        // Download template
        $(document).on('click', '#btnDownloadTemplate', function(e) {
            e.preventDefault();
            var wsData = [
                ['Application ID', 'Program', 'Course'],
                ['SK-2026-1003', 'B.Com (Hons)', 'Accounting & Finance'],
                ['SK-2026-1001', 'B.A. Political Science', 'Political Science']
            ];
            var ws = XLSX.utils.aoa_to_sheet(wsData);
            ws['!cols'] = [{ wch: 18 }, { wch: 25 }, { wch: 25 }];
            var wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Merit List');
            XLSX.writeFile(wb, 'merit_list_template.xlsx');
        });

        // Manual validate (fallback, hidden by default)
        $(document).on('click', '#btnValidateMerit', function () {
            if (pendingEntries.length === 0) { showToast('Please upload a file first', 'warning'); return; }
        });

        // Create merit list (after validation)
        $(document).on('click', '#btnUploadMerit', function () {
            var name = $('#mlUploadName').val().trim();
            var session = $('#mlUploadSession').val() || '2026-27';
            var date = $('#mlUploadDate').val();
            var program = $('#mlUploadProgram').val() || '';
            if (!name) { showToast('Please enter a merit list name', 'warning'); return; }
            if (!date) { showToast('Please select a date', 'warning'); return; }
            if (pendingEntries.length === 0) { showToast('No entries to upload', 'warning'); return; }

            var newId = 'ML-' + (MERIT_LISTS.length + 1).toString().padStart(3, '0');
            MERIT_LISTS.push({ id: newId, name: name, date: date, session: session, program: program, entries: pendingEntries });
            saveMeritLists();

            // Reset form
            $('#mlUploadName').val('');
            $('#mlUploadSession').val('2026-27');
            $('#mlUploadDate').val('');
            $('#mlUploadProgram').val('');
            $('#mlFileInput').val('');
            $('#mlDropIcon').text('cloud_upload');
            $('#mlDropLabel').text('Click to upload or drag & drop');
            $('#mlDropHint').text('.xlsx, .xls, .csv — Max 5 MB');
            $('#mlPreviewArea').hide();
            $('#btnUploadMerit').hide();
            pendingEntries = [];

            showToast('Merit list created successfully!');
            showSection('section-ca-merit-manage');
        });

        // Sign out
        $(document).on('click', '.btn-admin-signout', function () {
            localStorage.removeItem('emmis_he_logged_in');
            window.location.href = 'index.html';
        });
    }

    // ============================================================
    // 12. COLLEGE PICKER
    // ============================================================

    function findCollegeById(id) {
        var match = null;
        $.each(ALL_COLLEGES, function (_, c) { if (c.id === id) { match = c; return false; } });
        return match;
    }

    function applyCollegeInfo(college) {
        COLLEGE_INFO.id       = college.id;
        COLLEGE_INFO.name     = college.name;
        COLLEGE_INFO.code     = college.code;
        COLLEGE_INFO.district = college.district;
        COLLEGE_INFO.session  = '2026-27';

        // Update UI text across the portal
        $('#adminCollegeName').text(college.name + ' — ' + college.code);
        $('#dashboardCollegeName').text(college.name);
        $('#dashboardSession').text(COLLEGE_INFO.session);
        // Show / hide switcher button
        $('#btnSwitchCollege').show();
    }

    function showCollegePicker() {
        // Hide sidebar + main content sections, show picker full-width
        $('.sidebar-admin').hide();
        $('.admin-main').css('margin-left', '0');
        $('#adminCollegeName').text('');
        $('#btnSwitchCollege').hide();

        // Build picker cards
        var $grid = $('#collegePickerGrid').empty();
        $.each(ALL_COLLEGES, function (_, c) {
            var typeColor = c.type === 'Private' ? 'var(--clr-tertiary)' : 'var(--clr-primary)';
            var card = [
                '<div class="col-sm-6 col-md-4">',
                '  <div class="card h-100 rounded-3 p-4 college-picker-card" style="cursor:pointer;border:2px solid transparent;transition:border-color .2s,box-shadow .2s;" data-college-id="' + c.id + '">',
                '    <div class="d-flex align-items-start justify-content-between mb-2">',
                '      <span class="material-symbols-outlined" style="font-size:32px;color:' + typeColor + ';">account_balance</span>',
                '      <span class="badge rounded-pill" style="background:rgba(0,107,88,0.08);color:' + typeColor + ';font-size:.7rem;">' + c.type + '</span>',
                '    </div>',
                '    <h6 class="fw-bold mb-1" style="color:var(--clr-on-surface);">' + c.name + '</h6>',
                '    <p class="small text-on-surface-variant mb-0"><span class="material-symbols-outlined" style="font-size:13px;vertical-align:-2px;">location_on</span> ' + c.location + '</p>',
                '    <p class="small text-on-surface-variant mb-3"><span class="material-symbols-outlined" style="font-size:13px;vertical-align:-2px;">tag</span> ' + c.code + '</p>',
                '    <button class="btn btn-primary btn-sm w-100 mt-auto">Select College</button>',
                '  </div>',
                '</div>'
            ].join('');
            $grid.append(card);
        });

        // Show picker section (it lives inside .admin-main, already full-width now)
        $('.ca-section').hide();
        $('#section-ca-college-select').show();
    }

    function selectCollegeAndEnter(college) {
        sessionStorage.setItem('emmis_ca_college_id', String(college.id));
        applyCollegeInfo(college);

        // Restore sidebar layout
        $('.sidebar-admin').show();
        $('.admin-main').css('margin-left', '16rem');

        // Navigate to dashboard
        $('#section-ca-college-select').hide();
        showSection('section-ca-dashboard');
    }

    // ============================================================
    // 13. INIT
    // ============================================================

    $(function () {
        loadRegistrations();
        loadRecommendations();
        loadMeritLists();
        loadAdmissionSchedules();
        initRegistrationSearch();
        initAllApplications();
        initEvents();

        // College picker event — delegated (cards rendered dynamically)
        $(document).on('click', '.college-picker-card', function () {
            var id = parseInt($(this).data('college-id'), 10);
            var college = findCollegeById(id);
            if (college) selectCollegeAndEnter(college);
        });

        // Switch College button
        $(document).on('click', '#btnSwitchCollege', function () {
            sessionStorage.removeItem('emmis_ca_college_id');
            showCollegePicker();
        });

        // Check if a college was previously selected this session
        var storedId = parseInt(sessionStorage.getItem('emmis_ca_college_id') || '0', 10);
        if (storedId) {
            var saved = findCollegeById(storedId);
            if (saved) {
                applyCollegeInfo(saved);
                showSection('section-ca-dashboard');
                return;
            }
        }

        // No college selected — show picker
        showCollegePicker();
    });

})(jQuery);
