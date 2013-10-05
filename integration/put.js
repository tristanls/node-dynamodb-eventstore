/*

put.js - dynamoDbEventStore.put(event) integration "sanity check" test

The MIT License (MIT)

Copyright (c) 2013 Tristan Slominski

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

*/

"use strict";

var AWS = require('aws-sdk'),
    DynamoDbEventStore = require('../index.js');

if (!process.env["DYNAMODB_ES_TEST_ACCESS_KEY_ID"]) {
    console.log("Please define DYNAMODB_ES_TEST_ACCESS_KEY_ID in your " 
        + "environment for the test to proceed");
    return;
}

if (!process.env["DYNAMODB_ES_TEST_SECRET_ACCESS_KEY"]) {
    console.log("Please define DYNAMODB_ES_TEST_SECRET_ACCESS_KEY in your " 
        + "environment for the test to proceed");
    return;
}

var options = {
    AWS: AWS,
    accessKeyId: process.env["DYNAMODB_ES_TEST_ACCESS_KEY_ID"],
    region: 'us-east-1',
    dynamoDbTable: 'all-events',
    secretAccessKey: process.env["DYNAMODB_ES_TEST_SECRET_ACCESS_KEY"]
};

var es = new DynamoDbEventStore(options);

es.put({foo: 'bar'}, function (error) {
    if (error) console.log('error');
    console.log('done');
});