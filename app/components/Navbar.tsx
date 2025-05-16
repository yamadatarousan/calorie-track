import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-indigo-600 text-white p-4">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Calorie Track
        </Link>
        <div className="space-x-4">
          <Link href="/dashboard" className="hover:underline">
            ダッシュボード
          </Link>
          <Link href="/records" className="hover:underline">
            記録一覧
          </Link>
          <Link href="/records/new" className="hover:underline">
            新規記録
          </Link>
        </div>
      </div>
    </nav>
  );
}