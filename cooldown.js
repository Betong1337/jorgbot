const mysql = require('mysql');

TIME_QUIZ = false;
TIMEARR_QUIZ = [];

while (true) {
    var dt = new Date();
    var MINUTE = dt.getMinutes();

    if (TIME_QUIZ === false) {
        TIMEARR_QUIZ.push(MINUTE);
        TIME_QUIZ = true;
        NEXT_MINUTE = TIMEARR_QUIZ[0] + 5;
    }

    if (NEXT_MINUTE > 59) {
        NEXT_MINUTE = 0;
    }

    if (MINUTE === NEXT_MINUTE) {
        console.log("QUIZ COOLDOWN RESET");
        TIME_QUIZ = false;
        TIMEARR_QUIZ = [];
    }
}