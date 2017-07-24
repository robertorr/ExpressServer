var main = function () {
    "use strict";

    var startTime = null;
    var getStartTime = function () {
        $.getJSON("/starttime.json", function (time) {
            startTime = time.starttime;
            console.log()
        });
    };

    var updateDOM = function (counts) {
        const mainSelector = "main .content";
        $(mainSelector).empty();
        $(mainSelector).append($("<h3>").text("Tweet Terms and Counts"));
        $(mainSelector).append($("<p>").text("Start: " + new Date(startTime)));
        $(mainSelector).append($("<p>").text("Now: " + new Date($.now())));
        $(mainSelector).append($("<br>"));

        var jqContent = $("<ul>");
        $.each(counts, function (term, count) {
            var listItem = $("<li>").text(term + ": " + count);
            jqContent.append(listItem);
        });
        $(mainSelector).append(jqContent);
    };

    var getCounts = function () {
        $.getJSON("/counts.json", updateDOM);
    };

    setInterval(getCounts, 5000);
    getStartTime();
    getCounts();
};

$(document).ready(main);
