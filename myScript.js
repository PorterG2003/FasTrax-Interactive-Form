
function populate5(fromCookie=false) {
  console.log("Populating 5");
  var data;
  var jsonString = getCookie("fastrax-form");
  if (jsonString) {
    var data = JSON.parse(jsonString);
  }
  if (fromCookie && data && data['Number of Units']) {
    $('#NumberOfUnitsInput').val(data['Number of Units']);
  }
  var numUnits = $('#NumberOfUnitsInput').val(); // Use .val() to get the value of the input field
  console.log("numUnits:", numUnits);
  if (numUnits < 1) {
    numUnits = 1;
    $('#NumberOfUnitsInput').val(1);
  }
  if (numUnits > 5) {
    numUnits = 5;
    $('#NumberOfUnitsInput').val(5);
  }
  
  var groupRow = $('#section5GroupRow');
  groupRow.html(''); // Use .html('') to clear the content of the groupRow

  for(var i = 0; i < numUnits; i++) {
    var group = `
    <div class="group" id="group${i}">
      <div class='input-group small'>
        <label class="labels" id="UnitNumberLabel${i}" for="UnitNumber">Unit Number</label> 
        <input id="UnitNumberInput${i}" type="text" name="Unit Number${i}">
      </div>
      <div class='input-group medium'>
        <label class="labels" id="DescriptionLabel${i}" for="Description">Description</label> 
        <input id="DescriptionInput${i}" type="text" name="Description${i}">
      </div>
      <div class='input-group small'>
        <label class="labels" id="LicenseLabel${i}" for="License">License</label> 
        <input id="LicenseInput${i}" type="text" name="License${i}">
      </div>
      <div class='input-group xxxsmall'>
        <label class="labels" id="StateLabel${i}" for="State">State</label> 
        <input id="StateInput${i}" type="text" name="State${i}">
      </div>
      <div class='input-group medium'>
        <label class="labels" id="VINLabel${i}" for="VIN">VIN</label> 
        <input id="VINInput${i}" type="text" name="VIN${i}">
      </div>
    </div>`;
    groupRow.append(group); // Use .append() to add the new group to the groupRow
  }

  $(document).find('.group').each(function () {
    var $thisGroup = $(this);
    $thisGroup.find('input').each(function () {
      var $thisInput = $(this);
      if (data && data[$thisInput.attr('name')]) {
        $thisInput.val(data[$thisInput.attr('name')]);
      }
    })
  });

  console.log("Populated 5");

  $('input').on('change', handleInputChange);
}

