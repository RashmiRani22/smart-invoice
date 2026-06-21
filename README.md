# Smart Invoice & GST Generator

A modern, professional web application for creating invoices, calculating GST, and generating PDF exports. Built with React, TypeScript, Tailwind CSS, and Node.js.

## Features

- 🧮 **GST Calculator** - Automatic GST calculation (5%, 12%, 18%, 28%)
- 📄 **Invoice Generator** - Create professional invoices with business and customer details
- 📥 **PDF Export** - Download invoices as PDF with one click
- 🌙 **Dark Mode** - Toggle between light and dark themes
- 📱 **Responsive Design** - Works on all devices and screen sizes
- ✨ **Live Preview** - See invoice updates in real-time as you type

## Tech Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS, React Hook Form
- **PDF Generation:** jsPDF
- **Build Tool:** Vite
- **Deployment:** Vercel

## Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd smart-invoice-gst-generator

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Usage

1. **Fill Business Details** - Enter your company name, GST number, address, email, and phone
2. **Add Customer Information** - Enter customer name, GST number, and address
3. **Add Products** - Add items with quantity, rate, and GST percentage
4. **Generate Invoice** - Click "Generate PDF Invoice" to download
5. **Toggle Dark Mode** - Use the button in the header to switch themes

## Deployment on Vercel

### Option 1: Direct GitHub Integration (Recommended)

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your GitHub repository
5. Framework: Select "Vite"
6. Click "Deploy"

### Option 2: Using Vercel CLI

```bash
npm install -g vercel
vercel
```

Follow the prompts to deploy.

## Project Structure

```
smart-invoice-gst-generator/
├── src/
│   ├── main.tsx          # Entry point
│   ├── App.tsx           # Main component
│   └── index.css         # Global styles
├── index.html            # HTML template
├── package.json          # Dependencies
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
└── tailwind.config.js    # Tailwind configuration
```

## License

MIT

## Author

Created with ❤️ for small businesses and freelancers
