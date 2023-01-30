const axios = require("axios");
const fs = require("fs");
const path = require("path");

const filepath = "input_files/invoice_810.edi";
//const filepath = "input_files/purchase_order_850.edi";
//const filepath = "input_files/ship_notice_856.edi";

// Main function
async function main() {

  // Check if Stedi API key was set as secret environment variable
  
  if (process.env.hasOwnProperty('stedi-api-key')) {

    console.log("api key is valid, proceeding\n")

  } else {

    console.log('invalid API key set, quitting\n\nplease generate a valid API key on \nhttps://www.stedi.com/app/settings/api-keys\n')

    // Exit the program
    process.exit(0);

  }

  // Load the EDI file from disk
  const data = fs.readFileSync(path.resolve(__dirname, filepath), 'utf8');

  // Create an EDI Core request with input EDI string
  const requestJson = {
    input: data,
    input_format: "edi",
    output_format: "jedi@2.0"
  }

  // Create a new POST request to EDI Core
  const request = await axios.request({
    method: "POST",
    url: "https://edi-core.stedi.com/2021-06-05/translate",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Key ${process.env['stedi-api-key']}`
    },
    data: requestJson
  }).then(response => {
    return response.data;
  })
    .catch(error => {
      console.log(error);
      return error;
    });

  // Print the EDI Core response
  console.log(JSON.stringify(request, null, 2));

  // Return the EDI Core response
  return request;

};

// Run the main function
main();