function populate6(fromCookie=false) {
  console.log("Populating 6");
  var data;
  var jsonString = getCookie("fastrax-form");
  if (jsonString) {
    var data = JSON.parse(jsonString);
  }
  if (fromCookie && data && data['Number of Axle Groups']) {
    $('#NumOfGroupsInput').val(data['Number of Axle Groups']);
  }
  var numUnits = $('#NumOfGroupsInput').val(); // Use .val() to get the value of the input field
  console.log("num Axle Groups:", numUnits);
  if (numUnits < 2) {
    numUnits = 2;
    $('#NumOfGroupsInput').val(2);
  }
  if (numUnits > 6) {
    numUnits = 6;
    $('#NumOfGroupsInput').val(6);
  }

  var jsonString = getCookie("fastrax-form");
  
  var groupRow = $('#AxleGroupRow');
  groupRow.html(`
  <div class="scroll-indicator"></div>
  <div class="label-group">
    <div class='input-group'>
      <label class="labels" id="AxlesWeightsLabel1" for="AxlesWeights">Axles Weights</label>
      <p id="subGroupWeights1" class="subLabel">Enter individual axle weights if desired</p>
    </div>
    <div class='input-group'>
      <label class="labels" id="TireSizeLabel1" for="TireSize">Tire Size</label>
    </div>
    <div class='input-group'>
      <label class="labels" id="NumOfTiresLabel1" for="NumOfTires"># of Tires/Axle</label>
    </div>
    <div class='input-group'>
      <label class="labels" id="TrackWidthLabel1" for="TrackWidth">Track Width</label>
    </div>
    <div class='input-group'>
      <label class="labels" id="AxleSpacingLabel1" for="AxleSpacing">Axle Spacing</label>
    </div>
  </div>`);
  for(var i = 0; i < numUnits; i++) {
    var group = `
    <div class="axle-group" id="AxleGroup${i}">
      <div class='input-group xxsmall'>
        <label class="labels" id="AxlesInGroupLabel${i}" for="AxlesInGroup">Axles</label>
        <p id="subGroupWeights1" class="subLabel">Group ${i+1}</p>
        <input id="AxlesInGroupInput${i}${i}" type="number" name="Axles In Group${i}${i}" value="1" min="1" max="5" onchange="populateAxleGroup(${i})">
      </div>
      <div class="row" id="imageRow${i}">
      </div>
      <div class="row">
        <input class="axlesWeights" id="AxlesWeightsInput${i}${i}" type="text" name="Axles Weights${i}${i}">
      </div>
      <div class="row" id="axleInputRow${i}">
      </div>
      <div class="row axle-spacing" id="AxleSpacingRow${i}">
      </div>
    </div>`;
    groupRow.append(group); // Use .append() to add the new group to the groupRow
    var $groupInput = $(`#AxlesInGroupInput${i}${i}`);
    if (data && data[`Axles In Group${i}${i}`]) {
      $groupInput.val(data[`Axles In Group${i}${i}`]);
      console.log(`Populated ${$groupInput} with ${$groupInput.val()}`);
    }
    populateAxleGroup(i);
  }
  console.log("Populated 6");

  $('input').on('change', handleInputChange);

  const indicator = $('.scroll-indicator');
  const row = $('#AxleGroupRow');
  if (indicator) {
    // Check overflow initially
    toggleScrollIndicator(row, indicator);

    row.on('scroll', function () {
      toggleScrollIndicator(row, indicator);
    });

    $('#NumOfGroupsInput').on('change', function () {
      toggleScrollIndicator(row, indicator);
    })

    // Add click event listener to scroll to the left
    indicator.on('click', function () {
      row.scrollLeft(row[0].scrollWidth); // Scroll all the way to the left
    });
  }
}

function populateAxleGroup(group) {
  console.log(`Populating Axle Group ${group}`);
  var numAxles = $(`#AxlesInGroupInput${group}${group}`).val(); // Use .val() to get the value of the input field
  console.log(`num Axles in Group ${group}:`, numAxles);
  if (numAxles < 1) {
    numAxles = 1;
    $(`#AxlesInGroupInput${group}${group}`).val(1);
  }
  if (numAxles > 5) {
    numAxles = 5;
    $(`#AxlesInGroupInput${group}${group}`).val(5);
  }

  // Calculate the maximum width and set it
  var maxWidth = 54 * numAxles + 20 * (numAxles - 1) + "px";
  $("#AxleGroup"+group).css("width", maxWidth);
  
  var imageRow = $(`#imageRow${group}`);
  imageRow.html("");

  var inputRow = $(`#axleInputRow${group}`);
  inputRow.html("");

  var axleSpacingRow = $(`#AxleSpacingRow${group}`);
  axleSpacingRow.html("");

  for(var i = 0; i < numAxles; i++) {
    imageRow.append(`<img class="tireImages" id="tire${group}${i}" src="tire.png" alt="">`)

    inputCol = `
    <div class="col">
      <input id="TireSizeInput${group}${i}" type="text" name="Tire Size${group}${i}">
      <input id="NumOfTiresInput${group}${i}" type="text" name="Number of Tires per Axle${group}${i}">
      <input id="TrackWidthInput${group}${i}" type="text" name="Track Width${group}${i}">
    </div>`
    inputRow.append(inputCol);

    if (i != numAxles-1 || group!=$('#NumOfGroupsInput').val()-1) {
      axleSpacingRow.append(`<input id="AxleSpacingInput${group}${i}" type="text" name="Axle Spacing${group}${i}">`);
    }

    var axleGroup = $(`#AxleGroup${group}`);
    if (i == numAxles-1 && group==$('#NumOfGroupsInput').val()-1 && i==0) {
      axleGroup.css('margin-bottom', '25px');
    }
    else {
      axleGroup.css('margin-bottom', '0px');
    }
  }

  var jsonString = getCookie("fastrax-form");
  if (jsonString) {
    var data = JSON.parse(jsonString);
    $(document).find('.col').each(function () {
      var $thisCol = $(this);
      $thisCol.find('input').each(function () {
        var $thisInput = $(this);
        if (data[$thisInput.attr('name')]) {
          $thisInput.val(data[$thisInput.attr('name')]);
        }
      })
    });
    $(document).find('.axle-spacing').each(function () {
      var $thisRow = $(this);
      $thisRow.find('input').each(function () {
        var $thisInput = $(this);
        if (data[$thisInput.attr('name')]) {
          $thisInput.val(data[$thisInput.attr('name')]);
        }
      })
    });
  }
  console.log(`Populated Axle Group ${group}`);

  $('input').on('change', handleInputChange);
}

