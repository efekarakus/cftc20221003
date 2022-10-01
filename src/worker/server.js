import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } from "@aws-sdk/client-sqs";
const REGION = process.env.AWS_DEFAULT_REGION;
const sqsClient = new SQSClient({ region: REGION });

const queueURL = process.env.COPILOT_QUEUE_URI;
const params = {
    MaxNumberOfMessages: 10,
    QueueUrl: queueURL,
    VisibilityTimeout: 20,
    WaitTimeSeconds: 10,
};

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const run = async () => {
    try {
        const data = await sqsClient.send(new ReceiveMessageCommand(params));
        if (data.Messages) {
            var deleteParams = {
                QueueUrl: queueURL,
                ReceiptHandle: data.Messages[0].ReceiptHandle,
            };
            try {
                const data = await sqsClient.send(new DeleteMessageCommand(deleteParams));
                console.log("Message deleted", data);
            } catch (err) {
                console.log("Error", err);
            }
        } else {
            console.log("No messages to delete");
        }
        return data; // For unit tests.
    } catch (err) {
        console.log("Receive Error", err);
    }
};

while (true) {
    run();
    await delay(5000);
}