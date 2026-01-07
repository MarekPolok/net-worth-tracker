import { ThemeProvider } from '@/components/ThemeProvider';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body className="antialiased">
        <ThemeProvider>
            {children}
        </ThemeProvider>
        </body>
        </html>
    );
}