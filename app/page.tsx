import Link from "next/link"

export default function Home() {
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center">
      <div className="container  px-4 py-1">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 capitalize"> inventory management</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">streamline your inventory tracking with our powerful easy to use management system. Track products, monitor stock levels, and gain valuable insights</p>
          <div className="flex gap-4 justify-center">
            <Link href="/sign-In" className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors">Sign in</Link>
            <Link href="/learnMore" className="bg-white text-purple-600  px-8 py-3 font-semibold border-2 border-purple-600 hover:bg-purple-100 rounded-lg">Learn More</Link>
          </div>
        </div>
      </div>
    </div>
  )
}


