# Influential Followers CSV Generator

Pull your Twitter/X followers, rank them by their follower count, and export
the most influential ones to a clean CSV file — powered by the
[Apify](https://apify.com) API.

Default target account: **@danmartell**

## Setup

```bash
pip install -r requirements.txt
```

## Get Your Apify API Token

1. Sign up at [https://apify.com](https://apify.com)
2. Go to **Settings → Integrations** in the Apify Console
3. Copy your **API token**

## Usage

### Option 1: Pass the token as an argument

```bash
python influential_followers.py --api-token YOUR_APIFY_TOKEN
```

### Option 2: Set an environment variable

```bash
export APIFY_API_TOKEN=YOUR_APIFY_TOKEN
python influential_followers.py
```

### Full options

```
python influential_followers.py \
  --api-token YOUR_TOKEN \
  --username danmartell \
  --max-items 5000 \
  --output influential_followers.csv
```

| Flag           | Description                                      | Default                     |
|----------------|--------------------------------------------------|-----------------------------|
| `--api-token`  | Your Apify API token (or use env var)            | `APIFY_API_TOKEN` env var   |
| `--username`   | Twitter/X handle to pull followers for           | `danmartell`                |
| `--max-items`  | Max followers to fetch (omit for all)            | All                         |
| `--output`     | Output CSV file path                             | `influential_followers.csv` |

## Output

The CSV contains one row per follower, sorted by follower count (highest first):

| Column           | Description                              |
|------------------|------------------------------------------|
| `rank`           | Influence rank (1 = most followers)      |
| `username`       | Twitter/X handle                         |
| `name`           | Display name                             |
| `followers_count`| Number of followers they have            |
| `following_count`| Number of accounts they follow           |
| `description`    | Bio / profile description                |
| `verified`       | Whether the account is verified          |
| `location`       | Profile location                         |
| `profile_url`    | Direct link to their X profile           |

## How It Works

1. Calls the Apify actor `apidojo/twitter-user-scraper` with `getFollowers: true`
2. Collects all follower profile data from the resulting dataset
3. Normalizes fields and sorts by `followers_count` descending
4. Writes the ranked list to CSV
5. Prints a top-10 preview to the terminal

## Cost

The Apify actor charges approximately **$0.30 per 1,000 users** scraped.
