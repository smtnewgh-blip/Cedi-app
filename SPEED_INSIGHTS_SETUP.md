# Vercel Speed Insights Setup Guide

This document explains how Vercel Speed Insights has been configured for the CediApp project.

## What Was Implemented

Vercel Speed Insights has been integrated into this project using the **web-vitals** library and the Vercel Analytics API. This vanilla JavaScript implementation tracks the following Web Vitals metrics:

- **CLS** (Cumulative Layout Shift)
- **FID** (First Input Delay)
- **FCP** (First Contentful Paint)
- **LCP** (Largest Contentful Paint)
- **TTFB** (Time to First Byte)

## Implementation Details

### Files Modified

1. **README.md** - Added Speed Insights tracking script to the embedded HTML
2. **index.html** - Created/updated deployment-ready HTML file with Speed Insights
3. **vercel.json** - Added Vercel configuration for proper deployment

### How It Works

The implementation uses:
- **web-vitals v3** library loaded via ES module from unpkg.com CDN
- Custom JavaScript function to send metrics to Vercel's Analytics endpoint
- Environment variable `VERCEL_ANALYTICS_ID` for authentication

## Configuration Steps

### 1. Enable Speed Insights in Vercel Dashboard

1. Go to your project on [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to your project settings
3. Click on the "Speed Insights" tab
4. Enable Speed Insights for your project

### 2. Deploy to Vercel

Speed Insights will automatically work when deployed to Vercel because:
- Vercel automatically injects the `VERCEL_ANALYTICS_ID` environment variable
- The tracking script checks for this variable before sending data
- Metrics are sent to `https://vitals.vercel-analytics.com/v1/vitals`

### 3. Local Testing (Optional)

If you want to test locally, you need to manually set the analytics ID:

```html
<script>
  // Add this before the Speed Insights module script
  window.VERCEL_ANALYTICS_ID = 'your-analytics-id-here';
</script>
```

⚠️ **Note**: The analytics ID is automatically provided by Vercel during deployment. You only need to manually set it for local testing.

## Viewing Metrics

Once deployed and receiving traffic:

1. Go to your project on Vercel
2. Click on the "Speed Insights" tab
3. View real-time Web Vitals data from your users

## Technical Notes

### Browser Compatibility

The implementation uses:
- ES modules (modern browsers)
- `navigator.sendBeacon()` with `fetch()` fallback
- Web Vitals API (widely supported)

### Data Collection

- Metrics are collected from real user interactions
- Data is sent using `sendBeacon` for reliability
- No data is sent if `VERCEL_ANALYTICS_ID` is not present
- Connection speed information is included if available

### Privacy

- Only performance metrics are collected
- No personally identifiable information (PII) is tracked
- Complies with Vercel's privacy policies

## Troubleshooting

### No data appearing in dashboard

1. Ensure Speed Insights is enabled in Vercel project settings
2. Verify the site is deployed on Vercel
3. Wait for user traffic (data appears after real users visit)
4. Check browser console for warnings

### Console warnings

If you see "Vercel Analytics ID not found" in the console:
- This is normal for local development
- The ID is automatically injected by Vercel on deployment
- Ignore this warning when running locally

## Resources

- [Vercel Speed Insights Documentation](https://vercel.com/docs/speed-insights)
- [Web Vitals Library](https://github.com/GoogleChrome/web-vitals)
- [Web Vitals Metrics Guide](https://web.dev/vitals/)

## Support

For issues or questions:
- Check [Vercel Documentation](https://vercel.com/docs)
- Visit [Vercel Community](https://github.com/vercel/vercel/discussions)
- Contact Vercel Support through your dashboard
