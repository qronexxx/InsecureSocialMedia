import React, { useState } from 'react'
import CloudUpload from '@mui/icons-material/CloudUpload'

const UploadPage: React.FC = () => {
  const [content, setContent] = useState('')
  const [files, setFiles] = useState<File[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    setFiles(Array.from(e.target.files))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Upload-Logik einbauen
    console.log('Post content:', content)
    console.log('Files:', files)
  }

  return (
    <main className="flex-grow container mx-auto px-6 lg:px-10 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Create a post</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 sm:p-8 rounded-xl shadow-sm ring-1 ring-primary/10 space-y-6"
        >
          <textarea
            className="w-full h-32 p-4 rounded-lg bg-background-light border border-primary/20 focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder:text-gray-500 text-base resize-none"
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <div className="relative flex flex-col items-center justify-center w-full p-10 border-2 border-dashed border-primary/20 rounded-lg text-center cursor-pointer hover:bg-primary/5 transition-colors">
            <input
              id="file-upload"
              type="file"
              multiple
              accept="image/png,image/jpeg,image/gif"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileChange}
            />
            <CloudUpload className="text-5xl text-gray-500" fontSize="inherit" />
            <p className="mt-2 font-semibold text-gray-900">
              Drag & drop files or <span className="text-primary font-bold">browse</span>
            </p>
          </div>

          {files.length > 0 && (
            <div className="text-sm text-gray-700">
              Selected: {files.map((f) => f.name).join(', ')}
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="bg-primary text-background-dark font-bold py-3 px-8 rounded-lg hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}

export default UploadPage