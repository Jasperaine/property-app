$(document).ready(function () {

    // global variable used to store JSON data

    var houseObj = {};

    // search onClick function

    $("#search").click(function () {

        // clears previous search results and property details for each new search

        $("#resultsList").html("");
        $("#results").html("");

        $("#address").html("");
        $("#desc").html("");
        $("#type").html("");
        $("#price").html("");
        $("#bedrooms").html("");
        $("#agent").html("");
        $("#status").html("");
        $("#contact").html("");

        // variables storing options selected + place id

        var location = $("select#location option:checked").val();
        var minPrice = $("select#minPrice option:checked").val();
        var maxPrice = $("select#maxPrice option:checked").val();
        var beds = $("select#beds option:checked").val();
        var placeId;

        // JSON request for location of search

        $.getJSON("http://index1.homeflow.co.uk/places?api_key=" + config.key + "&search[name]=" + location, function (data) {

            placeId = data.result.locations.elements[0].place_id;

            // JSON request for properties within requested location

            $.getJSON("http://index1.homeflow.co.uk/properties?api_key=" + config.key + "&search[place][id]=" + placeId + "&[search][channel]=sales", function (data2) {

                
                // variable storing the total number of filtered results found

                var resultsFound = 0;

                // assigning JSON data to global variable

                houseObj = data2.result.properties.elements;

                // for loop filtering and appending relevent properties to DOM

                for (var i = 0; i < houseObj.length ; i++) {

                    // variables storing individual data

                    // var img = houseObj[i].assets.image;
                    var address = houseObj[i].display_address;
                    var type = houseObj[i].property_type;
                    var priceValue = houseObj[i].price_value;
                    var priceDisplay = houseObj[i].price;
                    var bedrooms = houseObj[i].bedrooms;

                    // if statement to filter relevent properties and append to DOM

                    if (priceValue > minPrice && priceValue < maxPrice && bedrooms == beds) {
                        resultsFound++;
                        $("#resultsList").append(
                           /* " <div class='results'> <img src'" + img + "' alt='thumbnail'> */ "<div id='" + i + "'> <div class='address'>" + address + "</div> <div class='type'>Type: " + type + "<div class='price'>Price: " + priceDisplay + "</div> <div>Bedrooms: " + bedrooms + "</di> <button class='btn btn-default view-more' id='" + i + "'>View</button><hr>");
                    }

                    // if statement covering 6+ bedroom property results

                    if (beds == 6) {
                        if (priceValue > minPrice && priceValue < maxPrice && bedrooms >= 6) {
                            resultsFound++;
                            console.log('hello');
                            $("#resultsList").append(
                               /* " <div class='results'> <img src'" + img + "' alt='thumbnail'> */ "<div id='" + i + "'> <div class='address'>" + address + "</div> <div class='type'>Type: " + type + "<div class='price'>Price: " + priceDisplay + "</div> <div>Bedrooms: " + bedrooms + "</di> <button class='btn btn-default view-more' id='" + i + "'>View</button><hr>");
                        }
                    }
                }

                // if statement appending relevant search results found

                if (resultsFound == 1) {
                    $("#results").append(resultsFound + " house found <hr>");
                } else if (resultsFound == 0) {
                    $("#results").append("No houses found <hr>");
                } else {
                    $("#results").append(resultsFound + " houses found <hr>");
                }

            });
        });
    });

    // onClick function to display property details

    $(document).on('click', '.view-more', function () {

        // clears previous property details

        $("#address").html("");
        $("#desc").html("");
        $("#type").html("");
        $("#price").html("");
        $("#bedrooms").html("");
        $("#agent").html("");
        $("#status").html("");
        $("#contact").html("");

        // id variable used to locate relevent data to display

        var id = event.target.id;

        // appending relevant data to property details section using id

        $("#address").append(houseObj[id].display_address + "<hr>");
        $("#type").append("Type: " + houseObj[id].property_type + "<hr>");
        $("#price").append("Price: " + houseObj[id].price + "<hr>");
        $("#bedrooms").append("Bedrooms: " + houseObj[id].bedrooms + "<hr>");
        $("#agent").append("Agency: <a href='" + houseObj[id].agency.external_domain + "' target='blank'>" + houseObj[id].agency.agency_name + "</a> <hr>");
        $("#status").append("Status: " + houseObj[id].status + "<hr>");
        $("#contact").append("Contact: " + houseObj[id].contact_telephone + "<hr>");
        $("#desc").append(houseObj[id].short_description);
    });

});