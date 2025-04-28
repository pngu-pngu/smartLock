const AWS = require('aws-sdk');
const mysql = require('mysql');
const s3 = new AWS.S3();
const s3Region = "us-east-1";
const { v4: uuidv4 } = require('uuid');
const BUCKET_NAME = "smartlockimages";

const BUCKET = 'smartlockimages';

const rdsConfig = {
  host: ".rds.amazonaws.com",
  user: "user",
  password: "password",
  database: "smartLock",
};

// Define all request methods here
const REQUEST_METHOD = {
  POST: "POST",
  GET: "GET",
  DELETE: "DELETE",
  PATCH: "PATCH",
};

// Define all status codes here
const STATUS_CODE = {
  SUCCESS: 200,
  NOT_FOUND: 404,
};

// Paths
const userPath = "/user";
const trustedPath = "/Trusted";
const imagesPath = "/Images";
const userParamPath = `${userPath}/{user_id}`;
const trustedParamPath = `${trustedPath}/{trusted_id}`;
const imagesParamPath = `${imagesPath}/{image_id}`;



exports.handler = async (event) => {
  console.log("Request event method: ", event.httpMethod);
  console.log("EVENT\n" + JSON.stringify(event, null, 2));

  let response;

  switch (true) {
    
    // ******** START GET values from a table by id ************* //
    
    // Get user by id by path param
    case event.httpMethod === REQUEST_METHOD.GET &&
      event.requestContext.resourcePath === userParamPath:
      response = await getRecord(userPath.substring(1), userParamPath.split("{")[1].split("}")[0], event.pathParameters.user_id);
      break;
    
    // Get trusted by id by path param
    case event.httpMethod === REQUEST_METHOD.GET &&
      event.requestContext.resourcePath === trustedParamPath:
      response = await getRecord(trustedPath.substring(1), trustedParamPath.split("{")[1].split("}")[0], event.pathParameters.trusted_user_id);
      break;

    //get images by id by path param
    case event.httpMethod === REQUEST_METHOD.GET &&
      event.requestContext.resourcePath === imagesParamPath:
      response = await getRecord(imagesPath.substring(1), imagesParamPath.split("{")[1].split("}")[0], event.pathParameters.image_id);
      break;

    // ******** END GET values from a table by id ************* //
    
    
    // ******** START DELETE values from a table by id ************* //
    
    // delete user by id by path param
    case event.httpMethod === REQUEST_METHOD.DELETE &&
      event.requestContext.resourcePath === userParamPath:
      response = await deleteRecord(userPath.substring(1), userParamPath.split("{")[1].split("}")[0], event.pathParameters.user_id);
      break;
    
    //delete trusted by id by path param
    case event.httpMethod === REQUEST_METHOD.DELETE &&
      event.requestContext.resourcePath === trustedParamPath:
      response = await deleteRecord(trustedPath.substring(1), trustedParamPath.split("{")[1].split("}")[0], event.pathParameters.trusted_id);
      break;

    //delete images by id by path param
    case event.httpMethod === REQUEST_METHOD.DELETE &&
      event.requestContext.resourcePath === imagesParamPath:
      response = await deleteRecord(imagesPath.substring(1), imagesParamPath.split("{")[1].split("}")[0], event.pathParameters.image_id);
      break;

    // ******** END DELETE values from a table by id ************* //
    

    // ******** START GET ALL values from a table ************* //
    
    //get all users
    case event.httpMethod === REQUEST_METHOD.GET &&
      event.requestContext.resourcePath === userPath:
      console.log("event",event);
      response = await getAllRecords(userPath.substring(1), event.queryStringParameters);
      break;

    //get all trusted
    case event.httpMethod === REQUEST_METHOD.GET &&
      event.requestContext.resourcePath === trustedPath:
      response = await getAllRecords(trustedPath.substring(1), event.queryStringParameters);
      break;

    //get all images
    case event.httpMethod === REQUEST_METHOD.GET &&
      event.requestContext.resourcePath === imagesPath:
      response = await getAllRecords(imagesPath.substring(1), event.queryStringParameters);
      break;


    // ******** END Get ALL values from a table ************* //
      
      
    // ******** START PATCH value from a table ************* //
    
    // Update user info by ID (PATCH request)
    case event.httpMethod === REQUEST_METHOD.PATCH &&
      event.requestContext.resourcePath === userParamPath:
      response = await patchRecord(userPath.substring(1), userParamPath.split("{")[1].split("}")[0], event.pathParameters.user_id,  JSON.parse(event.body));
      break;
    
    // Update trusted info by ID (PATCH request)
    case event.httpMethod === REQUEST_METHOD.PATCH &&
      event.requestContext.resourcePath === trustedParamPath:
      response = await patchRecord(trustedPath.substring(1), trustedParamPath.split("{")[1].split("}")[0], event.pathParameters.trusted_id, JSON.parse(event.body));
      break;

    // Update images info by ID (PATCH request)
    case event.httpMethod === REQUEST_METHOD.PATCH &&
      event.requestContext.resourcePath === imagesParamPath:
      response = await patchRecord(imagesPath.substring(1), imagesParamPath.split("{")[1].split("}")[0], event.pathParameters.image_id, JSON.parse(event.body));
      break;

    // ******** END PATCH value from a table ************* //
    
    
    // ******** START POST value from a table ************* //
    
    // post into user
    case event.httpMethod === REQUEST_METHOD.POST &&
      event.requestContext.resourcePath === userPath:
      response = await postRecord(userPath.substring(1), JSON.parse(event.body));
      break;

    //post into trusted
    case event.httpMethod === REQUEST_METHOD.POST &&
      event.requestContext.resourcePath === trustedPath:
      response = await postRecord(trustedPath.substring(1), JSON.parse(event.body));
      break;

    //post into images
    case event.httpMethod === REQUEST_METHOD.POST &&
      event.requestContext.resourcePath === imagesPath:
      response = await postRecord(imagesPath.substring(1), JSON.parse(event.body));
      break;
    
    // ******** END POST value from a table ************* //
    

    // Invalid requests
    default:
      response = buildResponse(STATUS_CODE.NOT_FOUND, {
        error: "Not Found",
        path: event.requestContext.resourcePath,
      });
      break;
  }

  return response;
};


