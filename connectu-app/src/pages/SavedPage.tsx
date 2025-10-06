import React, { useEffect, useState } from 'react'
import API_BASE from '../api'
import { useAuth } from '../auth/AuthContext'

type Post = {
    id: number
    authorUsername: string
    text: string
    likesCount: number
    commentCount: number
    fileName?: string | null
    fileBase64?: string | null
    postedOn?: string
    liked?: boolean
    bookmarked?: boolean
}

const SavedPage: React.FC = () => {
    const { username } = useAuth()
    const [posts, setPosts] = useState<Post[] | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!username) return
        const load = async () => {
            setError(null)
            try {
                const resp = await fetch(`${API_BASE}/api/users/${encodeURIComponent(username)}/bookmarks`)
                if (!resp.ok) throw new Error(await resp.text())
                const arr = (await resp.json()) as any[]
                const mapped: Post[] = arr.map((p) => ({
                    id: p.id,
                    authorUsername: p.authorUsername,
                    text: p.content,
                    likesCount: p.likesCount ?? 0,
                    commentCount: p.commentCount ?? 0,
                    fileName: p.fileName ?? null,
                    fileBase64: p.fileBase64 ?? null,
                    postedOn: p.postedOn ?? null,
                    liked: p.liked ?? false,
                    bookmarked: p.bookmarked ?? true,
                }))
                setPosts(mapped)
            } catch {
                setError('Fehler beim Laden der gespeicherten Posts.')
                setPosts([])
            }
        }
        load()
    }, [username])

    return (
        <main className="flex flex-1 justify-center py-8 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-2xl space-y-4">
                <h1 className="text-2xl font-bold">Gespeicherte Posts</h1>
                {posts === null ? (
                    <div className="text-sm text-gray-600">Lade gespeicherte Posts…</div>
                ) : error ? (
                    <div className="text-sm text-red-600">{error}</div>
                ) : posts.length === 0 ? (
                    <div className="text-sm text-gray-600">Keine gespeicherten Posts.</div>
                ) : (
                    posts.map((p) => (
                        <div key={p.id} className="rounded-xl bg-white shadow-sm ring-1 ring-primary/10 p-4">
                            <div className="flex items-center gap-4">
                                <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-gray-800">
                                    {(p.authorUsername || '?').slice(0, 1).toUpperCase()}
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-gray-900">{p.authorUsername}</p>
                                    {p.postedOn && <p className="text-xs text-gray-500">{new Date(p.postedOn).toLocaleString()}</p>}
                                </div>
                            </div>
                            <p className="mt-3 text-sm text-gray-800">{p.text}</p>
                            {p.fileBase64 && p.fileName && /\.(png|jpe?g|gif|webp)$/i.test(p.fileName) && (
                                <img
                                    alt="Post-Bild"
                                    className="mt-3 aspect-video w-full object-cover"
                                    src={`data:${p.fileName.toLowerCase().endsWith('.gif') ? 'image/gif' : p.fileName.toLowerCase().endsWith('.webp') ? 'image/webp' : 'image/jpeg'};base64,${p.fileBase64}`}
                                />
                            )}
                        </div>
                    ))
                )}
            </div>
        </main>
    )
}

export default SavedPage
