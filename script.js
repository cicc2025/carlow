window.onload = function () {
setTimeout(_ => document.body.style.cssText = "opacity: 1; transition: 1s;",3000)
}
// start main clock
function putTimeByClassName(name, seconds) {
  let h = new Date().getHours();
  let m = new Date().getMinutes();
  let s = new Date().getSeconds();
  let day;
  if (h == 12) {
    day = "pm";
  } else if (h > 12) {
    h = `${h - 12}`;
    day = "pm";
  } else {
    day = "am";
  }
  if (seconds) {
    document.querySelector(`.${name}`).textContent = `${h == 0 ? 12 : h}:${
      m < 10 ? `0${m}` : m
    }:${s < 10 ? `0${s}` : s}${day}`;
  } else {
    document.querySelector(`.${name}`).textContent = `${h == 0 ? 12 : h}:${
      m < 10 ? `0${m}` : m
    }${day}`;
  }
}
setInterval(putTimeByClassName, 1000, "time", true);
// end main clock
// start hijri date and miladi date
const normalMonths = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

async function hijriDate() {
  let year = new Date().getFullYear();
  let day = new Date().getDate();
  let month = new Date().getMonth() + 1;
  document.querySelector(".miladi").textContent = `${day}/${
    normalMonths[month - 1]
  }/${year}g`;
  try {
    await fetch(`http://api.aladhan.com/v1/gToH/${day}-${month}-${year}?`)
      .then(async function (res) {
        if (res.ok && res.status === 200) {
          res = await res.json();
          return res;
        } else {
          throw Error(" can't fetch data");
        }
      })
      .then((res) => {
        let date = res.data.hijri;
        document.querySelector(".hijri").textContent =
          `${date.day || "---"}/${date.month.en || "---"}/${
            date.year + "h" || "---"
          }` || "";
      });
  } catch (e) {
    console.log(e);
  }
}
hijriDate();
setInterval(hijriDate, 60000);
// end hijri date and miladi date
// start inserting azan time

// start adjust time to make it for e.g from 15:53 -> 3:53pm
function formater(time) {
  let result;
  if (time) {
    if (!isNaN(time.slice(0,2))) {
      if (time.slice(0,2) == 12) {
        result = `${time}pm`
      } else if (time.slice(0,2) > 12) {
        result = `${time.slice(0,2) - 12}${time.slice(2)}pm`
      } else {
        result = `${time}am`;
      }
    } else {
      result = `${time}am`;
    }
  }
  return result;
}
// end adjust time to make it for e.g from 15:53 -> 3:53pm

