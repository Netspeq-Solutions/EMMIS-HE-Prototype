/* ============================================================
   EMMIS HE — State Education Department Portal
   jQuery Application Logic (Single-Page Architecture)
   ============================================================ */
(function ($) {
    'use strict';

    // ============================================================
    // 1. MOCK DATA
    // ============================================================

    var SESSIONS = ["2024-25", "2023-24"];
    var DISTRICTS = ["All", "Gangtok", "Pakyong", "Mangan", "Gyalshing", "Namchi", "Soreng"];
    var COURSE_TYPES = ["All", "B.A", "B.Sc", "B.Com", "B.A Law"];

    var COLLEGES = [
        { id: "sgc", name: "Sikkim Government College", district: "Gangtok", type: "Government" },
        { id: "dnt", name: "Dentam College", district: "Gyalshing", type: "Government" },
        { id: "sac", name: "Sikkim Arts College", district: "Pakyong", type: "Government" },
        { id: "ngc", name: "Namchi Govt. College", district: "Namchi", type: "Government" },
        { id: "mng", name: "Mangan College", district: "Mangan", type: "Government" },
        { id: "srg", name: "Soreng College", district: "Soreng", type: "Government" }
    ];

    // Detailed data per college + course (mock)
    var DATA = [
        { college: "sgc", district: "Gangtok", course: "B.Com", applications: 38, admitted: 14, registered: 10, seats: 60, male: 22, female: 16, st: 14, sc: 4, obc: 10, gen: 10, session: "2024-25" },
        { college: "sgc", district: "Gangtok", course: "B.A", applications: 52, admitted: 20, registered: 16, seats: 98, male: 24, female: 28, st: 16, sc: 8, obc: 15, gen: 13, session: "2024-25" },
        { college: "sgc", district: "Gangtok", course: "B.Sc", applications: 25, admitted: 10, registered: 8, seats: 40, male: 15, female: 10, st: 9, sc: 3, obc: 7, gen: 6, session: "2024-25" },
        { college: "dnt", district: "Gyalshing", course: "B.A", applications: 75, admitted: 45, registered: 40, seats: 60, male: 35, female: 40, st: 25, sc: 10, obc: 22, gen: 18, session: "2024-25" },
        { college: "dnt", district: "Gyalshing", course: "B.Sc", applications: 60, admitted: 30, registered: 28, seats: 40, male: 32, female: 28, st: 20, sc: 8, obc: 18, gen: 14, session: "2024-25" },
        { college: "sac", district: "Pakyong", course: "B.A", applications: 90, admitted: 55, registered: 48, seats: 70, male: 42, female: 48, st: 32, sc: 14, obc: 26, gen: 18, session: "2024-25" },
        { college: "sac", district: "Pakyong", course: "B.A Law", applications: 45, admitted: 20, registered: 18, seats: 30, male: 25, female: 20, st: 12, sc: 6, obc: 15, gen: 12, session: "2024-25" },
        { college: "ngc", district: "Namchi", course: "B.Com", applications: 80, admitted: 42, registered: 38, seats: 50, male: 38, female: 42, st: 22, sc: 12, obc: 28, gen: 18, session: "2024-25" },
        { college: "ngc", district: "Namchi", course: "B.A Law", applications: 55, admitted: 28, registered: 25, seats: 35, male: 28, female: 27, st: 15, sc: 8, obc: 18, gen: 14, session: "2024-25" },
        { college: "mng", district: "Mangan", course: "B.A", applications: 65, admitted: 35, registered: 30, seats: 50, male: 30, female: 35, st: 28, sc: 8, obc: 16, gen: 13, session: "2024-25" },
        { college: "mng", district: "Mangan", course: "B.Sc", applications: 40, admitted: 22, registered: 20, seats: 30, male: 22, female: 18, st: 18, sc: 5, obc: 10, gen: 7, session: "2024-25" },
        { college: "srg", district: "Soreng", course: "B.A", applications: 50, admitted: 28, registered: 24, seats: 40, male: 24, female: 26, st: 22, sc: 6, obc: 12, gen: 10, session: "2024-25" },
        // 2023-24 data (prior session for trend)
        { college: "sgc", district: "Gangtok", course: "B.Com", applications: 32, admitted: 12, registered: 10, seats: 60, male: 18, female: 14, st: 12, sc: 4, obc: 8, gen: 8, session: "2023-24" },
        { college: "sgc", district: "Gangtok", course: "B.A", applications: 45, admitted: 18, registered: 14, seats: 80, male: 20, female: 25, st: 14, sc: 6, obc: 13, gen: 12, session: "2023-24" },
        { college: "dnt", district: "Gyalshing", course: "B.A", applications: 60, admitted: 38, registered: 35, seats: 60, male: 28, female: 32, st: 20, sc: 8, obc: 18, gen: 14, session: "2023-24" },
        { college: "ngc", district: "Namchi", course: "B.Com", applications: 65, admitted: 35, registered: 30, seats: 50, male: 30, female: 35, st: 18, sc: 10, obc: 22, gen: 15, session: "2023-24" },
        { college: "mng", district: "Mangan", course: "B.A", applications: 50, admitted: 28, registered: 25, seats: 50, male: 22, female: 28, st: 22, sc: 6, obc: 12, gen: 10, session: "2023-24" },
        { college: "srg", district: "Soreng", course: "B.A", applications: 40, admitted: 22, registered: 20, seats: 40, male: 18, female: 22, st: 18, sc: 5, obc: 10, gen: 7, session: "2023-24" }
    ];

    // ============================================================
    // 2. HELPERS
    // ============================================================

    function getCollegeName(cid) {
        for (var i = 0; i < COLLEGES.length; i++) { if (COLLEGES[i].id === cid) return COLLEGES[i].name; }
        return cid;
    }

    function filterData() {
        var session = $('#filterSession').val() || '2024-25';
        var district = $('#filterDistrict').val() || 'All';
        var college = $('#filterCollege').val() || 'All';
        var course = $('#filterCourse').val() || 'All';

        return $.grep(DATA, function (d) {
            if (d.session !== session) return false;
            if (district !== 'All' && d.district !== district) return false;
            if (college !== 'All' && d.college !== college) return false;
            if (course !== 'All' && d.course !== course) return false;
            return true;
        });
    }

    function sumField(arr, field) {
        var s = 0; $.each(arr, function (_, d) { s += (d[field] || 0); }); return s;
    }

    // ============================================================
    // 3. SECTION NAVIGATION
    // ============================================================

    var currentSection = 'section-sa-dashboard';

    function showSection(sectionId) {
        currentSection = sectionId;
        $('.sa-section').hide();
        $('#' + sectionId).fadeIn(250);
        $('html, body').scrollTop(0);
        $('.sidebar-admin .sidebar-nav-item').removeClass('active');
        $('.sidebar-admin .sidebar-nav-item[data-section="' + sectionId + '"]').addClass('active');

        if (sectionId === 'section-sa-dashboard') renderDashboard();
        if (sectionId === 'section-sa-applications') renderApplicationsReport();
        if (sectionId === 'section-sa-admissions') renderAdmissionsReport();
        if (sectionId === 'section-sa-analysis') renderAnalysis();
    }

    // ============================================================
    // 4. DASHBOARD
    // ============================================================

    function renderDashboard() {
        var data = filterData();
        var totalApps = sumField(data, 'applications');
        var totalReg = sumField(data, 'registered');
        var activeColleges = [];
        $.each(data, function (_, d) { if ($.inArray(d.college, activeColleges) < 0) activeColleges.push(d.college); });

        $('#saKpiApps').text(totalApps.toLocaleString());
        $('#saKpiReg').text(totalReg.toLocaleString());
        $('#saKpiRatio').text(totalApps > 0 ? Math.round((totalReg / totalApps) * 100) + '%' : '—');
        $('#saKpiColleges').text(activeColleges.length);

        // District chart
        var districtData = {};
        $.each(data, function (_, d) { districtData[d.district] = (districtData[d.district] || 0) + d.applications; });
        var maxDist = Math.max.apply(null, $.map(districtData, function (v) { return v; })) || 1;
        var $distBars = $('#districtBars').empty();
        var distColors = ['var(--clr-primary)', 'var(--clr-secondary)', 'var(--clr-tertiary)', '#5b8a72', '#7a5230', '#3d6b5e'];
        var ci = 0;
        $.each(districtData, function (dist, count) {
            var pct = Math.round((count / maxDist) * 100);
            $distBars.append(
                '<div class="bar-row"><span class="bar-label">' + dist + '</span>' +
                '<div class="bar-track"><div class="bar-fill" style="width:' + pct + '%;background:' + distColors[ci % distColors.length] + '"><span>' + count + '</span></div></div>' +
                '<span class="bar-value">' + count + '</span></div>'
            );
            ci++;
        });

        // Course donut
        var courseData = {};
        $.each(data, function (_, d) { courseData[d.course] = (courseData[d.course] || 0) + d.applications; });
        var courseColors = { 'B.A': 'var(--clr-primary)', 'B.Sc': 'var(--clr-secondary)', 'B.Com': 'var(--clr-tertiary)', 'B.A Law': 'var(--clr-outline)' };
        var courseKeys = Object.keys(courseData);
        var total = sumField(data, 'applications');
        var angles = [0];
        $.each(courseKeys, function (i, k) { angles.push(angles[i] + Math.round((courseData[k] / total) * 360)); });
        var css = {};
        if (courseKeys[0]) { css['--seg1-color'] = courseColors[courseKeys[0]] || 'var(--clr-primary)'; css['--seg1-end'] = angles[1] + 'deg'; }
        if (courseKeys[1]) { css['--seg2-color'] = courseColors[courseKeys[1]] || 'var(--clr-secondary)'; css['--seg2-end'] = angles[2] + 'deg'; }
        if (courseKeys[2]) { css['--seg3-color'] = courseColors[courseKeys[2]] || 'var(--clr-tertiary)'; css['--seg3-end'] = angles[3] + 'deg'; }
        if (courseKeys[3]) { css['--seg4-color'] = courseColors[courseKeys[3]] || 'var(--clr-outline)'; }
        $('#courseDonut').css(css);
        $('#courseDonutTotal').text(total);

        var $legend = $('#courseDonutLegend').empty();
        $.each(courseData, function (course, count) {
            var pct = Math.round((count / total) * 100);
            $legend.append('<div class="d-flex align-items-center gap-2 mb-2"><span class="rounded-circle d-inline-block" style="width:12px;height:12px;background:' + (courseColors[course] || '#ccc') + ';"></span><span class="small fw-semibold">' + course + ': ' + count + ' (' + pct + '%)</span></div>');
        });

        // Gender stacked
        var totalMale = sumField(data, 'male');
        var totalFemale = sumField(data, 'female');
        var gTotal = totalMale + totalFemale;
        $('#genderMalePct').css('width', Math.round((totalMale / gTotal) * 100) + '%').find('span').text('Male: ' + totalMale);
        $('#genderFemalePct').css('width', Math.round((totalFemale / gTotal) * 100) + '%').find('span').text('Female: ' + totalFemale);

        // Monthly trend (mock data)
        var months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov'];
        var monthVals = [Math.round(total * 0.1), Math.round(total * 0.25), Math.round(total * 0.35), Math.round(total * 0.2), Math.round(total * 0.1)];
        var maxMonth = Math.max.apply(null, monthVals);
        var $trend = $('#monthlyTrend').empty();
        $.each(months, function (i, m) {
            var pct = Math.round((monthVals[i] / maxMonth) * 100);
            $trend.append(
                '<div class="bar-row"><span class="bar-label">' + m + '</span>' +
                '<div class="bar-track"><div class="bar-fill" style="width:' + pct + '%;background:var(--clr-primary);"><span>' + monthVals[i] + '</span></div></div>' +
                '<span class="bar-value">' + monthVals[i] + '</span></div>'
            );
        });
    }

    // ============================================================
    // 5. APPLICATIONS REPORT
    // ============================================================

    function renderApplicationsReport() {
        var data = filterData();
        var $tbody = $('#appReportBody').empty();
        $.each(data, function (_, d) {
            var convPct = d.applications > 0 ? Math.round((d.registered / d.applications) * 100) : 0;
            $tbody.append(
                '<tr><td class="fw-semibold">' + getCollegeName(d.college) + '</td>' +
                '<td>' + d.district + '</td><td>' + d.course + '</td>' +
                '<td class="cell-number">' + d.applications + '</td>' +
                '<td class="cell-number">' + d.registered + '</td>' +
                '<td class="cell-number">' + (d.applications - d.registered) + '</td>' +
                '<td><div class="d-flex align-items-center gap-2"><div class="cell-bar-track flex-grow-1"><div class="cell-bar-fill" style="width:' + convPct + '%;"></div></div><span class="small fw-bold">' + convPct + '%</span></div></td></tr>'
            );
        });
        $('#appReportCount').text(data.length + ' records');
    }

    // ============================================================
    // 6. ADMISSIONS REPORT
    // ============================================================

    function renderAdmissionsReport() {
        var data = filterData();
        var $tbody = $('#admReportBody').empty();
        $.each(data, function (_, d) {
            var fillPct = d.seats > 0 ? Math.round((d.registered / d.seats) * 100) : 0;
            $tbody.append(
                '<tr><td class="fw-semibold">' + getCollegeName(d.college) + '</td>' +
                '<td>' + d.course + '</td>' +
                '<td class="cell-number">' + d.seats + '</td>' +
                '<td class="cell-number">' + d.registered + '</td>' +
                '<td class="cell-number">' + (d.seats - d.registered) + '</td>' +
                '<td><span class="small fw-bold d-flex align-items-center gap-2"><div class="cell-bar-track flex-grow-1" style="max-width:80px;"><div class="cell-bar-fill" style="width:' + fillPct + '%;background:' + (fillPct >= 80 ? 'var(--clr-primary)' : fillPct >= 50 ? 'var(--clr-tertiary)' : 'var(--clr-error)') + ';"></div></div>' + fillPct + '%</span></td>' +
                '<td>' + d.male + ' / ' + d.female + '</td>' +
                '<td class="small">' + d.st + ' / ' + d.sc + ' / ' + d.obc + ' / ' + d.gen + '</td></tr>'
            );
        });
    }

    // ============================================================
    // 7. ANALYSIS
    // ============================================================

    function renderAnalysis() {
        var data = filterData();
        // College performance bars
        var collegeTotals = {};
        $.each(data, function (_, d) {
            if (!collegeTotals[d.college]) collegeTotals[d.college] = { apps: 0, reg: 0, seats: 0, name: getCollegeName(d.college) };
            collegeTotals[d.college].apps += d.applications;
            collegeTotals[d.college].reg += d.registered;
            collegeTotals[d.college].seats += d.seats;
        });
        var $perfBars = $('#collegePerformance').empty();
        $.each(collegeTotals, function (_, ct) {
            var fillPct = ct.seats > 0 ? Math.round((ct.reg / ct.seats) * 100) : 0;
            $perfBars.append(
                '<div class="mb-3"><div class="d-flex justify-content-between mb-1"><span class="small fw-semibold">' + ct.name + '</span><span class="small fw-bold">' + fillPct + '% filled</span></div>' +
                '<div class="d-flex gap-2"><div class="flex-grow-1"><div class="cell-bar-track" style="height:10px;"><div class="cell-bar-fill" style="width:' + Math.round((ct.apps / Math.max(ct.apps, ct.seats)) * 100) + '%;height:100%;background:var(--clr-outline-variant);border-radius:5px;"></div></div><span class="small text-outline">Apps: ' + ct.apps + '</span></div>' +
                '<div class="flex-grow-1"><div class="cell-bar-track" style="height:10px;"><div class="cell-bar-fill" style="width:' + fillPct + '%;height:100%;background:var(--clr-primary);border-radius:5px;"></div></div><span class="small text-primary-custom">Registered: ' + ct.reg + ' / ' + ct.seats + '</span></div></div></div>'
            );
        });

        // District summary cards
        var districtSummary = {};
        $.each(data, function (_, d) {
            if (!districtSummary[d.district]) districtSummary[d.district] = { apps: 0, reg: 0 };
            districtSummary[d.district].apps += d.applications;
            districtSummary[d.district].reg += d.registered;
        });
        var $distCards = $('#districtSummaryCards').empty();
        var satColors = function (pct) { return pct >= 70 ? 'var(--clr-primary)' : pct >= 40 ? 'var(--clr-tertiary)' : 'var(--clr-error)'; };
        $.each(districtSummary, function (dist, s) {
            var convPct = s.apps > 0 ? Math.round((s.reg / s.apps) * 100) : 0;
            $distCards.append(
                '<div class="col-md-4 col-6"><div class="p-3 rounded-3 bg-surface-container-lowest border" style="border-color:rgba(188,201,195,0.2)!important;">' +
                '<h6 class="fw-bold mb-2">' + dist + '</h6>' +
                '<div class="d-flex justify-content-between mb-1"><span class="small text-on-surface-variant">Applications</span><span class="small fw-bold">' + s.apps + '</span></div>' +
                '<div class="d-flex justify-content-between mb-1"><span class="small text-on-surface-variant">Registered</span><span class="small fw-bold">' + s.reg + '</span></div>' +
                '<div class="d-flex justify-content-between mb-2"><span class="small text-on-surface-variant">Conversion</span><span class="small fw-bold" style="color:' + satColors(convPct) + ';">' + convPct + '%</span></div>' +
                '<div class="cell-bar-track"><div class="cell-bar-fill" style="width:' + convPct + '%;background:' + satColors(convPct) + ';"></div></div></div></div>'
            );
        });

        // Session comparison
        var currentSession = $('#filterSession').val() || '2024-25';
        var prevSession = currentSession === '2024-25' ? '2023-24' : '2024-25';
        var currTotal = sumField($.grep(DATA, function (d) { return d.session === currentSession; }), 'applications');
        var prevTotal = sumField($.grep(DATA, function (d) { return d.session === prevSession; }), 'applications');
        var growth = prevTotal > 0 ? Math.round(((currTotal - prevTotal) / prevTotal) * 100) : 0;
        $('#trendCurrent').text(currTotal);
        $('#trendPrevious').text(prevTotal);
        $('#trendGrowth').text((growth >= 0 ? '+' : '') + growth + '%').removeClass('up down').addClass(growth >= 0 ? 'up' : 'down');
        $('#trendCurrentLabel').text(currentSession);
        $('#trendPreviousLabel').text(prevSession);
    }

    // ============================================================
    // 8. CSV EXPORT
    // ============================================================

    function exportCSV(tableId, filename) {
        var csv = [];
        var $table = $('#' + tableId);
        $table.find('tr').each(function () {
            var row = [];
            $(this).find('th, td').each(function () { row.push('"' + $(this).text().replace(/"/g, '""').trim() + '"'); });
            csv.push(row.join(','));
        });
        var blob = new Blob([csv.join('\n')], { type: 'text/csv' });
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename + '.csv';
        a.click();
    }

    // ============================================================
    // 9. EVENT BINDINGS
    // ============================================================

    function initEvents() {
        $(document).on('click', '.sidebar-admin .sidebar-nav-item[data-section]', function (e) {
            e.preventDefault();
            showSection($(this).data('section'));
        });

        // Filters
        $(document).on('change', '.sa-filter', function () {
            if (currentSection === 'section-sa-dashboard') renderDashboard();
            else if (currentSection === 'section-sa-applications') renderApplicationsReport();
            else if (currentSection === 'section-sa-admissions') renderAdmissionsReport();
            else if (currentSection === 'section-sa-analysis') renderAnalysis();
        });

        // Export
        $(document).on('click', '#btnExportApps', function () { exportCSV('appReportTable', 'applications_report'); });
        $(document).on('click', '#btnExportAdm', function () { exportCSV('admReportTable', 'admissions_report'); });
        $(document).on('click', '.btn-print-report', function () { window.print(); });

        // Sign out
        $(document).on('click', '.btn-admin-signout', function () {
            localStorage.removeItem('emmis_he_logged_in');
            window.location.href = 'index.html';
        });
    }

    // ============================================================
    // 10. INIT
    // ============================================================

    $(function () {
        initEvents();
        showSection('section-sa-dashboard');
    });

})(jQuery);
