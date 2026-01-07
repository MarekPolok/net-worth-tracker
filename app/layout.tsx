import './globals.css';
import '@progress/kendo-theme-default/dist/all.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body>{children}</body>
        </html>
    );
}
