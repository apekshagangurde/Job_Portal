from telethon import TelegramClient
import asyncio
import json

# Your API ID, API Hash, and phone number
api_id = '28896899'  # Replace with your actual API ID
api_hash = 'f574aa5354627fcef0050b18983b9fee'  # Replace with your actual API Hash
phone_number = '9322915597'  # Replace with your phone number

# List of channels to scrape
channel_usernames = [ 'apekshagangurde','jobs_and_internships_updates', 'goyalarsh',]  # Add mychannel here

# Keywords to identify job-related messages
job_keywords = ["Role:", "Company", "Batch", "Location", "Company name"]

async def fetch_jobs(client):
    jobs = []  # List to hold job data from all channels

    # Iterate over each channel
    for channel_username in channel_usernames:
        try:
            channel = await client.get_entity(channel_username)

            # Fetch messages from the channel
            async for message in client.iter_messages(channel, limit=50):
                content = message.message or message.text  # Combine both attributes

                # Filter out only job-related messages
                if content and any(keyword in content for keyword in job_keywords):
                    job = {
                        "title": content.split('\n')[0] if content.split('\n') else "No Title",
                        "description": content
                    }
                    jobs.append(job)
                else:
                    print(f"Skipping non-job message in {channel_username}")

        except Exception as e:
            print(f"Error fetching messages from {channel_username}: {e}")

    return jobs

async def main():
    async with TelegramClient('session_name', api_id, api_hash) as client:
        await client.start(phone=phone_number)

        while True:  # Infinite loop for continuous running
            jobs = await fetch_jobs(client)

            # Keep only the latest 50 entries
            if len(jobs) > 50:
                jobs = jobs[-50:]  # Keep only the last 50 jobs

            # Save the jobs to a JSON file
            with open('scraped_jobs.json', 'w') as f:
                json.dump(jobs, f, indent=4)

            print("Jobs scraped successfully from all channels!")

            # Wait for 15 minutes (900 seconds) before the next run
            await asyncio.sleep(10)

# Run the main function
if __name__ == '__main__':
    asyncio.run(main())
