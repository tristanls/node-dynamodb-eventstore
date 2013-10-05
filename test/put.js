/*

put.js - dynamoDbEventStore.put(event) test

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

var DynamoDbEventStore = require('../index.js');

var test = module.exports = {};

var options = {
        AWS: {
            config: {
                update: function (){}
            },
            DynamoDB: function () {}
        },
        dynamoDbTable: 'all-events'
    };

test["put generates yyyymmddTHHMMsslhrtime row key"] = function (test) {
    test.expect(1);
    options.AWS.DynamoDB = function () {
        return {
            batchWriteItem: function (params, batchWriteCallback) {
                var putRequest = params.RequestItems['all-events'][0].PutRequest;
                test.ok(putRequest.Item.key.S.match(/\d{8}T\d{9}\d*/));
                test.done();
            }
        }
    };
    var es = new DynamoDbEventStore(options);
    es.put({foo: 'bar'});
};

test["put uses stringified event as body"] = function (test) {
    test.expect(1);
    options.AWS.DynamoDB = function () {
        return {
            batchWriteItem: function (params, batchWriteCallback) {
                var putRequest = params.RequestItems['all-events'][0].PutRequest;
                test.equal(putRequest.Item.body.S, JSON.stringify({foo: 'bar'}));
                test.done();
            }
        }
    };
    var es = new DynamoDbEventStore(options);
    es.put({foo: 'bar'});
};

test["put sets callback error to true if error occured"] = function (test) {
    test.expect(1);
    options.AWS.DynamoDB = function () {
        return {
            batchWriteItem: function (params, batchWriteCallback) {
                batchWriteCallback(new Error("oh no"));
            }
        }
    };
    var es = new DynamoDbEventStore(options);
    es.put({foo: 'bar'}, function (error) {
        test.ok(error);
        test.done();
    });
};

test["put calls callback with no error if put succeeds"] = function (test) {
    test.expect(1);
    options.AWS.DynamoDB = function () {
        return {
            batchWriteItem: function (params, batchWriteCallback) {
                batchWriteCallback(null, "yay");
            }
        }
    };
    var es = new DynamoDbEventStore(options);
    es.put({foo: 'bar'}, function (error) {
        test.ok(!error);
        test.done();
    });
};