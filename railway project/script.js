// Initialize Firebase
var firebaseConfig = {
  // your firebase configuration here
  apiKey: "AIzaSyDYpdCTLAVCY7DoYRtdk9oO2sulLWnUaf4",
  authDomain: "railwaypnr-fc6d1.firebaseapp.com",
  projectId: "railwaypnr-fc6d1",
  storageBucket: "railwaypnr-fc6d1.appspot.com",
  messagingSenderId: "782694232370",
  appId: "1:782694232370:web:f336cced68cc9ea46a272b",
  measurementId: "G-YZN70C941G",
};
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

const options = {
  method: "GET",
  headers: {
    'X-RapidAPI-Key': 'eb931aa96emsh3f63a4f42268146p16e35ajsn8654a53c3b97',
		'X-RapidAPI-Host': 'pnr-status-indian-railway.p.rapidapi.com'
  },
};

//2463906207

const checkButton = document.getElementById("check-button");
const stationInput = document.getElementById("station-input");


const statusBtn = document.getElementById("click");

function redirect() {
  // Get the input values
  const pnrNumber = document.getElementById("pnr-number").value;
  const phoneNumber = document.getElementById("phn-number").value; //phone number k liye

  if (!pnrNumber && !phoneNumber) {
    alert("Please enter PNR number and phone number.");
    return; // Stop the function from proceeding further
  }
  
  window.location.href = `output.html?pnrNumber=${encodeURIComponent(
    pnrNumber
  )}&phoneNumber=${encodeURIComponent(phoneNumber)}`;
}

window.onload = function () {
  // Retrieve the URL parameters from the current page's URL
  const urlParams = new URLSearchParams(window.location.search);

  const pnrNumber = urlParams.get("pnrNumber");
  const phoneNumber = urlParams.get("phoneNumber");

  const responseContainer = document.getElementById("response-container");
  const div = document.getElementById("div");

  if(pnrNumber!= null && phoneNumber != null)
  {
    responseContainer.innerHTML = "Entered pnr number : " + pnrNumber + "<br>Entered phone number : " + phoneNumber 

     try
     {
      const url =
      "https://pnr-status-indian-railway.p.rapidapi.com/pnr-check/" + pnrNumber;

    fetch(url, options)
      .then((response) => response.json())
      .then((response) => 
      {
        div.innerHTML = "<b>TRAIN INFO : </b><br>" + "Name : " + response.data.trainInfo.name + "<br>Train No. : "  + response.data.trainInfo.trainNo + "<br>Date : " + response.data.trainInfo.dt +"<br>Boarding : "+response.data.trainInfo.boarding + "<br>Destination : " +
        response.data.trainInfo.destination + "<br><br><b>SEAT INFO : </b><br>" + "Berth : "+response.data.seatInfo.berth + "<br>Coach : "+response.data.seatInfo.coach;
        


      })
      .catch((err) => console.error(err));
    } catch
     {
         alert("Error");
     }

  }

};

