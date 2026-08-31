# Google Search Console

## Verification Architecture
We use the HTML meta tag method via Next.js metadata.
The environment variable NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION contains the Google site verification token.

## Owner Verification Workflow
1. Go to Google Search Console and add a new URL Prefix property.
2. Enter the current production origin: https://sunward-travel.vercel.app
3. Select "HTML tag" verification method and copy the string inside content="...".
4. Add it to Vercel as NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION.
5. Trigger a new production deployment.
6. Click Verify in Search Console.
7. Submit the sitemap at https://sunward-travel.vercel.app/sitemap.xml.

## Canonical Origin
Currently locked to the Vercel domain.

## Future Custom-Domain Migration
When moving to a custom domain (e.g. sunwardtravel.com):
1. Update NEXT_PUBLIC_SITE_URL in production env.
2. Add the custom domain as a new property in Search Console.
3. Validate robots.txt and sitemap.xml.
4. Set up 301 redirects from the Vercel domain to the custom domain.
