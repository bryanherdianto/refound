from be.tests.s3_utils import s3_client
import os
from botocore.exceptions import ClientError


def test_connection():
    bucket_name = os.getenv("AWS_BUCKET_NAME")
    print(f"Testing connection to bucket: {bucket_name}...")

    try:
        # head_bucket is a lightweight way to check if a bucket exists
        # and if you have permissions to access it.
        s3_client.head_bucket(Bucket=bucket_name)
        print("Success! Your AWS_ACCESS_KEY and Bucket name are correct.")

    except ClientError as e:
        error_code = e.response["Error"]["Code"]
        if error_code == "404":
            print("Error: Bucket does not exist. Check AWS_BUCKET_NAME in .env")
        elif error_code == "403":
            print(
                "Error: Access Denied. Your keys don't have permission for this bucket."
            )
        else:
            print(f"AWS Error: {e}")
    except Exception as e:
        print(f"Unexpected Error: {e}")


if __name__ == "__main__":
    test_connection()
