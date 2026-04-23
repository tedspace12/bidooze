// =========================
// data/help-data.ts
// =========================

export type Category = {
  slug: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  articleCount: number;
};

export type Article = {
  id: string;
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  content: string;
  readTime: number; // minutes
  popular?: boolean;
  updatedAt: string;
};

export const categories: Category[] = [
  {
    slug: "getting-started",
    title: "Getting Started",
    description: "Create your account, verify your email, set up your profile, and start bidding",
    icon: "Rocket",
    color: "amber",
    articleCount: 4,
  },
  {
    slug: "bidding",
    title: "Bidding",
    description: "Understand bid types, proxy bidding, bid increments, and auction registration",
    icon: "Gavel",
    color: "blue",
    articleCount: 5,
  },
  {
    slug: "account",
    title: "Account & Settings",
    description: "Manage your personal details, payment methods, and notification preferences",
    icon: "User",
    color: "violet",
    articleCount: 4,
  },
  {
    slug: "payments",
    title: "Invoices & Payments",
    description: "Add payment methods, view invoices, understand fees, and manage billing",
    icon: "CreditCard",
    color: "green",
    articleCount: 3,
  },
  {
    slug: "pickup-shipping",
    title: "Pickup & Shipping",
    description: "Everything after you win — schedule pickup, arrange shipping, and track items",
    icon: "Package",
    color: "orange",
    articleCount: 2,
  },
  {
    slug: "auctions",
    title: "Finding Auctions",
    description: "Browse, filter, and get notified about auctions across categories and locations",
    icon: "Search",
    color: "teal",
    articleCount: 3,
  },
  {
    slug: "sellers",
    title: "Selling on Bidooze",
    description: "List items, manage your auction, set reserves, and reach verified buyers",
    icon: "Store",
    color: "rose",
    articleCount: 2,
  },
  {
    slug: "troubleshooting",
    title: "Troubleshooting",
    description: "Resolve common issues with login, bidding errors, payment failures, and more",
    icon: "Wrench",
    color: "slate",
    articleCount: 3,
  },
];

