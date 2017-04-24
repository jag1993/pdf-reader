const pdf_table_extractor = require("pdf-table-extractor");
const excel = require('node-excel-export');
const csvWriter = require('csv-write-stream');
var writer = csvWriter({ headers: ["date","table", "pricing"]})
const fs = require('fs');
const noEmptyStrings = (n)=>{ return n != ' ' };
const noEmptyArrays = (n)=> { for(i=0;i<n.length;i++){ 
									if(n[i] ===  '' ){ 
										return false 
									}
								} 
										return true
							}

const ws = fs.createWriteStream('my.csv');

let eventsData =[];

//PDF parsed 
function success(result)
{
  result.pageTables.forEach((data)=>{
  		data.tables.forEach((data)=>{
  			data.forEach((data)=>{
  				eventsData.push(data.split('\n').filter(noEmptyStrings));
  			});
  		});
  })

  	let filteredValue = eventsData.filter(noEmptyArrays);
    eventsData = filteredValue;
    console.log(eventsData);
  	
  	writer.pipe(ws);
  	eventsData.forEach((data)=>{ 
  	//Find a way to parse through all the arrays taking the first two as the dates and event name
  	//Then the rest of the values being TableName and Pricing alternatively.
  	writer.write({date:data[0],table:data[1],pricing:data[2]})
  	})
  }
 
//Error 
function error(err)
{
   console.error('Error: ' + err);
}
 
pdf_table_extractor("PDF.pdf",success,error);

  
