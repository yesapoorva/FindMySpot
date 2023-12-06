data = "2023-11-26T07:00:00.000Z";

const dd = new Date(data);

console.log("new date===", dd);
console.log(typeof dd);

let cc = dd.toLocaleDateString();
console.log(cc);

function convertTime(timeString) {
  const dateObj = new Date(timeString);
  let localDate = dateObj.toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
  });
  let localTime = dateObj.toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
  });

  return { localDate: localDate, localTime: localTime };
}

console.log(convertTime(data).localTime);
console.log(convertTime(data).localDate);
