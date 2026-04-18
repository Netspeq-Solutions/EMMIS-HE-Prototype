/* ============================================================
   EMMIS HE — College Admin Portal
   jQuery Application Logic (Single-Page Architecture)
   ============================================================ */
(function ($) {
    'use strict';

    // ============================================================
    // 1. MOCK DATA
    // ============================================================

    var COLLEGE_INFO = {
        name: "Sikkim Government College, Burtuk",
        code: "SGC-BTK",
        session: "2024-25",
        district: "Gangtok"
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
            appNo: "SK-2024-1001", name: "Tshering Dorjee Bhutia", course: "bcom", marks: 78.5, status: "applied", photo: "",
            rollNo: "12345/24", board: "CBSE", stream: "Commerce", gender: "Male", mobile: "9876543210", email: "tshering.bhutia@gmail.com",
            category: "Sikkimese", coiNumber: "COI/SK/2024/0012", pwd: "No", dob: "2006-05-12", community: "ST",
            fatherName: "Karma Sangay Bhutia", fatherContact: "9876000001", motherName: "Doma Bhutia",
            district: "Gangtok", pincode: "737101", permanentAddress: "House No 42, Burtuk Bypass, Gangtok", state: "Sikkim",
            subjects: [{name:"English",marks:82,total:100},{name:"Accountancy",marks:78,total:100},{name:"Business Studies",marks:76,total:100},{name:"Economics",marks:80,total:100},{name:"Mathematics",marks:70,total:100}],
            pref1: "B.Com (Hons) — Accounting & Finance", pref2: "B.Com (Hons) — General", pref3: "",
            appFee: {txn:"TXN2024100112",amount:200,status:"Paid",method:"Online"}
        },
        {
            appNo: "SK-2024-1002", name: "Pema Wangchuk Lepcha", course: "bcom", marks: 76.2, status: "applied", photo: "",
            rollNo: "12346/24", board: "Sikkim Board", stream: "Commerce", gender: "Male", mobile: "9876543211", email: "pema.lepcha@yahoo.com",
            category: "Sikkimese", coiNumber: "COI/SK/2024/0034", pwd: "No", dob: "2006-03-22", community: "ST",
            fatherName: "Sonam Lepcha", fatherContact: "9876000002", motherName: "Yangki Lepcha",
            district: "Gangtok", pincode: "737102", permanentAddress: "Tadong, Near Tadong Bazaar, Gangtok", state: "Sikkim",
            subjects: [{name:"English",marks:75,total:100},{name:"Accountancy",marks:80,total:100},{name:"Business Studies",marks:72,total:100},{name:"Economics",marks:78,total:100},{name:"Mathematics",marks:76,total:100}],
            pref1: "B.Com (Hons) — Business Management", pref2: "B.Com (Hons) — Accounting & Finance", pref3: "",
            appFee: {txn:"TXN2024100215",amount:200,status:"Paid",method:"Online"}
        },
        {
            appNo: "SK-2024-1003", name: "Diki Yangzom Sherpa", course: "bcom", marks: 82.1, status: "applied", photo: "",
            rollNo: "12347/24", board: "ICSE", stream: "Commerce", gender: "Female", mobile: "9876543212", email: "diki.sherpa@gmail.com",
            category: "Sikkimese", coiNumber: "COI/SK/2024/0056", pwd: "No", dob: "2005-11-15", community: "OBC",
            fatherName: "Dawa Sherpa", fatherContact: "9876000003", motherName: "Phuti Sherpa",
            district: "Gangtok", pincode: "737135", permanentAddress: "Below Ranipool, NH10, East Sikkim", state: "Sikkim",
            subjects: [{name:"English",marks:85,total:100},{name:"Accountancy",marks:82,total:100},{name:"Business Studies",marks:80,total:100},{name:"Economics",marks:84,total:100},{name:"Mathematics",marks:79,total:100}],
            pref1: "B.Com (Hons) — Accounting & Finance", pref2: "B.A. Political Science", pref3: "",
            appFee: {txn:"TXN2024100309",amount:200,status:"Paid",method:"Online"}
        },
        {
            appNo: "SK-2024-1004", name: "Rajesh Kumar Rai", course: "ba-polsci", marks: 71.3, status: "applied", photo: "",
            rollNo: "12348/24", board: "Sikkim Board", stream: "Arts", gender: "Male", mobile: "9876543213", email: "rajesh.rai04@gmail.com",
            category: "Sikkimese", coiNumber: "COI/SK/2024/0078", pwd: "No", dob: "2006-07-08", community: "OBC",
            fatherName: "Hari Kumar Rai", fatherContact: "9876000004", motherName: "Sita Rai",
            district: "Pakyong", pincode: "737106", permanentAddress: "Singtam Bazaar, East Sikkim", state: "Sikkim",
            subjects: [{name:"English",marks:70,total:100},{name:"Political Science",marks:75,total:100},{name:"History",marks:68,total:100},{name:"Economics",marks:72,total:100},{name:"Nepali",marks:71,total:100}],
            pref1: "B.A. Political Science", pref2: "B.A. English (Hons)", pref3: "",
            appFee: {txn:"TXN2024100418",amount:200,status:"Paid",method:"Cash"}
        },
        {
            appNo: "SK-2024-1005", name: "Anjali Tamang", course: "ba-polsci", marks: 68.9, status: "applied", photo: "",
            rollNo: "12349/24", board: "CBSE", stream: "Arts", gender: "Female", mobile: "9876543214", email: "anjali.tamang@gmail.com",
            category: "Sikkimese", coiNumber: "COI/SK/2024/0090", pwd: "No", dob: "2006-01-30", community: "SC",
            fatherName: "Bikram Tamang", fatherContact: "9876000005", motherName: "Kamala Tamang",
            district: "Namchi", pincode: "737126", permanentAddress: "Jorethang, South Sikkim", state: "Sikkim",
            subjects: [{name:"English",marks:72,total:100},{name:"Political Science",marks:70,total:100},{name:"History",marks:65,total:100},{name:"Sociology",marks:68,total:100},{name:"Nepali",marks:69,total:100}],
            pref1: "B.A. Political Science", pref2: "B.A. English (Hons)", pref3: "",
            appFee: {txn:"TXN2024100522",amount:200,status:"Paid",method:"Online"}
        },
        {
            appNo: "SK-2024-1006", name: "Sonam Tshering Bhutia", course: "bsc-phy", marks: 85.4, status: "applied", photo: "",
            rollNo: "12350/24", board: "CBSE", stream: "Science", gender: "Male", mobile: "9876543215", email: "sonam.tshering@gmail.com",
            category: "Sikkimese", coiNumber: "COI/SK/2024/0102", pwd: "No", dob: "2005-09-18", community: "ST",
            fatherName: "Passang Bhutia", fatherContact: "9876000006", motherName: "Lhamu Bhutia",
            district: "Gangtok", pincode: "737102", permanentAddress: "Deorali, Above Deorali Bazaar, Gangtok", state: "Sikkim",
            subjects: [{name:"English",marks:80,total:100},{name:"Physics",marks:88,total:100},{name:"Chemistry",marks:85,total:100},{name:"Mathematics",marks:90,total:100},{name:"Computer Science",marks:84,total:100}],
            pref1: "B.Sc. Physics", pref2: "B.Sc. Mathematics", pref3: "",
            appFee: {txn:"TXN2024100603",amount:200,status:"Paid",method:"Online"}
        },
        {
            appNo: "SK-2024-1007", name: "Nima Doma Bhutia", course: "bsc-phy", marks: 79.8, status: "applied", photo: "",
            rollNo: "12351/24", board: "Sikkim Board", stream: "Science", gender: "Female", mobile: "9876543216", email: "nima.doma@yahoo.com",
            category: "Sikkimese", coiNumber: "COI/SK/2024/0114", pwd: "No", dob: "2006-04-05", community: "ST",
            fatherName: "Thendup Bhutia", fatherContact: "9876000007", motherName: "Passang Lhamu Bhutia",
            district: "Gangtok", pincode: "737135", permanentAddress: "Rumtek, Near Rumtek Monastery, East Sikkim", state: "Sikkim",
            subjects: [{name:"English",marks:76,total:100},{name:"Physics",marks:82,total:100},{name:"Chemistry",marks:80,total:100},{name:"Mathematics",marks:81,total:100},{name:"Biology",marks:80,total:100}],
            pref1: "B.Sc. Physics", pref2: "B.Sc. Chemistry", pref3: "",
            appFee: {txn:"TXN2024100711",amount:200,status:"Paid",method:"Online"}
        },
        {
            appNo: "SK-2024-1008", name: "Prakash Chettri", course: "ba-eng", marks: 74.6, status: "applied", photo: "",
            rollNo: "12352/24", board: "ICSE", stream: "Arts", gender: "Male", mobile: "9876543217", email: "prakash.chettri@gmail.com",
            category: "Sikkimese", coiNumber: "COI/SK/2024/0126", pwd: "No", dob: "2006-06-25", community: "General",
            fatherName: "Gopal Chettri", fatherContact: "9876000008", motherName: "Maya Chettri",
            district: "Namchi", pincode: "737126", permanentAddress: "Namchi Bazaar, South Sikkim", state: "Sikkim",
            subjects: [{name:"English",marks:78,total:100},{name:"History",marks:72,total:100},{name:"Geography",marks:74,total:100},{name:"Economics",marks:70,total:100},{name:"Nepali",marks:79,total:100}],
            pref1: "B.A. English (Hons)", pref2: "B.A. Political Science", pref3: "",
            appFee: {txn:"TXN2024100818",amount:200,status:"Paid",method:"Cash"}
        },
        {
            appNo: "SK-2024-1009", name: "Lhamu Diki Sherpa", course: "ba-eng", marks: 81.0, status: "applied", photo: "",
            rollNo: "12353/24", board: "CBSE", stream: "Arts", gender: "Female", mobile: "9876543218", email: "lhamu.sherpa@gmail.com",
            category: "Sikkimese", coiNumber: "COI/SK/2024/0138", pwd: "No", dob: "2005-12-10", community: "OBC",
            fatherName: "Mingma Sherpa", fatherContact: "9876000009", motherName: "Dawa Sherpa",
            district: "Mangan", pincode: "737116", permanentAddress: "Mangan Bazaar, North Sikkim", state: "Sikkim",
            subjects: [{name:"English",marks:85,total:100},{name:"History",marks:78,total:100},{name:"Political Science",marks:82,total:100},{name:"Sociology",marks:80,total:100},{name:"Nepali",marks:80,total:100}],
            pref1: "B.A. English (Hons)", pref2: "B.A. Political Science", pref3: "",
            appFee: {txn:"TXN2024100905",amount:200,status:"Paid",method:"Online"}
        },
        {
            appNo: "SK-2024-1010", name: "Tenzing Norgay Lepcha", course: "bcom", marks: 69.5, status: "applied", photo: "",
            rollNo: "12354/24", board: "Sikkim Board", stream: "Commerce", gender: "Male", mobile: "9876543219", email: "tenzing.lepcha@gmail.com",
            category: "Sikkimese", coiNumber: "COI/SK/2024/0150", pwd: "No", dob: "2006-02-14", community: "ST",
            fatherName: "Dawa Lepcha", fatherContact: "9876000010", motherName: "Chungki Lepcha",
            district: "Gyalshing", pincode: "737111", permanentAddress: "Gyalshing Bazaar, West Sikkim", state: "Sikkim",
            subjects: [{name:"English",marks:68,total:100},{name:"Accountancy",marks:72,total:100},{name:"Business Studies",marks:70,total:100},{name:"Economics",marks:65,total:100},{name:"Nepali",marks:72,total:100}],
            pref1: "B.Com (Hons) — General", pref2: "B.A. English (Hons)", pref3: "",
            appFee: {txn:"TXN2024101015",amount:200,status:"Paid",method:"Online"}
        },
        {
            appNo: "SK-2024-1011", name: "Kesang Ongmu", course: "ba-polsci", marks: 73.2, status: "applied", photo: "",
            rollNo: "12355/24", board: "Sikkim Board", stream: "Arts", gender: "Female", mobile: "9876543220", email: "kesang.ongmu@gmail.com",
            category: "Sikkimese", coiNumber: "COI/SK/2024/0162", pwd: "No", dob: "2006-08-19", community: "ST",
            fatherName: "Norbu Ongmu", fatherContact: "9876000011", motherName: "Dolma Ongmu",
            district: "Soreng", pincode: "737121", permanentAddress: "Soreng Bazaar, West Sikkim", state: "Sikkim",
            subjects: [{name:"English",marks:74,total:100},{name:"Political Science",marks:76,total:100},{name:"History",marks:70,total:100},{name:"Sociology",marks:72,total:100},{name:"Nepali",marks:74,total:100}],
            pref1: "B.A. Political Science", pref2: "B.A. English (Hons)", pref3: "",
            appFee: {txn:"TXN2024101122",amount:200,status:"Paid",method:"Online"}
        },
        {
            appNo: "SK-2024-1012", name: "Bikash Gurung", course: "bsc-phy", marks: 77.1, status: "applied", photo: "",
            rollNo: "12356/24", board: "CBSE", stream: "Science", gender: "Male", mobile: "9876543221", email: "bikash.gurung@yahoo.com",
            category: "Sikkimese", coiNumber: "COI/SK/2024/0174", pwd: "No", dob: "2006-10-03", community: "OBC",
            fatherName: "Ram Gurung", fatherContact: "9876000012", motherName: "Sarita Gurung",
            district: "Pakyong", pincode: "737106", permanentAddress: "Pakyong Town, East Sikkim", state: "Sikkim",
            subjects: [{name:"English",marks:74,total:100},{name:"Physics",marks:80,total:100},{name:"Chemistry",marks:76,total:100},{name:"Mathematics",marks:78,total:100},{name:"Biology",marks:77,total:100}],
            pref1: "B.Sc. Physics", pref2: "B.Sc. Chemistry", pref3: "",
            appFee: {txn:"TXN2024101209",amount:200,status:"Paid",method:"Online"}
        },
        {
            appNo: "SK-2024-1013", name: "Yangchen Dolma", course: "ba-eng", marks: 88.3, status: "applied", photo: "",
            rollNo: "12357/24", board: "CBSE", stream: "Arts", gender: "Female", mobile: "9876543222", email: "yangchen.dolma@gmail.com",
            category: "Sikkimese", coiNumber: "COI/SK/2024/0186", pwd: "No", dob: "2005-07-28", community: "ST",
            fatherName: "Paljor Dolma", fatherContact: "9876000013", motherName: "Sonam Dolma",
            district: "Gangtok", pincode: "737101", permanentAddress: "M.G. Marg, Gangtok, East Sikkim", state: "Sikkim",
            subjects: [{name:"English",marks:92,total:100},{name:"History",marks:86,total:100},{name:"Political Science",marks:88,total:100},{name:"Sociology",marks:85,total:100},{name:"Nepali",marks:90,total:100}],
            pref1: "B.A. English (Hons)", pref2: "B.A. Political Science", pref3: "",
            appFee: {txn:"TXN2024101316",amount:200,status:"Paid",method:"Online"}
        },
        {
            appNo: "SK-2024-1014", name: "Sanjay Subba", course: "bcom", marks: 65.7, status: "applied", photo: "",
            rollNo: "12358/24", board: "Sikkim Board", stream: "Commerce", gender: "Male", mobile: "9876543223", email: "sanjay.subba@gmail.com",
            category: "Sikkimese", coiNumber: "COI/SK/2024/0198", pwd: "No", dob: "2006-11-11", community: "SC",
            fatherName: "Man Bahadur Subba", fatherContact: "9876000014", motherName: "Dhan Maya Subba",
            district: "Namchi", pincode: "737126", permanentAddress: "Namchi Town, South Sikkim", state: "Sikkim",
            subjects: [{name:"English",marks:65,total:100},{name:"Accountancy",marks:68,total:100},{name:"Business Studies",marks:64,total:100},{name:"Economics",marks:62,total:100},{name:"Nepali",marks:70,total:100}],
            pref1: "B.Com (Hons) — General", pref2: "B.A. Political Science", pref3: "",
            appFee: {txn:"TXN2024101420",amount:200,status:"Paid",method:"Cash"}
        },
        {
            appNo: "SK-2024-1015", name: "Phurba Lhamu Tamang", course: "ba-polsci", marks: 70.4, status: "applied", photo: "",
            rollNo: "12359/24", board: "CBSE", stream: "Arts", gender: "Female", mobile: "9876543224", email: "phurba.tamang@gmail.com",
            category: "Sikkimese", coiNumber: "COI/SK/2024/0210", pwd: "No", dob: "2006-05-01", community: "SC",
            fatherName: "Dorjee Tamang", fatherContact: "9876000015", motherName: "Yangchen Tamang",
            district: "Pakyong", pincode: "737106", permanentAddress: "Singtam, Pakyong District, East Sikkim", state: "Sikkim",
            subjects: [{name:"English",marks:72,total:100},{name:"Political Science",marks:70,total:100},{name:"History",marks:68,total:100},{name:"Economics",marks:74,total:100},{name:"Nepali",marks:68,total:100}],
            pref1: "B.A. Political Science", pref2: "B.A. English (Hons)", pref3: "",
            appFee: {txn:"TXN2024101508",amount:200,status:"Paid",method:"Online"}
        },
        {
            appNo: "SK-2024-1016", name: "Rinzin Dorjee", course: "bsc-phy", marks: 83.9, status: "applied", photo: "",
            rollNo: "12360/24", board: "ICSE", stream: "Science", gender: "Male", mobile: "9876543225", email: "rinzin.dorjee@gmail.com",
            category: "Sikkimese", coiNumber: "COI/SK/2024/0222", pwd: "No", dob: "2005-08-16", community: "General",
            fatherName: "Lopsang Dorjee", fatherContact: "9876000016", motherName: "Lhaki Dorjee",
            district: "Mangan", pincode: "737116", permanentAddress: "Mangan Town, North Sikkim", state: "Sikkim",
            subjects: [{name:"English",marks:80,total:100},{name:"Physics",marks:86,total:100},{name:"Chemistry",marks:84,total:100},{name:"Mathematics",marks:88,total:100},{name:"Computer Science",marks:82,total:100}],
            pref1: "B.Sc. Physics", pref2: "B.Sc. Mathematics", pref3: "",
            appFee: {txn:"TXN2024101612",amount:200,status:"Paid",method:"Online"}
        },
        {
            appNo: "SK-2024-1017", name: "Dechen Wangmo", course: "ba-eng", marks: 79.2, status: "applied", photo: "",
            rollNo: "12361/24", board: "CBSE", stream: "Arts", gender: "Female", mobile: "9876543226", email: "dechen.wangmo@gmail.com",
            category: "Sikkimese", coiNumber: "COI/SK/2024/0234", pwd: "No", dob: "2006-03-09", community: "General",
            fatherName: "Jigme Wangmo", fatherContact: "9876000017", motherName: "Karma Wangmo",
            district: "Gangtok", pincode: "737101", permanentAddress: "Tibet Road, Gangtok, East Sikkim", state: "Sikkim",
            subjects: [{name:"English",marks:82,total:100},{name:"History",marks:78,total:100},{name:"Political Science",marks:80,total:100},{name:"Sociology",marks:76,total:100},{name:"Nepali",marks:80,total:100}],
            pref1: "B.A. English (Hons)", pref2: "B.A. Political Science", pref3: "",
            appFee: {txn:"TXN2024101718",amount:200,status:"Paid",method:"Online"}
        },
        {
            appNo: "SK-2024-1018", name: "Karma Tshering Lepcha", course: "bcom", marks: 72.8, status: "applied", photo: "",
            rollNo: "12362/24", board: "Sikkim Board", stream: "Commerce", gender: "Male", mobile: "9876543227", email: "karma.lepcha@yahoo.com",
            category: "Sikkimese", coiNumber: "COI/SK/2024/0246", pwd: "No", dob: "2006-09-22", community: "ST",
            fatherName: "Sonam Tshering", fatherContact: "9876000018", motherName: "Mingma Lepcha",
            district: "Gyalshing", pincode: "737111", permanentAddress: "Pelling Road, Gyalshing, West Sikkim", state: "Sikkim",
            subjects: [{name:"English",marks:70,total:100},{name:"Accountancy",marks:74,total:100},{name:"Business Studies",marks:72,total:100},{name:"Economics",marks:76,total:100},{name:"Nepali",marks:72,total:100}],
            pref1: "B.Com (Hons) — General", pref2: "B.Com (Hons) — Accounting & Finance", pref3: "",
            appFee: {txn:"TXN2024101822",amount:200,status:"Paid",method:"Online"}
        },
        {
            appNo: "SK-2024-1019", name: "Passang Diki", course: "ba-polsci", marks: 67.5, status: "applied", photo: "",
            rollNo: "12363/24", board: "Sikkim Board", stream: "Arts", gender: "Female", mobile: "9876543228", email: "passang.diki@gmail.com",
            category: "Sikkimese", coiNumber: "COI/SK/2024/0258", pwd: "No", dob: "2006-01-15", community: "ST",
            fatherName: "Tashi Diki", fatherContact: "9876000019", motherName: "Pema Diki",
            district: "Soreng", pincode: "737121", permanentAddress: "Soreng Town, West Sikkim", state: "Sikkim",
            subjects: [{name:"English",marks:68,total:100},{name:"Political Science",marks:66,total:100},{name:"History",marks:70,total:100},{name:"Sociology",marks:65,total:100},{name:"Nepali",marks:68,total:100}],
            pref1: "B.A. Political Science", pref2: "B.A. English (Hons)", pref3: "",
            appFee: {txn:"TXN2024101905",amount:200,status:"Paid",method:"Cash"}
        },
        {
            appNo: "SK-2024-1020", name: "Suraj Pradhan", course: "bcom", marks: 75.0, status: "applied", photo: "",
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
            id: "ML-001", name: "Merit List 1", date: "2024-10-20",
            entries: [
                { appNo: "SK-2024-1003", program: "B.Com (Hons)", course: "Accounting & Finance" },
                { appNo: "SK-2024-1001", program: "B.Com (Hons)", course: "Accounting & Finance" },
                { appNo: "SK-2024-1020", program: "B.Com (Hons)", course: "General" },
                { appNo: "SK-2024-1011", program: "B.A. Political Science", course: "Political Science" },
                { appNo: "SK-2024-1004", program: "B.A. Political Science", course: "Political Science" },
                { appNo: "SK-2024-1006", program: "B.Sc. Physics", course: "Physics" },
                { appNo: "SK-2024-1016", program: "B.Sc. Physics", course: "Physics" },
                { appNo: "SK-2024-1013", program: "B.A. English (Hons)", course: "English Literature" },
                { appNo: "SK-2024-1009", program: "B.A. English (Hons)", course: "English Literature" }
            ]
        },
        {
            id: "ML-002", name: "Merit List 2", date: "2024-11-05",
            entries: [
                { appNo: "SK-2024-1002", program: "B.Com (Hons)", course: "Business Management" },
                { appNo: "SK-2024-1018", program: "B.Com (Hons)", course: "General" },
                { appNo: "SK-2024-1015", program: "B.A. Political Science", course: "Political Science" },
                { appNo: "SK-2024-1005", program: "B.A. Political Science", course: "Political Science" },
                { appNo: "SK-2024-1007", program: "B.Sc. Physics", course: "Physics" },
                { appNo: "SK-2024-1012", program: "B.Sc. Physics", course: "Physics" },
                { appNo: "SK-2024-1008", program: "B.A. English (Hons)", course: "English Literature" },
                { appNo: "SK-2024-1017", program: "B.A. English (Hons)", course: "English Literature" }
            ]
        }
    ];

    // Registration data (keyed by appNo)
    var REGISTRATIONS = {};

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

    function loadMeritLists() {
        var d = localStorage.getItem('emmis_ca_meritlists');
        if (d) {
            try {
                var parsed = JSON.parse(d);
                // Validate new format (entries-based); discard old format (students/statuses)
                if (parsed.length > 0 && parsed[0].entries) {
                    MERIT_LISTS = parsed;
                } else {
                    localStorage.removeItem('emmis_ca_meritlists');
                }
            } catch(e) {}
        }
    }
    function saveMeritLists() { localStorage.setItem('emmis_ca_meritlists', JSON.stringify(MERIT_LISTS)); }

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
        if (sectionId === 'section-ca-merit-manage') renderMeritListDashboard();
        if (sectionId === 'section-ca-register-search') renderRegisteredList();
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
            var fillPct = Math.round((reg / c.seats) * 100);
            $tbody.append(
                '<tr><td class="fw-semibold">' + c.name + '</td>' +
                '<td class="cell-number">' + apps + '</td>' +
                '<td class="cell-number">' + adm + '</td>' +
                '<td class="cell-number">' + reg + '</td>' +
                '<td class="cell-number">' + (c.seats - reg) + '</td>' +
                '<td class="cell-bar"><div class="cell-bar-track"><div class="cell-bar-fill" style="width:' + fillPct + '%;"></div></div></td></tr>'
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
    // 5. REGISTERED STUDENTS LIST
    // ============================================================

    function renderRegisteredList() {
        var $tbody = $('#registeredBody').empty();
        var hasAny = false;
        $.each(REGISTRATIONS, function(appNo, reg) {
            var s = getStudentByApp(appNo);
            if (!s) return;
            hasAny = true;
            var stage = getRegStage(appNo);
            $tbody.append(
                '<tr><td class="fw-semibold" style="font-family:monospace;color:var(--clr-primary);">' + appNo + '</td>' +
                '<td class="fw-semibold">' + s.name + '</td>' +
                '<td>' + getCourseName(s.course) + '</td>' +
                '<td class="cell-number">' + (reg.rollNo || '—') + '</td>' +
                '<td><span class="status-pill" style="background:' + stage.bg + ';color:' + stage.color + ';">' + stage.label + '</span></td>' +
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
    // 6. AUTOCOMPLETE SEARCH (Shared across all search inputs)
    // ============================================================

    function initRegistrationSearch() {
        $(document).on('input', '.reg-search-input', function () {
            var $input = $(this);
            var $dropdown = $input.closest('.autocomplete-wrap').find('.reg-search-dropdown');
            var q = $input.val().toLowerCase().trim();
            if (q.length < 2) { $dropdown.removeClass('show').empty(); return; }
            var results = $.grep(STUDENTS, function (s) {
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
    // 7. STUDENT REGISTRATION — FORM (3 Booths)
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

        // Academic History (Step 3)
        var $subBody = $('#roSubjectsBody').empty();
        var totalMarksObt = 0, totalMarksFull = 0;
        $.each(student.subjects || [], function(_, sub) {
            var passClass = sub.marks >= 33 ? 'background:rgba(107,217,188,0.2);color:var(--clr-on-primary-container);' : 'background:rgba(186,26,26,0.1);color:var(--clr-error);';
            $subBody.append('<tr><td>' + sub.name + '</td><td class="text-center">' + sub.marks + '</td><td class="text-center">' + sub.total + '</td><td class="text-end"><span class="badge rounded-pill px-2 py-1" style="' + passClass + '">' + (sub.marks >= 33 ? 'Pass' : 'Fail') + '</span></td></tr>');
            totalMarksObt += sub.marks;
            totalMarksFull += sub.total;
        });
        var aggPct = totalMarksFull > 0 ? ((totalMarksObt / totalMarksFull) * 100).toFixed(1) : '0.0';
        $('#roAggregate').text(aggPct + '% (' + totalMarksObt + '/' + totalMarksFull + ')');

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

    function updateBoothStepper(reg) {
        $('.booth-step').removeClass('active completed');
        $('.booth-connector').removeClass('completed');
        if (reg.verified) { $('[data-booth="1"]').addClass('completed'); $('[data-after-booth="1"]').addClass('completed'); }
        if (reg.seatAllocated) { $('[data-booth="2"]').addClass('completed'); $('[data-after-booth="2"]').addClass('completed'); }
        if (reg.feeCollected) { $('[data-booth="3"]').addClass('completed'); }
    }

    function switchBooth(boothNum) {
        $('.booth-tab').hide();
        $('#booth' + boothNum).fadeIn(200);
        $('.booth-step').removeClass('active');
        $('[data-booth="' + boothNum + '"]').addClass('active');
    }

    // ============================================================
    // 8. MERIT LIST MANAGEMENT
    // ============================================================

    function renderMeritListDashboard() {
        var $container = $('#meritListCards').empty();
        if (MERIT_LISTS.length === 0) {
            $container.html('<div class="text-center py-5 text-on-surface-variant"><p class="fs-5 fw-semibold mb-2">No Merit Lists Yet</p><p>Upload your first merit list to get started.</p></div>');
            return;
        }
        $.each(MERIT_LISTS, function(_, ml) {
            var total = ml.entries.length;
            var matched = 0, regCount = 0;
            $.each(ml.entries, function(__, entry) {
                if (getStudentByApp(entry.appNo)) matched++;
                if (REGISTRATIONS[entry.appNo] && REGISTRATIONS[entry.appNo].feeCollected) regCount++;
            });
            var unmatched = total - matched;
            // Collect unique programs
            var programs = {};
            $.each(ml.entries, function(__, e) { programs[e.program] = true; });
            var progList = Object.keys(programs).join(', ');

            $container.append(
                '<div class="col-md-6"><div class="merit-card" data-ml-id="' + ml.id + '">' +
                '<div class="d-flex justify-content-between align-items-start mb-3">' +
                '<div><h5 class="fw-bold mb-1">' + ml.name + '</h5><p class="small text-on-surface-variant mb-0">' + progList + ' · ' + ml.date + '</p></div>' +
                '<span class="merit-badge" style="background:var(--clr-primary-container);color:var(--clr-on-primary-container);">' + total + ' Entries</span></div>' +
                '<div class="d-flex gap-3 flex-wrap">' +
                '<span class="status-pill admitted">✓ Matched: ' + matched + '</span>' +
                (unmatched > 0 ? '<span class="status-pill not-appeared">✗ Not Found: ' + unmatched + '</span>' : '') +
                '<span class="status-pill pending">📋 Registered: ' + regCount + '</span>' +
                '</div></div></div>'
            );
        });
    }

    function openMeritListDetail(mlId) {
        var ml = null;
        $.each(MERIT_LISTS, function(_, m) { if (m.id === mlId) ml = m; });
        if (!ml) return;

        $('#mlDetailName').text(ml.name);
        $('#mlDetailDate').text(ml.date);
        $('#mlDetailTotal').text(ml.entries.length);
        $('#btnDeleteMeritList').data('ml-id', mlId);

        var $tbody = $('#mlDetailBody').empty();
        var matched = 0, unmatched = 0, regCount = 0;
        $.each(ml.entries, function(rank, entry) {
            var s = getStudentByApp(entry.appNo);
            var isMatched = !!s;
            if (isMatched) matched++; else unmatched++;
            var isReg = REGISTRATIONS[entry.appNo] && REGISTRATIONS[entry.appNo].feeCollected;
            if (isReg) regCount++;

            var linkedBadge = isMatched
                ? '<span class="badge rounded-pill px-2 py-1" style="background:var(--clr-primary-container);color:var(--clr-on-primary-container);">Linked</span>'
                : '<span class="badge rounded-pill px-2 py-1" style="background:rgba(186,26,26,0.1);color:var(--clr-error);">Not Found</span>';
            var regBadge = isReg
                ? '<span class="badge rounded-pill px-2 py-1" style="background:var(--clr-tertiary-container);color:var(--clr-on-tertiary-container);">Registered</span>'
                : (isMatched ? '<span class="text-on-surface-variant small">—</span>' : '');

            $tbody.append(
                '<tr' + (!isMatched ? ' style="opacity:0.6;"' : '') + '>' +
                '<td class="cell-number">' + (rank + 1) + '</td>' +
                '<td class="fw-semibold" style="font-family:monospace;color:var(--clr-primary);">' + entry.appNo + '</td>' +
                '<td class="fw-semibold">' + (s ? s.name : '—') + '</td>' +
                '<td class="cell-number">' + (s ? s.marks + '%' : '—') + '</td>' +
                '<td>' + entry.program + '</td>' +
                '<td>' + entry.course + '</td>' +
                '<td>' + linkedBadge + '</td>' +
                '<td>' + regBadge + '</td></tr>'
            );
        });

        // Summary
        $('#mlSummaryTotal').text(ml.entries.length);
        $('#mlSummaryMatched').text(matched);
        $('#mlSummaryUnmatched').text(unmatched);
        $('#mlSummaryRegistered').text(regCount);

        showSection('section-ca-merit-detail');
    }

    // ============================================================
    // 9. TOAST
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
    // 10. EVENT BINDINGS
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

        // Booth tabs
        $(document).on('click', '.booth-step', function () {
            switchBooth(parseInt($(this).data('booth')));
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

        // Back to search
        $(document).on('click', '#btnBackToSearch', function () {
            showSection('section-ca-register-search');
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
                ['SK-2024-1003', 'B.Com (Hons)', 'Accounting & Finance'],
                ['SK-2024-1001', 'B.A. Political Science', 'Political Science']
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
            var date = $('#mlUploadDate').val();
            if (!name) { showToast('Please enter a merit list name', 'warning'); return; }
            if (!date) { showToast('Please select a date', 'warning'); return; }
            if (pendingEntries.length === 0) { showToast('No entries to upload', 'warning'); return; }

            var newId = 'ML-' + (MERIT_LISTS.length + 1).toString().padStart(3, '0');
            MERIT_LISTS.push({ id: newId, name: name, date: date, entries: pendingEntries });
            saveMeritLists();

            // Reset form
            $('#mlUploadName').val('');
            $('#mlUploadDate').val('');
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
    // 11. INIT
    // ============================================================

    $(function () {
        loadRegistrations();
        loadMeritLists();
        initRegistrationSearch();
        initEvents();
        showSection('section-ca-dashboard');
    });

})(jQuery);
