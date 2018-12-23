document.addEventListener("DOMContentLoaded", function(event) {
  var sessionPlus = document.getElementById("session-plus");
  var sessionMinus = document.getElementById("session-minus");
  var breakPlus = document.getElementById("break-plus");
  var breakMinus = document.getElementById("break-minus");
  var start = document.getElementById("start-btn");
  var reset = document.getElementById("reset");
  var minutes = document.getElementById("minutes");
  var seconds = document.getElementById("seconds");
  var body = document.getElementsByTagName("BODY")[0];
  var intervalId;
  var session;
  var isBreak;

  //load events
  sessionPlus.onclick = addToSession;
  sessionMinus.onclick = subtractFromSession;
  breakPlus.onclick = addToBreak;
  breakMinus.onclick = subtractFromBreak;
  start.onclick = startSession;
  reset.onclick = resetSession;
  body.onkeydown = function(e) {
    keyEvent(e);
  };
});

function timer(minutes) {
  this.duration = minutes;
  this.minutes = minutes;
  this.seconds = 0;
  this.break = false;
  this.useSeconds = function(seconds) {
    if (seconds > 0) {
      if (this.seconds > 0) {
        this.seconds -= seconds;
      } else if (this.seconds == 0 && this.minutes > 0) {
        this.minutes -= seconds;
        this.seconds = 59;
      } else {
        this.break = !this.break;
      }
    }
  };

  this.setTimer = function(duration) {
    this.minutes = duration;
    this.duration = duration;
  };

  this.progress = function() {
    return ((this.minutes + this.seconds / 60) / this.duration) * 100;
  };
}

function startSession() {
  var startIcon = document.getElementById("start-btn");
  var sessionDuration = document.getElementById("session-duration");
  var startButtonStatus = start.className;
  switch (startButtonStatus) {
    case "play":
      if (isMinutes(sessionDuration.value)) {
        startIcon.className = startIcon.className.replace(
          /\bfa-play-circle\b/g,
          "fa-pause-circle"
        );
        minutes.firstChild.data = zeroPad(sessionDuration.value);
        session = new timer(Number(sessionDuration.value));
        intervalId = window.setInterval(function() {
          updateTime(session);
        }, 1000);
        start.className = "pause";
        break;
      } else {
        document.getElementById("error").play();
        setTimeout(function() {
          window.alert("You need minutes in your session!!!");
        }, 10);
        break;
      }
    case "pause":
      clearInterval(intervalId);
      startIcon.className = startIcon.className.replace(
        /\bfa-pause-circle\b/g,
        "fa-play-circle"
      );
      start.className = "restart";
      break;

    case "restart":
      startIcon.className = startIcon.className.replace(
        /\bfa-play-circle\b/g,
        "fa-pause-circle"
      );
      start.className = "pause";
      intervalId = window.setInterval(function() {
        updateTime(session);
      }, 1000);
  }
}

function resetSession() {
  var sessionDuration = document.getElementById("session-duration");
  var breakDuration = document.getElementById("break-duration");
  var startIcon = document.getElementById("start-btn");

  startIcon.className = startIcon.className.replace(
    /\bfa-pause-circle\b/g,
    "fa-play-circle"
  );
  if (intervalId) {
    clearInterval(intervalId);
  }
  start.className = "play";
  sessionDuration.value = 25;
  breakDuration.value = 5;
  minutes.firstChild.data = "25";
  seconds.firstChild.data = "00";
}

function addToSession() {
  var sessionDuration = document.getElementById("session-duration");
  sessionDuration.value = Number(sessionDuration.value) + 1;
}

function subtractFromSession() {
  var sessionDuration = document.getElementById("session-duration");
  sessionDuration.value = Number(sessionDuration.value) - 1;
}

function addToBreak() {
  var breakDuration = document.getElementById("break-duration");
  breakDuration.value = Number(breakDuration.value) + 1;
}

function subtractFromBreak() {
  var breakDuration = document.getElementById("break-duration");
  breakDuration.value = Number(breakDuration.value) - 1;
}

function zeroPad(n) {
  n = n.toString();
  return n.length < 2 ? zeroPad("0" + n, 2) : n;
}

function updateTime(session) {
  var sessionDuration = document.getElementById("session-duration");
  var breakDuration = document.getElementById("break-duration");
  var progress;

  session.useSeconds(1);
  progress = session.progress() + "%";
  minutes.firstChild.data = zeroPad(session.minutes);
  seconds.firstChild.data = zeroPad(session.seconds);
  document.getElementById("loading-progress").style.height = progress;

  if (session.seconds == 0 && session.minutes == 0) {
    if (!session.break) {
      if (isMinutes(breakDuration.value)) {
        document.getElementById("alarm").play();
        session.setTimer(breakDuration.value);
      } else {
        document.getElementById("error").play();
        setTimeout(function() {
          window.alert("You need minutes in your break!!!");
          resetSession();
        }, 10);
      }
    } else {
      if (isMinutes(sessionDuration.value)) {
        document.getElementById("alarm").play();
        session.setTimer(sessionDuration.value);
      } else {
        document.getElementById("error").play();
        setTimeout(function() {
          window.alert("You need minutes in your session!!!");
          resetSession();
        }, 10);
      }
    }

    session.break = !session.break;
  }
}

function isMinutes(value) {
  var input = Number(value);
  if (input > 0 && Number.isInteger(input)) {
    return true;
  } else {
    return false;
  }
}

function keyEvent(e) {
  if (e.keyCode == 32) {
    e.preventDefault();
    startSession();
  }
  if (e.keyCode == 82) {
    e.preventDefault();
    resetSession();
  }
}