function getStatus() {
  const urlParams = new URLSearchParams(window.location.search);

  const pnrNumber = urlParams.get("pnrNumber");
  const phoneNumber = urlParams.get("phoneNumber");

  const seatReq=document.getElementById('dropdown').value;//for the required seattype;


  const responseContainer = document.getElementById("response-container");

  if (pnrNumber) {
    const url =
      "https://pnr-status-indian-railway.p.rapidapi.com/pnr-check/" + pnrNumber;

    fetch(url, options)
      .then((response) => response.json())
      .then((response) => {
        // console.log(response.data.boardingInfo.platform);
        if (response.status == false) {
          console.log("INVALID PNR......");

          document.getElementById(
            "result"
          ).innerHTML = `<br><pre>${"INVALID PNR......"}</pre>`;

          alert("Invalid hai bhaiiii");
        } else {

          const statusContainer = document.getElementById("status-container");
          const myCon = document.getElementById("myCon");


          //const status = JSON.stringify(response, null, 2);
          console.log("entring in else block --------");

          //	statusContainer.innerHTML = `<pre>${status}</pre>`;

          var count = 0;
          const pnrStatusCollection = db.collection("pnr-status");

          const noOfSeats = response.data.seatInfo.noOfSeats;

          console.log("No. of seats found in response : " + noOfSeats);
          for (let index = 0; index < noOfSeats; index++) {
            const seatNumber = response.data.passengerInfo[index].currentBerthNo;
            seatType = getSeatType(seatNumber);

            // Add "seatType" field to the passenger object
            response.data.passengerInfo[index].seatType = seatType;
            const c =
              "<br>" +
              "For Passenger Number " +
              index +
              "," +
              " Seat Type is : " +
              seatType +
              "<br>";
            statusContainer.innerHTML = c;
          }

          pnrStatusCollection.get().then((querySnapshot) => {

            var count = 0;

            var num = 0;
            var g = 1;

            let fk = 0;

            var op = 1; ;
            querySnapshot.forEach((doc) => {

              console.log("doc no is ::: "+ op);

            try{ console.log("Tryyyyyyyyyyyyy");
              const dt = doc.data().status.data.trainInfo.dt;
              const trainNo = doc.data().status.data.trainInfo.trainNo;



              if (
                dt == response.data.trainInfo.dt &&
                trainNo == response.data.trainInfo.trainNo
              ) {
                num++;

                console.log(
                  "Doc No. " + g + "is matched with your respnse." + "/n"
                );

                // console.log("IDs having same dt and trainNo is " + doc.id);
                console.log("Item No : " + num + "\n");
                console.log(
                  "Coach : " + "\n" + doc.data().status.data.seatInfo.coach
                );
                console.log(
                  "Number Of Seats : " +
                    "\n" +
                    doc.data().status.data.seatInfo.noOfSeats
                );


              }
             
              const noOfSeats = doc.data().status.data.seatInfo.noOfSeats;
              const seatReq = document.getElementById("dropdown");
              const selectedSeatType = dropdown.value;


              

              for (let index = 0; index < noOfSeats; index++) {
                if (
                  selectedSeatType ===
                    doc.data().status.data.passengerInfo[index].seatType &&
                  pnrNumber !== doc.data().pnrNumber
                ) {
                  //comapring the seatReq with the database
                  fk++;

                  console.log("yuuuuurrrreeeekkaaaaaaaaaaaaaaaaaaaaaaaaaaaa");

                  const info =
                    "<br>" +
                    "For Passenger Number " +
                    index +
                    "<br>" +
                    "CBN : " +
                    doc.data().status.data.passengerInfo[index].currentBerthNo +
                    "<br>" +
                    "CC : " +
                    doc.data().status.data.passengerInfo[index].currentCoach +
                    "<br>" +
                    "ST : " +
                    doc.data().status.data.passengerInfo[index].seatType +
                    "<br>" +
                    "PhoneNo. : " +
                    doc.data().pnrNumber;
                  statusContainer.innerHTML += info;
                }
              }

              if (fk == 0) {
                myCon.innerHTML = "No Match Found";
              } else {
                myCon.innerHTML = " ";
              }

              if (pnrNumber == doc.data().pnrNumber) {
                count++;
              }
              console.log(seatReq);

              g++;

            }catch
            {

               console.log("catchhhhhhhhhhhh");

                  console.log("fuck offff");
            }
            op++;
            });




            if (count == 0) {

            

              // Save the modified data to the database

              console.log("Printing response : "+response.data)
             // pnrStatusCollection.add(response.data);



              // Add data to Firebase
              db.collection("pnr-status")
                .add({
                  pnrNumber: pnrNumber,
                  status: response,
                  phoneNumber: phoneNumber,
                })
                .then((docRef) => {
                  console.log("Document written with ID: ", docRef.id);
                  alert("PNR status added successfully!");

                /*   //Yhi theek krna hai tumko , 
                  so that ek baar sari processing hone k baad values pnr input ,
                   phn input wale box me padi na rahe ,
                   waha blank ho jae(Reset ho jana chaiye)  */

                 /*  mine these two lines arent working :)
                  document.getElementById("pnr-number").value = "";
                  document.getElementById("phn-number").value = ""; */

                  
                })
                .catch((error) => {
                  console.error("Error adding document: ", error);
                  alert("Error adding document. Please try again later.");
                });

                


            } else {
              console.log("Repeated pnr number : " + pnrNumber);
              responseContainer.innerHTML = `<pre>${
                "Repeated pnr number : " + pnrNumber
              }</pre>`;

                 

            }
          });
        }
      })
      .catch((err) => console.error(err));
  }
}

function getSeatType(seatNumber) {
  if (seatNumber % 8 === 1) {
    seatType = "Lower Berth";
  } else if (seatNumber % 8 === 2) {
    seatType = "Middle Berth";
  } else if (seatNumber % 8 === 3) {
    seatType = "Upper Berth";
  } else if (seatNumber % 8 === 4) {
    seatType = "Lower Berth";
  } else if (seatNumber % 8 === 5) {
    seatType = "Middle Berth";
  } else if (seatNumber % 8 === 6) {
    seatType = "Upper Berth";
  } else if (seatNumber % 8 === 7) {
    seatType = "Lower Berth";
  } else if (seatNumber % 8 === 0) {
    seatType = "Side Upper Berth";
  } else {
    seatType = "Invalid Seat Number";
  }

  return seatType;
}







/* 
countButton.addEventListener("click", () => {
  console.log("Main chla");
  const pnrStatusCollection = db.collection("pnr-status");

 
  pnrStatusCollection.get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      console.log(
        doc.id,
        " => ",
        doc.data().status.data.boardingInfo.stationId
      );
    });
  });
});
 */