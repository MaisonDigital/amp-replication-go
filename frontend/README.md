# Real Estate Frontend

A modern, lightning-fast Next.js real estate website template built with Bun, designed for easy customization and deployment across multiple clients.

## 🚀 Tech Stack

- **Runtime**: Bun (for blazing fast package management and builds)
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom real estate components
- **State Management**: TanStack React Query (formerly React Query)
- **Forms**: React Hook Form with Zod validation
- **Maps**: MapLibre GL (free, no API key required)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **API Integration**: Ready for FastAPI backend

## 🏡 Features

### Core Functionality
- **Property Search**: Advanced filtering (price, bedrooms, location, type)
- **Interactive Maps**: MapLibre-powered property mapping with custom markers
- **Property Details**: Full property pages with image galleries
- **Featured Listings**: Office-specific property showcases
- **Responsive Design**: Mobile-first, works perfectly on all devices

### SEO & Marketing
- **Auto-Generated SEO Pages**: 
  - `/properties/for-sale/ottawa`
  - `/properties/for-sale/kanata/condos`
  - `/properties/for-rent/orleans/houses`
  - 100+ location/type combinations automatically
- **Structured Data**: Rich snippets for search engines
- **Dynamic Meta Tags**: Property-specific social sharing
- **Sitemap Generation**: Automatic XML sitemap creation

### Client Customization
- **Single Config File**: Easy branding in `src/lib/config.ts`
- **Environment Variables**: Different settings per deployment
- **Theme Colors**: Customizable primary/secondary colors
- **Company Information**: Phone, email, address, social media
- **Feature Toggles**: Enable/disable commercial properties, maps, etc.

### Performance
- **Bun Package Manager**: 3x faster installs than npm
- **MapLibre**: Lightweight mapping (vs Google Maps)
- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic bundle optimization
- **Caching**: React Query for API response caching

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Homepage
│   │   ├── properties/        # Property search & detail pages
│   │   │   ├── page.tsx       # Main search page
│   │   │   ├── for-sale/      # SEO pages for sales
│   │   │   ├── for-rent/      # SEO pages for rentals
│   │   │   └── [listingKey]/  # Individual property pages
│   │   ├── contact/           # Contact page
│   │   ├── about/             # About page
│   │   ├── layout.tsx         # Root layout
│   │   ├── not-found.tsx      # 404 page
│   │   ├── error.tsx          # Error boundary
│   │   ├── loading.tsx        # Loading page
│   │   ├── sitemap.ts         # Dynamic sitemap
│   │   └── robots.ts          # SEO robots.txt
│   ├── components/
│   │   ├── layout/            # Header, footer, navigation
│   │   ├── properties/        # Property cards, grids, filters
│   │   ├── home/              # Homepage sections
│   │   ├── contact/           # Contact form components
│   │   ├── map/               # MapLibre components
│   │   └── ui/                # Reusable UI components
│   ├── hooks/                 # Custom React hooks
│   │   ├── useProperties.ts   # Property API hooks
│   │   ├── useLocalStorage.ts # Local storage hook
│   │   └── useDebounce.ts     # Debounce hook
│   ├── lib/
│   │   ├── config.ts          # 🎯 Main configuration file
│   │   ├── api.ts             # API client functions
│   │   └── utils.ts           # Utility functions
│   ├── types/
│   │   └── property.ts        # TypeScript type definitions
│   └── providers/
│       └── query-provider.tsx # React Query setup
├── public/
│   ├── images/                # Static images
│   └── icons/                 # Favicons, PWA icons
├── .env.local                 # Environment variables
├── tailwind.config.js         # Tailwind configuration
├── postcss.config.js          # PostCSS configuration
├── next.config.js             # Next.js configuration
├── tsconfig.json              # TypeScript configuration
├── package.json               # Dependencies (Bun)
└── bun.lockb                  # Bun lock file
```

## 🛠️ Development Setup

### Prerequisites
- **Bun** (latest version)
- **Node.js** 18.17.0+ (for Next.js)

### Installation

```bash
# Clone or create the frontend directory
cd frontend

