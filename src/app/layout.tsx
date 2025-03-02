import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="flex flex-row items-center justify-center p-4"
      >
        {children}
      </body>
    </html>
  );
}
