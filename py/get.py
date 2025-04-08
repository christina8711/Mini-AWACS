import boto3
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('TemperatureData')

def lambda_handler(event, context):
    sensor_id = event['queryStringParameters']['sensorId']
    response = table.query(
        KeyConditionExpression=Key('sensorId').eq(sensor_id)
    )
    return {
        'statusCode': 200,
        'body': str(response['Items'])
    }