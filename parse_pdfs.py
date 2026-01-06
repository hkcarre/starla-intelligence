import PyPDF2
import json
import os
import re
from pathlib import Path

# Define the base directory
base_dir = Path(r'C:\Dev\starbucks')

# Countries we want to track
target_countries = ['Germany', 'United Kingdom', 'Italy', 'France', 'Spain', 'Netherlands']

# Periods in order
periods = ['P11 - 2024', 'P12 - 2024', 'P13 - 2024', 'P1 - 2025', 'P2 - 2025', 'P3 - 2025', 'P4 - 2025', 'P5 - 2025', 'P6 - 2025', 'P7 - 2025']

# Data structure
data = {}

def extract_pdf_text(pdf_path):
    """Extract text from PDF file"""
    try:
        with open(pdf_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            text = ''
            for page in reader.pages:
                text += page.extract_text()
            return text
    except Exception as e:
        print(f"Error reading {pdf_path}: {e}")
        return None

def parse_market_share(text):
    """Extract market share percentage from text"""
    # Look for patterns like "15.3%" or "Market Share: 15.3"
    patterns = [
        r'Market Share[:\s]+(\d+\.?\d*)%?',
        r'Share[:\s]+(\d+\.?\d*)%',
        r'(\d+\.?\d+)%\s+share',
    ]
    
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            return float(match.group(1))
    return None

def parse_change(text):
    """Extract share change from text"""
    # Look for patterns like "+2.3pp" or "Change: +2.3"
    patterns = [
        r'([+-]?\d+\.?\d*)pp',
        r'Change[:\s]+([+-]?\d+\.?\d*)%?',
        r'([+-]\d+\.?\d+)\s*points?',
    ]
    
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            return float(match.group(1))
    return None

print("Parsing PDF files...")
print("=" * 60)

# Parse files for each country
for country in target_countries:
    country_key = country.lower().replace(' ', '')
    data[country_key] = {
        'name': country,
        'periods': [],
        'share_values': [],
        'change_values': []
    }
    
    for period in periods:
        period_dir = base_dir / period
        
        # Find PDF file for this country
        pdf_files = list(period_dir.glob(f"*{country}*.pdf"))
        
        if pdf_files:
            pdf_path = pdf_files[0]
            print(f"Processing: {period} - {country}")
            
            text = extract_pdf_text(pdf_path)
            if text:
                share = parse_market_share(text)
                change = parse_change(text)
                
                if share is not None:
                    data[country_key]['periods'].append(period)
                    data[country_key]['share_values'].append(share)
                    data[country_key]['change_values'].append(change if change is not None else 0)
                    print(f"  ✓ Share: {share}% | Change: {change}pp")
                else:
                    print(f"  ✗ Could not extract data")

print("\n" + "=" * 60)
print("Extraction Complete!")
print(f"\nData for {len(data)} countries extracted.")

# Save to JSON
output_path = base_dir / 'starla-platform' / 'extracted_data.json'
with open(output_path, 'w') as f:
    json.dump(data, f, indent=2)

print(f"\nData saved to: {output_path}")

# Print summary
print("\n" + "=" * 60)
print("DATA SUMMARY")
print("=" * 60)
for country_key, country_data in data.items():
    print(f"\n{country_data['name']}:")
    print(f"  Periods: {len(country_data['periods'])}")
    if country_data['share_values']:
        print(f"  Latest Share: {country_data['share_values'][-1]}%")
        print(f"  Latest Change: {country_data['change_values'][-1]}pp")
