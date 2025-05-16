import './globals.css';
import Navbar from './components/Navbar';

export const metadata = {
  title: 'Calorie Track',
  description: '食事カロリー管理アプリ',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-gray-100">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}