async function getTimes() {
  try {
    await fetch(
      "./index.json"
    )
      .then((e) => {
        if (e.ok && e.status == 200) return e.json();
      })
      .then((e) => {
        let newDate = new Date();
        let Dday = newDate.getDate();
        let Dmonth = newDate.getMonth() + 1;
        let data;
        for (let i = 0; i < e.length; i++) {
          let [day,month] = e[i].Date.split("/");
          if (Dday == day && Dmonth == month) {
            data = e[i];
          }
        }
        document.querySelector(".fajr-azan").textContent = formater(data.Fajr);
        document.querySelector(".fajr-azan").setAttribute("time",data.Fajr);

        document.querySelector(".duhr-azan").textContent = formater(data.Dhuhr);
        document.querySelector(".duhr-azan").setAttribute("time",data.Dhuhr);

        document.querySelector(".asr-azan").textContent = formater(data.Asr);
        document.querySelector(".asr-azan").setAttribute("time",data.Asr);

        document.querySelector(".maghrib-azan").textContent = formater(data.Maghrib);
        document.querySelector(".maghrib-azan").setAttribute("time",data.Maghrib);
        
        document.querySelector(".isha-azan").textContent = formater(data.Isha);
        document.querySelector(".isha-azan").setAttribute("time",data.Isha);
      });
  } catch (e) {
    console.log(e);
  }
}
getTimes();
setInterval(getTimes,60000)
// end inserting azan time
// start highliting next prayer
let prevPrayer;
let currentPrayer;
let nextPrayer;
function heighlight() {

  if (document.querySelector(".fajr-iqama")) {
    let hours = new Date().getHours();
    let minutes = new Date().getMinutes();
    let fajr = document.querySelector(".fajr-iqama");
    let duhr = document.querySelector(".duhr-iqama");
    let asr = document.querySelector(".asr-iqama");
    let maghrib = document.querySelector(".maghrib-iqama");
    let isha = document.querySelector(".isha-iqama");
    let clock = `${hours}.${minutes.toString().padStart(2,"0")}`;
    function queryInsert(prayer) {document.querySelectorAll(`.${prayer}-related`).forEach(e => e.classList.add("active"))};
    function adj(prayer) {return prayer.getAttribute("time").split(":").join(".")}
    let activeAmount = 0;
    document.querySelectorAll(`.active`).forEach(e => {
      ++activeAmount;
      if (activeAmount > 3) {


          document.querySelector(".close-sound-container").style.backgroundColor = "#ff8100"
        setTimeout(_ => document.querySelector(".phone").classList.add("phone-trans") ,600)
        setTimeout(_ => document.querySelector(".top-bar").classList.add("top-bar-trans"),1000)
        setTimeout(_ => document.querySelector(".noti-icon").classList.add("noti-icon-trans"),1000)
        setTimeout(_ => document.querySelector(".slide-x").classList.add("slide-x-trans"),1900)
        setTimeout(_ => {
          setTimeout(_ => document.querySelector(".close-sound-container").style.backgroundColor = "transparent",1500)
          document.querySelector(".slide-x").classList.remove("slide-x-trans") 
          setTimeout(_ => document.querySelector(".top-bar").classList.remove("top-bar-trans"),650)
        setTimeout(_ => document.querySelector(".noti-icon").classList.remove("noti-icon-trans"),650)
        setTimeout(_ => document.querySelector(".phone").classList.remove("phone-trans"),950)
        
        }, 5000)

        
        
        new Audio("./iqamaBeeb.mp3").play();
        document.querySelectorAll(`.active`).forEach(e => e.classList.remove("active"))
      }
    })
    if (parseFloat(clock) >= parseFloat(adj(isha)) || parseFloat(clock) < parseFloat(adj(fajr))) {
      queryInsert("fajr");
      document.querySelectorAll(".prog-title")[1].textContent = "Fajr"

      if (parseFloat(clock) >= 0) {
        prevPrayer = document.querySelector(".isha-iqama").getAttribute("time") + ":d";

      }else {
        prevPrayer = document.querySelector(".isha-iqama").getAttribute("time");
        console.log(clock)
      }





      currentPrayer = document.querySelector(".fajr-iqama").getAttribute("time");
      nextPrayer = document.querySelector(".duhr-iqama").getAttribute("time");
    }else if (parseFloat(clock) >= parseFloat(adj(fajr)) && parseFloat(clock) < parseFloat(adj(duhr))) {
      document.querySelectorAll(".prog-title")[1].textContent = "Duhr"
      queryInsert("duhr");
      prevPrayer = document.querySelector(".fajr-iqama").getAttribute("time");
      currentPrayer = document.querySelector(".duhr-iqama").getAttribute("time");
      nextPrayer = document.querySelector(".asr-iqama").getAttribute("time");
    }else if (parseFloat(clock) >= parseFloat(adj(duhr)) && parseFloat(clock) < parseFloat(adj(asr))) {
      queryInsert("asr");
      document.querySelectorAll(".prog-title")[1].textContent = "Asr"
      prevPrayer = document.querySelector(".duhr-iqama").getAttribute("time");
      currentPrayer = document.querySelector(".asr-iqama").getAttribute("time");
      nextPrayer = document.querySelector(".maghrib-iqama").getAttribute("time");
    }else if (parseFloat(clock) >= parseFloat(adj(asr)) && parseFloat(clock) < parseFloat(adj(maghrib))) {
      queryInsert("maghrib");
      document.querySelectorAll(".prog-title")[1].textContent = "Maghrib"
      prevPrayer = document.querySelector(".asr-iqama").getAttribute("time");
      currentPrayer = document.querySelector(".maghrib-iqama").getAttribute("time");
      nextPrayer = document.querySelector(".isha-iqama").getAttribute("time");
    }else if (parseFloat(clock) >= parseFloat(adj(maghrib)) && parseFloat(clock) < parseFloat(adj(isha))) {
      queryInsert("isha");
      document.querySelectorAll(".prog-title")[1].textContent = "Isha"
      prevPrayer = document.querySelector(".maghrib-iqama").getAttribute("time");
      currentPrayer = document.querySelector(".isha-iqama").getAttribute("time");
      nextPrayer = document.querySelector(".fajr-iqama").getAttribute("time");
    }
    
  }

} 
heighlight()
setInterval(heighlight,1000);
// end highliting next prayer
// start donation progress

