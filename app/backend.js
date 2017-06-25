function getData(callback, output){
    var endpoint = "https://sheets.googleapis.com/v4/spreadsheets/";
    var sheet_id = "1MFBGJbOXVjtThgj5b6K0rv9xdsC1M2GQ0pJVB-8YCeU"
    var api_key = "AIzaSyAuStn0s5MooqGYM5dOXUuc-C_SiCmdZ5Y";
    var sheetname = "Form Responses 1"
    var url = endpoint + sheet_id + "/values/" + sheetname + "?key=" + api_key;
    
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if (req.readyState == 4 && req.status == 200)
            callback(req.responseText);
    }
    req.open('GET', url, true)
    req.send();
}

function parseData(data){
    data = JSON.parse(data).values;
    var formattedData = [];
    for (var i = 1; i < data.length; i++)
        formattedData = formattedData.concat(parseRow(data[i]));
    summarizeData(formattedData);
}

function parseRow(row){
    var responses = [];
    /* Column values for the source spreadsheetgotch
    ['timestamp', 
     'Course Name & ID', 'Difficulty', 'Time Commitment', 'Comments',
     'Quarter Taken',
     '2nd Course', 
     'Course Name & ID', 'Difficulty', 'Time Commitment', 'Comments',
     '3rd Course', 
     'Course Name & ID', 'Difficulty', 'Time Commitment', 'Comments']
    */
    
    var timestamp = row[0];
    var quarter = row[5]
    
    var firstResponse = {};
    firstResponse.courseID = row[1];
    firstResponse.quarterTaken = quarter;
    firstResponse.difficulty = row[2];
    firstResponse.timeSpent = row[3];
    firstResponse.studentComment = row[4];
    
    responses.push(firstResponse);
    
    
    if (row[6] == "Yes") {
        var secondResponse = {};
        secondResponse.courseID = row[7];
        secondResponse.quarterTaken = quarter;
        secondResponse.difficulty = row[8];
        secondResponse.timeSpent = row[9];
        secondResponse.studentComment = row[10];
        
        responses.push(secondResponse);
        
        if (row[11] == "Yes") {
            var thirdResponse = {};
            thirdResponse.courseID = row[12];
            thirdResponse.quarterTaken = quarter;
            thirdResponse.difficulty = row[13];
            thirdResponse.timeSpent = row[14];
            thirdResponse.studentComment = row[15];
            
            responses.push(thirdResponse);
        }
    }
    return responses;
}

function summarizeData(data){
    var completeData = {};
    for (var i = 0; i < data.length; i++) {
        var currentResponse = data[i];
        var courseData = completeData[currentResponse.courseID];
        if (isEmpty(courseData)){
           courseData = newCourse();
        }
        courseData.difficulty[currentResponse.difficulty] += 1;
        courseData.timeSpent[currentResponse.timeSpent] += 1;
        if (currentResponse.studentComment != "" && currentResponse.studentComment != "null")
            courseData.comments.push(currentResponse.studentComment);
        completeData[currentResponse.courseID] = courseData;
    }
    
    localStorage.setItem("courseData", JSON.stringify(completeData));
}

function isEmpty(obj){
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop))
            return false;
    }
    return true;
}

function newCourse(){
     // initialize the object
    var course = {};
    course.difficulty = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
    };
    course.timeSpent = {
        "0-5 hours": 0,
        "6-12 hours": 0,
        "13-18 hours": 0,
        "18+ hours": 0,
    };
    course.comments = [];
    
    return course;
}

var data = [];
getData(parseData, data);