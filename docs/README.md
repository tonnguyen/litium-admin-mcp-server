# Litium Admin MCP Server Documentation

This folder contains the complete Mintlify documentation for the Litium Admin MCP Server.

## 📚 Documentation Structure

```
docs/
├── mint.json                          # Mintlify configuration
├── introduction.mdx                   # Landing page
├── getting-started/                   # Getting started guides
│   ├── installation.mdx              # Installation guide
│   ├── configuration.mdx             # Configuration for Cursor/Claude
│   ├── authentication.mdx            # OAuth2 authentication
│   └── quickstart.mdx                # Quick start tutorial
├── tools/                             # Tool reference documentation
│   ├── overview.mdx                  # Tools overview
│   ├── blocks/                       # Blocks tools (5)
│   ├── products/                     # Products tools (5)
│   ├── customers/                    # Customers tools (5)
│   ├── media/                        # Media tools (2)
│   ├── websites/                     # Websites tools (2)
│   ├── orders/                       # Orders tools (2)
│   ├── api-discovery/                # API discovery tools (5)
│   └── api-documentation/            # API documentation tools (2)
└── guides/                            # Additional guides
    ├── deployment.mdx                # Deployment guide
    ├── testing.mdx                   # Testing guide
    └── troubleshooting.mdx           # Troubleshooting guide
```

## 🚀 Getting Started with Mintlify

### 1. Install Mintlify CLI

```bash
npm install -g mintlify
```

### 2. Preview Documentation Locally

**Option A: Using npm script (recommended)**
```bash
npm run docs:dev
```

**Option B: Using mintlify CLI directly**
```bash
cd docs
mintlify dev
```

The documentation will be available at `http://localhost:3000`

### 3. Deploy to Mintlify

#### Option A: Using npm script (recommended)

```bash
npm run docs:deploy
```

#### Option B: Deploy via Mintlify Dashboard

1. Go to [mintlify.com](https://mintlify.com)
2. Sign up/login
3. Click "New Documentation"
4. Connect your GitHub repository
5. Select the `docs` folder
6. Deploy!

#### Option C: Deploy via CLI directly

```bash
cd docs
mintlify deploy
```

## 📝 Documentation Features

### What's Included

- ✅ **Complete Tool Reference**: All 28 MCP tools documented with examples
- ✅ **Interactive Code Blocks**: Copy-paste ready examples in multiple languages
- ✅ **Natural Language Examples**: Examples for use with AI assistants
- ✅ **Step-by-Step Guides**: Installation, configuration, and deployment
- ✅ **Troubleshooting**: Common issues and solutions
- ✅ **Search Functionality**: Built-in documentation search
- ✅ **Responsive Design**: Works on desktop, tablet, and mobile
- ✅ **Dark Mode**: Automatic dark mode support

### Interactive Components

The documentation uses Mintlify's interactive components:

- **Cards**: Quick navigation to related topics
- **Accordions**: Expandable content sections
- **Tabs**: Multiple code examples or options
- **Code Groups**: Examples in different languages
- **Steps**: Sequential instructions
- **Param/Response Fields**: API parameter documentation
- **Info/Warning/Check boxes**: Highlighted callouts

## 🎨 Customization

### Update Branding

Edit `mint.json` to customize:

```json
{
  "name": "Your Project Name",
  "logo": {
    "light": "/logo/light.svg",
    "dark": "/logo/dark.svg"
  },
  "colors": {
    "primary": "#0D9373",
    "light": "#07C983",
    "dark": "#0D9373"
  }
}
```

### Add Logo Files

Place your logo files in:
```
docs/logo/
├── light.svg    # Logo for light mode
└── dark.svg     # Logo for dark mode
```

Recommended sizes:
- Height: 30-40px
- Format: SVG (preferred) or PNG

### Update Navigation

Edit the `navigation` section in `mint.json` to add/remove pages or reorganize the structure.

## 📖 Content Guidelines

When editing documentation:

1. **Use MDX format**: Files use `.mdx` extension (Markdown + JSX)
2. **Include frontmatter**: Each file needs title and description
3. **Use components**: Leverage Mintlify components for better UX
4. **Add examples**: Include practical code examples
5. **Keep it updated**: Update docs when adding new features

### Frontmatter Example

```mdx
---
title: Page Title
description: 'Brief description for SEO and search'
---

## Content starts here...
```

## 🔧 Local Development

### Prerequisites

- Node.js 18 or later
- npm or yarn

### Development Workflow

1. Make changes to `.mdx` files
2. Preview with `npm run docs:dev`
3. Test all links and examples
4. Commit and push to repository
5. Mintlify auto-deploys on push (if connected)

### Available npm Scripts

```bash
# Preview documentation locally
npm run docs:dev

# Deploy documentation to Mintlify
npm run docs:deploy
```

### Hot Reload

Both `npm run docs:dev` and `mintlify dev` include hot reload - changes to files will automatically refresh the browser.

## 📊 Analytics

To add analytics, edit `mint.json`:

```json
{
  "analytics": {
    "ga4": {
      "measurementId": "G-XXXXXXXXXX"
    }
  }
}
```

## 🌐 Custom Domain

To use a custom domain:

1. Go to Mintlify dashboard
2. Select your documentation
3. Go to Settings → Custom Domain
4. Add your domain and follow DNS instructions

## 📚 Resources

- [Mintlify Documentation](https://mintlify.com/docs)
- [Mintlify Component Library](https://mintlify.com/docs/components)
- [MDX Documentation](https://mdxjs.com/)

## 🤝 Contributing

To contribute to the documentation:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally with `npm run docs:dev`
5. Submit a pull request

## 📝 License

This documentation is part of the Litium Admin MCP Server project and follows the same MIT license.

---

Built with ❤️ using [Mintlify](https://mintlify.com)

