from telethon import TelegramClient
import asyncio
import json

# Your API ID and API Hash from Telegram
api_id = '28896899'  # Replace with your actual API ID
api_hash = 'f574aa5354627fcef0050b18983b9fee'  # Replace with your actual API Hash
phone_number = '9322915597'  # Replace with your phone number

# The channel you want to scrape
channel_usernames = ['jobs_and_internships_updates', 'goyalarsh'] 
async def main():
    async with TelegramClient('session_name', api_id, api_hash) as client:
        await client.start(phone=phone_number)
        
        # Get the channel
        channel = await client.get_entity(channel_username)

        # List to hold job data
        jobs = []

        # Fetch messages from the channel
        async for message in client.iter_messages(channel, limit=20):  # Adjust the limit as needed
            print(f"Processing message: {message}")  # Debugging line to see the message

            # Check if the message has a valid text content
            if message.message:
                job = {
                    "title": message.message.split('\n')[0] if message.message.split('\n') else "No Title",
                    "description": message.message,
                    
                }
                jobs.append(job)
            elif message.text:  # Check for text messages as a separate attribute
                job = {
                    "title": message.text.split('\n')[0] if message.text.split('\n') else "No Title",
                    "description": message.text,
                    "link": f"https://t.me/{channel_username}/{message.id}"
                }
                jobs.append(job)
            else:
                print(f"Received a non-text message or None: {message}")  # Log non-text messages

        # Save the jobs to a JSON file
        with open('scraped_jobs.json', 'w') as f:
            json.dump(jobs, f, indent=4)

        print("Jobs scraped successfully!")

# Run the main function
if __name__ == '__main__':
    asyncio.run(main())
