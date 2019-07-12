$("#search-btn").on("click", function () {
    var topic = $("#search-topic").val()
    var records = ($("#search-records option:selected").text());
    var startYear = $("#start-year").val()
    var endYear = $("#end-year").val()
    var queryURL = ""
    var exception = false
    
    // Empty results when a search is made
    $("#results").empty()

    // Checks if user input is not a number
    if (isNaN(startYear) === true || isNaN(endYear) === true) {
        alert("The Start and End Year must be numbers")
        exception = true
    }
    // Checks if Start and End Year values exist and are 4 digits
    else if ((startYear && startYear.length !== 4) || (endYear && endYear.length !== 4)) {
        alert("The Start and End Year must be 4 digits")
        exception = true
    }
    // Checks if Start Year is after End Year
    else if ((startYear && endYear) && startYear > endYear) {
        alert("The End Year must be after the Start Year")
        exception = true
    }

    // If Start or End Year have errors, do not make a query
    if (!exception) {
        // If both Start and End Year are requested
        if (startYear && endYear) {
            queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=" + topic + "&begin_date=" + startYear + "0101&end_date=" + endYear + "1231&api-key=CS8zhBsER5U78SP1p8e0kKSGoAeeVfpD"
        } 
        // If Start Year is requested but not End Year
        else if (startYear && !endYear) {
            queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=" + topic + "&begin_date=" + startYear + "0101&api-key=CS8zhBsER5U78SP1p8e0kKSGoAeeVfpD"
        }
        // If End Year is requested but not Start Year
        else if (!startYear && endYear) {
            queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=" + topic + "&end_date=" + endYear + "1231&api-key=CS8zhBsER5U78SP1p8e0kKSGoAeeVfpD"
        }
        // If neither Start Year nor End Year are requested
        else {
            queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + topic + "&api-key=CS8zhBsER5U78SP1p8e0kKSGoAeeVfpD"
        }
        
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (resp) {
            var results = resp.response.docs;
            console.log(results)

            // Checks if there are as many matches as number of records requested
            if (results.length < records) {
                alert("There are not as many matching articles as you requested")
            } 
            
            else {
                for (i = 0; i < records; i++) {                
                    var heading = $("<h1 class=heading>")
                    var newResult = $("<div class=newResult>")
        
                    heading.html("Article "+ (i+1))
                    newResult.html(results[i].snippet + "<br>" +"<a href="+results[i].web_url+">Click to read the full story</a>")
                    $("#results").append(heading, newResult);
                   
                    $(".newResult").css({
                        "margin-bottom": "8px",
                        "background":"#efefef",
                        "text-align": "center"
                    })
                    $(".heading").css({
                        "background":"#efefef",
                        "text-align": "center",
                        "font-size":"18px",
                        "margin": "0px"
                    })
                }
            }
        })
    }
})