//Wait fot the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  //importing the college list div and search button
  let collegeList = document.querySelector("#collegeList"); //Div for collgList
  let searchBtn = document.querySelector("#searchBtn");

  //declaring variables to store the state and country
  let country;
  let state;

  //adding event listner to the search button
  searchBtn.addEventListener("click", async () => {
    //get the country and state value from their respective inputs
    state = capitalizeFirstLetter(
      document.querySelector("#stateInp").value.toLowerCase()
    );
    district = capitalizeFirstLetter(
      document.querySelector("#districtInp").value.toLowerCase()
    );
    console.log(state);
    console.log(district);

    //if both state and country are not provided
    if (!state && !district) {
      Swal.fire({
        title: "Enter State and District",
        icon: "error",
      });
      return;
    }

    //show a loading message sweet alert 2
    // Swal.fire({
    //   imageUrl: "images/searching.gif",
    //   imageWidth: 200,
    //   imageHeight: 200,
    //   imageAlt: "Custom image",
    //   title: "Searching...",
    //   allowOutsideClick: false,
    //   showConfirmButton: false,
    //   willOpen: () => {
    //     Swal.showLoading();
    //   },
    // });

    //getting college data from API
    let colleges = await getCollege(state, district);

    //clear the existing college list
    collegeList.innerHTML = "";
    //calling the fnc to show college list
    showCollegeList(colleges);

    //after showing college close the loading message
    Swal.close();
  });

  //FUNCTION -  to fetch college from API
  // async function getCollege(country) {
  //   const collegeAPI = `http://localhost:3001/getCollege?country=${country}`;
  //   try {
  //     let res = await axios.get(collegeAPI);
  //     return res.data;
  //   } catch (error) {
  //     console.log(error);
  //     Swal.fire({
  //       title: "Data Not Found",
  //       icon: "error",
  //     });
  //   }
  // }

  // FUNCTION -  to fetch college from API
  async function getCollege(state, district) {
    const collegeAPI = `http://localhost:3001/getCollege?state=${state}&district=${district}`;
    try {
      let res = await axios.get(collegeAPI);
      console.log(res.data);
      return res.data;
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Data Not Found",
        icon: "error",
      });
    }
  }

  //FUNCTION - to capitalize first letter - used for state
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  //Array for holding whole colleges data
  const collegesData = [];

  function showCollegeList(collList) {
    for (let coll of collList) {
      // Create college data object
      let collegeData = createCollegeData(coll);

      // Add college data to the array
      collegesData.push(collegeData);

      // Create college div
      let college = createCollegeDiv(collegeData);

      // Append college div to the college list
      collegeList.append(college);
    }
    saveAsCSV();
  }
  //function to create a college Data object
  function createCollegeData(coll) {
    return {
      name: coll["College Name"],
      district: coll["District Name"],
      state: coll["State Name"],
      collegeType: coll["College Type"],
    };
  }

  //FUNCTION - creating the main College Div
  function createCollegeDiv(collegeData) {
    let college = document.createElement("div");
    college.classList.add(
      "text-base",
      "md:text-3xl",
      "font-sans",
      "rounded-lg",
      "shadow-xl",
      "shadow-gray-800",
      "w-full",
      "px-4",
      "h-16",
      "bg-[#8D99AE]",
      "flex",
      "justify-evenly",
      "items-center",
      "gap-1",
      "even:bg-[#EDF2F4]"
    );

    // Create and append country flag
    let countryFlag = createCountryFlag();
    college.appendChild(countryFlag);

    // Create and append college name
    let collegeName = createCollegeName(collegeData.name);
    college.appendChild(collegeName);

    // Create and append college state
    let collegeLocation = createCollegeLocation(
      collegeData.district,
      collegeData.state
    );
    college.appendChild(collegeLocation);

    return college;
  }

  //FUNCTION - create country flag div and img
  function createCountryFlag() {
    let countryFlag = document.createElement("div");
    countryFlag.classList.add("w-12", "h-11");
    let flagImg = document.createElement("img");
    flagImg.src = "flag.png";
    flagImg.alt = "countryFlag";
    flagImg.classList.add("w-full", "h-full", "rounded-full");
    countryFlag.appendChild(flagImg);
    return countryFlag;
  }
  //FUNCTION college name div
  function createCollegeName(name) {
    let collegeName = document.createElement("div");
    collegeName.innerText = name;
    collegeName.classList.add(
      "w-48",
      "md:w-full",
      "text-center",
      "md:text-3xl"
    );
    return collegeName;
  }
  //FUNCTION  - createCollegeType
  function createCollegeLocation(Type) {
    let collegeType = document.createElement("div");
    collegeType.classList.add(
      "w-20",
      "md:w-3/12",
      "md:text-3xl",
      "flex",
      "justify-center",
      "items-center",
      "gap-1"
    );
    let stateIcon = document.createElement("i");
    stateIcon.classList.add("fa-solid", "fa-graduation-cap");
    collegeState.appendChild(stateIcon);

    let stateText = document.createElement("div");
    stateText.classList.add("md:text-3xl");
    stateText.innerText = district + " " + state;
    collegeState.appendChild(stateText);
    return collegeState;
  }

  //FUNCTION - create college Location - district, state
  function createCollegeLocation(district, state) {
    let collegeState = document.createElement("div");
    collegeState.classList.add(
      "w-20",
      "md:w-3/12",
      "md:text-3xl",
      "flex",
      "justify-center",
      "items-center",
      "gap-1"
    );
    let stateIcon = document.createElement("i");
    stateIcon.classList.add("fa-lg", "fa-solid", "fa-location-dot");
    collegeState.appendChild(stateIcon);

    let stateText = document.createElement("div");
    stateText.classList.add("md:text-3xl");
    stateText.innerText = district + " " + state;
    collegeState.appendChild(stateText);
    return collegeState;
  }

  //FUNCTION - to create a CSV
  function saveAsCSV() {
    // Create a new button element
    let saveCsvBtn = document.createElement("button");

    // Add classes to the button for styling
    saveCsvBtn.classList.add(
      "text-lg",
      "font-sans",
      "font-medium",
      "cursor-pointer",
      "group",
      "relative",
      "flex",
      "gap-1.5",
      "px-8",
      "py-4",
      "bg-[#E8F0FE]",
      "text-[#FF4444]",
      "rounded-3xl",
      "hover:bg-opacity-70",
      "transition",
      "font-semibold",
      "shadow-md"
    );

    // Set the inner HTML of the button to include the text and SVG icon
    saveCsvBtn.innerHTML = `
      Save as CSV
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="24px" width="24px">
        <g stroke-width="0" id="SVGRepo_bgCarrier"></g>
        <g stroke-linejoin="round" stroke-linecap="round" id="SVGRepo_tracerCarrier"></g>
        <g id="SVGRepo_iconCarrier">
          <g id="Interface / Download">
            <path stroke-linejoin="round" stroke-linecap="round" stroke-width="2" stroke="#FF4444" d="M6 21H18M12 3V17M12 17L17 12M12 17L7 12" id="Vector"></path>
          </g>
        </g>
      </svg>
    `;

    //event listner for save as CSV button
    saveCsvBtn.addEventListener("click", () => {
      // Initialize the CSV content with the appropriate data type and charset
      let csvContent = "data:text/csv;charset=utf-8,";

      // Add the header row to the CSV content
      let headerRow = "Country,Country flag, Name,State,Web";
      csvContent += headerRow + "\r\n";

      // Loop through the collegesData array and add each row to the CSV content
      collegesData.forEach(function (rowArray) {
        let row = [country, ...Object.values(rowArray)].join(",");
        csvContent += row + "\r\n";
      });

      // Encode the CSV content as a URI
      const encodedUri = encodeURI(csvContent);

      // Create a new anchor element and set its href attribute to the encoded URI
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `CollegeScope-${country}-${state}.csv`);

      // Append the anchor element to the body (required for Firefox)
      document.body.appendChild(link);

      // Simulate a click on the anchor element to start the download
      link.click();

      // Remove the anchor element from the body
      document.body.removeChild(link);
    });

    // Append the button to the collegeList element
    collegeList.appendChild(saveCsvBtn);
  }
});