function toggleScrollIndicator(row, indicator) {
  const isOverflowing = row[0].scrollWidth > row.innerWidth();
  const isAtTop = row.scrollLeft() == 0;
  console.log(row.scrollLeft());
  if (isOverflowing && isAtTop) {
    indicator.css('display', 'block');
  } else {
    indicator.css('display', 'none');
  }
}

//------ONLOAD-------
$(document).ready(function () {
  populate5(fromCookie=true);
  populate6(fromCookie=true);
  loadDataFromCookie("fastrax-form");

  $('input').on('change', handleInputChange);
});

function handleInputChange() {
  console.log("Handling Input Change");
  saveDataToCookie("fastrax-form");
  loadDataFromCookie("fastrax-form");
  console.log("Handled Input Change");
}

//------SUBMIT------
function submitForm() {
  var submitButton = $('#submit');
  var semi = $('#semi');
  var message = $('#message');

  // Collect the form data dynamically
  var formData = {
    "Site": "fastraxpermitservice.com",
    "Form": "Submit",
    "FormFields": {}
  };
  $('.section').each(function(index) {
    var section = $(this);
    var sectionName = `Section ${index +1}`;

    // Exclude section 7
    if (index != 6) {
      formData["FormFields"][sectionName] = {};
    }

    // Handle different groups in each section
    if (index < 3) {
      section.find('input, textarea').each(function() {
        var input = $(this);
        var name = input.attr('name');
        var value;
    
        if (input.is(':checkbox')) {
          value = input.is(':checked');
        } else {
          value = input.val();
        }
    
        formData["FormFields"][sectionName][name] = value;
      });
    }
    else if (index == 3) {
      section.find('.col').each(function() {
        var col = $(this);
        col.find('input, textarea').each(function() {
          var input = $(this);
          var name = input.attr('name');
          var value;
      
          if (input.is(':checkbox')) {
            value = input.is(':checked');
          } else {
            value = input.val();
          }
      
          formData["FormFields"][sectionName][name] = value;
        });
      });
    }
    else if (index == 4) {
      section.find('.group').each(function(group_index) {
        var group = $(this);
        formData["FormFields"][sectionName][`Unit ${group_index+1}`] = {};
        group.find('input, textarea').each(function() {
          var input = $(this);
          var name = input.attr('name');
          if (typeof name === 'string' && name.length > 0) {
            name = name.slice(0, -1); // Trim the last character
          }
          var value;
      
          if (input.is(':checkbox')) {
            value = input.is(':checked');
          } else {
            value = input.val();
          }
      
          formData["FormFields"][sectionName][`Unit ${group_index+1}`][name] = value;
        });
      });
    }
    else if (index == 5) {
      section.find('.axle-group').each(function(group_index) {
        var group = $(this);
        formData["FormFields"][sectionName][`Axle Group ${group_index+1}`] = {};
        group.find('input, textarea').each(function() {
          var input = $(this);
          var name = input.attr('name');
          var name = input.attr('name');
          if (typeof name === 'string' && name.length > 0) {
            if (name.slice(0, -2) == 'Axles In Group' || name.slice(0, -2) == 'Axles Weights') {
              name = name.slice(0, -2); // Trim the last two characters
            }
            else {
              const intValue = parseInt(name.slice(-1));
              name = name.slice(0, -2) + " " + (intValue + 1);
            }
          }
          var value;
      
          if (input.is(':checkbox')) {
            value = input.is(':checked');
          } else {
            value = input.val();
          }
      
          formData["FormFields"][sectionName][`Axle Group ${group_index+1}`][name] = value;
        });
      });
    }
  });

  console.log("Form Data:\n", formData);

  semi.addClass('slide-right');
  submitButton.addClass('slide-right');

  // Create a delay promise
  const delay = new Promise(resolve => setTimeout(resolve, 1000));

  // Send the form data to the webhook
  const fetchPromise = fetch('https://n6ubkbodoc.execute-api.us-west-2.amazonaws.com/Prod/triggerr', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': 'hy9GF2JRCm26vsH5k1Smi1UaekyHIEla62HJUaM8'
    },
    body: JSON.stringify(formData)
  })
  .then(response => {
    return response.ok;
  })
  .catch(error => {
    console.error('Error submitting form:', error);
    return false; // Treat errors the same way as a bad response
  });

  // Wait for both the delay and fetch promises
  Promise.all([delay, fetchPromise])
  .then(([_, responseOk]) => {
    handleResponse(semi, submitButton, message, responseOk);
  })
  .catch(error => {
    console.error('Error submitting form:', error);
    handleResponse(semi, submitButton, message, false);
  });
}