export const articles: Article[] = [
  // ── Getting Started ──────────────────────────────────────────────────────
  {
    id: "1",
    slug: "how-to-register",
    category: "getting-started",
    title: "How to create a Bidooze account",
    excerpt: "Step-by-step guide to signing up, verifying your email with a one-time code, creating a password, and completing your profile.",
    content: `
## Creating your Bidooze account

Signing up takes under two minutes. Here's the exact flow:

### Step 1 — Enter your email
Go to [bidooze.com/auth/signup](/auth/signup) and enter your email address, then click **Continue with Email**.

You can also sign up instantly with **Google**, **Apple**, or **Facebook** using the social buttons on the same page.

### Step 2 — Verify your email
Check your inbox for a 6-digit verification code from Bidooze. Enter it on the verification screen. If the code doesn't arrive within a minute, click **Resend** (available after 30 seconds).

### Step 3 — Create a password
Choose a password that meets all three requirements:
- At least 8 characters
- At least 1 letter
- At least 1 number or symbol

Tick the box to agree to Bidooze's Terms, Privacy Policy, and Cookie Policy, then click **Create Account**.

### Step 4 — Add your personal information
Enter your **first name**, **last name**, and **phone number**. Auctioneers use this information when approving bidders, so it's required before you can bid.

### Step 5 — Select your interests
Choose the auction categories you're most interested in (e.g. Art, Vehicles, Jewellery). You can skip this step and update it later. Click **Finish** to go to the homepage.

> **Already started but didn't finish?** If your profile setup is incomplete, Bidooze will redirect you back to finish it the next time you log in.
    `,
    readTime: 3,
    popular: true,
    updatedAt: "2025-05-10",
  },
  {
    id: "2",
    slug: "completing-your-profile",
    category: "getting-started",
    title: "Completing your profile and interests",
    excerpt: "How to update your name, phone number, category interests, and account information after signing up.",
    content: `
## Completing and updating your profile

### Personal information
During sign-up you're asked for your first name, last name, and phone number at [/auth/personal-information](/auth/personal-information). If you skipped or need to update these details, go to **Account Settings → User Information** at [/account](/account).

You can update:
- First and last name
- Phone number
- Country
- Timezone
- Bio

Click **Save changes** when done.

### Category interests
When you first sign up, you select the auction categories you care about at the profile setup step. These help personalise your experience.

To update your interests later, contact Bidooze support via the [Contact page](/contact).

### Payment methods and address
Before you can register for and bid in auctions, you need a payment method on file. Go to **Account Settings → Payment** at [/account](/account) to add a credit or debit card and a billing address.
    `,
    readTime: 3,
    popular: false,
    updatedAt: "2025-05-10",
  },
  {
    id: "3",
    slug: "resetting-password",
    category: "getting-started",
    title: "Resetting your password",
    excerpt: "How to reset a forgotten password using the reset link sent to your email.",
    content: `
## Resetting your password

### Forgot your password?
1. Go to [/auth/reset-password](/auth/reset-password)
2. Enter the email address linked to your Bidooze account
3. Click **Send Reset Link**
4. A dialog will confirm: *"Check your email — a link has been sent to the email associated with your account"*
5. Click the link in the email to choose a new password

> **Didn't receive the email?** Check your spam or junk folder. The reset link expires after a short period, so request a new one if needed.

### Password requirements
Your new password must contain:
- At least 8 characters
- At least 1 letter
- At least 1 number or symbol
    `,
    readTime: 2,
    popular: true,
    updatedAt: "2025-05-01",
  },
  {
    id: "4",
    slug: "navigating-the-platform",
    category: "getting-started",
    title: "Navigating the Bidooze platform",
    excerpt: "A tour of the navigation bar, auction browser, watchlist, bids page, and account settings.",
    content: `
## Platform overview

### Secondary navigation bar
The bar beneath the main header gives you quick access to the most-used sections:

| Link | Page | What it does |
|------|------|-------------|
| Search by Category | Dropdown | Browse auctions by category and subcategory |
| Watch List | /watchlist | Lots you've saved to watch |
| Bids | /bids | Your bid activity and registered auctions |
| Find Auctions | Dropdown | Browse all, live, upcoming, by state, or by auctioneer |
| Auctioneer Search | /auctioneers | Find and follow auctioneers |
| Blog | /blog | Auction news and guides |
| Sell | /sell | List items or register as a seller |
| Calendar | /calendar | Monthly view of all upcoming auctions |
| Help | /help | This page |

### Bids page (/bids)
Your central hub for bidding activity. Three tabs:
- **My Bids** — all lots you've bid on, grouped by auction, with your bid status
- **Top Picks** — personalized lot recommendations
- **My Auctions** — auctions you've registered for

### Watchlist (/watchlist)
Save any lot to your watchlist with the heart icon. You'll receive a notification when the price changes or the auction is closing soon (if enabled in Settings).

### Account settings (/account)
Two tabs:
- **User Information** — name, phone, country, timezone, bio
- **Payment** — payment methods and billing address

### Notification settings (/settings)
Manage which email and push alerts Bidooze sends you: outbid alerts, auction reminders, winning notifications, payment updates, and more.
    `,
    readTime: 4,
    popular: false,
    updatedAt: "2025-05-05",
  },

  // ── Bidding ───────────────────────────────────────────────────────────────
  {
    id: "5",
    slug: "how-to-bid",
    category: "bidding",
    title: "How to place a bid",
    excerpt: "A complete walkthrough of registering for an auction and placing your first bid on a lot.",
    content: `
## Placing a bid on Bidooze

### Before you bid
Three things must be in place:
- Your **personal information** is complete (name and phone number)
- You have a **payment method** on file — add one at [/account](/account) under the Payment tab
- You are **registered for the specific auction** you want to bid in

### Step 1 — Register for the auction
Open the auction page and click **Register to Bid**. For most auctions this is instant; some auctioneers require manual approval (see [Registering for a specific auction](/help/article/registering-for-auction)).

### Step 2 — Find a lot and place your bid
1. Open the lot page at [/lot/[id]](/lots)
2. Enter your bid amount in the bid field — it must meet or exceed the minimum next bid shown
3. Click **Place Bid**
4. Review the bid summary in the confirmation modal (amount, buyer's premium, estimated total)
5. Click **Confirm** to submit

Your bid is now live. You'll receive a notification if you're outbid.

### Outbid notifications
Enable **Outbid notifications** in [Settings](/settings) to get instant alerts when someone surpasses your bid.
    `,
    readTime: 4,
    popular: true,
    updatedAt: "2025-05-12",
  },
  {
    id: "6",
    slug: "auto-bidding",
    category: "bidding",
    title: "Using proxy (max) bidding",
    excerpt: "Set a maximum bid and let Bidooze bid on your behalf up to your limit.",
    content: `
## Proxy bidding explained

Proxy bidding lets you set the maximum amount you're willing to pay. Bidooze then automatically raises your bid in the smallest required increment to keep you in the lead — up to your maximum.

### How to set a proxy bid
1. On the lot page, enter your **maximum bid** amount in the bid field
2. Select the **max bid** option (if shown) before confirming
3. Confirm — Bidooze will now bid for you automatically

### How it works
- Your maximum is **never revealed** to other bidders
- The system only bids the minimum increment needed to keep you winning
- If two bidders set the same maximum, the first one placed wins at that amount
- You can **raise** your proxy bid limit at any time during an open auction

### Bid increments
Increments are set by the auctioneer and increase as the lot value rises. The current increment required is always shown next to the bid field on the lot page.

| Lot value | Typical increment |
|-----------|-------------------|
| $0 – $200 | $5 |
| $201 – $1,000 | $25 |
| $1,001 – $5,000 | $100 |
| $5,001+ | $250 |

Exact increments vary per auction — always check the lot page.
    `,
    readTime: 5,
    popular: true,
    updatedAt: "2025-04-30",
  },
  {
    id: "7",
    slug: "bid-status",
    category: "bidding",
    title: "Checking the status of your bids",
    excerpt: "Find all active, winning, outbid, and completed bids from the Bids page.",
    content: `
## Bid status overview

### Where to find your bids
Go to [/bids](/bids) and open the **My Bids** tab. Your lots are grouped by auction.

| Status | Description |
|--------|-------------|
| **Winning** | You are currently the highest bidder |
| **Outbid** | Another bidder has surpassed your amount |
| **Won** | Auction closed and you were the top bidder |
| **Lost** | Auction closed, another bidder won |

### Bid summary
At the top of the My Bids tab you'll see a summary showing:
- How many lots you're currently winning
- How many times you've been outbid
- Total number of bids placed
- Lots won and lost

### Filtering
Use the sidebar filters on the My Bids tab to narrow by:
- Specific auction
- Bid status
- Show/hide closed lots

### Outbid alerts
Enable **Outbid notifications** in [Settings](/settings) to get an instant alert the moment someone outbids you.
    `,
    readTime: 3,
    popular: true,
    updatedAt: "2025-05-08",
  },
  {
    id: "8",
    slug: "registering-for-auction",
    category: "bidding",
    title: "Registering for a specific auction",
    excerpt: "How to register to bid in an auction and check your registration status.",
    content: `
## Auction registration

### Why registration is required
Each auctioneer controls access to their auction. You must register before placing any bid, so the auctioneer can verify that you have a valid payment method on file and meets their requirements.

### How to register
1. Open the auction page
2. Click **Register to Bid**
3. Review the auction terms, confirm your phone number, and optionally set a max bid limit
4. If a deposit is required, you'll be guided through the payment step
5. Click **Confirm Registration**

For some auctioneers the registration is instant. For others, the auctioneer must manually approve you — this typically happens within 1 business day.

### Checking your registration status
Go to [/bids?tab=my-auctions](/bids) and open the **My Auctions** tab. Every auction you've registered for is listed there along with its registration status.

### Approval pending?
If your status shows **Pending**, wait for the auctioneer to review your application. You'll receive a notification when approved.
    `,
    readTime: 3,
    popular: true,
    updatedAt: "2025-04-10",
  },
  {
    id: "9",
    slug: "auction-terminology",
    category: "bidding",
    title: "Auction terminology glossary",
    excerpt: "Definitions for reserve price, buyer's premium, hammer price, proxy bid, and more.",
    content: `
## Auction terminology

| Term | Definition |
|------|-----------|
| **Reserve price** | The minimum price the seller will accept. If not met, the item may not sell. |
| **Starting bid** | The lowest bid amount accepted to open bidding on a lot. |
| **Hammer price** | The winning bid amount at the moment the auction closes the lot. |
| **Buyer's premium** | A percentage fee added to the hammer price, paid by the buyer. Typically 10–20%. |
| **Proxy bid / Max bid** | A maximum bid you set in advance. Bidooze bids on your behalf in minimum increments up to that amount. |
| **Lot** | A single item or group of items offered as one unit in an auction. |
| **Catalogue** | The full list of lots in an auction with descriptions and photos. |
| **Bid increment** | The minimum amount by which a new bid must exceed the current highest bid. Set by the auctioneer. |
| **Soft close** | Auction closing time extends automatically if a bid is placed in the final minutes. |
| **Registration** | The process of enrolling in a specific auction before you're permitted to bid. |
    `,
    readTime: 4,
    popular: true,
    updatedAt: "2025-04-15",
  },

  // ── Account & Settings ───────────────────────────────────────────────────
  {
    id: "10",
    slug: "managing-account",
    category: "account",
    title: "Managing your account information",
    excerpt: "Update your name, phone number, country, timezone, and bio from Account Settings.",
    content: `
## Account settings

Go to [/account](/account) to manage your personal details.

### User Information tab
- **Name** — your first and last name as shown to auctioneers
- **Phone number** — required for auction registration
- **Country** — your country of residence
- **Timezone** — used to display auction times in your local time
- **Bio** — optional short description

Make any changes and click **Save changes**.

### Payment tab
See [Adding a payment method](/help/article/adding-payment-method) and [Adding a billing address](/help/article/adding-payment-method) for full details on managing cards and addresses.
    `,
    readTime: 2,
    popular: false,
    updatedAt: "2025-05-10",
  },
  {
    id: "11",
    slug: "notification-settings",
    category: "account",
    title: "Managing your notification preferences",
    excerpt: "Turn on or off email and push notifications for bids, auctions, payments, and more.",
    content: `
## Notification preferences

Go to [/settings](/settings) to control which notifications Bidooze sends you.

### Bidding activity
| Notification | What triggers it |
|-------------|-----------------|
| Outbid notifications | Someone places a higher bid than yours |
| Auction won | An auction you were winning has closed with you as winner |
| Auction ending soon | An auction you're bidding in is about to close |
| Watched item price changes | The price changes on a lot in your watchlist |
| Watched auction closing | A watched auction is closing soon |

### Auction reminders
| Notification | What triggers it |
|-------------|-----------------|
| Registered auction reminders | Upcoming reminders for auctions you've registered for |
| Auctions starting soon | Auctions you're interested in are about to open |
| Daily auction summary | A daily digest of all active auctions you're involved in |

### Account & transactions
| Notification | What triggers it |
|-------------|-----------------|
| Payment notifications | A payment succeeds or fails |

Toggle each one on or off, then click **Save settings**.
    `,
    readTime: 3,
    popular: false,
    updatedAt: "2025-05-06",
  },
  {
    id: "12",
    slug: "watchlist",
    category: "account",
    title: "Using your watchlist",
    excerpt: "Save lots to your watchlist and get notified when prices change or auctions close.",
    content: `
## Watchlist

The watchlist lets you track lots without registering to bid. You can add any lot with the **heart icon** visible on lot cards and lot detail pages.

### Accessing your watchlist
Click **Watch List** in the navigation bar or go to [/watchlist](/watchlist).

### What you can do
- View all saved lots at a glance
- See the current bid and time remaining for each
- Click through to any lot to place a bid
- Remove lots you're no longer interested in

### Notifications for watched lots
Enable these in [Settings](/settings) to stay informed:
- **Watched item price changes** — notified when the current bid increases
- **Watched auction closing** — alerted when a watched auction is nearly over
    `,
    readTime: 2,
    popular: false,
    updatedAt: "2025-05-05",
  },
  {
    id: "13",
    slug: "resetting-password-account",
    category: "account",
    title: "Changing or resetting your password",
    excerpt: "How to reset a forgotten password or request a password change.",
    content: `
## Password management

### Forgot your password?
1. Go to [/auth/reset-password](/auth/reset-password)
2. Enter your account email address
3. Click **Send Reset Link**
4. A link will be sent to your email — click it to set a new password

### Password requirements
- At least 8 characters
- At least 1 letter
- At least 1 number or symbol

> Need further help? Use the [Contact page](/contact) to reach the support team.
    `,
    readTime: 2,
    popular: false,
    updatedAt: "2025-05-01",
  },

  // ── Payments ──────────────────────────────────────────────────────────────
  {
    id: "14",
    slug: "adding-payment-method",
    category: "payments",
    title: "Adding a payment method and billing address",
    excerpt: "Add a credit or debit card and billing address to your account before bidding.",
    content: `
## Adding a payment method

A valid payment method is required before you can register for or bid in any auction.

### How to add a card
1. Go to [Account Settings → Payment tab](/account)
2. Click **Add payment method**
3. Enter your card details (card number, expiry, CVC, cardholder name)
4. Click **Save**

### Adding a billing address
In the same Payment tab, scroll to the address section:
1. Click **Add address** or **Edit**
2. Fill in your address details (street, city, state/province, country, postal code)
3. Click **Save**

### Accepted cards
Bidooze accepts all major credit and debit cards (Visa, Mastercard, American Express).

> All card data is handled by a PCI-DSS Level 1 certified payment processor. Bidooze never stores raw card numbers.
    `,
    readTime: 3,
    popular: true,
    updatedAt: "2025-05-06",
  },
  {
    id: "15",
    slug: "understanding-invoices",
    category: "payments",
    title: "Understanding your invoice",
    excerpt: "Break down of hammer price, buyer's premium, and what you owe after winning a lot.",
    content: `
## Invoice breakdown

After winning a lot, Bidooze automatically generates an invoice when the auction closes.

### Invoice components

| Line item | Description |
|-----------|-------------|
| Hammer price | The winning bid amount |
| Buyer's premium | Auctioneer's percentage fee on top of the hammer price |
| Sales tax / VAT | Applied based on your location and item type |
| Shipping (if applicable) | Carrier cost if shipping was requested |
| **Total due** | Sum of all above |

### Buyer's premium
The buyer's premium percentage is set by the auctioneer and is always shown on the auction and lot pages before you bid. It is added to your hammer price after you win.

### Viewing invoices
Your invoices are accessible from [/bids](/bids). Each won lot will show its payment status. Contact the auctioneer directly through the auction page for invoice disputes.
    `,
    readTime: 4,
    popular: true,
    updatedAt: "2025-05-02",
  },
  {
    id: "16",
    slug: "payment-issues",
    category: "payments",
    title: "Payment issues and failed charges",
    excerpt: "What to do if a payment fails, your card is declined, or you need to update billing details.",
    content: `
## Payment issues

### Card declined
If your card is declined during auction registration or invoice payment:
1. Check that your card details in [Account Settings → Payment](/account) are up to date (expiry date, billing address)
2. Contact your bank — some banks block unusual online transactions by default
3. Try adding a different payment method

### Failed charge notification
Bidooze will send you a **payment notification** (if enabled in [Settings](/settings)) when a charge fails. Resolve the issue before the invoice due date to avoid losing your won items.

### Updating your card
1. Go to [Account Settings → Payment](/account)
2. Remove the outdated card and add a new one
3. Make sure the new card is marked as default before your next bid

> If you're having persistent payment issues, use the [Contact page](/contact) to reach the Bidooze support team.
    `,
    readTime: 3,
    popular: false,
    updatedAt: "2025-05-02",
  },

  // ── Pickup & Shipping ─────────────────────────────────────────────────────
  {
    id: "17",
    slug: "pickup-instructions",
    category: "pickup-shipping",
    title: "Pickup instructions",
    excerpt: "How to arrange pickup of items you've won at auction.",
    content: `
## Picking up your won items

### After you win
1. Pay your invoice in full
2. The auctioneer will release pickup instructions via email and in-app notification
3. Review the pickup **location, dates, and hours** carefully — these are set by each individual auctioneer

### Bringing ID
Always bring a **government-issued photo ID** matching the name on your Bidooze account. Auctioneers are required to verify identity before releasing items.

### If you can't collect in person
Contact the auctioneer directly through the auction page to arrange an authorised collection agent. Requirements vary by auctioneer.

### Missed the pickup window?
Contact the auctioneer through the auction page as soon as possible. Storage fees may apply for uncollected items after the stated pickup period.
    `,
    readTime: 4,
    popular: true,
    updatedAt: "2025-05-09",
  },
  {
    id: "18",
    slug: "shipping-information",
    category: "pickup-shipping",
    title: "Shipping your won items",
    excerpt: "Shipping availability, how to request shipping, and what happens after dispatch.",
    content: `
## Shipping options

Not all auctions offer shipping — this is determined by the auctioneer. If shipping is available, it will be shown on the lot page before you bid.

### Requesting shipping
After winning a lot where shipping is available:
1. The auctioneer will contact you with shipping options
2. Confirm your delivery address — make sure it's up to date in [Account Settings → Payment](/account)
3. Review the shipping quote
4. Shipping cost is added to your invoice

### Carriers
Shipping carriers and rates are set by the individual auctioneer. Oversized or fragile items may require specialist carriers arranged directly with the auctioneer.

### Tracking
Once your item is dispatched, the auctioneer will provide tracking information via email or through the auction page.

> **Questions about a specific shipment?** Contact the auctioneer directly through the auction page — they manage all fulfilment for their auctions.
    `,
    readTime: 4,
    popular: false,
    updatedAt: "2025-04-20",
  },

  // ── Finding Auctions ──────────────────────────────────────────────────────
  {
    id: "19",
    slug: "finding-auctions",
    category: "auctions",
    title: "Finding auctions on Bidooze",
    excerpt: "Use the navigation, search, filters, and calendar to discover auctions that match your interests.",
    content: `
## Discovering auctions

### Browse all auctions
Go to [/auctions](/auctions) to see every current and upcoming auction. Use the status tabs at the top to switch between:
- **All** — everything on the platform
- **Live** — auctions open for bidding right now ([/auctions?auction_status=live](/auctions?auction_status=live))
- **Upcoming** — auctions that haven't opened yet ([/auctions?auction_status=upcoming](/auctions?auction_status=upcoming))

### Search by category
Click **Search by Category** in the navigation bar to browse by category and subcategory — for example: Vehicles → Classic Cars, or Jewellery → Diamond Rings.

### Browse by location
Go to [Auctions by State](/auctions/state) from the **Find Auctions** dropdown to view an interactive map of auctions in the US and Canada.

### Auction calendar
The [Calendar](/calendar) page shows a monthly view of all scheduled auctions. Click any date to see auctions closing or starting that day.

### Find auctioneers
Visit [/auctioneers](/auctioneers) to search for specific auction houses. From any auctioneer's profile you can see all their current and upcoming auctions.
    `,
    readTime: 3,
    popular: false,
    updatedAt: "2025-05-03",
  },
  {
    id: "20",
    slug: "auction-calendar",
    category: "auctions",
    title: "Using the auction calendar",
    excerpt: "Navigate the monthly calendar, filter by auctioneer or auction type, and view a day's schedule.",
    content: `
## Auction calendar

The calendar at [/calendar](/calendar) gives you a monthly overview of all auctions on Bidooze.

### Navigating the calendar
- Use the **left and right arrows** to move between months
- Days with auctions are highlighted — click one to see that day's schedule on the right
- The **Daily Schedule** panel shows auction names, times, and status for the selected date

### Filtering the calendar
Use the filter controls to narrow what's shown:
- **Auctioneer** — show only auctions from a specific house
- **Auction type** — filter by live, timed, or webcast

### Switching to list view
On mobile, the calendar switches to a list view for easier reading.
    `,
    readTime: 3,
    popular: false,
    updatedAt: "2025-05-03",
  },
  {
    id: "21",
    slug: "auctions-by-state",
    category: "auctions",
    title: "Finding auctions by state or province",
    excerpt: "Use the interactive US and Canada maps to find auctions in your area.",
    content: `
## Auctions by state or province

Go to [/auctions/state](/auctions/state) from the **Find Auctions** menu.

### How it works
- An interactive map of the **United States** or **Canada** is displayed (toggle between them with the country selector)
- States and provinces are colour-coded by auction count — darker means more auctions
- Hover over a state to see the number of auctions
- Click a state to see all auctions in that region

### Viewing results
After clicking a state, you're taken to the filtered auction list showing only auctions from that location. You can further refine by status (live, upcoming) from there.
    `,
    readTime: 2,
    popular: false,
    updatedAt: "2025-05-03",
  },

  // ── Selling ───────────────────────────────────────────────────────────────
  {
    id: "22",
    slug: "selling-on-bidooze",
    category: "sellers",
    title: "Selling on Bidooze — getting started",
    excerpt: "How auctioneers list auctions and lots on the Bidooze platform.",
    content: `
## Selling on Bidooze

Bidooze is a marketplace for professional auctioneers. If you're an auctioneer looking to list auctions and reach verified buyers, here's how to get started.

### Register as a seller
Click **Sell** in the navigation bar or visit [/sell](/sell). This will direct you to the Bidooze Seller Panel where you can create your auctioneer account.

### What sellers can do
From the Seller Panel, auctioneers can:
- Create and publish auctions
- Add and manage lots with photos and descriptions
- Set reserve prices, starting bids, and bid increments
- Approve or reject bidder registrations
- Manage invoices and communicate with winning bidders

### Questions about selling?
Use the [Contact page](/contact) and select **Partnership / Selling on Bidooze** as the reason. Our team will be in touch.
    `,
    readTime: 3,
    popular: false,
    updatedAt: "2025-04-10",
  },
  {
    id: "23",
    slug: "auctioneer-search",
    category: "sellers",
    title: "Finding and following auctioneers",
    excerpt: "Search the auctioneer directory, view their profiles, and see all their active auctions.",
    content: `
## Auctioneer search

Bidooze hosts auctions from professional auction houses across multiple countries.

### Searching for auctioneers
Go to [/auctioneers](/auctioneers). You can:
- Search by **auctioneer name**
- Filter by **location** (state and country)
- Toggle to show only your **favourite** auctioneers

### Auctioneer profiles
Click any auctioneer to open their profile page, which shows:
- Company name and location
- Contact details and social links
- All current and upcoming auctions

### Saving favourites
Click the **star icon** on any auctioneer card to add them to your favourites. Log in to save favourites — guests cannot save them.
    `,
    readTime: 2,
    popular: false,
    updatedAt: "2025-04-10",
  },

  // ── Troubleshooting ───────────────────────────────────────────────────────
  {
    id: "24",
    slug: "login-issues",
    category: "troubleshooting",
    title: "Can't log in to your account",
    excerpt: "Steps to resolve login failures, forgotten passwords, and account access issues.",
    content: `
## Login issues

### Wrong password
1. Go to [/auth/login](/auth/login) and enter your email
2. If the password is wrong, click **Forgot password?** to reset it via [/auth/reset-password](/auth/reset-password)

### Verification code not arriving
If you're signing up and the OTP code hasn't arrived:
- Check your spam or junk folder
- Wait 60 seconds, then click **Resend** on the verification screen
- Make sure the email address you entered is correct

### Account not recognised
- Double-check you're using the email address you signed up with
- If you signed up via Google, Apple, or Facebook, use that social login button instead of email/password

### Profile setup not completing
If you're redirected back to profile setup every time you log in, it means your sign-up was not fully completed. Finish all steps (personal info and category interests) to gain full access.

### Still can't access your account?
Use the [Contact page](/contact) and select **Account Help** as the reason.
    `,
    readTime: 3,
    popular: true,
    updatedAt: "2025-05-01",
  },
  {
    id: "25",
    slug: "bid-not-going-through",
    category: "troubleshooting",
    title: "Bid not going through",
    excerpt: "Why a bid might be rejected and how to fix it.",
    content: `
## Bid not going through

### Not registered for the auction
You must register for an auction before placing any bid. Open the auction page and click **Register to Bid**. If your registration is pending approval, wait for the auctioneer to approve you.

### Bid amount too low
The bid must meet the **minimum next bid** shown on the lot page. This is the current highest bid plus the bid increment. Enter at least this amount.

### No payment method on file
A valid payment method is required. Go to [Account Settings → Payment](/account) to add a card before bidding.

### Auction has closed
If the auction's closing time has passed, bids can no longer be placed. Check [/bids](/bids) to see if any lots are still open.

### Still having issues?
Use the [Contact page](/contact) and select **Bidding Issue** as the reason with a description of the error you're seeing.
    `,
    readTime: 3,
    popular: true,
    updatedAt: "2025-05-08",
  },
  {
    id: "26",
    slug: "registration-issues",
    category: "troubleshooting",
    title: "Auction registration problems",
    excerpt: "What to do if your registration is rejected, pending too long, or you can't find your registration status.",
    content: `
## Auction registration problems

### Where to check your status
Go to [/bids?tab=my-auctions](/bids) and open the **My Auctions** tab. All auctions you've registered for are listed with their current registration status.

### Pending too long
Most registrations are approved within 1 business day. If yours has been pending for longer:
- Check that your personal information and phone number in [Account Settings](/account) are correct
- Check that you have a valid payment method on file
- Some auctions require a deposit — make sure that step was completed during registration

### Registration rejected
If an auctioneer declines your registration, you'll receive a notification. The auctioneer may not provide a reason. You can:
- Review your account details for completeness
- Contact the auctioneer directly through the auction page

### Can't find the Register button
The **Register to Bid** button only appears on auctions that are currently open for registration. If the auction hasn't opened for registration yet, check back closer to the start date.
    `,
    readTime: 3,
    popular: false,
    updatedAt: "2025-04-10",
  },
];

export const popularArticles = articles.filter((a) => a.popular);

export const quickSearchTerms = [
  "Create account",
  "Verify email",
  "Register to bid",
  "Add payment method",
  "Pickup instructions",
  "Reset password",
  "Proxy bid",
  "My bids",
  "Watchlist",
  "Auction calendar",
  "Buyer's premium",
  "Notification settings",
];
