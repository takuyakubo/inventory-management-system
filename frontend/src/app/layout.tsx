import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Inventory Management System',
  description: 'Efficient inventory management for your business',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">{children}</body>
    </html>
  )
}