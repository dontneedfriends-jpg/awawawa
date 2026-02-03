# 3D Printing Workshop CRM

A comprehensive CRM application designed for home 3D printing workshops. Features order management, parts cataloging, cost calculation, inventory tracking, and analytics with a modern dark-mode interface powered by Convex.

## Features

- 📦 **Order Management** - Track orders from creation to delivery with status workflow
- 🔧 **Parts Catalog** - Manage your parts library with photos and automatic cost calculations
- 🎨 **Materials Management** - Track filament inventory with low-stock alerts
- 🖨️ **Printer Management** - Monitor printer utilization and maintenance schedules
- 📊 **Analytics Dashboard** - Real-time insights into revenue, orders, and material usage
- ⚡ **Quick Estimate** - Fast cost calculation tool for custom quotes
- 🌍 **Multi-language** - Support for English and Russian
- 💱 **Multi-currency** - RUB, USD, EUR, CNY with automatic conversion
- 🌑 **Dark Mode** - Workshop-optimized dark theme

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **Backend**: Convex (real-time database and backend)
- **State Management**: React Context + Convex reactive queries
- **Forms**: react-hook-form + zod validation
- **Charts**: Recharts
- **Notifications**: Sonner

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/dontneedfriends-jpg/awawawa.git
   cd awawawa
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Convex:
   ```bash
   npx convex dev
   ```
   This will create a new Convex project and provide you with a deployment URL.

4. Create `.env.local` file:
   ```bash
   cp .env.local.example .env.local
   ```
   Add your Convex deployment URL to `.env.local`:
   ```
   NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js app router pages
├── components/             # React components
│   ├── ui/                # shadcn/ui components
│   ├── layout/            # Layout components (Sidebar, Header)
│   ├── orders/            # Order-related components
│   ├── parts/             # Parts catalog components
│   ├── materials/         # Materials management components
│   └── common/            # Shared components
├── contexts/              # React contexts (i18n, currency)
├── convex/                # Convex backend functions
│   ├── schema.ts          # Database schema
│   ├── orders.ts          # Order operations
│   ├── parts.ts           # Parts operations
│   ├── materials.ts       # Materials operations
│   └── analytics.ts       # Analytics queries
├── lib/                   # Utility functions
│   ├── currency.ts        # Currency formatting
│   ├── date.ts            # Date formatting
│   ├── cost-calculator.ts # Cost calculation logic
│   └── validators.ts      # Zod validation schemas
└── locales/               # i18n translations (en, ru)
```

## Usage

### Creating an Order

1. Navigate to "Orders" from the sidebar
2. Click "New Order"
3. Fill in customer information
4. Add parts and quantities
5. Set markup percentage
6. Review and create order

### Managing Materials

1. Go to "Materials"
2. Add new materials with cost per gram
3. Track inventory levels
4. Receive low-stock alerts

### Cost Calculation

The system automatically calculates costs based on:
- Material weight × cost per gram
- Print time × printer hourly rate
- Your markup percentage

### Quick Estimate

Use the Quick Estimate tool for rapid quotes:
1. Select material
2. Enter weight and print time
3. Set markup
4. Get instant pricing

## Customization

### Adding a New Language

1. Create a new file in `locales/` (e.g., `locales/de.ts`)
2. Copy the structure from `locales/en.ts`
3. Translate all strings
4. Update `contexts/i18n-context.tsx` to include the new locale

### Changing Theme Colors

Edit the CSS variables in `app/globals.css`:
```css
:root {
  --accent-orange: #ff6b00;  /* Primary accent */
  --status-printing: #ff6b00; /* etc. */
}
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variable: `NEXT_PUBLIC_CONVEX_URL`
4. Deploy!

### Deploy Convex Backend

```bash
npx convex deploy
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please open an issue on GitHub.
