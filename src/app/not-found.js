export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold text-gray-800">404 - Page Not Found</h1>
      <p className="text-gray-500 mt-2">Sorry, the page you are looking for does not exist.</p>
      <a href="/" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md">
        Go to Home
      </a>
    </div>
  );
}