# Install dependencies (lightning fast with Bun!)
bun install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your settings

# Start development server
bun dev
```

### Available Scripts

```bash
bun dev          # Start development server (http://localhost:3000)
bun build        # Build for production
bun start        # Start production server
bun lint         # Run ESLint
bun type-check   # Run TypeScript checks
bun format       # Format code with Prettier
```

## ⚙️ Configuration

### Main Config File: `src/lib/config.ts`

This is where you customize everything for each client:

```typescript
export const siteConfig = {
  company: {
    name: "Maison Property Group",        // ← Change this
    tagline: "Your Premier Real Estate Partner",
    phone: "(613) 555-0123",             // ← Change this
    email: "info@maisonpropertygroup.com", // ← Change this
    // ... etc
  },
  
  theme: {
    primary: "#1e40af",   // ← Brand colors
    secondary: "#dc2626",
    accent: "#059669",
  },
  
  primaryLocations: [      // ← Adds SEO pages for each
    "Ottawa", "Kanata", "Orleans", // ← Add/remove locations
  ],
  
  officeKey: "OFFICE123", // ← Change to client's office key
};
```

### Environment Variables: `.env.local`

```env
# API Backend
NEXT_PUBLIC_API_URL=http://localhost:8000

# Business Info
NEXT_PUBLIC_COMPANY_NAME="Maison Property Group"
NEXT_PUBLIC_OFFICE_KEY="OFFICE123"

# Social Media
NEXT_PUBLIC_FACEBOOK_URL=https://facebook.com/yourpage
# ... etc
```

## 🗺️ Mapping with MapLibre

### Why MapLibre?
- **100% Free** - No API keys required for basic maps
- **No Usage Limits** - Unlike Google Maps (28K free loads/month)
- **Great Performance** - Lightweight and fast
- **Perfect for Real Estate** - Excellent address geocoding

### Map Features
- **Custom Property Markers** with price displays
- **Hover Popups** showing property details
- **Auto-fitting bounds** to show all properties
- **Click handlers** for property selection
- **OpenStreetMap tiles** (free, high-quality)

### Usage Example

```tsx
import { PropertyMap } from "@/components/map/property-map";

<PropertyMap
  properties={searchResults}
  onPropertyClick={(property) => router.push(`/properties/${property.listing_key}`)}
  center={[-75.6972, 45.4215]} // Ottawa
  zoom={11}
/>
```

## 🔌 API Integration

### FastAPI Backend Integration

The frontend is designed to work seamlessly with your FastAPI backend:

```typescript
// Automatic API calls via React Query
const { data, isLoading } = useSearchProperties({
  transaction_type: "For Sale",
  city_region: "Ottawa",
  bedrooms: 3,
});
```

### Endpoint Mapping

| Frontend Hook | API Endpoint | Purpose |
|---------------|-------------|---------|
| `useSearchProperties` | `GET /api/v1/search` | Property search with filters |
| `usePropertyDetail` | `GET /api/v1/listings/{id}` | Individual property details |
| `useFeaturedProperties` | `GET /api/v1/featured/{office}` | Featured listings by office |
| `useMapProperties` | `GET /api/v1/search/map` | Properties within map bounds |

### Error Handling & Caching

- **Automatic retries** for failed requests
- **5-minute caching** for search results
- **10-minute caching** for property details
- **Loading states** and error boundaries
- **Optimistic updates** where appropriate

## 🎨 Customization Guide

### For New Clients

1. **Update Company Info** in `src/lib/config.ts`
2. **Set Environment Variables** in `.env.local`
3. **Replace Logo/Images** in `public/images/`
4. **Deploy** to Vercel/Netlify

### Brand Colors

```typescript
// In src/lib/config.ts
theme: {
  primary: "#your-primary-color",
  secondary: "#your-secondary-color",
  accent: "#your-accent-color",
}
```

### Adding Locations

```typescript
// Automatically generates SEO pages
primaryLocations: [
  "Ottawa",
  "Your New City",  // Creates /properties/for-sale/your-new-city
]
```

### Feature Toggles

```typescript
features: {
  showCommercial: true,        // Show/hide commercial properties
  showMap: true,              // Enable/disable map functionality
  showMortgageCalculator: false, // Show mortgage calculator
  showBlog: false,            // Enable blog section
}
```

## 📊 SEO Features

### Automatic Page Generation

The app automatically creates SEO-optimized pages:

- **Location Pages**: `/properties/for-sale/{location}`
- **Property Type Pages**: `/properties/for-sale/{location}/{type}`
- **Rental Pages**: `/properties/for-rent/{location}`
- **Dynamic Meta Tags** for each page
- **Structured Data** for rich snippets

### Meta Tag Example

```tsx
// Automatically generated for each location
export const metadata: Metadata = {
  title: "Condos for Sale in Ottawa | Maison Property Group",
  description: "Browse condos for sale in Ottawa. Find your perfect condo with detailed listings, photos, and neighborhood information.",
  keywords: ["Ottawa condos", "condos for sale Ottawa", "Ottawa real estate"],
};
```

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Build and deploy
bun run build

# Deploy to Vercel
npx vercel --prod
```

