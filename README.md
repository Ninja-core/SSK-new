# SSK Coaching Center

A premium, responsive Chemistry coaching center website built with Next.js 16, React, Tailwind CSS, and Lucide icons.

## Run locally

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Included

- Responsive navigation with mobile menu and smooth section scrolling
- Hero, about, Chemistry course cards, playlist-ready resources section, approach, workflow, enquiry form, and footer
- Client-side enquiry validation and success state (no backend)
- Accessible labels, keyboard-friendly controls, reduced-motion support, and SEO metadata
- No invented phone number, address, faculty credentials, results, pricing, or testimonials

## Configuration

Edit the `institute` object near the top of `app/page.tsx` to add WhatsApp, email, Instagram, and YouTube details. Add playlist data to the resources section when links are available. The enquiry form currently demonstrates the front-end flow only and should be connected to a backend or form provider later.

## Remaining tasks

- Add verified institute contact details and social links
- Add approved YouTube playlist and lesson data
- Connect enquiry submission to the preferred backend or form provider
- Add real testimonials only after they are supplied and approved
