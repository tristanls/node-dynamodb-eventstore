# dynamodb-eventstore

_Stability: 1 - [Experimental](https://github.com/tristanls/stability-index#stability-1---experimental)_

[![NPM version](https://badge.fury.io/js/dynamodb-eventstore.png)](http://npmjs.org/package/dynamodb-eventstore)

Store events in DynamoDb.

## Installation

    npm install dynamodb-eventstore

## Tests

### Unit Tests

    npm test

### Integration "sanity check" Test

    npm run-script integration

Given `DYNAMODB_ES_TEST_ACCESS_KEY_ID` and `DYNAMODB_ES_TEST_SECRET_ACCESS_KEY` are present in the environment, will attempt to insert `{foo: "bar"}` into the event store. If an error occurs, result will be:

    error
    done

On success, result will be:

    done

## Overview

DynamoDbEventStore is a simple client to store events in a DynamoDb table. It turns a JavaScript object into JSON and stores it under a unique key related to client time.

```javascript
var DynamoDbEventStore = require('dynamodb-eventstore');
var es = new DynamoDbEventStore({
    accessKeyId: "ACCESS",
    region: "us-east-1",
    dynamoDbTable: "all-events",
    secretAccessKey: "SECRET" 
});
es.put({my: "event"}, function (error) {
    if (error) console.log('put failed :/'); 
});
```

DynamoDb table shall be set to have a Hash key **only** with name `key` and type `String`.

Event keys look like following example: `20130927T005240652508858176`.

Events are stored as JSON strings in a `String` column named `body`. For example:

```javascript
es.put({my: "event"});
// results in:
// key                          | body
// 20130927T005240652508858176  | {"my":"event"}
// (both columns are of type String)
```

## Documentation

### DynamoDbEventStore

**Public API**
  * [new DynamoDbEventStore(options)](#new-dynamodbeventstoreoptions)
  * [dynamoDbEventStore.put(event, \[callback\])](#dynamodbeventstoreputevent-callback)
  * [Event '~trace'](#event-trace)

#### new DynamoDbEventStore(options)

  * `options`:
    * `AWS`: _Object_ _(Default: `require('aws-sdk');`)_ An instance of `aws-sdk`.
    * `accessKeyId`: _String_ AWS access key ID.
    * `region`: _String_ The region to send service requests to.
    * `dynamoDbTable`: _String_ The name of DynamoDB table to use for event store.
    * `secretAccessKey`: _String_ AWS secret access key.
    * `sslEnabled`: _Boolean_ _(Default: true)_ Whether to enable SSL for requests.

Creates a new DynamoDbEventStore instance.

#### dynamoDbEventStore.put(event, [callback])

  * `event`: _Object_ JavaScript object representing the event to store.
  * `callback`: _Function_ _(Default: undefined)_ An optional callback to call on success or failure.

Attempts to store the `event` in DynamoDb. If a `callback` is provided it will be called with error set to true if an error occurs or with no parameters otherwise.

```javascript
dynamoDbEventStore.put({foo: 'bar'}, function (error) {
    if (error) console.log('put failed :/'); 
});
```

#### Event `~trace`

  * `message`: _String_ Trace message.

Emitted to trace internal execution of DynamoDbEventStore instance.