### Other Platforms

Works with any Node.js hosting:
- **Netlify**
- **Railway**
- **DigitalOcean App Platform**
- **AWS Amplify**

### Environment Variables

Make sure to set these in your hosting platform:

```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NEXT_PUBLIC_SITE_URL=https://your-frontend-domain.com
NEXT_PUBLIC_OFFICE_KEY=client_office_key
NEXT_PUBLIC_COMPANY_NAME="Client Company Name"
```

## 🔧 Performance Optimizations

### Built-in Optimizations

- **Automatic Code Splitting**: Next.js splits bundles automatically
- **Image Optimization**: WebP/AVIF conversion, lazy loading
- **Font Optimization**: Google Fonts optimization
- **Bundle Analysis**: Run `bun run analyze` to see bundle sizes

### Caching Strategy

- **Static Pages**: Generated at build time
- **API Responses**: Cached via React Query
- **Images**: Cached by Next.js Image component
- **Map Tiles**: Cached by MapLibre

### Performance Monitoring

```bash
# Analyze bundle size
ANALYZE=true bun run build

# Check for unused dependencies
bun run lint

# Type checking
bun run type-check
```

## 🐛 Troubleshooting

### Common Issues

**Bun Installation Issues:**
```bash
# Update Bun
curl -fsSL https://bun.sh/install | bash

# Clear Bun cache
bun pm cache rm
```

**Map Not Loading:**
```bash
# Check MapLibre CSS is imported
# In your component: import "maplibre-gl/dist/maplibre-gl.css"
```

**API Connection Issues:**
```bash
# Verify API URL in .env.local
echo $NEXT_PUBLIC_API_URL

# Check API is running
curl http://localhost:8000/health
```

**Build Errors:**
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules bun.lockb
bun install
```

## 📈 Production Checklist

Before deploying for a client:

- [ ] Update `src/lib/config.ts` with client info
- [ ] Set production environment variables
- [ ] Replace placeholder images in `public/images/`
- [ ] Test all property search functionality
- [ ] Verify contact form works
- [ ] Check map functionality
- [ ] Run `bun run build` successfully
- [ ] Test on mobile devices
- [ ] Verify SEO pages generate correctly
- [ ] Set up analytics (GA4, etc.)

## 🤝 Client Handoff

### For Clients

1. **Admin Access**: Provide hosting platform access
2. **Environment Variables**: Document what each setting does
3. **Content Updates**: Show how to update company info
4. **Analytics**: Set up Google Analytics/Search Console
5. **Support**: Provide contact for technical issues

### Maintenance

- **Monthly**: Update dependencies with `bun update`
- **Quarterly**: Review analytics and performance
- **Annually**: Update Next.js major versions

---

**Built with ❤️ and ⚡ Bun for real estate professionals**

*Need help customizing this template? Contact the development team.*