import React, { useEffect, useState } from 'react'
import CloudUpload from '@mui/icons-material/CloudUpload'
import API_BASE from '../api'
import { useAuth } from '../auth/AuthContext'
import { useNavigate } from 'react-router-dom'

const toBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
        const r = new FileReader()
        r.onload = () => resolve((r.result as string).split(',')[1] || '')
        r.onerror = reject
        r.readAsDataURL(file)
    })

const UploadPage: React.FC = () => {
    const { isAuthenticated, username, token } = useAuth()
    const [content, setContent] = useState('')
    const [files, setFiles] = useState<File[]>([])
    const [busy, setBusy] = useState(false)
    const [msg, setMsg] = useState<string | null>(null)
    const navigate = useNavigate()

    useEffect(() => {
        if (!isAuthenticated) navigate('/', { replace: true, state: { showLogin: true } })
    }, [isAuthenticated, navigate])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return
        setFiles(Array.from(e.target.files))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!isAuthenticated || !username) return
        setMsg(null); setBusy(true)
        try {
            const first = files[0]
            const fileBase64 = first ? await toBase64(first) : null
            const payload = { content, authorUsername: username, fileName: first?.name ?? null, fileBase64 }
            const resp = await fetch(`${API_BASE}/api/posts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                body: JSON.stringify(payload),
            })
            if (!resp.ok) throw new Error(await resp.text())
            setContent(''); setFiles([]); setMsg('Post erstellt!')
            setTimeout(() => navigate('/explore'), 400)
        } catch {
            setMsg('Fehler beim Erstellen des Posts.')
        } finally { setBusy(false) }
    }

    if (!isAuthenticated) return null

    return (
        <main className="flex-grow container mx-auto px-6 lg:px-10 py-12">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">Post erstellen</h1>

                <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-xl shadow-sm ring-1 ring-primary/10 space-y-6">
          <textarea
              className="w-full h-32 p-4 rounded-lg bg-background-light border border-primary/20 focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder:text-gray-500 text-base resize-none"
              placeholder="Was möchtest du teilen?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
          />

                    <div className="relative flex flex-col items-center justify-center w-full p-10 border-2 border-dashed border-primary/20 rounded-lg text-center cursor-pointer hover:bg-primary/5 transition-colors">
                        <input id="file-upload" type="file" multiple className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange} />
                        <CloudUpload className="text-5xl text-gray-500" fontSize="inherit" />
                        <p className="mt-2 font-semibold text-gray-900">
                            Dateien hierher ziehen oder <span className="text-primary font-bold">durchsuchen</span>
                        </p>
                        <p className="text-xs text-gray-600 mt-1">Alle Dateitypen erlaubt (Bilder werden dargestellt)</p>
                    </div>

                    {files.length > 0 && <div className="text-sm text-gray-700">Ausgewählt: {files.map((f) => f.name).join(', ')}</div>}

                    {msg && <div className="text-sm text-gray-700">{msg}</div>}

                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={busy || (!content && files.length === 0)}
                            className="bg-primary text-background-dark font-bold py-3 px-8 rounded-lg hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                            {busy ? 'Veröffentliche…' : 'Veröffentlichen'}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    )
}
export default UploadPage
