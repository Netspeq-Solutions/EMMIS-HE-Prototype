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
        session: "2026",
        district: ""
    };

    // 3-letter code map for app ID generation — mirrors app.js COLLEGE_CODES
    var COLLEGE_CODES_MAP = {1:'SGC', 2:'DEN', 3:'SAC', 4:'NGC', 5:'MAN', 6:'SOR', 7:'NBB', 8:'RHE', 9:'GCB', 10:'WPC', 11:'LIN', 12:'SSG'};

    // Returns the 3-letter code for the currently selected college (default SGC)
    function getCollegeCode() { return COLLEGE_CODES_MAP[COLLEGE_INFO.id] || 'SGC'; }

    // Remap an SGC-based seed appNo to the current college's code
    function remapAppNo(appNo) {
        var code = getCollegeCode();
        if (code === 'SGC') return appNo;
        return appNo.replace(/^(SK-\d{4}-)SGC(-\d+)$/, '$1' + code + '$2');
    }

    // Returns the seed STUDENTS array — seed data is SGC-only; other colleges start empty
    // Map pref1Program + pref1Course text values from app.js to a COURSES id in college-admin.js
    function inferCourseId(prefProgram, prefCourse) {
        var c = (prefCourse  || '').toLowerCase().trim();
        var p = (prefProgram || '').toLowerCase().trim();
        // 1. Exact match on COURSES name
        for (var i = 0; i < COURSES.length; i++) {
            if (COURSES[i].name.toLowerCase() === c) return COURSES[i].id;
        }
        // 2. Substring match — stored course contains a COURSES name (or vice versa)
        for (var i = 0; i < COURSES.length; i++) {
            var cn = COURSES[i].name.toLowerCase();
            if (c && c.indexOf(cn) >= 0) return COURSES[i].id;
            if (c && cn.indexOf(c) >= 0) return COURSES[i].id;
        }
        // 3. First-word prefix match (e.g. "b.com" → bcom, "b.sc." → bsc-phy)
        var cFirst = c.split(' ')[0];
        if (cFirst) {
            for (var i = 0; i < COURSES.length; i++) {
                if (COURSES[i].name.toLowerCase().indexOf(cFirst) === 0) return COURSES[i].id;
            }
        }
        // 4. Program keyword fallback — pick first matching course
        for (var i = 0; i < COURSES.length; i++) {
            var cn = COURSES[i].name.toLowerCase();
            if (p.indexOf('commerce') >= 0 && cn.indexOf('com') >= 0)   return COURSES[i].id;
            if (p.indexOf('science')  >= 0 && cn.indexOf('b.sc') >= 0)  return COURSES[i].id;
            if (p.indexOf('arts')     >= 0 && cn.indexOf('b.a.') >= 0)  return COURSES[i].id;
        }
        return '';
    }

    // Convert a raw live application (from emmis_he_applications) to the STUDENTS-compatible format
    function liveAppToStudent(a) {
        var s1 = a.step1 || {}, s2 = a.step2 || {}, s3 = a.step3 || {}, s4 = a.step4 || {}, s5 = a.step5 || {};
        // Compute aggregate percentage from step3 numbered subject inputs
        var totalObt = 0, totalMax = 0, subjects = [];
        for (var k = 1; k <= 10; k++) {
            var sn = s3['subject_' + k] || '';
            var sm = parseFloat(s3['marks_' + k]);
            var st = parseFloat(s3['total_' + k]);
            if (isNaN(sm) && !sn) break;
            sm = isNaN(sm) ? 0 : sm;
            st = isNaN(st) || st <= 0 ? 100 : st;
            if (sn || sm > 0) {
                subjects.push({ name: sn, marks: sm, total: st });
                totalObt += sm; totalMax += st;
            }
        }
        var marksPct = totalMax > 0 ? parseFloat(((totalObt / totalMax) * 100).toFixed(1)) : 0;
        var p1Prog   = s4.pref1Program || '';
        var p1Course = (s4.pref1Course && s4.pref1Course !== 'Select Course') ? s4.pref1Course : '';
        var p2Prog   = (s4.pref2Program && s4.pref2Program !== 'Select Course') ? s4.pref2Program : '';
        var p3Prog   = (s4.pref3Program && s4.pref3Program !== 'Select Course') ? s4.pref3Program : '';
        // Resolve to a COURSES id so dashboard/filter comparisons work correctly
        var courseId = inferCourseId(p1Prog, p1Course) || p1Prog;
        return {
            appNo:             a.applicationId,
            name:              s1.candidateName || '',
            course:            courseId,
            marks:             marksPct,
            status:            (a.status === 'submitted' ? 'applied' : a.status) || 'applied',
            photo:             '',
            rollNo:            s1.rollNo || '',
            board:             s1.board  || '',
            stream:            s1.stream || '',
            gender:            s1.gender || '',
            mobile:            s1.mobile || '',
            email:             s1.email  || '',
            category:          s1.category   || '',
            coiNumber:         s1.coiNumber  || '',
            pwd:               s1.pwd        || 'No',
            dob:               s2.dob        || '',
            community:         s2.community  || '',
            fatherName:        s2.fatherName    || '',
            fatherContact:     s2.fatherContact || '',
            motherName:        s2.motherName    || '',
            district:          s2.district      || '',
            pincode:           s2.pincode       || '',
            permanentAddress:  s2.permanentAddress || '',
            state:             s2.state || '',
            subjects:          subjects,
            pref1:             p1Prog + (p1Course ? ' — ' + p1Course : ''),
            pref2:             p2Prog,
            pref3:             p3Prog,
            appFee: {
                txn:    s5.transactionId  || '',
                amount: s5.amount         || 200,
                status: s5.status === 'paid' ? 'Paid' : 'Pending',
                method: s5.paymentMethod  || ''
            },
            collegeId: a.collegeId,
            _isLive: true
        };
    }

    // Returns live submitted applications from localStorage for the current college
    function getLiveStudents() {
        var result = [];
        var expectedCode = getCollegeCode(); // e.g. 'SGC', 'DEN', etc.
        // Valid app ID pattern: SK-YYYY-CODE-NNNNN where CODE matches this college
        var validIdPattern = new RegExp('^SK-\\d{4}-' + expectedCode + '-\\d+$');
        try {
            var liveApps = JSON.parse(localStorage.getItem('emmis_he_applications') || '[]');
            $.each(liveApps, function(_, a) {
                if (parseInt(a.collegeId, 10) === COLLEGE_INFO.id && a.status !== 'draft') {
                    // Skip apps with malformed/fallback IDs (e.g. SKM code from invalid college selection)
                    if (a.applicationId && !validIdPattern.test(a.applicationId)) return;
                    result.push(liveAppToStudent(a));
                }
            });
        } catch(e) {}
        return result;
    }

    function getActiveStudents() {
        var code = getCollegeCode();
        var liveStudents = getLiveStudents();
        if (code === 'SGC') {
            // SGC has seed data — live apps take priority; seed fills remaining slots
            var liveIds = {};
            $.each(liveStudents, function(_, s) { liveIds[s.appNo] = true; });
            var seedOnly = $.grep(STUDENTS, function(s) { return !liveIds[s.appNo]; });
            return liveStudents.concat(seedOnly);
        }
        // All other colleges: only real submitted applications
        return liveStudents;
    }

    // Whether MERIT_LISTS was successfully loaded from localStorage (vs. seed fallback)
    var _meritListsLoaded = false;

    // Returns MERIT_LISTS (always loaded from localStorage; seed is intentionally empty)
    function getActiveMeritLists() {
        return MERIT_LISTS;
    }

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
            appNo: "SK-2026-SGC-00001", name: "Tshering Dorjee Bhutia", course: "bcom", marks: 78.5, status: "applied", photo: "",
            rollNo: "12345/24", board: "CBSE", stream: "Commerce", gender: "Male", mobile: "9876543210", email: "tshering.bhutia@gmail.com",
            category: "Sikkimese", coiNumber: "COI/SK/2024/0012", pwd: "No", dob: "2006-05-12", community: "ST",
            fatherName: "Karma Sangay Bhutia", fatherContact: "9876000001", motherName: "Doma Bhutia",
            district: "Gangtok", pincode: "737101", permanentAddress: "House No 42, Burtuk Bypass, Gangtok", state: "Sikkim",
            subjects: [{name:"English",marks:82,total:100},{name:"Accountancy",marks:78,total:100},{name:"Business Studies",marks:76,total:100},{name:"Economics",marks:80,total:100},{name:"Mathematics",marks:70,total:100}],
            pref1: "B.Com (Hons) — Accounting & Finance", pref2: "B.Com (Hons) — General", pref3: "",
            appFee: {txn:"TXN2024100112",amount:200,status:"Paid",method:"Online"}
        },
        {
            appNo: "SK-2026-SGC-00002", name: "Pema Wangchuk Lepcha", course: "bcom", marks: 76.2, status: "applied", photo: "",
            rollNo: "12346/24", board: "Sikkim Board", stream: "Commerce", gender: "Male", mobile: "9876543211", email: "pema.lepcha@yahoo.com",
            category: "Sikkimese", coiNumber: "COI/SK/2024/0034", pwd: "No", dob: "2006-03-22", community: "ST",
            fatherName: "Sonam Lepcha", fatherContact: "9876000002", motherName: "Yangki Lepcha",
            district: "Gangtok", pincode: "737102", permanentAddress: "Tadong, Near Tadong Bazaar, Gangtok", state: "Sikkim",
            subjects: [{name:"English",marks:75,total:100},{name:"Accountancy",marks:80,total:100},{name:"Business Studies",marks:72,total:100},{name:"Economics",marks:78,total:100},{name:"Mathematics",marks:76,total:100}],
            pref1: "B.Com (Hons) — Business Management", pref2: "B.Com (Hons) — Accounting & Finance", pref3: "",
            appFee: {txn:"TXN2024100215",amount:200,status:"Paid",method:"Online"}
        },
        {
            appNo: "SK-2026-SGC-00003", name: "Diki Yangzom Sherpa", course: "bcom", marks: 82.1, status: "applied", photo: "",
            rollNo: "12347/24", board: "ICSE", stream: "Commerce", gender: "Female", mobile: "9876543212", email: "diki.sherpa@gmail.com",
            category: "Sikkimese", coiNumber: "COI/SK/2024/0056", pwd: "No", dob: "2005-11-15", community: "OBC",
            fatherName: "Dawa Sherpa", fatherContact: "9876000003", motherName: "Phuti Sherpa",
            district: "Gangtok", pincode: "737135", permanentAddress: "Below Ranipool, NH10, East Sikkim", state: "Sikkim",
            subjects: [{name:"English",marks:85,total:100},{name:"Accountancy",marks:82,total:100},{name:"Business Studies",marks:80,total:100},{name:"Economics",marks:84,total:100},{name:"Mathematics",marks:79,total:100}],
            pref1: "B.Com (Hons) — Accounting & Finance", pref2: "B.A. Political Science", pref3: "",
            appFee: {txn:"TXN2024100309",amount:200,status:"Paid",method:"Online"}
        },
        {
            appNo: "SK-2026-SGC-00004", name: "Rajesh Kumar Rai", course: "ba-polsci", marks: 71.3, status: "applied", photo: "",
            rollNo: "12348/24", board: "Sikkim Board", stream: "Arts", gender: "Male", mobile: "9876543213", email: "rajesh.rai04@gmail.com",
            category: "Sikkimese", coiNumber: "COI/SK/2024/0078", pwd: "No", dob: "2006-07-08", community: "OBC",
            fatherName: "Hari Kumar Rai", fatherContact: "9876000004", motherName: "Sita Rai",
            district: "Pakyong", pincode: "737106", permanentAddress: "Singtam Bazaar, East Sikkim", state: "Sikkim",
            subjects: [{name:"English",marks:70,total:100},{name:"Political Science",marks:75,total:100},{name:"History",marks:68,total:100},{name:"Economics",marks:72,total:100},{name:"Nepali",marks:71,total:100}],
            pref1: "B.A. Political Science", pref2: "B.A. English (Hons)", pref3: "",
            appFee: {txn:"TXN2024100418",amount:200,status:"Paid",method:"Cash"}
        },
        {
            appNo: "SK-2026-SGC-00005", name: "Anjali Tamang", course: "ba-polsci", marks: 68.9, status: "applied", photo: "",
            rollNo: "12349/24", board: "CBSE", stream: "Arts", gender: "Female", mobile: "9876543214", email: "anjali.tamang@gmail.com",
            category: "Sikkimese", coiNumber: "COI/SK/2024/0090", pwd: "No", dob: "2006-01-30", community: "SC",
            fatherName: "Bikram Tamang", fatherContact: "9876000005", motherName: "Kamala Tamang",
            district: "Namchi", pincode: "737126", permanentAddress: "Jorethang, South Sikkim", state: "Sikkim",
            subjects: [{name:"English",marks:72,total:100},{name:"Political Science",marks:70,total:100},{name:"History",marks:65,total:100},{name:"Sociology",marks:68,total:100},{name:"Nepali",marks:69,total:100}],
            pref1: "B.A. Political Science", pref2: "B.A. English (Hons)", pref3: "",
            appFee: {txn:"TXN2024100522",amount:200,status:"Paid",method:"Online"}
        },
        {
            appNo: "SK-2026-SGC-00006", name: "Sonam Tshering Bhutia", course: "bsc-phy", marks: 85.4, status: "applied", photo: "",
            rollNo: "12350/24", board: "CBSE", stream: "Science", gender: "Male", mobile: "9876543215", email: "sonam.tshering@gmail.com",
            category: "Sikkimese", coiNumber: "COI/SK/2024/0102", pwd: "No", dob: "2005-09-18", community: "ST",
            fatherName: "Passang Bhutia", fatherContact: "9876000006", motherName: "Lhamu Bhutia",
            district: "Gangtok", pincode: "737102", permanentAddress: "Deorali, Above Deorali Bazaar, Gangtok", state: "Sikkim",
            subjects: [{name:"English",marks:80,total:100},{name:"Physics",marks:88,total:100},{name:"Chemistry",marks:85,total:100},{name:"Mathematics",marks:90,total:100},{name:"Computer Science",marks:84,total:100}],
            pref1: "B.Sc. Physics", pref2: "B.Sc. Mathematics", pref3: "",
            appFee: {txn:"TXN2024100603",amount:200,status:"Paid",method:"Online"}
        },
        {
            appNo: "SK-2026-SGC-00007", name: "Nima Doma Bhutia", course: "bsc-phy", marks: 79.8, status: "applied", photo: "",
            rollNo: "12351/24", board: "Sikkim Board", stream: "Science", gender: "Female", mobile: "9876543216", email: "nima.doma@yahoo.com",
            category: "Sikkimese", coiNumber: "COI/SK/2024/0114", pwd: "No", dob: "2006-04-05", community: "ST",
            fatherName: "Thendup Bhutia", fatherContact: "9876000007", motherName: "Passang Lhamu Bhutia",
            district: "Gangtok", pincode: "737135", permanentAddress: "Rumtek, Near Rumtek Monastery, East Sikkim", state: "Sikkim",
            subjects: [{name:"English",marks:76,total:100},{name:"Physics",marks:82,total:100},{name:"Chemistry",marks:80,total:100},{name:"Mathematics",marks:81,total:100},{name:"Biology",marks:80,total:100}],
            pref1: "B.Sc. Physics", pref2: "B.Sc. Chemistry", pref3: "",
            appFee: {txn:"TXN2024100711",amount:200,status:"Paid",method:"Online"}
        },
        {
            appNo: "SK-2026-SGC-00008", name: "Prakash Chettri", course: "ba-eng", marks: 74.6, status: "applied", photo: "",
            rollNo: "12352/24", board: "ICSE", stream: "Arts", gender: "Male", mobile: "9876543217", email: "prakash.chettri@gmail.com",
            category: "Sikkimese", coiNumber: "COI/SK/2024/0126", pwd: "No", dob: "2006-06-25", community: "General",
            fatherName: "Gopal Chettri", fatherContact: "9876000008", motherName: "Maya Chettri",
            district: "Namchi", pincode: "737126", permanentAddress: "Namchi Bazaar, South Sikkim", state: "Sikkim",
            subjects: [{name:"English",marks:78,total:100},{name:"History",marks:72,total:100},{name:"Geography",marks:74,total:100},{name:"Economics",marks:70,total:100},{name:"Nepali",marks:79,total:100}],
            pref1: "B.A. English (Hons)", pref2: "B.A. Political Science", pref3: "",
            appFee: {txn:"TXN2024100818",amount:200,status:"Paid",method:"Cash"}
        },
        {
            appNo: "SK-2026-SGC-00009", name: "Lhamu Diki Sherpa", course: "ba-eng", marks: 81.0, status: "applied", photo: "",
            rollNo: "12353/24", board: "CBSE", stream: "Arts", gender: "Female", mobile: "9876543218", email: "lhamu.sherpa@gmail.com",
            category: "Sikkimese", coiNumber: "COI/SK/2024/0138", pwd: "No", dob: "2005-12-10", community: "OBC",
            fatherName: "Mingma Sherpa", fatherContact: "9876000009", motherName: "Dawa Sherpa",
            district: "Mangan", pincode: "737116", permanentAddress: "Mangan Bazaar, North Sikkim", state: "Sikkim",
            subjects: [{name:"English",marks:85,total:100},{name:"History",marks:78,total:100},{name:"Political Science",marks:82,total:100},{name:"Sociology",marks:80,total:100},{name:"Nepali",marks:80,total:100}],
            pref1: "B.A. English (Hons)", pref2: "B.A. Political Science", pref3: "",
            appFee: {txn:"TXN2024100905",amount:200,status:"Paid",method:"Online"}
        },
        {
            appNo: "SK-2026-SGC-00010", name: "Tenzing Norgay Lepcha", course: "bcom", marks: 69.5, status: "applied", photo: "",
            rollNo: "12354/24", board: "Sikkim Board", stream: "Commerce", gender: "Male", mobile: "9876543219", email: "tenzing.lepcha@gmail.com",
            category: "Sikkimese", coiNumber: "COI/SK/2024/0150", pwd: "No", dob: "2006-02-14", community: "ST",
            fatherName: "Dawa Lepcha", fatherContact: "9876000010", motherName: "Chungki Lepcha",
            district: "Gyalshing", pincode: "737111", permanentAddress: "Gyalshing Bazaar, West Sikkim", state: "Sikkim",
            subjects: [{name:"English",marks:68,total:100},{name:"Accountancy",marks:72,total:100},{name:"Business Studies",marks:70,total:100},{name:"Economics",marks:65,total:100},{name:"Nepali",marks:72,total:100}],
            pref1: "B.Com (Hons) — General", pref2: "B.A. English (Hons)", pref3: "",
            appFee: {txn:"TXN2024101015",amount:200,status:"Paid",method:"Online"}
        },
        {
            appNo: "SK-2026-SGC-00011", name: "Kesang Ongmu", course: "ba-polsci", marks: 73.2, status: "applied", photo: "",
            rollNo: "12355/24", board: "Sikkim Board", stream: "Arts", gender: "Female", mobile: "9876543220", email: "kesang.ongmu@gmail.com",
            category: "Sikkimese", coiNumber: "COI/SK/2024/0162", pwd: "No", dob: "2006-08-19", community: "ST",
            fatherName: "Norbu Ongmu", fatherContact: "9876000011", motherName: "Dolma Ongmu",
            district: "Soreng", pincode: "737121", permanentAddress: "Soreng Bazaar, West Sikkim", state: "Sikkim",
            subjects: [{name:"English",marks:74,total:100},{name:"Political Science",marks:76,total:100},{name:"History",marks:70,total:100},{name:"Sociology",marks:72,total:100},{name:"Nepali",marks:74,total:100}],
            pref1: "B.A. Political Science", pref2: "B.A. English (Hons)", pref3: "",
            appFee: {txn:"TXN2024101122",amount:200,status:"Paid",method:"Online"}
        },
        {
            appNo: "SK-2026-SGC-00012", name: "Bikash Gurung", course: "bsc-phy", marks: 77.1, status: "applied", photo: "",
            rollNo: "12356/24", board: "CBSE", stream: "Science", gender: "Male", mobile: "9876543221", email: "bikash.gurung@yahoo.com",
            category: "Sikkimese", coiNumber: "COI/SK/2024/0174", pwd: "No", dob: "2006-10-03", community: "OBC",
            fatherName: "Ram Gurung", fatherContact: "9876000012", motherName: "Sarita Gurung",
            district: "Pakyong", pincode: "737106", permanentAddress: "Pakyong Town, East Sikkim", state: "Sikkim",
            subjects: [{name:"English",marks:74,total:100},{name:"Physics",marks:80,total:100},{name:"Chemistry",marks:76,total:100},{name:"Mathematics",marks:78,total:100},{name:"Biology",marks:77,total:100}],
            pref1: "B.Sc. Physics", pref2: "B.Sc. Chemistry", pref3: "",
            appFee: {txn:"TXN2024101209",amount:200,status:"Paid",method:"Online"}
        },
        {
            appNo: "SK-2026-SGC-00013", name: "Yangchen Dolma", course: "ba-eng", marks: 88.3, status: "applied", photo: "",
            rollNo: "12357/24", board: "CBSE", stream: "Arts", gender: "Female", mobile: "9876543222", email: "yangchen.dolma@gmail.com",
            category: "Sikkimese", coiNumber: "COI/SK/2024/0186", pwd: "No", dob: "2005-07-28", community: "ST",
            fatherName: "Paljor Dolma", fatherContact: "9876000013", motherName: "Sonam Dolma",
            district: "Gangtok", pincode: "737101", permanentAddress: "M.G. Marg, Gangtok, East Sikkim", state: "Sikkim",
            subjects: [{name:"English",marks:92,total:100},{name:"History",marks:86,total:100},{name:"Political Science",marks:88,total:100},{name:"Sociology",marks:85,total:100},{name:"Nepali",marks:90,total:100}],
            pref1: "B.A. English (Hons)", pref2: "B.A. Political Science", pref3: "",
            appFee: {txn:"TXN2024101316",amount:200,status:"Paid",method:"Online"}
        },
        {
            appNo: "SK-2026-SGC-00014", name: "Sanjay Subba", course: "bcom", marks: 65.7, status: "applied", photo: "", isRecommendation: true,
            rollNo: "12358/24", board: "Sikkim Board", stream: "Commerce", gender: "Male", mobile: "9876543223", email: "sanjay.subba@gmail.com",
            category: "Sikkimese", coiNumber: "COI/SK/2024/0198", pwd: "No", dob: "2006-11-11", community: "SC",
            fatherName: "Man Bahadur Subba", fatherContact: "9876000014", motherName: "Dhan Maya Subba",
            district: "Namchi", pincode: "737126", permanentAddress: "Namchi Town, South Sikkim", state: "Sikkim",
            subjects: [{name:"English",marks:65,total:100},{name:"Accountancy",marks:68,total:100},{name:"Business Studies",marks:64,total:100},{name:"Economics",marks:62,total:100},{name:"Nepali",marks:70,total:100}],
            pref1: "B.Com (Hons) — General", pref2: "B.A. Political Science", pref3: "",
            appFee: {txn:"TXN2024101420",amount:200,status:"Paid",method:"Cash"}
        },
        {
            appNo: "SK-2026-SGC-00015", name: "Phurba Lhamu Tamang", course: "ba-polsci", marks: 70.4, status: "applied", photo: "",
            rollNo: "12359/24", board: "CBSE", stream: "Arts", gender: "Female", mobile: "9876543224", email: "phurba.tamang@gmail.com",
            category: "Sikkimese", coiNumber: "COI/SK/2024/0210", pwd: "No", dob: "2006-05-01", community: "SC",
            fatherName: "Dorjee Tamang", fatherContact: "9876000015", motherName: "Yangchen Tamang",
            district: "Pakyong", pincode: "737106", permanentAddress: "Singtam, Pakyong District, East Sikkim", state: "Sikkim",
            subjects: [{name:"English",marks:72,total:100},{name:"Political Science",marks:70,total:100},{name:"History",marks:68,total:100},{name:"Economics",marks:74,total:100},{name:"Nepali",marks:68,total:100}],
            pref1: "B.A. Political Science", pref2: "B.A. English (Hons)", pref3: "",
            appFee: {txn:"TXN2024101508",amount:200,status:"Paid",method:"Online"}
        },
        {
            appNo: "SK-2026-SGC-00016", name: "Rinzin Dorjee", course: "bsc-phy", marks: 83.9, status: "applied", photo: "",
            rollNo: "12360/24", board: "ICSE", stream: "Science", gender: "Male", mobile: "9876543225", email: "rinzin.dorjee@gmail.com",
            category: "Sikkimese", coiNumber: "COI/SK/2024/0222", pwd: "No", dob: "2005-08-16", community: "General",
            fatherName: "Lopsang Dorjee", fatherContact: "9876000016", motherName: "Lhaki Dorjee",
            district: "Mangan", pincode: "737116", permanentAddress: "Mangan Town, North Sikkim", state: "Sikkim",
            subjects: [{name:"English",marks:80,total:100},{name:"Physics",marks:86,total:100},{name:"Chemistry",marks:84,total:100},{name:"Mathematics",marks:88,total:100},{name:"Computer Science",marks:82,total:100}],
            pref1: "B.Sc. Physics", pref2: "B.Sc. Mathematics", pref3: "",
            appFee: {txn:"TXN2024101612",amount:200,status:"Paid",method:"Online"}
        },
        {
            appNo: "SK-2026-SGC-00017", name: "Dechen Wangmo", course: "ba-eng", marks: 79.2, status: "applied", photo: "",
            rollNo: "12361/24", board: "CBSE", stream: "Arts", gender: "Female", mobile: "9876543226", email: "dechen.wangmo@gmail.com",
            category: "Sikkimese", coiNumber: "COI/SK/2024/0234", pwd: "No", dob: "2006-03-09", community: "General",
            fatherName: "Jigme Wangmo", fatherContact: "9876000017", motherName: "Karma Wangmo",
            district: "Gangtok", pincode: "737101", permanentAddress: "Tibet Road, Gangtok, East Sikkim", state: "Sikkim",
            subjects: [{name:"English",marks:82,total:100},{name:"History",marks:78,total:100},{name:"Political Science",marks:80,total:100},{name:"Sociology",marks:76,total:100},{name:"Nepali",marks:80,total:100}],
            pref1: "B.A. English (Hons)", pref2: "B.A. Political Science", pref3: "",
            appFee: {txn:"TXN2024101718",amount:200,status:"Paid",method:"Online"}
        },
        {
            appNo: "SK-2026-SGC-00018", name: "Karma Tshering Lepcha", course: "bcom", marks: 72.8, status: "applied", photo: "",
            rollNo: "12362/24", board: "Sikkim Board", stream: "Commerce", gender: "Male", mobile: "9876543227", email: "karma.lepcha@yahoo.com",
            category: "Sikkimese", coiNumber: "COI/SK/2024/0246", pwd: "No", dob: "2006-09-22", community: "ST",
            fatherName: "Sonam Tshering", fatherContact: "9876000018", motherName: "Mingma Lepcha",
            district: "Gyalshing", pincode: "737111", permanentAddress: "Pelling Road, Gyalshing, West Sikkim", state: "Sikkim",
            subjects: [{name:"English",marks:70,total:100},{name:"Accountancy",marks:74,total:100},{name:"Business Studies",marks:72,total:100},{name:"Economics",marks:76,total:100},{name:"Nepali",marks:72,total:100}],
            pref1: "B.Com (Hons) — General", pref2: "B.Com (Hons) — Accounting & Finance", pref3: "",
            appFee: {txn:"TXN2024101822",amount:200,status:"Paid",method:"Online"}
        },
        {
            appNo: "SK-2026-SGC-00019", name: "Passang Diki", course: "ba-polsci", marks: 67.5, status: "applied", photo: "", isRecommendation: true,
            rollNo: "12363/24", board: "Sikkim Board", stream: "Arts", gender: "Female", mobile: "9876543228", email: "passang.diki@gmail.com",
            category: "Sikkimese", coiNumber: "COI/SK/2024/0258", pwd: "No", dob: "2006-01-15", community: "ST",
            fatherName: "Tashi Diki", fatherContact: "9876000019", motherName: "Pema Diki",
            district: "Soreng", pincode: "737121", permanentAddress: "Soreng Town, West Sikkim", state: "Sikkim",
            subjects: [{name:"English",marks:68,total:100},{name:"Political Science",marks:66,total:100},{name:"History",marks:70,total:100},{name:"Sociology",marks:65,total:100},{name:"Nepali",marks:68,total:100}],
            pref1: "B.A. Political Science", pref2: "B.A. English (Hons)", pref3: "",
            appFee: {txn:"TXN2024101905",amount:200,status:"Paid",method:"Cash"}
        },
        {
            appNo: "SK-2026-SGC-00020", name: "Suraj Pradhan", course: "bcom", marks: 75.0, status: "applied", photo: "",
            rollNo: "12364/24", board: "CBSE", stream: "Commerce", gender: "Male", mobile: "9876543229", email: "suraj.pradhan@gmail.com",
            category: "Sikkimese", coiNumber: "COI/SK/2024/0270", pwd: "No", dob: "2006-04-18", community: "General",
            fatherName: "Krishna Pradhan", fatherContact: "9876000020", motherName: "Gita Pradhan",
            district: "Gangtok", pincode: "737102", permanentAddress: "Tadong, Near SRM University, Gangtok", state: "Sikkim",
            subjects: [{name:"English",marks:76,total:100},{name:"Accountancy",marks:75,total:100},{name:"Business Studies",marks:74,total:100},{name:"Economics",marks:78,total:100},{name:"Mathematics",marks:72,total:100}],
            pref1: "B.Com (Hons) — Business Management", pref2: "B.Com (Hons) — Accounting & Finance", pref3: "",
            appFee: {txn:"TXN2024102015",amount:200,status:"Paid",method:"Online"}
        }
    ];

    // Pre-built merit lists — intentionally empty; upload via college admin portal
    var MERIT_LISTS = [];

    // Registration data (keyed by appNo)
    var REGISTRATIONS = {};
    // Session-wise admission schedule configurations
    var ADMISSION_SCHEDULES = {};
    var editingScheduleSession = null; // year value shown in form
    var editingScheduleKey = null;    // full storage key (collegeId_uniqueId)
    var scheduleUserEditing = false;   // true only when user explicitly clicked Edit Session

    // ============================================================
    // 2. HELPERS
    // ============================================================

    function getStudentByApp(appNo) {
        // Live applications take priority — check submitted portal apps first
        try {
            var liveApps = JSON.parse(localStorage.getItem('emmis_he_applications') || '[]');
            for (var j = 0; j < liveApps.length; j++) {
                var a = liveApps[j];
                if (a.applicationId === appNo) {
                    return liveAppToStudent(a);
                }
            }
        } catch(e) {}
        // Fall back to seed data (demo entries)
        for (var i = 0; i < STUDENTS.length; i++) { if (STUDENTS[i].appNo === appNo) return STUDENTS[i]; }
        // Convert non-SGC appNo to SGC equivalent for seed lookup (e.g. SK-2026-DEN-00001 → SK-2026-SGC-00001)
        var sgcEquiv = appNo.replace(/^(SK-\d{4}-)[A-Z]{2,4}(-\d+)$/, '$1SGC$2');
        if (sgcEquiv !== appNo) {
            for (var i2 = 0; i2 < STUDENTS.length; i2++) {
                if (STUDENTS[i2].appNo === sgcEquiv) {
                    var copy = $.extend({}, STUDENTS[i2]);
                    copy.appNo = appNo; // return with the requested (non-SGC) code
                    return copy;
                }
            }
        }
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
                activeSession = s.session || String(s.year || '');
                return false; // break
            }
        });
        if (activeSession) return activeSession;
        // Fall back to most recent merit list session
        var latestSession = null;
        $.each(getActiveMeritLists(), function(_, ml) {
            if (!latestSession || (ml.session || ml.year || '') > latestSession) latestSession = ml.session || String(ml.year || '');
        });
        if (latestSession) return latestSession;
        // Final fallback
        return COLLEGE_INFO.session || null;
    }

    // Returns the current admission year (integer) for the college
    function getCurrentAdmissionYear() {
        var sched = getCollegeSchedule();
        if (sched && sched.year) return sched.year;
        return new Date().getFullYear();
    }

    // Get the one admission schedule for the current college (one per year)
    function getCollegeSchedule() {
        var found = null;
        $.each(ADMISSION_SCHEDULES, function(k, s) {
            if (s && s.collegeId === COLLEGE_INFO.id) { found = s; found._key = k; return false; }
        });
        return found;
    }

    // Load/save per-year notification (stored separately)
    function loadNotification(collegeId, year) {
        var raw = localStorage.getItem('emmis_ca_notification_' + collegeId + '_' + year);
        if (!raw) return '';
        try { return JSON.parse(raw).text || ''; } catch(e) { return ''; }
    }
    function saveNotification(collegeId, year, text) {
        localStorage.setItem('emmis_ca_notification_' + collegeId + '_' + year,
            JSON.stringify({ text: text, updatedAt: new Date().toISOString() }));
    }

    // Returns true if the student's appNo belongs to the current ongoing session.
    function isStudentCurrentSession(student) {
        var year = getCurrentAdmissionYear();
        if (!year) return true; // no session info at all — show everyone
        return student.appNo.indexOf('-' + year + '-') >= 0;
    }

    function getMeritListsForApp(appNo) {
        var lists = [];
        $.each(getActiveMeritLists(), function(_, ml) {
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
    function loadRegistrations() {
        REGISTRATIONS = {};
        var key = 'emmis_ca_registrations_' + (COLLEGE_INFO.id || 'default');
        var d = localStorage.getItem(key);
        if (d) { try { REGISTRATIONS = JSON.parse(d); } catch(e) { REGISTRATIONS = {}; } }
    }
    function saveRegistrations() {
        localStorage.setItem('emmis_ca_registrations_' + (COLLEGE_INFO.id || 'default'), JSON.stringify(REGISTRATIONS));
    }

    // Recommendations: keyed by appNo — from invite-link applications + seed data
    var RECOMMENDATIONS_SET = {};
    function loadRecommendations() {
        RECOMMENDATIONS_SET = {};
        var recs = JSON.parse(localStorage.getItem('emmis_ca_recommendations') || '[]');
        $.each(recs, function(_, r) { RECOMMENDATIONS_SET[r.appNo] = r; });
        // Also mark seed students that have isRecommendation:true (using remapped appNos)
        $.each(getActiveStudents(), function(_, s) {
            if (s.isRecommendation) RECOMMENDATIONS_SET[s.appNo] = { appNo: s.appNo, seed: true };
        });
    }
    function isStudentRecommendation(appNo) {
        return !!RECOMMENDATIONS_SET[appNo] || !!(REGISTRATIONS[appNo] && REGISTRATIONS[appNo].isRecommendation);
    }

    function loadMeritLists() {
        MERIT_LISTS = []; // always reset before loading so switching colleges never leaks data
        _meritListsLoaded = false;
        var key = 'emmis_ca_meritlists_' + (COLLEGE_INFO.id || 'default');
        var d = localStorage.getItem(key);
        if (d) {
            try {
                var parsed = JSON.parse(d);
                // Validate new format (entries-based); discard old format (students/statuses)
                if (parsed.length > 0 && parsed[0].entries) {
                    MERIT_LISTS = parsed;
                    _meritListsLoaded = true;
                    // Backward compat: ensure session and program fields exist
                    $.each(MERIT_LISTS, function(_, ml) {
                        if (!ml.session) ml.session = '2024-25';
                        if (ml.program === undefined) ml.program = '';
                    });
                } else {
                    localStorage.removeItem(key);
                }
            } catch(e) {}
        }
    }
    function saveMeritLists() {
        var key = 'emmis_ca_meritlists_' + (COLLEGE_INFO.id || 'default');
        localStorage.setItem(key, JSON.stringify(MERIT_LISTS));
        _meritListsLoaded = true;
        // Rebuild global aggregate so student portal track status can read across all colleges
        var all = [];
        for (var cid = 1; cid <= 12; cid++) {
            var d = localStorage.getItem('emmis_ca_meritlists_' + cid);
            if (d) { try { var l = JSON.parse(d); if (Array.isArray(l)) all = all.concat(l); } catch(e) {} }
        }
        localStorage.setItem('emmis_ca_meritlists', JSON.stringify(all));
    }

    // ── Counselling Sessions ──────────────────────────────────────
    var COUNSELLING_SESSIONS = [];
    function loadCounsellingSessions() {
        COUNSELLING_SESSIONS = [];
        var key = 'emmis_ca_counselling_sessions_' + (COLLEGE_INFO.id || 'default');
        var d = localStorage.getItem(key);
        if (d) {
            try {
                var parsed = JSON.parse(d);
                if (Array.isArray(parsed)) COUNSELLING_SESSIONS = parsed;
            } catch(e) {}
        }
    }
    function saveCounsellingSessions() {
        var key = 'emmis_ca_counselling_sessions_' + (COLLEGE_INFO.id || 'default');
        localStorage.setItem(key, JSON.stringify(COUNSELLING_SESSIONS));
        // Rebuild global aggregate so student portal track status can read across all colleges
        var all = [];
        for (var cid = 1; cid <= 12; cid++) {
            var d = localStorage.getItem('emmis_ca_counselling_sessions_' + cid);
            if (d) { try { var l = JSON.parse(d); if (Array.isArray(l)) all = all.concat(l); } catch(e) {} }
        }
        localStorage.setItem('emmis_ca_counselling_sessions', JSON.stringify(all));
    }

    function loadAdmissionSchedules() {
        var d = localStorage.getItem('emmis_ca_admission_schedules');
        if (d) {
            try {
                ADMISSION_SCHEDULES = JSON.parse(d) || {};
                // Backward compat: ensure new fields exist
                $.each(ADMISSION_SCHEDULES, function(k, s) {
                    if (!s) return;
                    if (!s.year && s.session) s.year = parseInt(s.session, 10) || new Date().getFullYear();
                    if (!s.overrides) s.overrides = [];
                    if (!s.inviteLinks) s.inviteLinks = [];
                    // Migrate old inviteToken → single invite link entry
                    if (s.inviteToken && s.inviteLinks.length === 0) {
                        s.inviteLinks.push({ token: s.inviteToken, label: 'Original invite link', createdAt: s.updatedAt || '', used: false });
                    }
                });
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
        if (sectionId === 'section-ca-prev-schedules') renderPrevSchedulesSection();
        if (sectionId === 'section-ca-merit-manage') renderMeritListDashboard();
        if (sectionId === 'section-ca-counselling-manage') renderCounsellingDashboard();
        if (sectionId === 'section-ca-counselling-upload') { $('#csActiveYearDisplay').text(getCurrentAdmissionYear()); }
        if (sectionId === 'section-ca-register-search') renderRegisteredList();
        if (sectionId === 'section-ca-all-applications') renderAllApplications();
    }

    // ============================================================
    // 4. DASHBOARD
    // ============================================================

    function renderDashboard() {
        // KPIs
        var activeStudents = getActiveStudents();
        var activeMeritLists = getActiveMeritLists();
        var totalApps = activeStudents.length;
        var meritListedSet = {}, registered = 0;
        $.each(activeMeritLists, function(_, ml) {
            $.each(ml.entries, function(__, entry) {
                meritListedSet[entry.appNo] = true;
            });
        });
        var admitted = Object.keys(meritListedSet).length;
        var _regCollegeCode = getCollegeCode();
        $.each(REGISTRATIONS, function(app, reg) {
            if (app.indexOf('-' + _regCollegeCode + '-') < 0) return; // skip other-college entries
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
            $.each(activeStudents, function(__, s) { if (s.course === c.id) apps++; });
            $.each(activeMeritLists, function(__, ml) {
                $.each(ml.entries, function(___, entry) {
                    var s = getStudentByApp(entry.appNo);
                    if (s && s.course === c.id) admSet[entry.appNo] = true;
                });
            });
            adm = Object.keys(admSet).length;
            $.each(REGISTRATIONS, function(app, r) {
                if (app.indexOf('-' + _regCollegeCode + '-') < 0) return; // skip other-college entries
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
        $.each(activeStudents, function(_, s) {
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
        $.each(activeStudents, function(_, s) { communities[s.community] = (communities[s.community] || 0) + 1; });
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

    function generateInviteToken() {
        var chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        var token = '';
        for (var i = 0; i < 32; i++) {
            token += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return token;
    }

    // ── Override windows ──
    function getActiveOverrideEndDate(overrides) {
        // Returns the common end date of active overrides, or null if none active
        var today = new Date(); today.setHours(0,0,0,0);
        var activeDate = null;
        $.each(overrides || [], function(_, ovr) {
            if (!ovr.endDate) return;
            var d = new Date(ovr.endDate + 'T00:00:00');
            if (d >= today) { activeDate = ovr.endDate; return false; }
        });
        return activeDate;
    }

    function renderOverrideList(overrides, schedKey) {
        var $list = $('#overrideList').empty();
        var today = new Date(); today.setHours(0,0,0,0);
        if (!overrides || overrides.length === 0) {
            $list.html('<div class="text-center py-3 text-on-surface-variant small" style="border:1.5px dashed var(--clr-outline-variant);border-radius:8px;"><span class="material-symbols-outlined d-block mb-1" style="font-size:28px;opacity:.35;">date_range</span>No overrides configured yet.</div>');
            return;
        }
        $.each(overrides, function(i, ovr) {
            var d = new Date(ovr.endDate + 'T00:00:00');
            var isExpired = d < today;
            var programLabel = ovr.program || 'All Programs';
            var courseLabel = ovr.courseName || ovr.courseId || 'All Courses';
            var endFmt = ovr.endDate ? (function(){ var p=ovr.endDate.split('-'); var dt=new Date(parseInt(p[0]),parseInt(p[1])-1,parseInt(p[2])); return dt.toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}); }()) : '—';
            $list.append(
                '<div class="d-flex align-items-center gap-3 p-3 rounded-3 mb-2" style="background:var(--clr-surface-low);border:1px solid var(--clr-outline-variant);' + (isExpired ? 'opacity:.55;' : '') + '">' +
                '<div class="flex-grow-1">' +
                '<span class="fw-bold small d-block">' + programLabel + ' — ' + courseLabel + '</span>' +
                '<span class="small text-on-surface-variant">Override closing date: <strong style="color:' + (isExpired ? 'var(--clr-error)' : 'var(--clr-primary)') + ';">' + endFmt + '</strong>' + (isExpired ? ' <span class="badge rounded-pill ms-1" style="background:rgba(186,26,26,0.1);color:var(--clr-error);font-size:.65rem;">Expired</span>' : '') + '</span>' +
                '</div>' +
                '<button class="btn btn-sm btn-link text-danger p-1 btn-delete-override" data-key="' + schedKey + '" data-idx="' + i + '" title="Delete override"><span class="material-symbols-outlined" style="font-size:18px;">delete</span></button>' +
                '</div>'
            );
        });
    }

    function renderInviteLinksList(inviteLinks, schedKey) {
        var $list = $('#inviteLinksList').empty();
        if (!inviteLinks || inviteLinks.length === 0) {
            $list.html('<div class="text-center py-3 text-on-surface-variant small" style="border:1.5px dashed rgba(186,26,26,0.25);border-radius:8px;"><span class="material-symbols-outlined d-block mb-1" style="font-size:28px;opacity:.35;">link_off</span>No invite links generated yet.</div>');
            return;
        }
        var baseUrl = window.location.origin + window.location.pathname.replace(/\/[^/]+$/, '/') + 'index.html?invite=';
        var today = new Date(); today.setHours(0, 0, 0, 0);
        $.each(inviteLinks, function(i, lnk) {
            var fullUrl = baseUrl + lnk.token;
            var createdFmt = lnk.createdAt ? new Date(lnk.createdAt).toLocaleDateString('en-IN', {day:'2-digit',month:'short',year:'numeric'}) : '—';
            var isExpired = lnk.validUntil ? new Date(lnk.validUntil + 'T00:00:00') < today : false;
            var validUntilHtml = '';
            if (lnk.validUntil) {
                var vuFmt = (function(){ var p = lnk.validUntil.split('-'); return new Date(parseInt(p[0]), parseInt(p[1]) - 1, parseInt(p[2])).toLocaleDateString('en-IN', {day:'2-digit',month:'short',year:'numeric'}); }());
                validUntilHtml = ' &middot; Valid until: <strong style="color:' + (isExpired ? 'var(--clr-error)' : 'var(--clr-primary)') + ';">' + vuFmt + '</strong>' +
                    (isExpired ? ' <span class="badge rounded-pill ms-1" style="background:rgba(186,26,26,0.1);color:var(--clr-error);font-size:.65rem;">Expired</span>' : '');
            }
            $list.append(
                '<div class="d-flex align-items-start gap-3 p-3 rounded-3 mb-2" style="' + ((isExpired || lnk.used) ? 'opacity:.65;' : '') + 'background:rgba(186,26,26,0.04);border:1px solid rgba(186,26,26,0.15);">' +
                '<div class="flex-grow-1 min-width-0">' +
                (lnk.label ? '<span class="fw-bold small d-block">' + $('<span>').text(lnk.label).html() + '</span>' : '') +
                '<code class="d-block text-truncate" style="font-size:.7rem;color:var(--clr-on-surface-variant);" title="' + fullUrl + '">' + fullUrl + '</code>' +
                '<span class="small text-on-surface-variant">Generated: ' + createdFmt + validUntilHtml + (lnk.used ? ' &middot; <span style="color:var(--clr-error);">Used</span>' : '') + '</span>' +
                '</div>' +
                '<div class="d-flex flex-column gap-2 flex-shrink-0">' +
                '<button class="btn btn-sm fw-bold btn-copy-invite d-flex align-items-center gap-1" data-url="' + fullUrl + '" style="font-size:.7rem;padding:4px 10px;background:rgba(186,26,26,0.1);color:var(--clr-error);border:1px solid rgba(186,26,26,0.2);"><span class="material-symbols-outlined" style="font-size:13px;">content_copy</span>Copy</button>' +
                '<button class="btn btn-sm fw-bold btn-delete-invite d-flex align-items-center gap-1" data-key="' + schedKey + '" data-idx="' + i + '" style="font-size:.7rem;padding:4px 10px;background:rgba(186,26,26,0.05);color:var(--clr-error);border:1px solid rgba(186,26,26,0.15);"><span class="material-symbols-outlined" style="font-size:13px;">delete</span>Revoke</button>' +
                '</div></div>'
            );
        });
    }

    function resetScheduleForm() {
        scheduleUserEditing = false;
        editingScheduleSession = null;
        editingScheduleKey = null;
        var year = getCurrentAdmissionYear();
        $('#cfgYearBadge').text(year);
        $('#cfgAppOpen').val('');
        $('#cfgAppClose').val('');
        $('#cfgAppFee').val('');
        $('#cfgProspectusName').val('');
    }

    function populateScheduleForm(schedule, schedKey) {
        editingScheduleSession = schedule.session || String(schedule.year || '');
        editingScheduleKey = schedKey || null;
        var year = schedule.year || parseInt(schedule.session, 10) || new Date().getFullYear();
        $('#cfgYearBadge').text(year);
        $('#cfgAppOpen').val(schedule.defaultWindow && schedule.defaultWindow.appOpen || '');
        $('#cfgAppClose').val(schedule.defaultWindow && schedule.defaultWindow.appClose || '');
        $('#cfgAppFee').val(schedule.appFee != null ? schedule.appFee : '');
        $('#cfgProspectusName').val(schedule.prospectusName || '');
    }

    function renderScheduleCards() {
        var $wrap = $('#scheduleCards').empty();
        var sched = getCollegeSchedule();
        if (!sched) {
            $wrap.html(
                '<div class="text-center py-5">' +
                '<span class="material-symbols-outlined d-block mb-2" style="font-size:48px;color:var(--clr-outline);">event_busy</span>' +
                '<p class="text-on-surface-variant mb-0">No session configured for this year yet. Fill in the form above and save.</p>' +
                '</div>'
            );
            return;
        }
        var year = sched.year || parseInt(sched.session, 10) || '—';
        var schedKey = sched._key;
        var notifText = loadNotification(COLLEGE_INFO.id, year);
        var overrides = sched.overrides || [];
        var inviteLinks = sched.inviteLinks || [];

        // Load merit list and counselling data for this college/year
        var allMl = [];
        try { allMl = JSON.parse(localStorage.getItem('emmis_ca_meritlists') || '[]'); } catch(e) {}
        var collegeMl = $.grep(allMl, function(ml) {
            var mlYear = ml.year || parseInt(ml.session, 10) || 0;
            if (mlYear !== year) return false;
            if (COLLEGE_INFO.id && ml.collegeId && String(ml.collegeId) !== String(COLLEGE_INFO.id)) return false;
            return true;
        });

        var allCs = [];
        try { allCs = JSON.parse(localStorage.getItem('emmis_ca_counselling_sessions') || '[]'); } catch(e) {}
        var collegeCs = $.grep(allCs, function(cs) {
            var csYear = cs.year || 0;
            if (csYear !== year) return false;
            if (COLLEGE_INFO.id && cs.collegeId && String(cs.collegeId) !== String(COLLEGE_INFO.id)) return false;
            return true;
        });

        var mlCount = collegeMl.length;
        var csCount = collegeCs.length;
        var ovrCount = overrides.length;
        var invCount = inviteLinks.length;

        var appOpen  = formatYmdToDisplay((sched.defaultWindow && sched.defaultWindow.appOpen)  || '');
        var appClose = formatYmdToDisplay((sched.defaultWindow && sched.defaultWindow.appClose) || '');

        var html = '';

        // ─── Session header card ───
        html += '<div class="card rounded-3 overflow-hidden mb-3">';
        // Header strip
        html += '<div class="p-4" style="background:var(--clr-surface-low);">';
        html += '<div class="d-flex justify-content-between align-items-start gap-3 flex-wrap">';
        html += '<div>';
        html += '<div class="d-flex align-items-center gap-2 mb-2">';
        html += '<span class="material-symbols-outlined" style="font-size:22px;color:var(--clr-primary);">event_available</span>';
        html += '<h5 class="fw-bold mb-0">Admission Year ' + year + '</h5>';
        html += '<span class="badge rounded-pill fw-bold" style="background:var(--clr-primary-container);color:var(--clr-on-primary-container);">ACTIVE</span>';
        html += '</div>';
        html += '<div class="d-flex flex-wrap gap-4 mt-1">';
        html += '<div><span class="d-block text-on-surface-variant" style="font-size:.68rem;text-transform:uppercase;letter-spacing:.07em;">App Opens</span>';
        html += '<span class="fw-semibold small">' + (appOpen || '—') + '</span></div>';
        html += '<div><span class="d-block text-on-surface-variant" style="font-size:.68rem;text-transform:uppercase;letter-spacing:.07em;">App Closes</span>';
        html += '<span class="fw-semibold small">' + (appClose || '—') + '</span></div>';
        html += '<div><span class="d-block text-on-surface-variant" style="font-size:.68rem;text-transform:uppercase;letter-spacing:.07em;">Prospectus Fee</span>';
        html += '<span class="fw-semibold small">' + (sched.appFee ? '\u20b9' + sched.appFee : 'Free') + '</span></div>';
        if (sched.prospectusName) {
            html += '<div><span class="d-block text-on-surface-variant" style="font-size:.68rem;text-transform:uppercase;letter-spacing:.07em;">Prospectus</span>';
            html += '<span class="fw-semibold small d-flex align-items-center gap-1"><span class="material-symbols-outlined" style="font-size:13px;vertical-align:-1px;">description</span>' + $('<span>').text(sched.prospectusName).html() + '</span></div>';
        }
        html += '</div></div>';
        // Edit / Delete buttons
        html += '<div class="d-flex gap-2 flex-shrink-0 align-items-start">';
        html += '<button class="btn btn-sm btn-outline-primary fw-bold btn-edit-schedule d-flex align-items-center gap-1" data-key="' + schedKey + '"><span class="material-symbols-outlined" style="font-size:14px;vertical-align:-2px;">edit</span>Edit</button>';
        html += '<button class="btn btn-sm btn-outline-danger fw-bold btn-delete-schedule d-flex align-items-center gap-1" data-key="' + schedKey + '"><span class="material-symbols-outlined" style="font-size:14px;vertical-align:-2px;">delete</span>Delete</button>';
        html += '</div>';
        html += '</div></div>';

        // Quick stats row
        html += '<div class="d-flex border-top" style="background:var(--clr-surface);">';
        var statItems = [
            { icon: 'format_list_numbered', label: 'Merit Lists',     count: mlCount,  color: 'var(--clr-primary)' },
            { icon: 'record_voice_over',    label: 'Counselling',     count: csCount,  color: 'var(--clr-primary)' },
            { icon: 'date_range',           label: 'Overrides',       count: ovrCount, color: 'var(--clr-tertiary)' },
            { icon: 'link',                 label: 'Invite Links',    count: invCount, color: 'var(--clr-error)' }
        ];
        $.each(statItems, function(i, stat) {
            html += '<div class="flex-fill text-center py-3 px-2' + (i < statItems.length - 1 ? ' border-end' : '') + '">';
            html += '<span class="material-symbols-outlined d-block mb-1" style="font-size:20px;color:' + stat.color + ';">' + stat.icon + '</span>';
            html += '<span class="fw-bold d-block lh-1 mb-1" style="font-size:1.1rem;">' + stat.count + '</span>';
            html += '<span class="small text-on-surface-variant">' + stat.label + '</span>';
            html += '</div>';
        });
        html += '</div>';
        html += '</div>'; // end session header card

        // ─── Tabbed detail card ───
        html += '<div class="card rounded-3 overflow-hidden">';

        // Nav pills
        html += '<div class="px-3 pt-3 pb-0" style="background:var(--clr-surface-low);border-bottom:1px solid var(--clr-outline-variant);">';
        html += '<ul class="nav nav-pills gap-1 overflow-auto pb-2" style="flex-wrap:nowrap;" role="tablist">';
        var tabs = [
            { id: 'tab-notif',     label: 'Notification',   icon: 'campaign',              badge: '' },
            { id: 'tab-merits',    label: 'Merit Lists',     icon: 'format_list_numbered',  badge: mlCount  },
            { id: 'tab-counsel',   label: 'Counselling',     icon: 'record_voice_over',     badge: csCount  },
            { id: 'tab-overrides', label: 'Overrides',       icon: 'date_range',            badge: ovrCount },
            { id: 'tab-links',     label: 'Invite Links',    icon: 'link',                  badge: invCount }
        ];
        $.each(tabs, function(i, tab) {
            var active = i === 0 ? ' active' : '';
            html += '<li class="nav-item flex-shrink-0" role="presentation">';
            html += '<button class="nav-link' + active + ' d-flex align-items-center gap-1 fw-semibold" id="' + tab.id + '-tab" data-bs-toggle="pill" data-bs-target="#' + tab.id + '" type="button" role="tab" style="font-size:.78rem;padding:.4rem .8rem;white-space:nowrap;">';
            html += '<span class="material-symbols-outlined" style="font-size:14px;">' + tab.icon + '</span>' + tab.label;
            if (tab.badge !== '') html += ' <span class="badge rounded-pill fw-bold ms-1" style="font-size:.6rem;background:rgba(0,0,0,0.08);color:inherit;">' + tab.badge + '</span>';
            html += '</button></li>';
        });
        html += '</ul></div>';

        // Tab panes
        html += '<div class="tab-content">';

        // ── Notification tab ──
        html += '<div class="tab-pane fade show active p-4" id="tab-notif" role="tabpanel">';
        html += '<div class="d-flex justify-content-between align-items-start gap-2 mb-3">';
        html += '<div>';
        html += '<h6 class="fw-bold d-flex align-items-center gap-2 mb-1"><span class="material-symbols-outlined" style="font-size:18px;color:var(--clr-secondary);">campaign</span>Public Announcement</h6>';
        html += '<p class="small text-on-surface-variant mb-0">Displayed on the public college listing page. Update any time, independent of session configuration.</p>';
        html += '</div>';
        html += '<span class="small fw-semibold flex-shrink-0 ms-2" id="notifSavedIndicator" style="display:none;color:var(--clr-primary);"><span class="material-symbols-outlined" style="font-size:13px;vertical-align:-2px;">check_circle</span> Saved <span id="notifSavedAt"></span></span>';
        html += '</div>';
        html += '<textarea class="form-control mb-3" id="cfgNotification" rows="3" placeholder="e.g., Document verification starts May 12. Bring all originals.">' + $('<span>').text(notifText).html() + '</textarea>';
        html += '<div class="d-flex justify-content-end">';
        html += '<button class="btn btn-outline-secondary btn-sm fw-bold d-flex align-items-center gap-2" id="btnSaveNotification"><span class="material-symbols-outlined" style="font-size:14px;">save</span>Update Notification</button>';
        html += '</div></div>';

        // ── Merit Lists tab ──
        html += '<div class="tab-pane fade p-4" id="tab-merits" role="tabpanel">';
        html += '<div class="d-flex justify-content-between align-items-start mb-3 gap-2">';
        html += '<div><h6 class="fw-bold d-flex align-items-center gap-2 mb-1"><span class="material-symbols-outlined" style="font-size:18px;color:var(--clr-primary);">format_list_numbered</span>Merit Lists — AY ' + year + '</h6>';
        html += '<p class="small text-on-surface-variant mb-0">Publish merit lists so selected students can see their status on the Track Status page.</p></div>';
        html += '<a href="#" class="btn btn-sm btn-outline-primary fw-bold flex-shrink-0 d-flex align-items-center gap-1 btn-goto-section" data-section="section-ca-merit-manage"><span class="material-symbols-outlined" style="font-size:14px;">open_in_new</span>Manage All</a>';
        html += '</div>';
        if (collegeMl.length === 0) {
            html += '<div class="text-center py-5 text-on-surface-variant">';
            html += '<span class="material-symbols-outlined d-block mb-2" style="font-size:40px;color:var(--clr-outline);">format_list_numbered</span>';
            html += '<p class="mb-2">No merit lists for AY ' + year + ' yet.</p>';
            html += '<a href="#" class="btn btn-sm btn-outline-primary fw-bold btn-goto-section" data-section="section-ca-merit-upload">Upload Merit List</a>';
            html += '</div>';
        } else {
            var mlGroups = {}, mlGroupOrder = [];
            $.each(collegeMl, function(_, ml) {
                var prog = ml.program || 'General';
                if (!mlGroups[prog]) { mlGroups[prog] = []; mlGroupOrder.push(prog); }
                mlGroups[prog].push(ml);
            });
            html += '<div class="d-flex flex-column gap-3">';
            $.each(mlGroupOrder, function(_, prog) {
                html += '<div>';
                html += '<span class="d-block fw-bold mb-2" style="font-size:.7rem;text-transform:uppercase;letter-spacing:.07em;color:var(--clr-primary);">';
                html += '<span class="material-symbols-outlined align-middle" style="font-size:13px;vertical-align:-2px;">school</span> ' + $('<span>').text(prog).html() + '</span>';
                html += '<div class="d-flex flex-column gap-2">';
                $.each(mlGroups[prog], function(_, ml) {
                    var total = (ml.entries || []).length;
                    var published = ml.published;
                    var admDates = (ml.admissionStart && ml.admissionEnd) ? (formatYmdToDisplay(ml.admissionStart) + ' \u2013 ' + formatYmdToDisplay(ml.admissionEnd)) : 'Dates not set';
                    var pubBadge = published
                        ? '<span class="badge rounded-pill" style="background:rgba(107,217,188,0.25);color:var(--clr-on-primary-container);font-size:.65rem;">Published</span>'
                        : '<span class="badge rounded-pill" style="background:rgba(186,26,26,0.1);color:var(--clr-error);font-size:.65rem;">Draft</span>';
                    html += '<div class="d-flex justify-content-between align-items-center p-2 px-3 rounded-3" style="background:var(--clr-surface-low);border:1px solid var(--clr-outline-variant);">';
                    html += '<div class="d-flex align-items-center gap-3 flex-grow-1 min-width-0">';
                    html += '<div class="flex-grow-1 min-width-0">';
                    html += '<span class="fw-semibold small d-block text-truncate">' + $('<span>').text(ml.name).html() + (ml.course ? ' <span class="fw-normal text-on-surface-variant">\u2014 ' + $('<span>').text(ml.course).html() + '</span>' : '') + '</span>';
                    html += '<span class="small text-on-surface-variant">Admission: ' + admDates + ' &nbsp;&middot;&nbsp; ' + total + ' entries</span>';
                    html += '</div>' + pubBadge + '</div>';
                    html += '<button class="btn btn-sm fw-bold btn-toggle-ml-publish flex-shrink-0 ms-2" data-ml-id="' + ml.id + '" style="font-size:.7rem;padding:2px 10px;' + (published ? 'background:rgba(186,26,26,0.08);color:var(--clr-error);border:1px solid rgba(186,26,26,0.2);' : 'background:rgba(0,107,88,0.1);color:var(--clr-primary);border:1px solid rgba(0,107,88,0.2);') + '">';
                    html += '<span class="material-symbols-outlined" style="font-size:13px;vertical-align:-2px;">' + (published ? 'unpublished' : 'publish') + '</span> ';
                    html += (published ? 'Unpublish' : 'Publish') + '</button>';
                    html += '</div>';
                });
                html += '</div></div>';
            });
            html += '</div>';
        }
        html += '</div>';

        // ── Counselling tab ──
        html += '<div class="tab-pane fade p-4" id="tab-counsel" role="tabpanel">';
        html += '<div class="d-flex justify-content-between align-items-start mb-3 gap-2">';
        html += '<div><h6 class="fw-bold d-flex align-items-center gap-2 mb-1"><span class="material-symbols-outlined" style="font-size:18px;color:var(--clr-primary);">record_voice_over</span>Counselling — AY ' + year + '</h6>';
        html += '<p class="small text-on-surface-variant mb-0">Publish counselling call lists so students can see if they have been invited for counselling.</p></div>';
        html += '<a href="#" class="btn btn-sm btn-outline-primary fw-bold flex-shrink-0 d-flex align-items-center gap-1 btn-goto-section" data-section="section-ca-counselling-manage"><span class="material-symbols-outlined" style="font-size:14px;">open_in_new</span>Manage All</a>';
        html += '</div>';
        if (collegeCs.length === 0) {
            html += '<div class="text-center py-5 text-on-surface-variant">';
            html += '<span class="material-symbols-outlined d-block mb-2" style="font-size:40px;color:var(--clr-outline);">record_voice_over</span>';
            html += '<p class="mb-2">No counselling sessions for AY ' + year + ' yet.</p>';
            html += '<a href="#" class="btn btn-sm btn-outline-primary fw-bold btn-goto-section" data-section="section-ca-counselling-upload">Create Session</a>';
            html += '</div>';
        } else {
            html += '<div class="d-flex flex-column gap-2">';
            $.each(collegeCs, function(_, cs) {
                var total = (cs.entries || []).length;
                var published = cs.published;
                var csDates = (cs.counsellingStart && cs.counsellingEnd) ? (formatYmdToDisplay(cs.counsellingStart) + ' \u2013 ' + formatYmdToDisplay(cs.counsellingEnd)) : 'Dates not set';
                var pubBadge = published
                    ? '<span class="badge rounded-pill" style="background:rgba(107,217,188,0.25);color:var(--clr-on-primary-container);font-size:.65rem;">Published</span>'
                    : '<span class="badge rounded-pill" style="background:rgba(186,26,26,0.1);color:var(--clr-error);font-size:.65rem;">Draft</span>';
                html += '<div class="d-flex justify-content-between align-items-center p-2 px-3 rounded-3" style="background:var(--clr-surface-low);border:1px solid var(--clr-outline-variant);">';
                html += '<div class="d-flex align-items-center gap-3 flex-grow-1 min-width-0">';
                html += '<div class="flex-grow-1 min-width-0">';
                html += '<span class="fw-semibold small d-block text-truncate">' + $('<span>').text(cs.name).html() + '</span>';
                html += '<span class="small text-on-surface-variant">Counselling: ' + csDates + ' &nbsp;&middot;&nbsp; ' + total + ' entries</span>';
                html += '</div>' + pubBadge + '</div>';
                html += '<button class="btn btn-sm fw-bold btn-toggle-cs-publish flex-shrink-0 ms-2" data-cs-id="' + cs.id + '" style="font-size:.7rem;padding:2px 10px;' + (published ? 'background:rgba(186,26,26,0.08);color:var(--clr-error);border:1px solid rgba(186,26,26,0.2);' : 'background:rgba(0,107,88,0.1);color:var(--clr-primary);border:1px solid rgba(0,107,88,0.2);') + '">';
                html += '<span class="material-symbols-outlined" style="font-size:13px;vertical-align:-2px;">' + (published ? 'unpublished' : 'publish') + '</span> ';
                html += (published ? 'Unpublish' : 'Publish') + '</button>';
                html += '</div>';
            });
            html += '</div>';
        }
        html += '</div>';

        // ── Overrides tab ──
        html += '<div class="tab-pane fade p-4" id="tab-overrides" role="tabpanel">';
        html += '<div class="d-flex justify-content-between align-items-start mb-3 gap-2">';
        html += '<div><h6 class="fw-bold d-flex align-items-center gap-2 mb-1"><span class="material-symbols-outlined" style="font-size:18px;color:var(--clr-tertiary);">date_range</span>Application Closing Date Overrides</h6>';
        html += '<p class="small text-on-surface-variant mb-0">Extend the application closing date for specific programs or courses beyond the default session closing date.</p></div>';
        html += '<button class="btn btn-outline-primary btn-sm fw-bold flex-shrink-0 d-flex align-items-center gap-1" id="btnShowAddOverride"><span class="material-symbols-outlined" style="font-size:16px;">add</span>Add Override</button>';
        html += '</div>';
        html += '<div id="overrideAddForm" class="p-3 rounded-3 mb-3" style="display:none;background:var(--clr-surface-low);border:1px solid var(--clr-outline-variant);">';
        html += '<div class="row g-2 align-items-end">';
        html += '<div class="col-md-3"><label class="form-label fw-bold small mb-1">Program</label><select class="form-select form-select-sm" id="ovrProgram"><option value="">All Programs</option><option value="B.Com">B.Com</option><option value="B.A">B.A</option><option value="B.Sc">B.Sc</option></select></div>';
        html += '<div class="col-md-4"><label class="form-label fw-bold small mb-1">Course <span class="fw-normal text-on-surface-variant">(optional)</span></label><select class="form-select form-select-sm" id="ovrCourse"><option value="">All Courses in Program</option></select></div>';
        html += '<div class="col-md-3"><label class="form-label fw-bold small mb-1">Override Closing Date *</label><input type="date" class="form-control form-control-sm" id="ovrEndDate"></div>';
        html += '<div class="col-md-2 d-flex gap-2"><button class="btn btn-primary btn-sm fw-bold flex-grow-1" id="btnSaveOverride">Add</button><button class="btn btn-surface btn-sm fw-bold" id="btnCancelOverride">\u00d7</button></div>';
        html += '</div><p class="small text-on-surface-variant mt-2 mb-0" id="ovrDateHint"></p>';
        html += '</div>';
        html += '<div id="overrideList"></div>';
        html += '</div>';

        // ── Invite Links tab ──
        html += '<div class="tab-pane fade p-4" id="tab-links" role="tabpanel">';
        html += '<div class="d-flex justify-content-between align-items-start mb-3 gap-2">';
        html += '<div><h6 class="fw-bold d-flex align-items-center gap-2 mb-1"><span class="material-symbols-outlined" style="font-size:18px;color:var(--clr-error);">link</span>Invite Links</h6>';
        html += '<p class="small text-on-surface-variant mb-0">Generate individual shareable links for specific students. Each link expires after first use or its validity date.</p></div>';
        html += '<button class="btn btn-sm fw-bold flex-shrink-0 d-flex align-items-center gap-1" id="btnShowInviteForm" style="background:rgba(186,26,26,0.1);color:var(--clr-error);border:1px solid rgba(186,26,26,0.2);">';
        html += '<span class="material-symbols-outlined" style="font-size:16px;">add_link</span>Generate Link</button>';
        html += '</div>';
        html += '<div id="inviteAddForm" class="p-3 rounded-3 mb-3" style="display:none;background:rgba(186,26,26,0.04);border:1px solid rgba(186,26,26,0.15);">';
        html += '<div class="row g-2 align-items-end">';
        html += '<div class="col-md-5"><label class="form-label fw-bold small mb-1">Label / Student Name <span class="fw-normal text-on-surface-variant">(optional)</span></label><input type="text" class="form-control form-control-sm" id="inviteLinkLabel" placeholder="e.g., Tenzin Bhutia"></div>';
        html += '<div class="col-md-3"><label class="form-label fw-bold small mb-1">Valid Until <span class="fw-normal text-on-surface-variant">(optional)</span></label><input type="date" class="form-control form-control-sm" id="inviteLinkValidUntil"></div>';
        html += '<div class="col-md-4 d-flex gap-2 align-items-end"><button class="btn btn-sm fw-bold flex-grow-1" id="btnGenerateInvite" style="background:var(--clr-error);color:#fff;">Generate</button><button class="btn btn-surface btn-sm fw-bold" id="btnCancelInvite">\u00d7</button></div>';
        html += '</div></div>';
        html += '<div id="inviteLinksList"></div>';
        html += '</div>';

        html += '</div>'; // tab-content
        html += '</div>'; // tabbed detail card

        $wrap.html(html);

        // Populate sub-lists after HTML is in DOM
        renderOverrideList(overrides, schedKey);
        renderInviteLinksList(inviteLinks, schedKey);
    }

    function updateScheduleFormState() {
        var sched = getCollegeSchedule();
        var locked = !!sched && !scheduleUserEditing;
        $('#cfgAppOpen, #cfgAppClose, #cfgAppFee, #btnPickProspectus, #btnClearProspectus').prop('disabled', locked);
        $('#btnSaveScheduleConfig').prop('disabled', locked);
        if (locked) {
            $('#scheduleExistsNotice').css('display', 'flex');
        } else {
            $('#scheduleExistsNotice').css('display', 'none');
        }
    }

    function renderAdmissionScheduleSection() {
        scheduleUserEditing = false;
        var year = getCurrentAdmissionYear();
        $('#cfgYearBadge').text(year);
        // Update topbar badge
        $('#activeAdmYearBadge').text('AY ' + year).css('display', '');
        var sched = getCollegeSchedule();
        if (sched && !editingScheduleKey) {
            populateScheduleForm(sched, sched._key);
        } else if (!sched && !editingScheduleKey) {
            resetScheduleForm();
        }
        renderScheduleCards();
        updateScheduleFormState();
    }

    function renderPrevSchedulesSection() {
        var currentYear = new Date().getFullYear();
        var $wrap = $('#prevSchedulesList').empty();

        // Collect all schedules for this college from past years
        var prevSchedules = [];
        $.each(ADMISSION_SCHEDULES, function(k, s) {
            if (!s || s.collegeId !== COLLEGE_INFO.id) return;
            var yr = s.year || parseInt(s.session, 10) || 0;
            if (yr < currentYear) prevSchedules.push({ key: k, sched: s, year: yr });
        });
        prevSchedules.sort(function(a, b) { return b.year - a.year; });

        if (!prevSchedules.length) {
            $wrap.html(
                '<div class="text-center py-5">' +
                '<span class="material-symbols-outlined d-block mb-2" style="font-size:40px;color:var(--clr-outline);">history</span>' +
                '<p class="text-on-surface-variant mb-0">No previous year schedules found.</p>' +
                '</div>'
            );
            return;
        }

        $.each(prevSchedules, function(_, item) {
            var s = item.sched;
            var year = item.year;
            var notif = loadNotification(COLLEGE_INFO.id, year);
            var overrides = s.overrides || [];
            var inviteLinks = s.inviteLinks || [];

            // Count merit lists and counselling sessions for this year
            var mlCount = $.grep(getActiveMeritLists(), function(ml) {
                return (ml.collegeId === COLLEGE_INFO.id) && ((ml.year || parseInt(ml.session, 10) || 0) === year);
            }).length;
            var csCount = $.grep(COUNSELLING_SESSIONS, function(cs) {
                return (cs.collegeId === COLLEGE_INFO.id) && ((cs.year || 0) === year);
            }).length;

            var appOpen  = (s.defaultWindow && s.defaultWindow.appOpen)  || '—';
            var appClose = (s.defaultWindow && s.defaultWindow.appClose) || '—';

            var html =
                '<div class="card mb-4 rounded-3 overflow-hidden">' +
                // Header
                '<div class="p-4" style="background:var(--clr-surface-low);">' +
                '<div class="d-flex flex-wrap justify-content-between align-items-start gap-3">' +
                '<div>' +
                '<h5 class="fw-bold mb-1 d-flex align-items-center gap-2">' +
                '<span class="material-symbols-outlined" style="font-size:20px;color:var(--clr-primary);">history_edu</span>' +
                'Admission Year ' + year +
                '</h5>' +
                '<p class="small text-on-surface-variant mb-0">Application: ' + appOpen + ' &rarr; ' + appClose + '</p>' +
                (s.appFee ? '<p class="small text-on-surface-variant mb-0">Prospectus Fee: ₹' + s.appFee + '</p>' : '<p class="small text-on-surface-variant mb-0">Prospectus Fee: Free</p>') +
                (s.prospectusName ? '<p class="small text-on-surface-variant mb-0 mt-1"><span class="material-symbols-outlined align-middle" style="font-size:13px;vertical-align:-2px;">description</span> ' + $('<span>').text(s.prospectusName).html() + '</p>' : '') +
                '</div>' +
                '<span class="badge rounded-pill fw-bold" style="background:var(--clr-surface-variant);color:var(--clr-on-surface-variant);">PAST</span>' +
                '</div>' +
                '</div>' +
                // Stats row
                '<div class="p-4 border-top">' +
                '<div class="row g-3">' +
                '<div class="col-6 col-md-3">' +
                '<div class="p-3 rounded-3 text-center" style="background:var(--clr-surface-low);">' +
                '<span class="d-block fw-bold fs-5">' + mlCount + '</span>' +
                '<span class="small text-on-surface-variant">Merit Lists</span>' +
                '</div></div>' +
                '<div class="col-6 col-md-3">' +
                '<div class="p-3 rounded-3 text-center" style="background:var(--clr-surface-low);">' +
                '<span class="d-block fw-bold fs-5">' + csCount + '</span>' +
                '<span class="small text-on-surface-variant">Counselling Sessions</span>' +
                '</div></div>' +
                '<div class="col-6 col-md-3">' +
                '<div class="p-3 rounded-3 text-center" style="background:var(--clr-surface-low);">' +
                '<span class="d-block fw-bold fs-5">' + overrides.length + '</span>' +
                '<span class="small text-on-surface-variant">Course Overrides</span>' +
                '</div></div>' +
                '<div class="col-6 col-md-3">' +
                '<div class="p-3 rounded-3 text-center" style="background:var(--clr-surface-low);">' +
                '<span class="d-block fw-bold fs-5">' + inviteLinks.length + '</span>' +
                '<span class="small text-on-surface-variant">Invite Links</span>' +
                '</div></div>' +
                '</div>' +
                '</div>';

            // Notification (if any)
            if (notif) {
                html +=
                    '<div class="p-4 border-top">' +
                    '<p class="small fw-bold d-flex align-items-center gap-1 mb-1" style="color:var(--clr-secondary);"><span class="material-symbols-outlined" style="font-size:15px;">campaign</span>Notification</p>' +
                    '<p class="small text-on-surface-variant mb-0">' + $('<span>').text(notif).html() + '</p>' +
                    '</div>';
            }

            // Course overrides (if any)
            if (overrides.length) {
                html += '<div class="p-4 border-top"><p class="small fw-bold mb-2">Course-wise Closing Date Overrides</p><div class="d-flex flex-column gap-1">';
                $.each(overrides, function(_, ovr) {
                    var label = (ovr.program ? ovr.program + ' ' : '') + (ovr.courseName || ovr.courseId ? '— ' + (ovr.courseName || ovr.courseId) : '');
                    html += '<span class="small text-on-surface-variant"><span class="material-symbols-outlined align-middle" style="font-size:13px;vertical-align:-2px;">date_range</span> ' +
                        $('<span>').text(label || 'All Courses').html() + ' — Closed: <strong>' + (ovr.endDate || '—') + '</strong></span>';
                });
                html += '</div></div>';
            }

            html += '</div>'; // end card
            $wrap.append(html);
        });
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
        var currentCollegeCode = getCollegeCode();
        $.each(REGISTRATIONS, function(appNo, reg) {
            // Guard: only show registrations belonging to this college (prevents cross-college leakage)
            if (appNo.indexOf('-' + currentCollegeCode + '-') < 0) return;
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
            var results = $.grep(getActiveStudents(), function (s) {
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

        // Seat allocation tab — build optgroups by student preference
        var $courseSelect = $('#regAllocCourse').empty();
        var prefCourseIds = [];
        var prefGroups = [];
        // Map preference strings to course IDs
        $.each([student.pref1, student.pref2, student.pref3], function(i, prefName) {
            if (!prefName) return;
            var matchId = null;
            $.each(COURSES, function(_, c) {
                if (c.name === prefName || c.name.toLowerCase().indexOf(prefName.toLowerCase()) >= 0) {
                    matchId = c.id; return false;
                }
            });
            if (matchId && $.inArray(matchId, prefCourseIds) < 0) {
                prefGroups.push({ label: 'Preference ' + (i + 1), courseId: matchId });
                prefCourseIds.push(matchId);
            }
        });
        $.each(prefGroups, function(_, pref) {
            var $grp = $('<optgroup>').attr('label', pref.label + ' — ' + (getCourseName(pref.courseId) || pref.courseId));
            $grp.append($('<option>').val(pref.courseId).text(getCourseName(pref.courseId) || pref.courseId));
            $courseSelect.append($grp);
        });
        var otherCourses = $.grep(COURSES, function(c) { return $.inArray(c.id, prefCourseIds) < 0; });
        if (otherCourses.length) {
            var $otherGrp = $('<optgroup>').attr('label', 'Other Courses');
            $.each(otherCourses, function(_, c) { $otherGrp.append($('<option>').val(c.id).text(c.name)); });
            $courseSelect.append($otherGrp);
        }
        // Pre-select allocated course or first pref
        var preselect = reg.allocatedCourse || (prefCourseIds.length ? prefCourseIds[0] : (COURSES[0] && COURSES[0].id));
        if (preselect) $courseSelect.val(preselect);
        $('#regRollNo').val(reg.rollNo || generateRollNo());
        $('#regSection').val(reg.section || 'A');
        populateElectives(reg.allocatedCourse || student.course, reg.electives, reg.moocsCourseName);
        $('#regMinorSubject').val(reg.minorSubject || '');

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

    var DOC_LABELS = [
        { key: 'marksheet', short: 'XII Marksheet' },
        { key: 'community', short: 'Community Cert' },
        { key: 'coi',       short: 'COI/Domicile' },
        { key: 'photo',     short: 'Photo' },
        { key: 'tc',        short: 'TC' }
    ];

    function getDocStatusHtml(appNo) {
        var reg = REGISTRATIONS[appNo];
        if (!reg || !reg.documents) {
            // Not yet at verification booth — show all as pending
            return '<span class="text-on-surface-variant" style="font-size:.72rem;">—&nbsp;Not verified</span>';
        }
        var docs = reg.documents;
        var uploaded = 0;
        var chips = $.map(DOC_LABELS, function(d) {
            var ok = !!docs[d.key];
            if (ok) uploaded++;
            return '<span title="' + d.short + '" style="display:inline-flex;align-items:center;gap:2px;font-size:.6rem;font-weight:600;padding:1px 5px;border-radius:99px;margin:1px;' +
                (ok ? 'background:rgba(0,107,88,0.12);color:var(--clr-primary);' : 'background:rgba(186,26,26,0.1);color:var(--clr-error);') + '">' +
                '<span class="material-symbols-outlined" style="font-size:10px;">' + (ok ? 'check_circle' : 'cancel') + '</span>' +
                d.short + '</span>';
        }).join('');
        var total = DOC_LABELS.length;
        var allOk = uploaded === total;
        var summary = '<div style="font-size:.65rem;font-weight:700;margin-bottom:2px;color:' + (allOk ? 'var(--clr-primary)' : 'var(--clr-error)') + '">' +
            uploaded + '/' + total + ' verified</div>';
        return summary + chips;
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

    function populateElectives(courseId, selected, moocsCourseName) {
        var $container = $('#regElectives').empty();
        var elecs = ELECTIVES[courseId] || [];
        $.each(elecs, function(i, e) {
            var checked = $.inArray(e, selected || []) >= 0 ? ' checked' : '';
            $container.append(
                '<div class="form-check"><input class="form-check-input elective-check" type="checkbox" value="' + e + '" id="elec' + i + '"' + checked + '>' +
                '<label class="form-check-label small" for="elec' + i + '">' + e + '</label></div>'
            );
        });
        // MOOCS option (always appended after course-specific electives)
        var moocsChecked = $.inArray('MOOCS', selected || []) >= 0;
        var moocsIdx = elecs.length;
        $container.append(
            '<div class="form-check"><input class="form-check-input elective-check" type="checkbox" value="MOOCS" id="elec' + moocsIdx + '"' + (moocsChecked ? ' checked' : '') + '>' +
            '<label class="form-check-label small fw-semibold" for="elec' + moocsIdx + '">MOOCS</label></div>'
        );
        // Show/hide MOOCS course name field
        if (moocsChecked) {
            $('#moocsNameWrap').show();
            $('#regMoocsName').val(moocsCourseName || '');
        } else {
            $('#moocsNameWrap').hide();
            $('#regMoocsName').val('');
        }
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

    function populateYearDropdowns() {
        // Collect all years from ML and CS for this college
        var years = {};
        $.each(getActiveMeritLists(), function(_, ml) {
            if (COLLEGE_INFO.id && ml.collegeId && String(ml.collegeId) !== String(COLLEGE_INFO.id)) return;
            var y = parseInt(ml.year, 10) || 0;
            if (y) years[y] = true;
        });
        $.each(COUNSELLING_SESSIONS, function(_, cs) {
            if (COLLEGE_INFO.id && cs.collegeId && String(cs.collegeId) !== String(COLLEGE_INFO.id)) return;
            var y = parseInt(cs.year, 10) || 0;
            if (y) years[y] = true;
        });
        // Also add current admission year
        var curYear = getCurrentAdmissionYear();
        if (curYear) years[curYear] = true;

        var sortedYears = Object.keys(years).map(Number).sort(function(a,b){ return b-a; });

        var buildOpts = function(curVal) {
            var opts = '<option value="all">All Years</option>';
            $.each(sortedYears, function(_, y) {
                opts += '<option value="' + y + '"' + (String(curVal) === String(y) ? ' selected' : '') + '>' + y + '</option>';
            });
            return opts;
        };

        var mlPrev = $('#mlFilterYear').val();
        var csPrev = $('#csFilterYear').val();
        $('#mlFilterYear').html(buildOpts(mlPrev));
        $('#csFilterYear').html(buildOpts(csPrev));
    }

    function renderMeritListDashboard() {
        populateYearDropdowns();
        var filterYear = $('#mlFilterYear').val() || 'all';
        var filterProgram = $('#mlFilterProgram').val() || 'all';

        var visible = $.grep(getActiveMeritLists(), function(ml) {
            // Filter by college (allow null/undefined collegeId for backward compat)
            if (COLLEGE_INFO.id && ml.collegeId != null && String(ml.collegeId) !== String(COLLEGE_INFO.id)) return false;
            if (filterYear !== 'all') {
                if (String(parseInt(ml.year, 10) || 0) !== String(filterYear)) return false;
            }
            if (filterProgram !== 'all') {
                if ((ml.program || '') !== filterProgram) return false;
            }
            return true;
        });

        var $container = $('#meritListCards').empty();
        $('#mlManageCount').text(visible.length + ' list' + (visible.length !== 1 ? 's' : ''));

        if (visible.length === 0) {
            $container.html('<div class="col-12 text-center py-5 text-on-surface-variant"><p class="fs-5 fw-semibold mb-2">No Merit Lists Found</p><p>' + (getActiveMeritLists().length === 0 ? 'Upload your first merit list to get started.' : 'No lists match the selected filters.') + '</p></div>');
            return;
        }

        // Group by program
        var groups = {}; // { programLabel: [ml, ...] }
        var groupOrder = [];
        $.each(visible, function(_, ml) {
            var prog = ml.program || 'Other';
            if (!groups[prog]) { groups[prog] = []; groupOrder.push(prog); }
            groups[prog].push(ml);
        });

        $.each(groupOrder, function(_, prog) {
            // Group header
            $container.append(
                '<div class="col-12 mt-2 mb-1">' +
                '<div class="d-flex align-items-center gap-2">' +
                '<span class="material-symbols-outlined" style="font-size:16px;color:var(--clr-primary);">school</span>' +
                '<span class="fw-bold text-uppercase" style="font-size:.75rem;letter-spacing:.06em;color:var(--clr-primary);">' + $('<span>').text(prog).html() + '</span>' +
                '<span class="badge rounded-pill ms-1" style="background:var(--clr-primary-container);color:var(--clr-on-primary-container);font-size:.65rem;">' + groups[prog].length + '</span>' +
                '</div><hr class="mt-1 mb-0" style="border-color:var(--clr-outline-variant);"></div>'
            );

            $.each(groups[prog], function(_, ml) {
            var total = ml.entries.length;
            var matched = 0, regCount = 0;
            $.each(ml.entries, function(__, entry) {
                if (getStudentByApp(entry.appNo)) matched++;
                if (REGISTRATIONS[entry.appNo] && REGISTRATIONS[entry.appNo].feeCollected) regCount++;
            });
            var unmatched = total - matched;
            var progLabel = ml.course ? (ml.program + ' — ' + ml.course) : (ml.program || '');
            var yearLabel = ml.year || ml.session || '—';
            var admDates = (ml.admissionStart && ml.admissionEnd) ? ('Admission: ' + ml.admissionStart + ' – ' + ml.admissionEnd) : '';
            var publishedBadge = ml.published ? '<span class="badge rounded-pill px-2 py-1" style="background:rgba(107,217,188,0.25);color:var(--clr-on-primary-container);font-size:.7rem;">Published</span>' :
                '<span class="badge rounded-pill px-2 py-1" style="background:rgba(186,26,26,0.1);color:var(--clr-error);font-size:.7rem;">Draft</span>';

            $container.append(
                '<div class="col-md-6"><div class="merit-card" data-ml-id="' + ml.id + '">' +
                '<div class="d-flex justify-content-between align-items-start mb-2">' +
                '<div>' +
                '<h5 class="fw-bold mb-1">' + $('<span>').text(ml.name).html() + '</h5>' +
                '<p class="small text-on-surface-variant mb-1">' + progLabel + '</p>' +
                '<p class="small text-on-surface-variant mb-0">Date: ' + ml.date + '</p>' +
                (admDates ? '<p class="small text-on-surface-variant mb-0">' + admDates + '</p>' : '') +
                '</div>' +
                '<div class="d-flex flex-column align-items-end gap-1">' +
                '<span class="merit-badge" style="background:var(--clr-primary-container);color:var(--clr-on-primary-container);">' + total + ' Entries</span>' +
                '<span class="badge rounded-pill px-2 py-1" style="background:var(--clr-secondary-container);color:var(--clr-on-secondary-container);font-size:.7rem;">AY ' + yearLabel + '</span>' +
                publishedBadge +
                '<button class="btn btn-sm fw-bold btn-toggle-ml-publish d-flex align-items-center gap-1 mt-1" data-ml-id="' + ml.id + '" style="font-size:.7rem;padding:2px 10px;' + (ml.published ? 'background:rgba(186,26,26,0.08);color:var(--clr-error);border:1px solid rgba(186,26,26,0.2);' : 'background:rgba(0,107,88,0.1);color:var(--clr-primary);border:1px solid rgba(0,107,88,0.2);') + '">' +
                '<span class="material-symbols-outlined" style="font-size:13px;">' + (ml.published ? 'unpublished' : 'publish') + '</span>' +
                (ml.published ? 'Unpublish' : 'Publish') + '</button>' +
                '</div>' +
                '</div>' +
                '<div class="d-flex gap-3 flex-wrap">' +
                '<span class="status-pill admitted">✓ Matched: ' + matched + '</span>' +
                (unmatched > 0 ? '<span class="status-pill not-appeared">✗ Not Found: ' + unmatched + '</span>' : '') +
                '<span class="status-pill pending">📋 Registered: ' + regCount + '</span>' +
                '</div></div></div>'
            );
            }); // end groups[prog]
        }); // end groupOrder
    }

    var currentMlEntries = [];
    var currentMl = null;

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
                (function() {
                    if (!s) return '<td class="cell-number">—</td>';
                    var obt = 0, tot = 0;
                    $.each(s.subjects || [], function(_, sub) { obt += sub.marks; tot += sub.total; });
                    return '<td class="cell-number">' + obt + ' / ' + tot + '</td>';
                })() +
                '<td>' + (currentMl ? (currentMl.program || '—') : '—') + '</td>' +
                '<td>' + (currentMl ? (currentMl.course || '—') : '—') + '</td>' +
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
        $.each(getActiveMeritLists(), function(_, m) { if (m.id === mlId) ml = m; });
        if (!ml) return;

        currentMlEntries = ml.entries;
        currentMl = ml;

        $('#mlDetailName').text(ml.name);
        $('#mlDetailDate').text(ml.date);
        $('#mlDetailTotal').text(ml.entries.length);
        $('#mlDetailSession').text(ml.year ? ('AY ' + ml.year) : (ml.session || '—'));
        $('#mlDetailProgram').text(ml.course ? (ml.program + ' — ' + ml.course) : (ml.program || '—'));
        $('#btnDeleteMeritList').data('ml-id', mlId);

        // Set publish toggle button state
        var $pub = $('#btnToggleMlPublish').data('ml-id', mlId);
        if (ml.published) {
            $pub.html('<span class="material-symbols-outlined" style="font-size:16px;">unpublished</span>Unpublish')
                .css({ background: 'rgba(186,26,26,0.08)', color: 'var(--clr-error)', border: '1px solid rgba(186,26,26,0.2)' });
        } else {
            $pub.html('<span class="material-symbols-outlined" style="font-size:16px;">publish</span>Publish')
                .css({ background: 'rgba(0,107,88,0.1)', color: 'var(--clr-primary)', border: '1px solid rgba(0,107,88,0.2)' });
        }

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
    // 9b. COUNSELLING SESSIONS DASHBOARD & DETAIL
    // ============================================================

    function renderCounsellingDashboard() {
        populateYearDropdowns();
        var filterYear = $('#csFilterYear').val() || 'all';

        // Filter to current college
        var visible = $.grep(COUNSELLING_SESSIONS, function(cs) {
            // Allow null/undefined collegeId for backward compat
            if (COLLEGE_INFO.id && cs.collegeId != null && String(cs.collegeId) !== String(COLLEGE_INFO.id)) return false;
            if (filterYear !== 'all') {
                var csYear = cs.year || 0;
                if (String(csYear) !== String(filterYear)) return false;
            }
            return true;
        });

        var $container = $('#counsellingCards').empty();
        $('#csManageCount').text(visible.length + ' session' + (visible.length !== 1 ? 's' : ''));

        if (visible.length === 0) {
            $container.append(
                '<div class="col-12 text-center py-5">' +
                '<span class="material-symbols-outlined d-block mb-2" style="font-size:48px;color:var(--clr-outline-variant);">groups</span>' +
                '<p class="text-on-surface-variant fw-semibold mb-1">No counselling sessions found.</p>' +
                '<a href="#" class="btn btn-primary btn-sm fw-bold btn-goto-section" data-section="section-ca-counselling-upload">Create First Session</a>' +
                '</div>'
            );
            return;
        }

        $.each(visible, function(_, cs) {
            var total   = (cs.entries || []).length;
            var matched = 0, unmatched = 0, regCount = 0;
            $.each(cs.entries || [], function(_, entry) {
                var s = getStudentByApp(entry.appNo);
                if (s) matched++; else unmatched++;
                if (REGISTRATIONS[entry.appNo] && REGISTRATIONS[entry.appNo].feeCollected) regCount++;
            });
            var yearLabel = cs.year ? cs.year + '–' + (cs.year + 1) : '—';
            var startFmt = cs.counsellingStart ? formatYmdToDisplay(cs.counsellingStart) : 'TBA';
            var endFmt   = cs.counsellingEnd   ? formatYmdToDisplay(cs.counsellingEnd)   : 'TBA';
            var counselDates = startFmt + ' – ' + endFmt;

            var publishedBadge = cs.published
                ? '<span class="badge rounded-pill" style="background:rgba(107,217,188,0.25);color:var(--clr-on-primary-container);font-size:.7rem;">Published</span>'
                : '<span class="badge rounded-pill" style="background:rgba(186,26,26,0.1);color:var(--clr-error);font-size:.7rem;">Draft</span>';

            $container.append(
                '<div class="col-12 col-md-6 col-xl-4">' +
                '<div class="card p-4 rounded-3 h-100 cursor-pointer cs-manage-card" data-cs-id="' + cs.id + '" style="cursor:pointer;">' +
                '<div class="d-flex justify-content-between align-items-start mb-3">' +
                '<div class="flex-grow-1 me-2">' +
                '<h6 class="fw-bold mb-1">' + $('<span>').text(cs.name).html() + '</h6>' +
                '<p class="small text-on-surface-variant mb-0">Counselling: ' + counselDates + '</p>' +
                '</div>' +
                '<div class="d-flex flex-column align-items-end gap-1">' +
                '<span class="merit-badge" style="background:var(--clr-primary-container);color:var(--clr-on-primary-container);">' + total + ' Entries</span>' +
                '<span class="badge rounded-pill px-2 py-1" style="background:var(--clr-secondary-container);color:var(--clr-on-secondary-container);font-size:.7rem;">AY ' + yearLabel + '</span>' +
                publishedBadge +
                '<button class="btn btn-sm fw-bold btn-toggle-cs-publish d-flex align-items-center gap-1 mt-1" data-cs-id="' + cs.id + '" style="font-size:.7rem;padding:2px 10px;' + (cs.published ? 'background:rgba(186,26,26,0.08);color:var(--clr-error);border:1px solid rgba(186,26,26,0.2);' : 'background:rgba(0,107,88,0.1);color:var(--clr-primary);border:1px solid rgba(0,107,88,0.2);') + '">' +
                '<span class="material-symbols-outlined" style="font-size:13px;">' + (cs.published ? 'unpublished' : 'publish') + '</span>' +
                (cs.published ? 'Unpublish' : 'Publish') + '</button>' +
                '</div></div>' +
                '<div class="d-flex gap-3 flex-wrap">' +
                '<span class="status-pill admitted">✓ Matched: ' + matched + '</span>' +
                (unmatched > 0 ? '<span class="status-pill not-appeared">✗ Not Found: ' + unmatched + '</span>' : '') +
                '<span class="status-pill pending">📋 Registered: ' + regCount + '</span>' +
                '</div></div></div>'
            );
        });
    }

    var currentCsEntries = [];

    function renderCsDetailTable() {
        var q      = ($('#csDetailSearch').val() || '').toLowerCase().trim();
        var linked = $('#csDetailFilterLinked').val() || 'all';

        var $tbody = $('#csDetailBody').empty();
        var shown = 0;

        $.each(currentCsEntries, function(rank, entry) {
            var s = getStudentByApp(entry.appNo);
            var isMatched = !!s;
            var isReg = !!(REGISTRATIONS[entry.appNo] && REGISTRATIONS[entry.appNo].feeCollected);

            if (linked === 'linked'     && !isMatched)  return;
            if (linked === 'notfound'   && isMatched)   return;
            if (linked === 'registered' && !isReg)      return;
            if (q) {
                var name = s ? s.name.toLowerCase() : '';
                if (entry.appNo.toLowerCase().indexOf(q) < 0 && name.indexOf(q) < 0) return;
            }

            shown++;
            var linkedBadge = isMatched
                ? '<span class="badge rounded-pill px-2 py-1" style="background:var(--clr-primary-container);color:var(--clr-on-primary-container);">Matched</span>'
                : '<span class="badge rounded-pill px-2 py-1" style="background:rgba(186,26,26,0.1);color:var(--clr-error);">Not Found</span>';
            var regBadge = isReg
                ? '<span class="badge rounded-pill px-2 py-1" style="background:var(--clr-tertiary-container);color:var(--clr-on-tertiary-container);">Registered</span>'
                : (isMatched ? '<span class="text-on-surface-variant small">—</span>' : '');

            var marksCell = (function() {
                if (!s) return '—';
                var obt = 0, tot = 0;
                $.each(s.subjects || [], function(_, sub) { obt += sub.marks; tot += sub.total; });
                return obt + ' / ' + tot;
            })();

            $tbody.append(
                '<tr' + (!isMatched ? ' style="opacity:0.6;"' : '') + '>' +
                '<td class="cell-number">' + shown + '</td>' +
                '<td style="font-family:monospace;" class="fw-semibold">' + $('<span>').text(entry.appNo).html() + '</td>' +
                '<td>' + (s ? $('<span>').text(s.name).html() : '<span class="text-on-surface-variant">—</span>') + '</td>' +
                '<td class="cell-number">' + marksCell + '</td>' +
                '<td>' + linkedBadge + '</td>' +
                '<td>' + regBadge + '</td>' +
                '</tr>'
            );
        });

        $('#csDetailCount').text(shown + ' of ' + currentCsEntries.length);
        $('#csDetailEmpty').toggle(shown === 0);
    }

    function openCounsellingDetail(csId) {
        var cs = null;
        $.each(COUNSELLING_SESSIONS, function(_, c) { if (c.id === csId) cs = c; });
        if (!cs) return;

        currentCsEntries = cs.entries || [];

        $('#csDetailName').text(cs.name);
        $('#csDetailYear').text(cs.year || '—');
        var startFmt = cs.counsellingStart ? formatYmdToDisplay(cs.counsellingStart) : 'TBA';
        var endFmt   = cs.counsellingEnd   ? formatYmdToDisplay(cs.counsellingEnd)   : 'TBA';
        $('#csDetailDates').text(startFmt + ' – ' + endFmt);
        $('#csDetailTotal').text(currentCsEntries.length);
        $('#btnDeleteCounselling').data('cs-id', csId);

        // Publish toggle button state
        var $pub = $('#btnToggleCsPublish').data('cs-id', csId);
        if (cs.published) {
            $pub.html('<span class="material-symbols-outlined" style="font-size:16px;">unpublished</span>Unpublish')
                .css({ background: 'rgba(186,26,26,0.08)', color: 'var(--clr-error)', border: '1px solid rgba(186,26,26,0.2)' });
        } else {
            $pub.html('<span class="material-symbols-outlined" style="font-size:16px;">publish</span>Publish')
                .css({ background: 'rgba(0,107,88,0.1)', color: 'var(--clr-primary)', border: '1px solid rgba(0,107,88,0.2)' });
        }

        // Reset filters
        $('#csDetailSearch').val('');
        $('#csDetailFilterLinked').val('all');

        // Summary stats
        var matched = 0, unmatched = 0, regCount = 0;
        $.each(currentCsEntries, function(_, entry) {
            var s = getStudentByApp(entry.appNo);
            if (s) matched++; else unmatched++;
            if (REGISTRATIONS[entry.appNo] && REGISTRATIONS[entry.appNo].feeCollected) regCount++;
        });
        $('#csSummaryTotal').text(currentCsEntries.length);
        $('#csSummaryMatched').text(matched);
        $('#csSummaryUnmatched').text(unmatched);
        $('#csSummaryRegistered').text(regCount);

        renderCsDetailTable();
        showSection('section-ca-counselling-detail');
    }

    // ============================================================
    // 10. ALL APPLICATIONS
    // ============================================================

    var allAppsActiveView = 'all';
    var allAppsLastFiltered = [];

    function getStudentSession(s) {
        var m = s.appNo.match(/SK-(\d{4})-/);
        if (m) {
            return m[1]; // e.g. '2026'
        }
        return 'Unknown';
    }

    function isStudentMeritListed(appNo) {
        var aml = getActiveMeritLists();
        for (var i = 0; i < aml.length; i++) {
            for (var j = 0; j < aml[i].entries.length; j++) {
                if (aml[i].entries[j].appNo === appNo) return true;
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
        var basePassed = $.grep(getActiveStudents(), baseFilter);
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

            // Program vs Course — show allotted if seat is allotted, else show preferences
            var programLabel = courseToProgramLabel(getCourseName(s.course));
            var prefCourseCell;
            if (appStatus === 'registered' || appStatus === 'completed') {
                // Seat allotted — show pref1 as the allotted course with indicator
                var allottedCourse = s.pref1 || getCourseName(s.course);
                prefCourseCell = '<span class="badge rounded-pill px-2 py-1 d-inline-flex align-items-center gap-1" style="background:rgba(63,102,90,0.15);color:var(--clr-secondary);font-size:.72rem;font-weight:600;">' +
                    '<span class="material-symbols-outlined" style="font-size:12px;">check_circle</span>' + allottedCourse + '</span>';
            } else {
                // Not yet allotted — show all preferences
                var prefParts = [];
                if (s.pref1) prefParts.push('<span class="d-block" style="font-size:.72rem;"><span class="text-on-surface-variant me-1" style="font-size:.65rem;">P1</span>' + s.pref1 + '</span>');
                if (s.pref2) prefParts.push('<span class="d-block" style="font-size:.72rem;color:var(--clr-on-surface-variant);"><span class="text-on-surface-variant me-1" style="font-size:.65rem;">P2</span>' + s.pref2 + '</span>');
                if (s.pref3) prefParts.push('<span class="d-block" style="font-size:.72rem;color:var(--clr-on-surface-variant);"><span class="text-on-surface-variant me-1" style="font-size:.65rem;">P3</span>' + s.pref3 + '</span>');
                prefCourseCell = prefParts.length ? prefParts.join('') : '<span class="text-on-surface-variant" style="font-size:.75rem;">—</span>';
            }

            $tbody.append(
                '<tr>' +
                '<td class="text-on-surface-variant small">' + (i + 1) + '</td>' +
                '<td style="font-family:monospace;color:var(--clr-primary);font-size:.8rem;white-space:nowrap;">' + s.appNo + '</td>' +
                '<td>' +
                    '<span class="fw-semibold d-block">' + s.name +
                    (isStudentRecommendation(s.appNo) ? ' <span class="badge rounded-pill ms-1" style="background:rgba(186,26,26,0.1);color:var(--clr-error);font-size:.62rem;vertical-align:middle;"><span class="material-symbols-outlined" style="font-size:10px;vertical-align:-1px;">star</span> Recommendation</span>' : '') +
                    '</span>' +
                    '<span class="text-on-surface-variant" style="font-size:.72rem;">' + s.board + ' · ' + s.district + '</span>' +
                    '<span class="badge rounded-pill ms-0 mt-1 d-inline-block" style="background:var(--clr-secondary-container);color:var(--clr-on-secondary-container);font-size:.6rem;" title="Admission Schedule ID: ' + COLLEGE_INFO.id + '_' + getStudentSession(s) + '">AY ' + getStudentSession(s) + '</span>' +
                '</td>' +
                '<td class="small fw-semibold">' + programLabel + '</td>' +
                '<td class="small">' + prefCourseCell + '</td>' +
                '<td class="cell-number" style="font-size:.8rem;">' + marksCell + '</td>' +
                '<td class="small">' + s.gender + '</td>' +
                '<td class="small">' + s.community + '</td>' +
                '<td>' + mlHtml + '</td>' +
                '<td style="min-width:130px;">' + getDocStatusHtml(s.appNo) + '</td>' +
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
            '#', 'Admission Year', 'App No', 'Roll No', 'Name', 'Date of Birth', 'Gender',
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
        // Export modal: cascade program → course
        $(document).on('change', '#expFilterProgram', function () {
            var prog = $(this).val();
            var $course = $('#expFilterCourse');
            if (!prog || prog === 'all') {
                $course.prop('disabled', true).html('<option value="all">&mdash; All Courses &mdash;</option>');
            } else {
                var catalog = getProgramCatalog();
                var courses = catalog[prog] || [];
                var opts = '<option value="all">All Courses</option>';
                $.each(courses, function(_, c) { opts += '<option value="' + c.id + '">' + c.name + '</option>'; });
                $course.prop('disabled', false).html(opts);
            }
            updateExportEstimate();
        });

        // Export modal: update estimate count on any filter change
        $(document).on('change', '#expFilterCourse, #expFilterYear, #expFilterStatus, #expFilterGender, #expFilterCommunity, #expFilterDistrict, #expFilterBoard', updateExportEstimate);

        // Update estimate when modal opens
        $('#exportAppsModal').on('show.bs.modal', function () {
            // Reset form
            $('#expFilterProgram, #expFilterCourse, #expFilterYear, #expFilterStatus, #expFilterGender, #expFilterCommunity, #expFilterDistrict, #expFilterBoard').val('all');
            $('#expFilterCourse').prop('disabled', true).html('<option value="all">&mdash; All Courses &mdash;</option>');
            updateExportEstimate();
        });

        $(document).on('click', '#btnConfirmExportApps', function () {
            exportAppsCSVFiltered();
            bootstrap.Modal.getInstance(document.getElementById('exportAppsModal')).hide();
        });
    }

    function getExportFilters() {
        return {
            program:   $('#expFilterProgram').val() || 'all',
            course:    $('#expFilterCourse').val() || 'all',
            year:      $('#expFilterYear').val() || 'all',
            status:    $('#expFilterStatus').val() || 'all',
            gender:    $('#expFilterGender').val() || 'all',
            community: $('#expFilterCommunity').val() || 'all',
            district:  $('#expFilterDistrict').val() || 'all',
            board:     $('#expFilterBoard').val() || 'all'
        };
    }

    function applyExportFilters(students) {
        var f = getExportFilters();
        return $.grep(students, function(s) {
            if (f.program !== 'all') {
                var prog = courseToProgramLabel(getCourseName(s.course));
                if (prog !== f.program) return false;
            }
            if (f.course !== 'all' && s.course !== f.course) return false;
            if (f.year !== 'all' && String(getStudentSession(s)) !== f.year) return false;
            if (f.status !== 'all' && getStudentAppStatus(s.appNo) !== f.status) return false;
            if (f.gender !== 'all' && (s.gender || '').toLowerCase() !== f.gender.toLowerCase()) return false;
            if (f.community !== 'all' && s.community !== f.community) return false;
            if (f.district !== 'all' && s.district !== f.district) return false;
            if (f.board !== 'all' && s.board !== f.board) return false;
            return true;
        });
    }

    function updateExportEstimate() {
        var count = applyExportFilters(getActiveStudents()).length;
        $('#expEstimateCount').text(count + ' record' + (count !== 1 ? 's' : ''));
    }

    // Builds a SheetJS worksheet from an array of student objects.
    // Subject columns are scoped to the students in this set.
    function buildExportSheet(students) {
        var subjectNames = [];
        var subjectIndex = {};
        $.each(students, function(_, s) {
            $.each(s.subjects || [], function(_, sub) {
                if (!subjectIndex.hasOwnProperty(sub.name)) {
                    subjectIndex[sub.name] = subjectNames.length;
                    subjectNames.push(sub.name);
                }
            });
        });

        var header = [
            '#', 'Admission Year', 'App No', 'Roll No', 'Name', 'Date of Birth', 'Gender',
            'Community', 'COI No.', 'PWD', 'Mobile', 'Email',
            'Father Name', 'Father Contact', 'Mother Name',
            'District', 'State', 'Pincode', 'Permanent Address',
            'Board', 'Stream', 'Aggregate %'
        ];
        $.each(subjectNames, function(_, name) {
            header.push(name + ' (Marks)');
            header.push(name + ' (Max)');
        });
        header = header.concat([
            'Program Applied', 'Preference 1', 'Preference 2', 'Preference 3',
            'App Fee Txn', 'App Fee Amount (₹)', 'App Fee Status', 'App Fee Method',
            'Merit Lists', 'Admission Status', 'Recommendation'
        ]);

        var statusLabelMap = {
            'applied': 'Applied', 'merit-listed': 'Merit Listed',
            'verified': 'Verified', 'registered': 'Seat Allotted', 'completed': 'Fee Collected'
        };

        var rows = [header];
        $.each(students, function(idx, s) {
            var subMarks = {}, subTotal = {};
            $.each(s.subjects || [], function(_, sub) { subMarks[sub.name] = sub.marks; subTotal[sub.name] = sub.total; });

            var mls = getMeritListsForApp(s.appNo);
            var mlText = mls.length ? $.map(mls, function(m) { return m.name; }).join(' | ') : '';
            var statusLabel = statusLabelMap[getStudentAppStatus(s.appNo)] || 'Applied';
            var fee = s.appFee || {};

            var row = [
                idx + 1, getStudentSession(s), s.appNo, s.rollNo || '', s.name, s.dob || '',
                s.gender, s.community, s.coiNumber || '', s.pwd || '',
                s.mobile || '', s.email || '',
                s.fatherName || '', s.fatherContact || '', s.motherName || '',
                s.district || '', s.state || '', s.pincode || '', s.permanentAddress || '',
                s.board, s.stream || '', s.marks
            ];
            $.each(subjectNames, function(_, name) {
                row.push(subMarks.hasOwnProperty(name) ? subMarks[name] : '');
                row.push(subTotal.hasOwnProperty(name) ? subTotal[name] : '');
            });
            row = row.concat([
                getCourseName(s.course), s.pref1 || '', s.pref2 || '', s.pref3 || '',
                fee.txn || '', fee.amount || '', fee.status || '', fee.method || '',
                mlText, statusLabel,
                isStudentRecommendation(s.appNo) ? 'Yes' : 'No'
            ]);
            rows.push(row);
        });

        return XLSX.utils.aoa_to_sheet(rows);
    }

    function exportAppsCSVFiltered() {
        var data = applyExportFilters(getActiveStudents());
        if (!data.length) { showToast('No records match the selected filters.', 'warning'); return; }

        var f = getExportFilters();
        // Multi-sheet when no specific course is pinned (All Programs or All Courses)
        var useMultiSheet = (f.course === 'all');

        var wb = XLSX.utils.book_new();

        if (useMultiSheet) {
            // Group students by course
            var groups = {};
            var groupOrder = [];
            $.each(data, function(_, s) {
                var key = s.course || '__unknown__';
                if (!groups[key]) { groups[key] = []; groupOrder.push(key); }
                groups[key].push(s);
            });

            // If more than one course, add an "All" summary sheet first
            if (groupOrder.length > 1) {
                XLSX.utils.book_append_sheet(wb, buildExportSheet(data), 'All');
            }

            // One sheet per course
            $.each(groupOrder, function(_, courseId) {
                var courseName = courseId === '__unknown__' ? 'Other' : (getCourseName(courseId) || 'Other');
                // Excel sheet names: max 31 chars, no special chars
                var sheetName = courseName.replace(/[:\\\/?*\[\]]/g, '').substring(0, 31);
                XLSX.utils.book_append_sheet(wb, buildExportSheet(groups[courseId]), sheetName);
            });
        } else {
            XLSX.utils.book_append_sheet(wb, buildExportSheet(data), 'Applications');
        }

        var nameParts = ['applications'];
        if (f.program !== 'all') nameParts.push(f.program);
        if (f.course !== 'all') nameParts.push(getCourseName(f.course));
        if (f.year !== 'all') nameParts.push(f.year);
        var filename = nameParts.join('_').replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_\-]/g, '') + '_' + new Date().toISOString().slice(0, 10) + '.xlsx';

        XLSX.writeFile(wb, filename);
    }

    // ============================================================
    // 11. TOAST
    // ============================================================

    function formatYmdToDisplay(ymd) {
        if (!ymd) return '';
        var parts = ymd.split('-');
        if (parts.length !== 3) return ymd;
        var dt = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        if (isNaN(dt.getTime())) return ymd;
        return dt.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    }

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

        // (Legacy selective window handlers removed — replaced by Override Windows system)

        // Admission schedule: cascade program → course for selective program change (legacy selective rows removed)

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

        // MOOCS elective toggle
        $(document).on('change', '.elective-check[value="MOOCS"]', function () {
            if ($(this).is(':checked')) {
                $('#moocsNameWrap').show().find('#regMoocsName').focus();
            } else {
                $('#moocsNameWrap').hide();
                $('#regMoocsName').val('');
            }
        });
        $(document).on('click', '#btnClearProspectus', function () {
            $('#cfgProspectusFile').val('');
            $('#cfgProspectusName').val('');
        });

        // Admission schedule: save config
        $(document).on('click', '#btnSaveScheduleConfig', function () {
            var year = new Date().getFullYear();
            var schedKey = String(COLLEGE_INFO.id) + '_' + year;
            var existing = ADMISSION_SCHEDULES[schedKey] || {};
            var cfg = {
                collegeId: COLLEGE_INFO.id,
                year: year,
                status: 'active',
                appFee: parseFloat($('#cfgAppFee').val()) || 0,
                prospectusName: ($('#cfgProspectusName').val() || '').trim(),
                defaultWindow: {
                    appOpen: $('#cfgAppOpen').val() || '',
                    appClose: $('#cfgAppClose').val() || ''
                },
                overrides: existing.overrides || [],
                inviteLinks: existing.inviteLinks || [],
                updatedAt: new Date().toISOString()
            };
            ADMISSION_SCHEDULES[schedKey] = cfg;
            saveAdmissionSchedules();
            scheduleUserEditing = false;
            editingScheduleKey = schedKey;
            renderScheduleCards();
            updateScheduleFormState();
            showToast('Session configuration saved');
        });

        // Save notification independently
        $(document).on('click', '#btnSaveNotification', function () {
            var year = new Date().getFullYear();
            var text = ($('#cfgNotification').val() || '').trim();
            saveNotification(COLLEGE_INFO.id, year, text);
            var timeStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
            $('#notifSavedAt').text(timeStr);
            $('#notifSavedIndicator').show();
            showToast('Notification updated');
        });

        // Admission schedule: edit
        $(document).on('click', '.btn-edit-schedule', function () {
            var key = $(this).data('key');
            if (!ADMISSION_SCHEDULES[key]) return;
            scheduleUserEditing = true;
            populateScheduleForm(ADMISSION_SCHEDULES[key], key);
            updateScheduleFormState();
            $('html, body').scrollTop(0);
        });

        // Admission schedule: delete
        $(document).on('click', '.btn-delete-schedule', function () {
            var key = $(this).data('key');
            if (!ADMISSION_SCHEDULES[key]) return;
            var yr = ADMISSION_SCHEDULES[key].year || ADMISSION_SCHEDULES[key].session;
            if (!confirm('Delete schedule for Admission Year ' + yr + '?')) return;
            delete ADMISSION_SCHEDULES[key];
            if (editingScheduleKey === key) { editingScheduleKey = null; }
            saveAdmissionSchedules();
            renderAdmissionScheduleSection();
            showToast('Session schedule deleted', 'warning');
        });

        // ── Override windows ──

        // Show/hide override form
        $(document).on('click', '#btnShowAddOverride', function () {
            var $form = $('#overrideAddForm');
            $form.toggle();
            if ($form.is(':visible')) {
                // Pre-fill date hint
                var sched = getCollegeSchedule();
                var minDate = sched && sched.defaultWindow && sched.defaultWindow.appClose ? sched.defaultWindow.appClose : '';
                if (minDate) {
                    $('#ovrEndDate').attr('min', minDate);
                    var activeDate = getActiveOverrideEndDate(sched ? sched.overrides : []);
                    if (activeDate) {
                        $('#ovrEndDate').val(activeDate);
                        $('#ovrDateHint').text('Active overrides exist — new override end date must match: ' + activeDate + '.');
                        $('#ovrEndDate').prop('readonly', true);
                    } else {
                        $('#ovrEndDate').val('').prop('readonly', false);
                        $('#ovrDateHint').text('Override end date must be on or after default closing date (' + minDate + ').');
                    }
                }
            }
        });
        $(document).on('click', '#btnCancelOverride', function () {
            $('#overrideAddForm').hide();
        });

        // Cascade program → course in override form
        $(document).on('change', '#ovrProgram', function () {
            var program = $(this).val();
            var $course = $('#ovrCourse').empty().append('<option value="">All Courses in Program</option>');
            if (program) {
                $.each(COURSES, function(_, c) {
                    if (c.name.indexOf(program) >= 0 || (program === 'B.Com' && c.id === 'bcom') ||
                        (program === 'B.A' && (c.id === 'ba-polsci' || c.id === 'ba-eng')) ||
                        (program === 'B.Sc' && c.id === 'bsc-phy')) {
                        $course.append('<option value="' + c.id + '">' + c.name + '</option>');
                    }
                });
            }
        });

        // Save override
        $(document).on('click', '#btnSaveOverride', function () {
            var schedKey = editingScheduleKey;
            if (!schedKey) { showToast('Save the session configuration first before adding overrides.', 'warning'); return; }
            var sched = ADMISSION_SCHEDULES[schedKey];
            if (!sched) return;

            var program = $('#ovrProgram').val();
            var courseId = $('#ovrCourse').val();
            var endDate = $('#ovrEndDate').val();
            if (!endDate) { showToast('Override closing date is required.', 'warning'); return; }

            var minDate = sched.defaultWindow && sched.defaultWindow.appClose;
            if (minDate && endDate < minDate) {
                showToast('Override end date cannot be before the default closing date (' + minDate + ').', 'warning'); return;
            }

            var activeDate = getActiveOverrideEndDate(sched.overrides || []);
            if (activeDate && endDate !== activeDate) {
                showToast('Active overrides exist. New override end date must match: ' + activeDate + '.', 'warning'); return;
            }

            var courseName = courseId ? (getCourseName(courseId) || courseId) : '';
            var newOvr = {
                id: 'OVR-' + Date.now(),
                program: program || '',
                courseId: courseId || '',
                courseName: courseName,
                endDate: endDate,
                createdAt: new Date().toISOString()
            };

            sched.overrides = sched.overrides || [];
            sched.overrides.push(newOvr);
            sched.updatedAt = new Date().toISOString();
            saveAdmissionSchedules();
            renderOverrideList(sched.overrides, schedKey);
            renderScheduleCards();
            $('#overrideAddForm').hide();
            showToast('Override window added');
        });

        // Delete override
        $(document).on('click', '.btn-delete-override', function () {
            var key = $(this).data('key');
            var idx = parseInt($(this).data('idx'), 10);
            var sched = ADMISSION_SCHEDULES[key];
            if (!sched || !sched.overrides) return;
            sched.overrides.splice(idx, 1);
            sched.updatedAt = new Date().toISOString();
            saveAdmissionSchedules();
            renderOverrideList(sched.overrides, key);
            renderScheduleCards();
            showToast('Override removed', 'warning');
        });

        // ── Invite links ──

        $(document).on('click', '#btnShowInviteForm', function () {
            $('#inviteAddForm').toggle();
            if ($('#inviteAddForm').is(':visible')) $('#inviteLinkLabel').focus();
        });
        $(document).on('click', '#btnCancelInvite', function () {
            $('#inviteAddForm').hide();
        });

        $(document).on('click', '#btnGenerateInvite', function () {
            var schedKey = editingScheduleKey;
            if (!schedKey) { showToast('Save the session configuration first.', 'warning'); return; }
            var sched = ADMISSION_SCHEDULES[schedKey];
            if (!sched) return;
            var label = ($('#inviteLinkLabel').val() || '').trim();
            var validUntil = ($('#inviteLinkValidUntil').val() || '').trim();
            var lnk = { token: generateInviteToken(), label: label, validUntil: validUntil, createdAt: new Date().toISOString(), used: false };
            sched.inviteLinks = sched.inviteLinks || [];
            sched.inviteLinks.push(lnk);
            saveAdmissionSchedules();
            renderInviteLinksList(sched.inviteLinks, schedKey);
            $('#inviteLinkLabel').val('');
            $('#inviteLinkValidUntil').val('');
            $('#inviteAddForm').hide();
            showToast('Invite link generated');
        });

        $(document).on('click', '.btn-delete-invite', function () {
            var key = $(this).data('key');
            var idx = parseInt($(this).data('idx'), 10);
            var sched = ADMISSION_SCHEDULES[key];
            if (!sched || !sched.inviteLinks) return;
            sched.inviteLinks.splice(idx, 1);
            saveAdmissionSchedules();
            renderInviteLinksList(sched.inviteLinks, key);
            showToast('Invite link revoked', 'warning');
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

            // Warn if marks were updated by admin before proceeding
            if (reg.marksUpdated) {
                var proceed = confirm('⚠️ Marks Updated by Admin\n\nThe Class XII marks for this student have been modified by an admin. Please review the updated marks carefully before registering.\n\nClick OK to proceed with registration, or Cancel to review the marks again.');
                if (!proceed) return;
            }

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
            reg.minorSubject = $('#regMinorSubject').val().trim();
            reg.moocsCourseName = $('.elective-check[value="MOOCS"]').is(':checked') ? ($('#regMoocsName').val().trim()) : '';
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
        $(document).on('change', '#mlFilterYear, #mlFilterProgram', function () {
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

        // Goto-section shortcut links (used inside Configured Session merit list summary)
        $(document).on('click', '.btn-goto-section', function (e) {
            e.preventDefault();
            var target = $(this).data('section');
            if (target) showSection(target);
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

        // Publish / Unpublish from detail page
        $(document).on('click', '#btnToggleMlPublish', function () {
            var mlId = $(this).data('ml-id');
            var ml = null;
            $.each(MERIT_LISTS, function(_, m) { if (m.id === mlId) { ml = m; return false; } });
            if (!ml) return;
            ml.published = !ml.published;
            saveMeritLists();
            // Refresh button state
            var $pub = $(this);
            if (ml.published) {
                $pub.html('<span class="material-symbols-outlined" style="font-size:16px;">unpublished</span>Unpublish')
                    .css({ background: 'rgba(186,26,26,0.08)', color: 'var(--clr-error)', border: '1px solid rgba(186,26,26,0.2)' });
                showToast('Merit list published');
            } else {
                $pub.html('<span class="material-symbols-outlined" style="font-size:16px;">publish</span>Publish')
                    .css({ background: 'rgba(0,107,88,0.1)', color: 'var(--clr-primary)', border: '1px solid rgba(0,107,88,0.2)' });
                showToast('Merit list unpublished', 'warning');
            }
        });

        // Publish / Unpublish from manage cards or Configured Session (stop propagation so card click doesn't fire)
        $(document).on('click', '.btn-toggle-ml-publish', function (e) {
            e.stopPropagation();
            var mlId = $(this).data('ml-id');
            var ml = null;
            $.each(MERIT_LISTS, function(_, m) { if (m.id === mlId) { ml = m; return false; } });
            if (!ml) return;
            ml.published = !ml.published;
            saveMeritLists();
            // Refresh whichever views are visible
            renderMeritListDashboard();
            renderScheduleCards();
            showToast(ml.published ? 'Merit list published' : 'Merit list unpublished', ml.published ? 'success' : 'warning');
        });

        // Cascade: program → course for merit upload
        $(document).on('change', '#mlUploadProgram', function () {
            var prog = $(this).val();
            var $course = $('#mlUploadCourse');
            if (!prog) {
                $course.prop('disabled', true).html('<option value="">— Select Program First —</option>');
                return;
            }
            var catalog = getProgramCatalog();
            var courses = catalog[prog] || [];
            var opts = '<option value="">— Select Course —</option>';
            $.each(courses, function(_, c) { opts += '<option value="' + c.name + '">' + c.name + '</option>'; });
            $course.prop('disabled', false).html(opts);
        });

        // Validate merit list upload
        var pendingEntries = [];

        function processUploadedRows(rows) {
            pendingEntries = [];
            var matched = 0, unmatched = 0;
            var $tbody = $('#mlPreviewBody').empty();

            $.each(rows, function(i, row) {
                var appNo = String(row[0] || '').trim();
                if (!appNo) return;
                var s = getStudentByApp(appNo);
                var isMatched = !!s;
                if (isMatched) matched++; else unmatched++;

                pendingEntries.push({ appNo: appNo, name: s ? s.name : '', marks: s ? s.marks : '' });

                var statusBadge = isMatched
                    ? '<span class="badge rounded-pill px-2 py-1" style="background:var(--clr-primary-container);color:var(--clr-on-primary-container);">Matched</span>'
                    : '<span class="badge rounded-pill px-2 py-1" style="background:rgba(186,26,26,0.1);color:var(--clr-error);">Not Found</span>';
                $tbody.append(
                    '<tr' + (!isMatched ? ' style="opacity:0.6;"' : '') + '>' +
                    '<td class="cell-number">' + (i + 1) + '</td>' +
                    '<td style="font-family:monospace;" class="fw-semibold">' + appNo + '</td>' +
                    '<td>' + (s ? s.name : '—') + '</td>' +
                    '<td class="cell-number">' + (s ? s.marks + '%' : '—') + '</td>' +
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
        // Parse & Preview pasted application IDs
        $(document).on('click', '#btnPreviewMerit', function () {
            var raw = $('#mlPasteIds').val() || '';
            if (!raw.trim()) { showToast('Please paste some application IDs first.', 'warning'); return; }
            var program = $('#mlUploadProgram').val() || '';
            var course  = $('#mlUploadCourse').val() || '';
            if (!program) { showToast('Please select a program first.', 'warning'); return; }
            if (!course)  { showToast('Please select a course first.', 'warning'); return; }

            // Parse: split by newlines and/or commas, trim, deduplicate
            var ids = [];
            var seen = {};
            $.each(raw.split(/[\n,]+/), function(_, part) {
                var id = part.trim();
                if (id && !seen[id]) { seen[id] = true; ids.push(id); }
            });

            // Match against STUDENTS
            var matched = 0, unmatched = 0;
            pendingEntries = [];
            var $tbody = $('#mlPreviewBody').empty();
            $.each(ids, function(i, id) {
                var student = getStudentByApp(id);
                if (student) {
                    matched++;
                    pendingEntries.push({ appNo: id, name: student.name, marks: student.marks || '' });
                    $tbody.append('<tr><td>' + (i + 1) + '</td><td><code>' + id + '</code></td><td>' + $('<span>').text(student.name).html() + '</td><td>' + (student.marks || '—') + '</td><td><span class="badge rounded-pill" style="background:rgba(107,217,188,0.2);color:var(--clr-on-primary-container);">Matched</span></td></tr>');
                } else {
                    unmatched++;
                    $tbody.append('<tr><td>' + (i + 1) + '</td><td><code>' + id + '</code></td><td class="text-on-surface-variant">Not found</td><td>—</td><td><span class="badge rounded-pill" style="background:rgba(186,26,26,0.1);color:var(--clr-error);">Not Found</span></td></tr>');
                }
            });

            $('#mlPreviewMatchCount').text(matched + ' matched');
            $('#mlPreviewUnmatchCount').text(unmatched);
            $('#mlPreviewUnmatchBadge').toggle(unmatched > 0);
            $('#mlPreviewArea').show();
            if (matched > 0) $('#btnUploadMerit').show();
            else $('#btnUploadMerit').hide();
        });

        // Save merit list
        $(document).on('click', '#btnUploadMerit', function () {
            var name       = ($('#mlUploadName').val() || '').trim();
            var date       = $('#mlUploadDate').val();
            var admStart   = $('#mlAdmStart').val();
            var admEnd     = $('#mlAdmEnd').val();
            var published  = $('#mlPublished').is(':checked');
            var program    = $('#mlUploadProgram').val() || '';
            var course     = $('#mlUploadCourse').val() || '';
            var year       = getCurrentAdmissionYear();

            if (!name)     { showToast('Please enter a merit list name.', 'warning'); return; }
            if (!date)     { showToast('Please select a publication date.', 'warning'); return; }
            if (!admStart) { showToast('Please enter admission start date.', 'warning'); return; }
            if (!admEnd)   { showToast('Please enter admission end date.', 'warning'); return; }
            if (!program)  { showToast('Please select a program.', 'warning'); return; }
            if (!course)   { showToast('Please select a course.', 'warning'); return; }
            if (pendingEntries.length === 0) { showToast('No entries to save. Parse & Preview first.', 'warning'); return; }

            var newId = 'ML-' + (MERIT_LISTS.length + 1).toString().padStart(3, '0');
            MERIT_LISTS.push({
                id: newId, name: name, date: date,
                admissionStart: admStart, admissionEnd: admEnd,
                year: year, published: published,
                program: program, course: course,
                collegeId: COLLEGE_INFO.id,
                entries: pendingEntries
            });
            saveMeritLists();

            // Reset form
            $('#mlUploadName').val('');
            $('#mlUploadDate').val('');
            $('#mlAdmStart').val('');
            $('#mlAdmEnd').val('');
            $('#mlPublished').prop('checked', true);
            $('#mlUploadProgram').val('');
            $('#mlUploadCourse').prop('disabled', true).html('<option value="">— Select Program First —</option>');
            $('#mlPasteIds').val('');
            $('#mlPreviewArea').hide();
            $('#btnUploadMerit').hide();
            pendingEntries = [];

            showToast('Merit list saved successfully!');
            showSection('section-ca-merit-manage');
        });

        // Cancel merit upload
        $(document).on('click', '#btnCancelMeritUpload', function () {
            showSection('section-ca-merit-manage');
        });

        // ── Counselling Section Events ────────────────────────────

        // Section nav: show manage when entering it
        $(document).on('click', '.sidebar-nav-item[data-section="section-ca-counselling-manage"]', function () {
            renderCounsellingDashboard();
        });

        // Filter change
        $(document).on('change', '#csFilterYear', function () { renderCounsellingDashboard(); });

        // Counselling card click → detail
        $(document).on('click', '.cs-manage-card', function (e) {
            if ($(e.target).closest('.btn-toggle-cs-publish').length) return;
            var csId = $(this).data('cs-id');
            openCounsellingDetail(csId);
        });

        // Preview counselling IDs
        var pendingCsEntries = [];
        $(document).on('click', '#btnPreviewCounselling', function () {
            var raw = $('#csPasteIds').val() || '';
            if (!raw.trim()) { showToast('Please paste some application IDs first.', 'warning'); return; }

            var ids = [];
            var seen = {};
            $.each(raw.split(/[\n,]+/), function(_, part) {
                var id = part.trim();
                if (id && !seen[id]) { seen[id] = true; ids.push(id); }
            });

            var matched = 0, unmatched = 0;
            pendingCsEntries = [];
            var $tbody = $('#csPreviewBody').empty();
            $.each(ids, function(i, id) {
                var student = getStudentByApp(id);
                if (student) {
                    matched++;
                    pendingCsEntries.push({ appNo: id, name: student.name, marks: student.marks || '' });
                    $tbody.append('<tr><td>' + (i + 1) + '</td><td><code>' + $('<span>').text(id).html() + '</code></td><td>' + $('<span>').text(student.name).html() + '</td><td>' + (student.marks || '—') + '</td><td><span class="badge rounded-pill" style="background:rgba(107,217,188,0.2);color:var(--clr-on-primary-container);">Matched</span></td></tr>');
                } else {
                    unmatched++;
                    pendingCsEntries.push({ appNo: id, name: '' });
                    $tbody.append('<tr style="opacity:0.6;"><td>' + (i + 1) + '</td><td><code>' + $('<span>').text(id).html() + '</code></td><td class="text-on-surface-variant">Not found</td><td>—</td><td><span class="badge rounded-pill" style="background:rgba(186,26,26,0.1);color:var(--clr-error);">Not Found</span></td></tr>');
                }
            });

            $('#csPreviewMatchCount').text(matched + ' matched');
            $('#csPreviewUnmatchCount').text(unmatched);
            $('#csPreviewUnmatchBadge').toggle(unmatched > 0);
            $('#csPreviewArea').show();
            if (matched > 0) $('#btnSaveCounselling').show();
            else $('#btnSaveCounselling').hide();
        });

        // Save counselling session
        $(document).on('click', '#btnSaveCounselling', function () {
            var name            = ($('#csUploadName').val() || '').trim();
            var date            = $('#csUploadDate').val();
            var counselStart    = $('#csCounsellingStart').val();
            var counselEnd      = $('#csCounsellingEnd').val();
            var published       = $('#csPublished').is(':checked');
            var year            = getCurrentAdmissionYear();

            if (!name)         { showToast('Please enter a session name.', 'warning'); return; }
            if (!date)         { showToast('Please select a publication date.', 'warning'); return; }
            if (!counselStart) { showToast('Please enter counselling start date.', 'warning'); return; }
            if (!counselEnd)   { showToast('Please enter counselling end date.', 'warning'); return; }
            if (pendingCsEntries.length === 0) { showToast('No entries to save. Preview first.', 'warning'); return; }

            var newId = 'CS-' + (COUNSELLING_SESSIONS.length + 1).toString().padStart(3, '0');
            COUNSELLING_SESSIONS.push({
                id: newId,
                name: name,
                date: date,
                counsellingStart: counselStart,
                counsellingEnd: counselEnd,
                year: year,
                published: published,
                collegeId: COLLEGE_INFO ? COLLEGE_INFO.id : null,
                entries: pendingCsEntries.slice()
            });
            saveCounsellingSessions();

            // Reset form
            $('#csUploadName').val('');
            $('#csUploadDate').val('');
            $('#csCounsellingStart').val('');
            $('#csCounsellingEnd').val('');
            $('#csPublished').prop('checked', true);
            $('#csPasteIds').val('');
            $('#csPreviewArea').hide();
            $('#btnSaveCounselling').hide();
            pendingCsEntries = [];

            showToast('Counselling session saved successfully!');
            renderCounsellingDashboard();
            showSection('section-ca-counselling-manage');
        });

        // Cancel counselling upload
        $(document).on('click', '#btnCancelCounselling', function () {
            showSection('section-ca-counselling-manage');
        });

        // Back to counselling manage from detail
        $(document).on('click', '#btnBackToCounselling', function () {
            showSection('section-ca-counselling-manage');
        });

        // Delete counselling session
        $(document).on('click', '#btnDeleteCounselling', function () {
            var csId = $(this).data('cs-id');
            if (!confirm('Delete this counselling session?')) return;
            COUNSELLING_SESSIONS = $.grep(COUNSELLING_SESSIONS, function(cs) { return cs.id !== csId; });
            saveCounsellingSessions();
            showToast('Counselling session deleted.', 'warning');
            renderCounsellingDashboard();
            showSection('section-ca-counselling-manage');
        });

        // Publish / Unpublish from detail page
        $(document).on('click', '#btnToggleCsPublish', function () {
            var csId = $(this).data('cs-id');
            var cs = null;
            $.each(COUNSELLING_SESSIONS, function(_, c) { if (c.id === csId) { cs = c; return false; } });
            if (!cs) return;
            cs.published = !cs.published;
            saveCounsellingSessions();
            var $pub = $(this);
            if (cs.published) {
                $pub.html('<span class="material-symbols-outlined" style="font-size:16px;">unpublished</span>Unpublish')
                    .css({ background: 'rgba(186,26,26,0.08)', color: 'var(--clr-error)', border: '1px solid rgba(186,26,26,0.2)' });
                showToast('Counselling session published');
            } else {
                $pub.html('<span class="material-symbols-outlined" style="font-size:16px;">publish</span>Publish')
                    .css({ background: 'rgba(0,107,88,0.1)', color: 'var(--clr-primary)', border: '1px solid rgba(0,107,88,0.2)' });
                showToast('Counselling session unpublished', 'warning');
            }
        });

        // Publish / Unpublish from manage cards
        $(document).on('click', '.btn-toggle-cs-publish', function (e) {
            e.stopPropagation();
            var csId = $(this).data('cs-id');
            var cs = null;
            $.each(COUNSELLING_SESSIONS, function(_, c) { if (c.id === csId) { cs = c; return false; } });
            if (!cs) return;
            cs.published = !cs.published;
            saveCounsellingSessions();
            renderCounsellingDashboard();
            renderScheduleCards();
            showToast(cs.published ? 'Counselling session published' : 'Counselling session unpublished', cs.published ? 'success' : 'warning');
        });

        // Detail search / filter
        $(document).on('input', '#csDetailSearch', function () { renderCsDetailTable(); });
        $(document).on('change', '#csDetailFilterLinked', function () { renderCsDetailTable(); });

        // Set year display on counselling upload section entry
        $(document).on('click', '.sidebar-nav-item[data-section="section-ca-counselling-upload"]', function () {
            $('#csActiveYearDisplay').text(getCurrentAdmissionYear());
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
        COLLEGE_INFO.session  = '2026';

        // Reload all college-scoped data for the newly selected college
        loadRegistrations();
        loadRecommendations();
        loadMeritLists();
        loadCounsellingSessions();

        var admYear = getCurrentAdmissionYear();

        // Update UI text across the portal
        $('#adminCollegeName').text(college.name + ' — ' + college.code);
        $('#dashboardCollegeName').text(college.name);
        $('#dashboardSession').text(COLLEGE_INFO.session);
        // Active year badge in topbar
        $('#activeAdmYearBadge').text('AY ' + admYear).css('display', '');
        // Reflect in merit upload section
        $('#mlActiveYearDisplay').text(admYear);
        // Show / hide switcher button
        $('#btnSwitchCollege').show();
    }

    var _collegePickerModal = null;

    function showCollegePicker(allowClose) {
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

        // Show close button only when switching (a college is already selected)
        $('#btnCloseCollegePicker').toggle(!!allowClose);

        if (!_collegePickerModal) {
            _collegePickerModal = new bootstrap.Modal(document.getElementById('collegePickerModal'), {
                backdrop: allowClose ? true : 'static',
                keyboard: !!allowClose
            });
        } else {
            // Update backdrop behaviour depending on context
            _collegePickerModal._config.backdrop = allowClose ? true : 'static';
            _collegePickerModal._config.keyboard = !!allowClose;
        }
        _collegePickerModal.show();
    }

    function selectCollegeAndEnter(college) {
        sessionStorage.setItem('emmis_ca_college_id', String(college.id));
        applyCollegeInfo(college);

        if (_collegePickerModal) _collegePickerModal.hide();
        showSection('section-ca-dashboard');
    }

    // ============================================================
    // 13. INIT
    // ============================================================

    $(function () {
        loadRegistrations();
        loadRecommendations();
        loadMeritLists();
        loadCounsellingSessions();
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

        // Switch College button — allow closing (college already selected)
        $(document).on('click', '#btnSwitchCollege', function () {
            showCollegePicker(true);
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

        // No college selected — show picker (not dismissible)
        showCollegePicker(false);
    });

})(jQuery);