let collections = document.querySelector(".collections-progress .current span").textContent;
let collectionsGoal = document.querySelector(".collections-progress .end span").textContent;
let collectionsDegree = (collections / collectionsGoal) * 180;
document.querySelector(".amount-circle-prog").style.cssText = `background-image: conic-gradient(white, white ${collectionsDegree}deg, #00000029 0deg, #00000029 180deg, transparent 180deg ) !important;`

function nextPrayerFn() {
  let [currHours, currMins] = currentPrayer.split(":");
  let [prevHours, prevMins] = prevPrayer.split(":");
  let prevDate = new Date();
  prevDate.setHours(prevHours);
  prevDate.setMinutes(prevMins);
  prevDate.setSeconds(0);
  prevDate.setMilliseconds(0);
  if (prevPrayer.split(":")[2]) {
    prevDate.setTime(prevDate.getTime() - 86400000)
  }
  let currentDate = new Date();
  currentDate.setHours(currHours);
  currentDate.setMinutes(currMins);
  currentDate.setSeconds(0);
  currentDate.setMilliseconds(0);
  let date = new Date()
date.setTime( currentDate.getTime()  - new Date().getTime())
  let hoursDiff = (date.getHours() - 1);
  let MinutesDiff = date.getMinutes();
  let secondsDiff = date.getSeconds();
 let timeDown = ("-"+(hoursDiff ? hoursDiff + "h " : "") + (MinutesDiff ? MinutesDiff.toString().padStart(2,"0") + "m " : "") + (secondsDiff.toString().padStart(2,"0") + "s"))
 document.querySelector(".current-iqama").textContent = timeDown;
 document.querySelector(".start-iqama").textContent = `${formater(prevHours).slice(0,-2)}:${prevMins}${formater(prevHours).slice(-2)}`
 document.querySelector(".end-iqama").textContent = `${formater(currHours).slice(0,-2)}:${currMins}${formater(currHours).slice(-2)}`
 //////////////////////////////
let newDate = new Date();
let prog = ((newDate.getTime() - (prevDate.getTime())) / (currentDate.getTime() - prevDate.getTime()) * 180);
// console.log("new date   "+(prevDate.getTime() - newDate.getTime()))
// console.log("prev date  "+prevDate.getTime())
// console.log("curr date  "+currentDate.getTime())
// console.log("=====================")
if (prog > 365.00) {
  prog -= 365
}
document.querySelector(".iqama-circle-prog").style.cssText = ` background-image: conic-gradient(white, white ${prog < 0 ? -prog : prog}deg, #00000029 0deg, #00000029 180deg, transparent 180deg );`
/////////////////////////////
// let d = new Date()
// d.setTime(0);
// console.log(d.getHours())
}
nextPrayerFn()
setInterval(nextPrayerFn,1000)



// end next iqama time down
