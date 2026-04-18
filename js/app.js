/* ============================================================
   EMMIS HE — Sikkim Higher Education Admission Portal
   Unified jQuery Application Logic (Single-Page Architecture)
   ============================================================
   RULES: jQuery only. No plain/vanilla JS.
   application.html uses section toggling, not page reloads.
   ============================================================ */

(function ($) {
    'use strict';

    // ============================================================
    // 1. MOCK DATA
    // ============================================================

    var COLLEGES = [
        {
            id: 1, name: "Sikkim Government College", type: "Government",
            location: "Tadong, Gangtok", district: "Gangtok", stream: "B.Com",
            status: "urgent", openDate: "Oct 01, 2024", closeDate: "Oct 15, 2024",
            meritListDate: "Oct 18, 2024", admissionReg: "Oct 20 – Oct 25, 2024",
            notification: "Verification of original documents starts from Oct 18.",
            image: "",
            courses: [
                { name: "Bachelor of Arts (B.A.)", duration: "3 Years", fee: "₹4,500/year", subjects: ["Political Science", "History", "English"] },
                { name: "Bachelor of Commerce (B.Com)", duration: "3 Years", fee: "₹5,000/year", subjects: ["Accountancy", "Business Studies"] }
            ]
        },
        {
            id: 2, name: "Dentam College", type: "Government",
            location: "Rangpo, East Sikkim", district: "Pakyong", stream: "B.Sc",
            status: "open", openDate: "Oct 05, 2024", closeDate: "Nov 05, 2024",
            meritListDate: "Nov 10, 2024", admissionReg: "Nov 12 – Nov 18, 2024",
            notification: "Scholarship exams for B.Tech are scheduled for next month.",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB62An-EyTiBUhcc9FtgvL2gRpj4YoRNUJ5FM4XAcfM1O0Q72N4Xg1lhOHJiL70Vg7RUQP7A-j0LTyDYZ9aSXo6Vl3t2PiZF0RN9jiSL1Ks0Tmi5l12caq_5yu8w_5f1V5fzDnB_hrG71PD0IxZv3GIwWv6namjxP9XWwIq7mia9XYXHgWQZK4RrvoWtuCI9ECmlNSeoIa-7qGcX0iuNEk1XGMwxepggxF5m_Nm0aiGj3I0lqbqK5xWDN_J3r7LpuWtx7qn3oKcLYXA",
            courses: [
                { name: "Bachelor of Science (B.Sc.)", duration: "3 Years", fee: "₹6,000/year", subjects: ["Physics", "Chemistry", "Mathematics"] }
            ]
        },
        {
            id: 3, name: "Sikkim Arts College", type: "Government",
            location: "Gyalshing, West Sikkim", district: "Gyalshing", stream: "B.A",
            status: "urgent", openDate: "Sep 25, 2024", closeDate: "Oct 12, 2024",
            meritListDate: "Oct 15, 2024", admissionReg: "Oct 17 – Oct 22, 2024",
            notification: "Limited seats available for Master of Fine Arts program.",
            image: "",
            courses: [
                { name: "Bachelor of Arts (B.A.)", duration: "3 Years", fee: "₹4,200/year", subjects: ["Sociology", "History", "English"] }
            ]
        },
        {
            id: 4, name: "Namchi Govt. College", type: "Government",
            location: "Namchi, South Sikkim", district: "Namchi", stream: "B.A Law",
            status: "open", openDate: "Oct 10, 2024", closeDate: "Nov 18, 2024",
            meritListDate: "Nov 22, 2024", admissionReg: "Nov 25 – Dec 01, 2024",
            notification: "New vocational streams introduced for the 2024 session.",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAIcbVe9LJGRGOVanTygT9EPSjq_9C-mSl_XGaH0R_EF_7f4UOzcK4ozeCbx2S_hcjNZBx-Y2tBjBw3b6o15OKKnM9DmSfFSM0_uyE80DHBr2l-DdTEzgVioNA8Docd1VVsjesyARkmZZZc1EpTje1TTWtAltIP3RHlcPhvugwwQGC3eg9Rm5UkL4Vo9UfeqVHVjgpCYc8YXaRgfDbFoYFI-zxTdlXAicUSrksSDGA8REmaGOnOAVyYQkUm9mFj2-_5kUgZdLbNRWMX",
            courses: [
                { name: "Bachelor of Arts (B.A.)", duration: "3 Years", fee: "₹4,500/year", subjects: ["Economics", "History", "Political Science"] },
                { name: "B.A. Law (Integrated)", duration: "5 Years", fee: "₹8,500/year", subjects: ["Constitutional Law", "Criminal Law"] }
            ]
        },
        {
            id: 5, name: "Mangan College", type: "Government",
            location: "Mangan, North Sikkim", district: "Mangan", stream: "B.A",
            status: "open", openDate: "Oct 08, 2024", closeDate: "Nov 10, 2024",
            meritListDate: "Nov 14, 2024", admissionReg: "Nov 16 – Nov 22, 2024",
            notification: "NSS and NCC enrollment open alongside admissions.",
            image: "",
            courses: [
                { name: "Bachelor of Arts (B.A.)", duration: "3 Years", fee: "₹4,200/year", subjects: ["Political Science", "Sociology", "Nepali"] },
                { name: "Bachelor of Science (B.Sc.)", duration: "3 Years", fee: "₹5,800/year", subjects: ["Botany", "Zoology", "Chemistry"] }
            ]
        },
        {
            id: 6, name: "Soreng College", type: "Government",
            location: "Soreng, West Sikkim", district: "Soreng", stream: "B.A",
            status: "open", openDate: "Oct 12, 2024", closeDate: "Nov 15, 2024",
            meritListDate: "Nov 20, 2024", admissionReg: "Nov 22 – Nov 28, 2024",
            notification: "Hostel facility available for students from remote areas.",
            image: "",
            courses: [
                { name: "Bachelor of Arts (B.A.)", duration: "3 Years", fee: "₹4,000/year", subjects: ["History", "English", "Political Science"] }
            ]
        },
        {
            id: 7, name: "Nar Bahadur Bhandari Degree College", type: "Government",
            location: "Tadong, Gangtok", district: "Gangtok", stream: "B.Com",
            status: "open", openDate: "Oct 03, 2024", closeDate: "Nov 02, 2024",
            meritListDate: "Nov 06, 2024", admissionReg: "Nov 08 – Nov 14, 2024",
            notification: "Centralized admission counselling for all UG programmes.",
            image: "",
            courses: [
                { name: "Bachelor of Arts (B.A.)", duration: "3 Years", fee: "₹4,500/year", subjects: ["Economics", "Political Science", "English"] },
                { name: "Bachelor of Commerce (B.Com)", duration: "3 Years", fee: "₹5,200/year", subjects: ["Accountancy", "Taxation", "Business Studies"] }
            ]
        },
        {
            id: 8, name: "Rhenock College", type: "Government",
            location: "Rhenock, East Sikkim", district: "Pakyong", stream: "B.Sc",
            status: "upcoming", openDate: "Nov 01, 2024", closeDate: "Dec 01, 2024",
            meritListDate: "", admissionReg: "",
            notification: "Registration dates to be announced shortly.",
            image: "",
            courses: [
                { name: "Bachelor of Arts (B.A.)", duration: "3 Years", fee: "₹4,200/year", subjects: ["History", "Nepali", "Geography"] },
                { name: "Bachelor of Science (B.Sc.)", duration: "3 Years", fee: "₹5,500/year", subjects: ["Mathematics", "Physics", "Computer Science"] }
            ]
        },
        {
            id: 9, name: "Government College Burtuk", type: "Government",
            location: "Burtuk, Gangtok", district: "Gangtok", stream: "B.A Law",
            status: "urgent", openDate: "Sep 28, 2024", closeDate: "Oct 14, 2024",
            meritListDate: "Oct 17, 2024", admissionReg: "Oct 19 – Oct 24, 2024",
            notification: "Last date for document verification is Oct 16.",
            image: "",
            courses: [
                { name: "B.A. Law (Integrated)", duration: "5 Years", fee: "₹9,000/year", subjects: ["Constitutional Law", "Criminal Law", "Civil Law"] },
                { name: "Bachelor of Arts (B.A.)", duration: "3 Years", fee: "₹4,500/year", subjects: ["Political Science", "History", "Sociology"] }
            ]
        },
        {
            id: 10, name: "West Point College", type: "Private",
            location: "Gyalshing, West Sikkim", district: "Gyalshing", stream: "B.A",
            status: "open", openDate: "Oct 15, 2024", closeDate: "Nov 20, 2024",
            meritListDate: "Nov 24, 2024", admissionReg: "Nov 26 – Dec 02, 2024",
            notification: "Scholarships available for SC/ST students.",
            image: "",
            courses: [
                { name: "Bachelor of Arts (B.A.)", duration: "3 Years", fee: "₹6,500/year", subjects: ["English", "Sociology", "Economics"] }
            ]
        },
        {
            id: 11, name: "Lingtam College", type: "Government",
            location: "Lingtam, East Sikkim", district: "Pakyong", stream: "B.Sc",
            status: "upcoming", openDate: "Nov 05, 2024", closeDate: "Dec 05, 2024",
            meritListDate: "", admissionReg: "",
            notification: "Admissions will begin after semester examinations.",
            image: "",
            courses: [
                { name: "Bachelor of Science (B.Sc.)", duration: "3 Years", fee: "₹5,800/year", subjects: ["Physics", "Chemistry", "Biology"] }
            ]
        },
        {
            id: 12, name: "South Sikkim Govt. College", type: "Government",
            location: "Ravangla, South Sikkim", district: "Namchi", stream: "B.A",
            status: "open", openDate: "Oct 06, 2024", closeDate: "Nov 08, 2024",
            meritListDate: "Nov 12, 2024", admissionReg: "Nov 14 – Nov 20, 2024",
            notification: "Free bus service from Ravangla bus stand to campus.",
            image: "",
            courses: [
                { name: "Bachelor of Arts (B.A.)", duration: "3 Years", fee: "₹4,000/year", subjects: ["History", "Political Science", "Nepali"] },
                { name: "Bachelor of Commerce (B.Com)", duration: "3 Years", fee: "₹4,800/year", subjects: ["Accountancy", "Economics"] }
            ]
        }
    ];

    var MOCK_APPLICATIONS = [
        { id: "2026001522", collegeName: "Sikkim University", course: "B.Com Hons", status: "submitted", dateLabel: "Applied: Oct 12, 2023", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAKg4H9haR6MYvK999WfWcWKpCB0GMd2fi5qhP4vSR6NdPvYAZAS7lhjKgOWfQ_u9Kxkvxafg4wrXhc4ZfmGQSbd3wRmWENOFE5kMXaymakAq-8lw3z7ifII1yGymo_2dQCN77zcwLuiFwg1ZR-n_n3vECMsAtaSqpqCfKH0rFkTRzQQ1xPH0lWC3zi2AT92Qn10yf2FQNEcVsxrmv3EkMueQXmuHSfPZM-e-NySVsFcZUpCm0BfHvavrNAE0kGEeb70KgGcYowWNw6" },
        { id: "2026002198", collegeName: "Nar Bahadur Bhandari Degree College", course: "B.A. Political Science", status: "draft", dateLabel: "Started: Nov 05, 2023", image: "" },
        { id: "2026003441", collegeName: "Sikkim Manipal University", course: "B.Tech Computer Science", status: "incomplete", dateLabel: "Missing Documents", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCKN_fBXjwQuTYRE1Mvid00faZJeYHU8JvuWzOq070uNTqYe_yUTPouTeSSNLqoLvhP7Wjg5QO3p1AZOloQwkP2uqZc4QV3A_5MiW3QWYKZkAS6uvxcqBPcJhNIqQ1VM4YdDY0im96RqtPAslLSBpoilNzWTIRlwkbunWIZnAZcasP1upxG-ecfNvrpFrc-PddAbAMpwKE8JqBQlOMROoN1r9h9xW5kLpAwWzuX_GW8Mqmmr0CKG3Evu3NDltcD5KGhx5d5NtVFcG48" }
    ];

    // ============================================================
    // 2. LOCAL STORAGE HELPERS
    // ============================================================

    var APP_KEY = 'emmis_he_application';
    var MOBILE_KEY = 'emmis_he_mobile';

    function getApplication() {
        var data = localStorage.getItem(APP_KEY);
        if (data) { try { return JSON.parse(data); } catch (e) { return null; } }
        return null;
    }

    function saveApplication(appData) {
        localStorage.setItem(APP_KEY, JSON.stringify(appData));
    }

    function getOrCreateApplication() {
        var app = getApplication();
        if (!app) {
            app = {
                applicationId: generateAppId(),
                collegeId: 1, collegeName: "Sikkim Government College",
                step1: { rollNo: "", candidateName: "", board: "", stream: "", mobile: "9876543210", gender: "", email: "", category: "Sikkimese", coiNumber: "", pwd: "No" },
                step2: { dob: "", community: "", fatherName: "", fatherContact: "", motherName: "", district: "", pincode: "", permanentAddress: "", country: "India", state: "Sikkim" },
                step3: { subjects: [{ name: "English", marks: 78, total: 100 }, { name: "Accountancy", marks: 45, total: 100 }, { name: "Economics", marks: 38, total: 100 }] },
                step4: { pref1Program: "Bachelor of Commerce", pref1Course: "B.Com Hons Accounting & Finance", pref2Program: "", pref2Course: "", pref3Program: "", pref3Course: "" },
                step5: { paymentMethod: "", transactionId: "", amount: 200, status: "pending" },
                currentStep: 1, status: "draft"
            };
            saveApplication(app);
        }
        return app;
    }

    function saveStepData(stepKey, data) {
        var app = getOrCreateApplication();
        app[stepKey] = $.extend(true, app[stepKey] || {}, data);
        saveApplication(app);
    }

    function clearApplication() { localStorage.removeItem(APP_KEY); }
    function generateAppId() { return "SK-2024-" + (Math.floor(Math.random() * 9000000) + 1000000); }
    function generateTxnId() { return "TXN" + (Math.floor(Math.random() * 9000000000) + 1000000000); }
    function saveMobile(m) { localStorage.setItem(MOBILE_KEY, m); }
    function getMobile() { return localStorage.getItem(MOBILE_KEY) || ''; }
    function isLoggedIn() { return localStorage.getItem('emmis_he_logged_in') === 'true'; }
    function setLoggedIn() { localStorage.setItem('emmis_he_logged_in', 'true'); }
    function clearLogin() { localStorage.removeItem('emmis_he_logged_in'); localStorage.removeItem(MOBILE_KEY); }

    // ============================================================
    // 3. SECTION NAVIGATION (application.html)
    // ============================================================

    function showSection(sectionId) {
        // Hide all sections
        $('.app-section').hide();
        // Show target
        $('#' + sectionId).fadeIn(250);

        // Scroll to top
        $('html, body').scrollTop(0);

        // Update sidebar
        var stepMap = {
            'section-dashboard': 0,
            'section-step1': 1, 'section-step2': 2, 'section-step3': 3,
            'section-step4': 4, 'section-step5': 5, 'section-step6': 6,
            'section-step7': 0
        };
        var step = stepMap[sectionId] || 0;

        // Toggle sidebar + stepper visibility
        if (sectionId === 'section-dashboard' || sectionId === 'section-step7') {
            // Fully hide sidebar — must remove d-md-flex since it uses !important
            $('#appSidebar').removeClass('d-md-flex').addClass('d-none');
            $('#collegeStickyHeader').hide();
            $('#stepperBar').hide();
        } else {
            // Show sidebar on desktop only (d-none hides mobile, d-md-flex shows md+)
            $('#appSidebar').removeClass('d-none').addClass('d-md-flex');
            $('#collegeStickyHeader').show();
            $('#stepperBar').show();
            highlightSidebar(step);
            updateStepper(step);
        }

        // Populate preview when entering Step 6
        if (sectionId === 'section-step6') {
            populatePreview();
        }

        // Track current step
        if (step > 0) {
            var app = getOrCreateApplication();
            app.currentStep = Math.max(app.currentStep || 1, step);
            saveApplication(app);
        }
    }

    function highlightSidebar(activeStep) {
        $('.sidebar-nav-item').removeClass('active');
        $('.sidebar-nav-item[data-step="' + activeStep + '"]').addClass('active');
    }

    function updateStepper(currentStep) {
        $('.stepper-step').each(function () {
            var step = parseInt($(this).data('step'));
            var $dot = $(this).find('.stepper-dot');
            var $label = $(this).find('.stepper-label');
            $dot.removeClass('active completed');
            $label.removeClass('active completed');
            if (step < currentStep) { $dot.addClass('completed'); $label.addClass('completed'); }
            else if (step === currentStep) { $dot.addClass('active'); $label.addClass('active'); }
        });
        $('.stepper-line').each(function () {
            var afterStep = parseInt($(this).data('after-step'));
            $(this).toggleClass('completed', afterStep < currentStep);
        });
    }

    // ============================================================
    // 4. COLLEGE LISTING (index.html)
    // ============================================================

    function initCollegeListing() {
        // Track how many are currently visible (first 4 are hardcoded in HTML)
        var visibleCount = 4;
        var pageSize = 4;

        // Update counter text
        function updateCounter() {
            var total = COLLEGES.length;
            var shown = Math.min(visibleCount, total);
            $('#collegeShowingCount').text('Showing ' + shown + ' of ' + total + ' Colleges in Sikkim');
            if (shown >= total) {
                $('#btnLoadMore').hide();
            } else {
                $('#btnLoadMore').show();
            }
        }
        updateCounter();

        // Build a college card HTML from data
        function buildCollegeCard(c) {
            var bannerClass = c.status === 'urgent' ? 'urgent' : (c.status === 'upcoming' ? 'upcoming' : 'open');
            var bannerIcon = c.status === 'urgent' ? 'timer' : (c.status === 'upcoming' ? 'schedule' : 'check_circle');
            var bannerText = c.status === 'urgent' ? 'REGISTRATION OPEN – ENDS SOON!' : (c.status === 'upcoming' ? 'COMING SOON' : 'REGISTRATION OPEN');
            var dateStyle = c.status === 'urgent' ? 'background:rgba(137,246,216,0.2);' : '';
            var dateLabelColor = c.status === 'urgent' ? 'color:var(--clr-on-primary-fixed-var);' : 'color:var(--clr-on-tertiary-fixed-var);';
            var dateValueColor = c.status === 'urgent' ? 'color:var(--clr-primary);' : 'color:var(--clr-on-tertiary-fixed);';

            // Collect all course keywords for filtering
            var streamKeywords = [c.stream];
            $.each(c.courses || [], function (_, cr) {
                if (cr.name.indexOf('B.A.') >= 0 || cr.name.indexOf('B.A ') >= 0) streamKeywords.push('B.A');
                if (cr.name.indexOf('B.Sc') >= 0) streamKeywords.push('B.Sc');
                if (cr.name.indexOf('B.Com') >= 0) streamKeywords.push('B.Com');
                if (cr.name.indexOf('Law') >= 0) streamKeywords.push('B.A Law');
            });
            var streamData = $.grep(streamKeywords, function (v, i) { return $.inArray(v, streamKeywords) === i; }).join(' ');

            var imgHtml = c.image ? '<div class="ratio ratio-16x9"><img src="' + c.image + '" class="w-100 h-100" style="object-fit:cover;" alt="' + c.name + '"></div>' : '';

            // Merit + admission dates row
            var meritRowHtml = '';
            if (c.meritListDate || c.admissionReg) {
                meritRowHtml = '<div class="d-flex justify-content-between align-items-center p-3 rounded-3 bg-surface-low">' +
                    '<div><span class="d-block text-uppercase fw-medium" style="font-size:.625rem; color:var(--clr-on-tertiary-fixed-var);">Merit List Date</span><span class="fw-bold small" style="color:var(--clr-on-tertiary-fixed);">' + (c.meritListDate || 'TBA') + '</span></div>' +
                    '<div class="text-end"><span class="d-block text-uppercase fw-medium" style="font-size:.625rem; color:var(--clr-on-tertiary-fixed-var);">Admission Registration</span><span class="fw-bold small" style="color:var(--clr-on-tertiary-fixed);">' + (c.admissionReg || 'TBA') + '</span></div>' +
                    '</div>';
            }

            // Courses expandable
            var coursesHtml = '';
            $.each(c.courses || [], function (_, cr) {
                var subjectBadges = '';
                $.each(cr.subjects || [], function (_, s) {
                    subjectBadges += '<span class="badge rounded-1 fw-medium" style="font-size:.5625rem; background:#fff; border:1px solid var(--clr-outline-variant); color:var(--clr-on-tertiary-fixed-var);">' + s + '</span>';
                });
                coursesHtml += '<div class="p-3 rounded-3 bg-surface-low mb-2">' +
                    '<div class="d-flex justify-content-between mb-1"><div><strong class="small">' + cr.name + '</strong><br><span style="font-size:.65rem; color:var(--clr-on-tertiary-fixed-var);">' + cr.duration + ' • ' + cr.fee + '</span></div></div>' +
                    '<div class="d-flex flex-wrap gap-1 mt-2">' + subjectBadges + '</div></div>';
            });

            return '<div class="col-12 col-md-6 col-lg-4 col-xl-3">' +
                '<div class="college-card h-100" data-name="' + c.name + '" data-district="' + c.district + '" data-stream="' + streamData + '">' +
                '<div class="college-card-banner ' + bannerClass + '"><span class="material-symbols-outlined" style="font-size:14px">' + bannerIcon + '</span> ' + bannerText + '</div>' +
                imgHtml +
                '<div class="card-body d-flex flex-column flex-grow-1 p-4">' +
                '<div class="mb-3">' +
                '<span class="text-uppercase fw-bold d-block mb-1" style="font-size:.625rem; letter-spacing:.1em; color:var(--clr-secondary);">' + c.type + '</span>' +
                '<h5 class="fw-bold mb-1 tracking-tight" style="color:var(--clr-on-tertiary-fixed);">' + c.name + '</h5>' +
                '<div class="d-flex align-items-center gap-1 small" style="color:var(--clr-on-tertiary-fixed-var);"><span class="material-symbols-outlined" style="font-size:14px">location_on</span>' + c.location + '</div>' +
                '</div>' +
                '<div class="d-flex flex-column gap-3 mb-4">' +
                '<div class="d-flex justify-content-between align-items-center p-3 rounded-3' + (dateStyle ? '' : ' bg-surface-low') + '"' + (dateStyle ? ' style="' + dateStyle + '"' : '') + '>' +
                '<div><span class="d-block text-uppercase fw-medium" style="font-size:.625rem; letter-spacing:.05em; ' + dateLabelColor + '">Opening Date</span><span class="fw-bold small" style="' + dateValueColor + '">' + c.openDate + '</span></div>' +
                '<div class="text-end"><span class="d-block text-uppercase fw-medium" style="font-size:.625rem; letter-spacing:.05em; ' + dateLabelColor + '">Closing Date</span><span class="fw-bold small" style="' + dateValueColor + '">' + c.closeDate + '</span></div>' +
                '</div>' +
                meritRowHtml +
                '<div class="p-3 rounded-3 bg-surface-low">' +
                '<span class="d-block text-uppercase fw-bold mb-1" style="font-size:.625rem; color:var(--clr-on-tertiary-fixed-var);">Notification</span>' +
                '<p class="mb-0 small" style="color:var(--clr-on-tertiary-fixed-var); line-height:1.5;">' + c.notification + '</p>' +
                '</div>' +
                '</div>' +
                '<div class="mt-auto d-grid gap-2">' +
                '<button class="btn btn-primary py-2 btn-apply-now" data-college-id="' + c.id + '">Apply Now</button>' +
                '<button class="btn btn-sm text-center d-flex align-items-center justify-content-center gap-1 btn-toggle-courses" style="color:var(--clr-on-tertiary-fixed-var); font-size:.75rem; font-weight:600;">View Course Details <span class="material-symbols-outlined" style="font-size:16px">expand_more</span></button>' +
                '</div>' +
                '<div class="college-courses mt-3 pt-3 border-top" style="display:none;">' +
                '<h6 class="fw-bold text-uppercase small mb-2" style="letter-spacing:.05em; color:var(--clr-on-tertiary-fixed);">Offered Courses</h6>' +
                coursesHtml +
                '</div>' +
                '</div></div></div>';
        }

        // Load More click
        $(document).on('click', '#btnLoadMore', function () {
            var nextBatch = COLLEGES.slice(visibleCount, visibleCount + pageSize);
            $.each(nextBatch, function (_, c) {
                $('#collegeGrid').append(buildCollegeCard(c));
            });
            visibleCount += nextBatch.length;
            updateCounter();
            // Re-apply active filters
            filterColleges();
        });

        $(document).on('click', '.filter-pill', function () {
            $(this).closest('.filter-group').find('.filter-pill').removeClass('active');
            $(this).addClass('active');
            filterColleges();
        });

        $('#collegeSearch').on('input', function () { filterColleges(); });

        $(document).on('click', '.btn-apply-now', function () {
            var cid = $(this).data('college-id');
            if (cid) localStorage.setItem('emmis_he_selected_college', cid);
            // Skip OTP if already logged in
            window.location.href = isLoggedIn() ? 'application.html' : 'login.html';
        });

        // Show "My Applications" button if logged in
        if (isLoggedIn()) {
            $('.btn-sign-in').text('My Applications').removeClass('btn-sign-in').addClass('btn-goto-dashboard').attr('href', 'application.html');
        }
        $(document).on('click', '.btn-goto-dashboard', function (e) {
            e.preventDefault();
            window.location.href = 'application.html';
        });

        $(document).on('click', '.btn-toggle-courses', function () {
            var $courses = $(this).closest('.college-card').find('.college-courses');
            $courses.slideToggle(300);
            var $icon = $(this).find('.material-symbols-outlined');
            $icon.text($courses.is(':visible') ? 'expand_less' : 'expand_more');
        });
    }

    function filterColleges() {
        var search = ($('#collegeSearch').val() || '').toLowerCase();
        var district = ($('.filter-group-district .filter-pill.active').data('value') || 'all').toString().toLowerCase();
        var stream = ($('.filter-group-stream .filter-pill.active').data('value') || 'all').toString().toLowerCase();
        $('.college-card').each(function () {
            var $c = $(this);
            var name = ($c.data('name') || '').toString().toLowerCase();
            var d = ($c.data('district') || '').toString().toLowerCase();
            var s = ($c.data('stream') || '').toString().toLowerCase();
            var show = (!search || name.indexOf(search) >= 0) && (district === 'all' || d.indexOf(district) >= 0) && (stream === 'all' || s.indexOf(stream) >= 0);
            $c.closest('.col').toggle(show);
        });
    }

    // ============================================================
    // 5. OTP LOGIN (login.html)
    // ============================================================

    function initOTPLogin() {
        $(document).on('input', '.otp-input', function () {
            if ($(this).val().length >= 1) $(this).next('.otp-input').focus();
        });
        $(document).on('keydown', '.otp-input', function (e) {
            if (e.key === 'Backspace' && $(this).val() === '') $(this).prev('.otp-input').focus();
        });

        $('#btnSendOtp').on('click', function () {
            var mobile = $('#mobileNumber').val();
            if (mobile && mobile.length === 10) {
                saveMobile(mobile);
                $('#otpSection').slideDown(300);
                $('#otpStatus').slideDown(200);
                $('#otpStatusText').text('OTP sent successfully to +91 ' + mobile);
                startOTPTimer();
                $('.otp-input').first().focus();
                $(this).text('OTP Sent').prop('disabled', true);
            }
        });

        $('#btnVerifyOtp').on('click', function () {
            var otp = '';
            $('.otp-input').each(function () { otp += $(this).val(); });
            if (otp.length < 6) {
                // Auto-fill demo
                $.each(['4', '8', '2', '9', '1', '7'], function (i, v) { $('.otp-input').eq(i).val(v); });
            }
            $(this).html('<span class="spinner-border spinner-border-sm me-2"></span>Verifying...');
            setLoggedIn();
            setTimeout(function () { window.location.href = 'application.html'; }, 800);
        });

        $('#btnResendOtp').on('click', function () {
            startOTPTimer();
            $('#otpStatusText').text('OTP resent to +91 ' + getMobile());
        });
    }

    function startOTPTimer() {
        var timeLeft = 105;
        var $timer = $('#otpTimer');
        if (window._otpInterval) clearInterval(window._otpInterval);
        window._otpInterval = setInterval(function () {
            timeLeft--;
            var m = Math.floor(timeLeft / 60), s = timeLeft % 60;
            $timer.text((m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s);
            if (timeLeft <= 0) { clearInterval(window._otpInterval); $timer.text('00:00'); $('#btnResendOtp').removeClass('d-none'); }
        }, 1000);
    }

    // ============================================================
    // 6. APPLICATION PAGE (application.html) — All sections
    // ============================================================

    function initApplication() {
        // If user came via "Apply Now" from index.html, go straight to registration form
        var pendingCollege = localStorage.getItem('emmis_he_selected_college');
        if (pendingCollege) {
            localStorage.removeItem('emmis_he_selected_college');
            showSection('section-step1');
        } else {
            showSection('section-dashboard');
        }

        // -- Dashboard --
        $(document).on('click', '.btn-new-application', function (e) {
            e.preventDefault();
            window.location.href = 'index.html';
        });
        $(document).on('click', '.btn-continue-app', function (e) {
            e.preventDefault();
            var app = getOrCreateApplication();
            showSection('section-step' + (app.currentStep || 1));
        });

        // -- Sidebar nav --
        $(document).on('click', '.sidebar-nav-item[data-step]', function (e) {
            e.preventDefault();
            var step = $(this).data('step');
            showSection('section-step' + step);
        });

        // -- Save & Next --
        $(document).on('click', '.btn-save-next', function (e) {
            e.preventDefault();
            var currentSection = $(this).closest('.app-section').attr('id');
            var stepNum = parseInt(currentSection.replace('section-step', ''));
            saveCurrentForm(stepNum);
            var next = stepNum + 1;
            if (next <= 7) showSection('section-step' + next);
        });

        // -- Back --
        $(document).on('click', '.btn-back', function (e) {
            e.preventDefault();
            var currentSection = $(this).closest('.app-section').attr('id');
            var stepNum = parseInt(currentSection.replace('section-step', ''));
            if (stepNum === 1) {
                showSection('section-dashboard');
            } else {
                showSection('section-step' + (stepNum - 1));
            }
        });

        // -- Save Draft --
        $(document).on('click', '.btn-save-draft', function (e) {
            e.preventDefault();
            var currentSection = $(this).closest('.app-section').attr('id');
            var stepNum = parseInt(currentSection.replace('section-step', ''));
            saveCurrentForm(stepNum);
            showToast('Draft saved successfully!');
        });

        // -- Discard --
        $(document).on('click', '.btn-discard', function (e) {
            e.preventDefault();
            showToast('Changes discarded.', 'warning');
        });

        // -- Category Toggle --
        $(document).on('change', '[name="category"]', function () {
            if ($(this).val() === 'Sikkimese') $('#sikkimeseFields').slideDown(300);
            else $('#sikkimeseFields').slideUp(300);
        });
        $(document).on('change', '[name="pwd"]', function () {
            if ($(this).val() === 'Yes') $('#pwdUpload').slideDown(300);
            else $('#pwdUpload').slideUp(300);
        });

        // -- Radio pills --
        $(document).on('click', '.radio-pill', function () {
            $(this).closest('.radio-pill-group').find('.radio-pill').removeClass('active');
            $(this).addClass('active');
            $(this).find('input[type="radio"]').prop('checked', true).trigger('change');
        });

        // -- Course Preferences: Program → Course cascading --
        var programCourses = {
            'Bachelor of Commerce': ['B.Com Hons Accounting & Finance', 'B.Com Hons Marketing', 'B.Com General'],
            'Bachelor of Science': ['B.Sc. Physics', 'B.Sc. Chemistry', 'B.Sc. Mathematics', 'B.Sc. Computer Science'],
            'Bachelor of Arts': ['B.A. Political Science', 'B.A. English (Hons)', 'B.A. Economics', 'B.A. History']
        };
        $(document).on('change', '[name="pref1Program"], [name="pref2Program"], [name="pref3Program"]', function () {
            var program = $(this).val();
            var prefNum = $(this).attr('name').replace('Program', 'Course');
            var $courseSelect = $('[name="' + prefNum + '"]');
            $courseSelect.html('<option selected>Select Course</option>');
            if (program && programCourses[program]) {
                $.each(programCourses[program], function (_, c) {
                    $courseSelect.append('<option>' + c + '</option>');
                });
            }
            updateSelectionSummary();
        });
        $(document).on('change', '[name="pref1Course"], [name="pref2Course"], [name="pref3Course"]', function () {
            updateSelectionSummary();
        });

        function updateSelectionSummary() {
            for (var i = 1; i <= 3; i++) {
                var prog = $('[name="pref' + i + 'Program"]').val();
                var course = $('[name="pref' + i + 'Course"]').val();
                var hasSelection = course && course !== 'Select Course';
                var $wrap = $('#summaryPref' + i);
                var $badge = $('#summaryBadge' + i);
                var $body = $('#summaryBody' + i);
                var $courseText = $('#summaryCourse' + i);
                var $subLabel = $('#summarySubLabel' + i);
                if (hasSelection) {
                    $wrap.css('opacity', '1');
                    $badge.text('SELECTED').css({ background: '#dcfce7', color: '#166534' });
                    $body.css({ background: 'rgba(0,107,88,0.05)', 'border-left': '4px solid var(--clr-primary)' });
                    $courseText.text(course).removeClass('fst-italic fw-medium').addClass('fw-bold').css('color', '');
                    if ($subLabel.length) $subLabel.show();
                } else {
                    if (i > 1) $wrap.css('opacity', '.4');
                    $badge.text('NOT SET').css({ background: '#f1f5f9', color: '#64748b' });
                    $body.css({ background: '#f8fafc', 'border-left': '4px dashed #cbd5e1' });
                    $courseText.text('No course selected').removeClass('fw-bold').addClass('fst-italic fw-medium').css('color', '#94a3b8');
                    if ($subLabel.length) $subLabel.hide();
                }
            }
        }

        // -- Academic: Add Subject --
        $(document).on('click', '.btn-add-subject', function () {
            var $tbody = $('#subjectsTable tbody');
            var n = $tbody.find('tr').length + 1;
            $tbody.append(
                '<tr><td><input type="text" class="form-control form-control-sm" name="subject_' + n + '" placeholder="Subject ' + n + '"></td>' +
                '<td><input type="number" class="form-control form-control-sm text-center marks-input" name="marks_' + n + '" placeholder="0" min="0"></td>' +
                '<td class="text-center align-middle"><input type="number" class="form-control form-control-sm text-center total-marks-input" name="total_' + n + '" value="100" min="1"></td>' +
                '<td class="text-end align-middle"><select class="form-select form-select-sm subject-status-select" style="max-width:140px;"><option value="">— Select —</option><option value="pass">Pass</option><option value="fail">Fail</option><option value="absent">Absent</option><option value="compartment">Compartment</option></select></td>' +
                '<td class="text-end align-middle"><button type="button" class="btn btn-link p-0 btn-remove-subject" style="color:var(--clr-error);"><span class="material-symbols-outlined" style="font-size:18px;">close</span></button></td></tr>'
            );
            recalcAggregate();
        });
        $(document).on('click', '.btn-remove-subject', function () {
            $(this).closest('tr').remove();
            recalcAggregate();
        });
        $(document).on('input', '.marks-input', function () { recalcAggregate(); updateSubjectStatus($(this)); });
        $(document).on('input', '.total-marks-input', function () { recalcAggregate(); });

        // -- Upload zone click handler --
        $(document).on('change', '.upload-zone input[type="file"]', function () {
            var fileName = $(this).val().split('\\').pop() || $(this).val().split('/').pop();
            if (fileName) {
                var $zone = $(this).closest('.upload-zone');
                $zone.find('.upload-label, p:not(.upload-filename)').first().text(fileName).css('color', 'var(--clr-primary)');
                $zone.css('border-color', 'var(--clr-primary)');
            }
        });

        // -- Payment --
        $(document).on('click', '.btn-pay-now', function () {
            var $btn = $(this);
            $btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-2"></span>Processing...');
            setTimeout(function () {
                var txnId = generateTxnId();
                saveStepData('step5', { transactionId: txnId, status: 'paid', paymentMethod: 'Online' });
                $btn.html('<span class="material-symbols-outlined me-2">check_circle</span>Payment Successful!').removeClass('btn-primary').addClass('btn-success');
                $('#paymentSuccess').slideDown(300);
                $('#txnId').text(txnId);
                $('.btn-proceed-preview').prop('disabled', false).css('opacity', '1');
                showToast('Payment completed successfully!');
            }, 2000);
        });
        $(document).on('click', '.btn-proceed-preview', function (e) {
            e.preventDefault();
            showSection('section-step6');
        });

        // -- Preview: Populate --
        $(document).on('click', '[data-show-section="section-step6"]', function () {
            populatePreview();
        });

        // -- Preview: Submit --
        $(document).on('click', '.btn-submit-application', function () {
            if (!$('#declarationCheck').is(':checked')) {
                $('#declarationCheck').closest('.declaration-box').addClass('border-danger');
                showToast('Please accept the declaration.', 'warning');
                return;
            }
            $('#submitConfirmModal').modal('show');
        });
        $(document).on('click', '#btnConfirmSubmit', function () {
            var app = getOrCreateApplication();
            app.status = 'submitted';
            saveApplication(app);
            $('#submitConfirmModal').modal('hide');
            showSection('section-step7');
        });
        $(document).on('click', '.btn-edit-section', function (e) {
            e.preventDefault();
            showSection('section-step' + $(this).data('step'));
        });
        $(document).on('click', '.btn-print-draft', function () { window.print(); });

        // -- Acknowledgement --
        $(document).on('click', '.btn-download-ack', function () { window.print(); });
        $(document).on('click', '.btn-back-dashboard', function (e) {
            e.preventDefault();
            showSection('section-dashboard');
        });

        // -- Sign Out --
        $(document).on('click', '.btn-sign-out', function () {
            clearLogin();
            window.location.href = 'index.html';
        });

        // -- Back to Dashboard from bottom nav --
        $(document).on('click', '.btn-go-dashboard', function (e) {
            e.preventDefault();
            showSection('section-dashboard');
        });
    }

    function saveCurrentForm(stepNumber) {
        var data = {};
        $('#section-step' + stepNumber).find('input, select, textarea').each(function () {
            var name = $(this).attr('name');
            if (!name) return;
            if ($(this).is(':radio')) { if ($(this).is(':checked')) data[name] = $(this).val(); }
            else if ($(this).is(':checkbox')) { data[name] = $(this).is(':checked'); }
            else { data[name] = $(this).val(); }
        });
        saveStepData('step' + stepNumber, data);
    }

    function recalcAggregate() {
        var total = 0, obtained = 0, count = 0;
        $('#subjectsTable tbody tr').each(function () {
            var v = parseInt($(this).find('.marks-input').val()) || 0;
            var t = parseInt($(this).find('.total-marks-input').val()) || 100;
            obtained += v; total += t; count++;
            updateSubjectStatus($(this).find('.marks-input'));
        });
        var pct = total > 0 ? ((obtained / total) * 100).toFixed(1) : '0.0';
        $('#aggregatePercent').text(pct + '%');
        $('#totalObtained').text(obtained + ' / ' + total);
        $('#totalSubjects').text(count);
    }

    function updateSubjectStatus($input) {
        var v = parseInt($input.val());
        var $select = $input.closest('tr').find('.subject-status-select');
        if (isNaN(v) || $input.val() === '') {
            $select.val('');
        } else if (v >= 33) {
            $select.val('pass');
        } else {
            $select.val('fail');
        }
    }

    function populatePreview() {
        var app = getOrCreateApplication();
        var s1 = app.step1 || {};
        var s2 = app.step2 || {};
        var s3 = app.step3 || {};
        var s4 = app.step4 || {};
        var s5 = app.step5 || {};

        // Sidebar / header
        $('#previewName').text(s1.candidateName || '—');
        $('#previewAppId').text('Application ID: ' + (app.applicationId || '—'));
        $('#previewCollege').text(app.collegeName || '—');
        $('#previewStreamSide').text(s1.stream || '—');
        $('#previewPaySide').text(s5.status === 'paid' ? 'Paid' : 'Pending');

        // Primary Information
        $('#previewRollNo').text(s1.rollNo || '—');
        $('#previewName2').text(s1.candidateName || '—');
        $('#previewBoard').text(s1.board || '—');
        $('#previewStream').text(s1.stream || '—');
        $('#previewMobile').text(s1.mobile ? '+91 ' + s1.mobile : '—');
        $('#previewGender').text(s1.gender || '—');
        $('#previewEmail').text(s1.email || '—');
        $('#previewCategory').text(s1.category || '—');
        $('#previewCOI').text(s1.coiNumber || '—');
        $('#previewPWD').text(s1.pwd || '—');

        // Personal Details
        $('#previewDob').text(s2.dob || '—');
        $('#previewCommunity').text(s2.community || '—');
        $('#previewFather').text(s2.fatherName || '—');
        $('#previewFatherContact').text(s2.fatherContact ? '+91 ' + s2.fatherContact : '—');
        $('#previewMother').text(s2.motherName || '—');
        $('#previewCountry').text(s2.country || '—');
        $('#previewState').text(s2.state || '—');
        $('#previewDistrict').text(s2.district || '—');
        $('#previewPincode').text(s2.pincode || '—');
        $('#previewAddress').text(s2.permanentAddress || '—');

        // Academic History — build subjects table dynamically
        var $tbody = $('#previewSubjectsBody').empty();
        var totalObt = 0, totalMax = 0;
        // Read from the actual form inputs if available
        $('#subjectsTable tbody tr').each(function () {
            var subj = $(this).find('input[name^="subject_"]').val() || '';
            var marks = parseInt($(this).find('.marks-input').val()) || 0;
            var totalM = parseInt($(this).find('.total-marks-input').val()) || 100;
            var statusVal = $(this).find('.subject-status-select').val() || '';
            var statusLabel = statusVal ? statusVal.charAt(0).toUpperCase() + statusVal.slice(1) : '—';
            if (subj || marks > 0) {
                $tbody.append('<tr><td class="px-3">' + $('<span>').text(subj).html() + '</td><td class="px-3 fw-semibold">' + marks + '</td><td class="px-3">' + totalM + '</td><td class="px-3">' + statusLabel + '</td></tr>');
                totalObt += marks;
                totalMax += totalM;
            }
        });
        var aggPct = totalMax > 0 ? ((totalObt / totalMax) * 100).toFixed(1) : '0.0';
        $('#previewAggregate').text('Aggregate: ' + aggPct + '%');
        $('#previewTotalMarks').text('Total: ' + totalObt + ' / ' + totalMax);
        $('#previewAggSide').text(aggPct + '%');

        // Course Preferences
        $('#previewPref1Prog').text(s4.pref1Program || '—');
        $('#previewPref1Course').text(s4.pref1Course || '—');
        $('#previewPref2Prog').text(s4.pref2Program || '—');
        $('#previewPref2Course').text(s4.pref2Course || '—');
        $('#previewPref3Prog').text(s4.pref3Program || '—');
        $('#previewPref3Course').text(s4.pref3Course || '—');

        // Payment
        $('#previewTxnId').text(s5.transactionId || '—');
        $('#previewPayAmount').text('₹ ' + (s5.amount || 200) + '.00');
        $('#previewPayMethod').text(s5.paymentMethod || '—');
        $('#previewPayStatus').text(s5.status === 'paid' ? 'PAID' : 'PENDING');

        // Hide payment edit button if already paid
        if (s5.status === 'paid') {
            $('#btnEditPayment').hide();
        } else {
            $('#btnEditPayment').show();
        }
    }

    // ============================================================
    // 7. TOAST
    // ============================================================

    function showToast(message, type) {
        type = type || 'success';
        var bg = type === 'success' ? 'bg-success' : type === 'warning' ? 'bg-warning text-dark' : 'bg-danger';
        var icon = type === 'success' ? 'check_circle' : type === 'warning' ? 'warning' : 'error';
        var $t = $('<div class="position-fixed bottom-0 end-0 m-4 px-4 py-3 rounded-3 shadow-lg d-flex align-items-center gap-2 ' + bg + ' text-white animate-fade-in-up" style="z-index:9999">' +
            '<span class="material-symbols-outlined">' + icon + '</span><span class="fw-semibold">' + message + '</span></div>').appendTo('body');
        setTimeout(function () { $t.fadeOut(300, function () { $(this).remove(); }); }, 3000);
    }

    // ============================================================
    // 8. AUTO-INIT
    // ============================================================

    $(function () {
        var page = $('body').data('page');
        if (page === 'college-listing') initCollegeListing();
        else if (page === 'otp-login') initOTPLogin();
        else if (page === 'application') initApplication();

        $('[data-bs-toggle="tooltip"]').each(function () { new bootstrap.Tooltip(this); });
    });

    // Export
    window.EMMIS = { COLLEGES: COLLEGES, showSection: showSection, showToast: showToast, getOrCreateApplication: getOrCreateApplication };

})(jQuery);
