import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata={metadataBase:new URL('https://whoknowsapro.com'),title:{default:'Who Knows a Pro? | Find Trusted Local Pros',template:'%s | Who Knows a Pro?'},description:'Find local businesses by region and category. Compare providers, browse local stores, and contact the right pro for your project.',icons:{icon:'/favicon.svg',shortcut:'/favicon.svg'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body className="antialiased">{children}</body></html>}
