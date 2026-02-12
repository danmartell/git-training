#!/usr/bin/env python3
"""
Influential Followers CSV Generator

Pulls followers for a Twitter/X account using the Apify API,
sorts them by follower count (most influential first),
and exports the results to a CSV file.
"""

import argparse
import csv
import os
import sys
import time

from apify_client import ApifyClient


# Default Apify actor for scraping Twitter/X followers.
# "apidojo/twitter-user-scraper" supports getFollowers with profile data.
DEFAULT_ACTOR_ID = "apidojo/twitter-user-scraper"

DEFAULT_USERNAME = "danmartell"
DEFAULT_OUTPUT = "influential_followers.csv"

CSV_COLUMNS = [
    "rank",
    "username",
    "name",
    "followers_count",
    "following_count",
    "description",
    "verified",
    "location",
    "profile_url",
]


def fetch_followers(api_token: str, username: str, max_items: int | None = None) -> list[dict]:
    """Fetch followers for a Twitter/X account via Apify."""

    client = ApifyClient(api_token)

    run_input = {
        "startUrls": [f"https://x.com/{username}"],
        "getFollowers": True,
        "getFollowing": False,
    }

    if max_items:
        run_input["maxItems"] = max_items

    print(f"Starting Apify actor '{DEFAULT_ACTOR_ID}' to fetch followers of @{username}...")
    print("This may take a while depending on follower count.\n")

    run = client.actor(DEFAULT_ACTOR_ID).call(run_input=run_input)

    print(f"Actor run finished. Status: {run.get('status', 'unknown')}")
    print(f"Run ID: {run.get('id', 'N/A')}\n")

    dataset_id = run["defaultDatasetId"]
    items = list(client.dataset(dataset_id).iterate_items())

    print(f"Retrieved {len(items)} records from dataset.\n")
    return items


def normalize_follower(raw: dict) -> dict:
    """Normalize raw Apify output into a clean follower record."""

    # The actor may return fields with varying key names depending on version.
    # We try common field names to be resilient.
    username = (
        raw.get("userName")
        or raw.get("username")
        or raw.get("screen_name")
        or raw.get("screenName")
        or ""
    )

    name = (
        raw.get("name")
        or raw.get("displayName")
        or raw.get("fullName")
        or ""
    )

    followers_count = (
        raw.get("followersCount")
        or raw.get("followers_count")
        or raw.get("followerCount")
        or raw.get("publicMetrics", {}).get("followersCount")
        or 0
    )

    following_count = (
        raw.get("followingCount")
        or raw.get("following_count")
        or raw.get("friendsCount")
        or raw.get("friends_count")
        or raw.get("publicMetrics", {}).get("followingCount")
        or 0
    )

    description = (
        raw.get("description")
        or raw.get("bio")
        or raw.get("rawDescription")
        or ""
    )

    verified = raw.get("verified") or raw.get("isVerified") or raw.get("isBlueVerified") or False

    location = raw.get("location") or raw.get("userLocation") or ""

    profile_url = f"https://x.com/{username}" if username else ""

    return {
        "username": username,
        "name": name,
        "followers_count": int(followers_count) if followers_count else 0,
        "following_count": int(following_count) if following_count else 0,
        "description": description.replace("\n", " ").strip() if description else "",
        "verified": verified,
        "location": location,
        "profile_url": profile_url,
    }


def sort_by_influence(followers: list[dict]) -> list[dict]:
    """Sort followers by follower count, descending (most influential first)."""
    return sorted(followers, key=lambda f: f["followers_count"], reverse=True)


def write_csv(followers: list[dict], output_path: str) -> None:
    """Write sorted followers to a CSV file."""

    with open(output_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=CSV_COLUMNS)
        writer.writeheader()

        for rank, follower in enumerate(followers, start=1):
            row = {"rank": rank, **follower}
            writer.writerow(row)

    print(f"CSV written to: {output_path}")
    print(f"Total followers exported: {len(followers)}")


def main():
    parser = argparse.ArgumentParser(
        description="Generate a CSV of your most influential Twitter/X followers using Apify.",
        epilog="Example: python influential_followers.py --api-token YOUR_TOKEN --username danmartell",
    )
    parser.add_argument(
        "--api-token",
        default=os.environ.get("APIFY_API_TOKEN"),
        help="Your Apify API token (or set APIFY_API_TOKEN env var).",
    )
    parser.add_argument(
        "--username",
        default=DEFAULT_USERNAME,
        help=f"Twitter/X username to pull followers for (default: {DEFAULT_USERNAME}).",
    )
    parser.add_argument(
        "--max-items",
        type=int,
        default=None,
        help="Maximum number of followers to fetch (default: all).",
    )
    parser.add_argument(
        "--output",
        default=DEFAULT_OUTPUT,
        help=f"Output CSV file path (default: {DEFAULT_OUTPUT}).",
    )

    args = parser.parse_args()

    if not args.api_token:
        print("Error: Apify API token is required.")
        print("Provide it via --api-token or set the APIFY_API_TOKEN environment variable.")
        print("\nGet your token at: https://console.apify.com/account/integrations")
        sys.exit(1)

    # 1. Fetch followers from Apify
    raw_followers = fetch_followers(args.api_token, args.username, args.max_items)

    if not raw_followers:
        print("No followers found. Check the username and try again.")
        sys.exit(1)

    # 2. Normalize records
    followers = [normalize_follower(f) for f in raw_followers]

    # Filter out any entries that look like the target profile itself (not a follower)
    followers = [f for f in followers if f["username"].lower() != args.username.lower()]

    # 3. Sort by follower count (most influential first)
    followers = sort_by_influence(followers)

    # 4. Write to CSV
    write_csv(followers, args.output)

    # 5. Print top 10 preview
    print("\n--- Top 10 Most Influential Followers ---")
    print(f"{'Rank':<6} {'Username':<20} {'Followers':>12}  {'Name'}")
    print("-" * 70)
    for i, f in enumerate(followers[:10], start=1):
        print(f"{i:<6} @{f['username']:<19} {f['followers_count']:>12,}  {f['name']}")

    print(f"\nFull results saved to: {args.output}")


if __name__ == "__main__":
    main()
