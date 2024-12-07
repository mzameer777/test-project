import UploadForm from './components/UploadForm'
import ObjectList, { refreshObjects } from './components/ObjectList'

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Azure File Upload</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">Upload File</h2>
          <UploadForm onUploadSuccess={refreshObjects} />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Uploaded Objects</h2>
          <ObjectList />
        </div>
      </div>
    </main>
  )
}