function handleResponse(semi, submitButton, message, success) {
  setTimeout(() => {
    semi.removeClass('slide-right');
    semi.addClass('middle');
    submitButton.removeClass('slide-right');
    submitButton.addClass('far-left');
    message.addClass('far-left');

    if (success) {
      // Successful submission
      submitButton.html('Submit Again');
      message.css('display', 'block');
      message.html('Submitted Successfully')
      message.removeClass('red');
      message.addClass('green');
    } else {
      // Handle error response
      submitButton.html('Try Again');
      message.css('display', 'block');
      message.html('Submission Failed')
      message.removeClass('green');
      message.addClass('red');
    }

    // Allow some time for the reset to complete
    setTimeout(() => {
      semi.addClass('slide-right');
      message.addClass('slide-right');
      setTimeout(() => {
        semi.removeClass('slide-right');
        message.removeClass('slide-right');
        semi.removeClass('middle');
        message.removeClass('far-left');

        // Allow some time for the reset to complete
        setTimeout(() => {
          message.addClass('slide-right');
          submitButton.addClass('slide-right');
          setTimeout(() => {
            message.removeClass('slide-right');
            submitButton.removeClass('slide-right');
            message.removeClass('middle');
            message.addClass('far-left');
            submitButton.removeClass('far-left');
          }, 1000); // Duration of the slideRight animation
        }, 1000); // Small delay to ensure the reset class is applied
      }, 1000); // Duration of the slideRight animation
    }, 1000); // Duration of the slideRight animation
  }, 10); // Small delay to ensure the reset class is applied

}


//-------COOKIES-------
function setCookie(name,value,days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days*24*60*60*1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function saveDataToCookie(name, days) {
  console.log("Saving Data to Cookie");
  var data = {
  };

  // Iterate through each row and store the data in an object

  $('body').find('input, textarea').each(function () {
    var $thisInput = $(this);
    var inputName = $thisInput.attr('name');
    var inputValue = $thisInput.is(':checkbox') ? $thisInput.is(':checked') : $thisInput.val();
    
    if (inputName) {
      data[inputName] = inputValue;
    }
  });

  // Convert the rowData array to a JSON string
  var value = JSON.stringify(data);

  // Save the JSON string as a cookie
  setCookie(name, value, days);
  console.log("Saved Data to Cookie");
}

function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}

function loadDataFromCookie(name, type) {
  console.log("Loading Data from Cookie");
  // Get the JSON string from the cookie
  var jsonString = getCookie(name);

  if (jsonString) {
    // Parse the JSON string to an object
    var data = JSON.parse(jsonString);

    // Iterate through each key-value pair in the form
    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        // Find the input element with the name attribute matching the key
        var $input = $('[name="' + key + '"]');

        // Populate the input element with the value
        if ($input.is(':checkbox')) {
          $input.prop('checked', data[key]);
        } else {
          $input.val(data[key]);
        }
      }
    }
  }
  else {
    populate5();
    populate6();
  }
  console.log("Loaded Data from Cookie");
}