import os
from be.tests.s3_utils import upload_item_image


def test_upload():
    local_file = "test_image.ico"

    # This is how it will be named inside the bucket
    s3_name = "test_folder/refound_logo_test.png"

    # Check if file exists locally first
    if not os.path.exists(local_file):
        print(f"Error: I can't find '{local_file}' in this folder, bruh.")
        return

    print(f"Uploading {local_file} to S3...")

    # 3. CALL YOUR FUNCTION
    image_url = upload_item_image(local_file, s3_name)

    if image_url:
        print("\nUpload worked.")
        print(f"Public URL: {image_url}")
    else:
        print("\nSomething went wrong. Check the S3 Upload Error above.")


if __name__ == "__main__":
    test_upload()
