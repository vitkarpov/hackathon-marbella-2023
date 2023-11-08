const express = require('express')
const app = express()
const port = 3000
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  UpdateCommand,
} = require("@aws-sdk/lib-dynamodb");
const { randomUUID } = require("crypto");

const client = new DynamoDBClient({
  region: 'eu-west-1'
});
const dynamo = DynamoDBDocumentClient.from(client);
const tableName = "Team57";

app.get('/answers/:id', async (req, res) => {
  const response = await dynamo.send(
    new GetCommand({
      TableName: tableName,
      Key: {
        id: req.params.id,
      },
    })
  );
  res.json(response.Item);
});

app.put('/answers', async (req, res) => {
  const id = randomUUID();
  await dynamo.send(
    new PutCommand({
      TableName: tableName,
      Item: {
        id,
        answer: '',
      },
    })
  );
  res.json({ id });
});

app.post('/answers', async (req, res) => {
  const data = JSON.parse(req.body);
  const response = await dynamo.send(
    new UpdateCommand({
      TableName: tableName,
      Key: { id: data.id },
      UpdateExpression: "set answer = :a",
      ExpressionAttributeValues: {":a": data.answer},
      ReturnValues: "UPDATED_NEW"
    })
  );
  res.json(response.Attributes);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});