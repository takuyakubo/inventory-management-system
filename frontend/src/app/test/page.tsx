export default function TestPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Tailwind CSS Test Page</h1>
      
      <p className="text-gray-700 mb-4">
        This is a test page to verify that Tailwind CSS styles are being applied correctly.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-red-100 p-4 rounded-lg shadow">Red Box</div>
        <div className="bg-green-100 p-4 rounded-lg shadow">Green Box</div>
        <div className="bg-blue-100 p-4 rounded-lg shadow">Blue Box</div>
      </div>
      
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Test Button
      </button>
    </div>
  );
}