import boto3
import os
from dotenv import load_dotenv

load_dotenv()

s3_client = boto3.client(
    "s3",
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    region_name=os.getenv("AWS_REGION"),
)


def upload_item_image(file_path, file_name):
    bucket = os.getenv("AWS_BUCKET_NAME")
    try:
        # ExtraArgs ensures the image is viewable on your website
        s3_client.upload_file(
            file_path, bucket, file_name, ExtraArgs={"ContentType": "image/jpeg"}
        )
        url = f"https://{bucket}.s3.{os.getenv('AWS_REGION')}.amazonaws.com/{file_name}"
        return url
    except Exception as e:
        print(f"S3 Upload Error: {e}")
        return None