async function getAllRecords(table, queryParams) {
  try {
    let query = `SELECT * FROM ${table}`;
    let values = [];

    if (queryParams && Object.keys(queryParams).length > 0) {
      const conditions = Object.entries(queryParams).map(([key, value]) => {
        values.push(value);
        return `${key} = ?`;
      });

      query += " WHERE " + conditions.join(" AND ");
    }

    console.log("Executing query:", query, values);
    const rows = await queryDatabase(query, values);

    return buildResponse(STATUS_CODE.SUCCESS, { values: rows });
  } catch (error) {
    console.error(`Error retrieving from ${table}: `, error);
    return buildResponse(STATUS_CODE.NOT_FOUND, { error: `Error retrieving from ${table}` });
  }
}




// FUNCTION TO GET A SINGLE VALUE FROM ANY TABLE
async function getRecord(table, pk, value) {
  console.log("table", table, "pk", pk, "value", value);
  try {
    const query = `SELECT * FROM ${table} WHERE ${pk} = ?`;
    console.log("query", query);
    const rows = await queryDatabase(query, [value]);
    return buildResponse(STATUS_CODE.SUCCESS, { values: rows });
  } catch (error) {
    console.error(`Error retrieving record from ${table}: `, error);
    return buildResponse(STATUS_CODE.NOT_FOUND, { error: `Error retrieving record from ${table}` });
  }
}

// FUNCTION TO DELETE A SINGLE RECORD FROM ANY TABLE
async function deleteRecord(table, pk, value) {
  try {
    const query = `DELETE FROM ${table} WHERE ${pk} = ?`;
    const result = await queryDatabase(query, [value]);
    console.log("result",result);

    if (result.affectedRows > 0) {
      return buildResponse(STATUS_CODE.SUCCESS, { message: `Record deleted from ${table}` });
    } else {
      return buildResponse(STATUS_CODE.NOT_FOUND, { error: `No record found in ${table} with ${pk} = ${value}` });
    }
  } catch (error) {
    console.error(`Error deleting record from ${table}: `, error);
    return buildResponse(STATUS_CODE.ERROR, { error: `Error deleting record from ${table}` });
  }
}



// FUNCTION TO PATCH  A SINGLE RECORD IN ANY TABLE
async function patchRecord(table, pk, value, updates) {
  console.log(updates)
  try {

    const setClause = Object.keys(updates).map(key => `${key} = ?`).join(", ");
    const query = `UPDATE ${table} SET ${setClause} WHERE ${pk} = ?`;
    
    const values = [...Object.values(updates), value];
    
    const result = await queryDatabase(query, values);

    if (result.affectedRows > 0) {
      return buildResponse(STATUS_CODE.SUCCESS, { message: `Record updated in ${table}` });
    } else {
      return buildResponse(STATUS_CODE.NOT_FOUND, { error: `No record found in ${table} with ${pk} = ${value}` });
    }
  } catch (error) {
    console.error(`Error updating record in ${table}: `, error);
    return buildResponse(STATUS_CODE.ERROR, { error: `Error updating record in ${table}` });
  }
}

// FUNCTION TO POST  A NEW RECORD INTO ANY TABLE
async function postRecord(table, record) {


  try {
    
    // Extract columns and values 
    const columns = Object.keys(record).join(", ");
    //console.log("record",record);
    //console.log("columns", columns);
    const values = Object.values(record).map( (value) => {
      if (typeof value === 'string') {
        return `'${value}'`; // Leave numbers as-is (for integers or floats)
      } 
      return value;
    });

    console.log("values",values);
    placeholders = values.join(", ");
    console.log("placeholders", placeholders);



    //console.log("placeholders", placeholders);
    const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;
    console.log(query);
    
    const result = await queryDatabase(query);

    if (result.affectedRows > 0) {
      return buildResponse(STATUS_CODE.SUCCESS, { message: `Record inserted into ${table}`, insertedId: result.insertId });
    } else {
      return buildResponse(STATUS_CODE.ERROR, { error: `Failed to insert record into ${table}` });
    }
  } catch (error) {
    console.error(`Error inserting record into ${table}: `, error);
    return buildResponse(STATUS_CODE.ERROR, { error: `Error inserting record into ${table}` });
  }
}









function buildResponse(statusCode, body) {
  return {
    statusCode: statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify(body)
  };
}

function queryDatabase(sql, values) {
  const connection = mysql.createConnection(rdsConfig);

  return new Promise((resolve, reject) => {
    connection.query(sql, values, (error, results) => {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        console.log(results);
        resolve(results);
      }
    });
  }).finally(() => {
    connection.end();
  });
}
