Made it possible with this script:
```python
import json
import requests
import os
import time
import random

def translate_json_values(input_file, output_file, api_key):
    # Read the JSON file
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Initialize DeepL API endpoint
    url = "https://api-free.deepl.com/v2/translate"
    # Use this URL for DeepL Pro:
    # url = "https://api.deepl.com/v2/translate"
    
    # Process each item in the JSON
    for i, item in enumerate(data):
        # Add delay between items to avoid rate limiting
        if i > 0:
            # Random delay between 1-3 seconds to avoid predictable patterns
            delay = 1 + random.random() * 2
            print(f"Waiting {delay:.2f} seconds before next translation...")
            time.sleep(delay)
        
        print(f"Translating item {i+1}/{len(data)}: '{item['word']}'")
        
        # Translate the "word" field with retry logic
        max_retries = 5
        retry_count = 0
        success = False
        
        while not success and retry_count < max_retries:
            try:
                word_response = requests.post(url, 
                    data={
                        "text": item["word"],
                        "target_lang": "DE",
                        "source_lang": "EN"
                    },
                    headers={"Authorization": f"DeepL-Auth-Key {api_key}"}
                )
                
                if word_response.status_code == 200:
                    item["word"] = word_response.json()["translations"][0]["text"]
                    success = True
                elif word_response.status_code == 429:
                    retry_count += 1
                    wait_time = 5 * retry_count  # Exponential backoff
                    print(f"Rate limit hit. Waiting {wait_time} seconds before retry {retry_count}/{max_retries}...")
                    time.sleep(wait_time)
                else:
                    print(f"Error translating '{item['word']}': {word_response.status_code}, {word_response.text}")
                    break
            except Exception as e:
                print(f"Exception while translating '{item['word']}': {e}")
                retry_count += 1
                time.sleep(5)
        
        # Small delay between word and forbidden words translations
        time.sleep(1)
        
        # Translate the "forbidden" words array - one by one to avoid rate limits
        translated_forbidden = []
        for j, forbidden_word in enumerate(item["forbidden"]):
            # Add small delay between individual forbidden words
            if j > 0:
                time.sleep(0.5)
            
            retry_count = 0
            success = False
            
            while not success and retry_count < max_retries:
                try:
                    forbidden_response = requests.post(url, 
                        data={
                            "text": forbidden_word,
                            "target_lang": "DE",
                            "source_lang": "EN"
                        },
                        headers={"Authorization": f"DeepL-Auth-Key {api_key}"}
                    )
                    
                    if forbidden_response.status_code == 200:
                        translated_forbidden.append(forbidden_response.json()["translations"][0]["text"])
                        success = True
                    elif forbidden_response.status_code == 429:
                        retry_count += 1
                        wait_time = 5 * retry_count  # Exponential backoff
                        print(f"Rate limit hit. Waiting {wait_time} seconds before retry {retry_count}/{max_retries}...")
                        time.sleep(wait_time)
                    else:
                        print(f"Error translating forbidden word '{forbidden_word}': {forbidden_response.status_code}, {forbidden_response.text}")
                        translated_forbidden.append(forbidden_word)  # Keep original on error
                        break
                except Exception as e:
                    print(f"Exception while translating forbidden word '{forbidden_word}': {e}")
                    retry_count += 1
                    time.sleep(5)
                    if retry_count >= max_retries:
                        translated_forbidden.append(forbidden_word)  # Keep original after max retries
            
        item["forbidden"] = translated_forbidden
        
        # Save progress after each item in case of interruption
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=4)
        
        print(f"Progress saved ({i+1}/{len(data)} items completed)")
    
    print(f"Translation complete. Output saved to {output_file}")

if __name__ == "__main__":
    # Input file path
    input_file = "words-list.json"  # Change this to your input file path
    
    # Output file path
    output_file = "words-list-de.json"
    
    # Get DeepL API key from environment variables for security
    api_key = os.environ.get("DEEPL_API_KEY")
    
    # If not in environment variables, you can hardcode it (less secure)
    if not api_key:
        api_key = "your-api-key-here"  # Replace with your actual API key
        # Alternatively, you can prompt the user for the API key
        # api_key = input("Enter your DeepL API key: ")
    
    translate_json_values(input_file, output_file, api_key)
```
However the results were not very good so i had to go through them manually.