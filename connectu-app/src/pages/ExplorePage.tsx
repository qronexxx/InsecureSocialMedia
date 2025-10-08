import React, { useEffect, useMemo, useState } from 'react'
import MoreHoriz from '@mui/icons-material/MoreHoriz'
import FavoriteBorder from '@mui/icons-material/FavoriteBorder'
import Favorite from '@mui/icons-material/Favorite'
import ChatBubbleOutline from '@mui/icons-material/ChatBubbleOutline'
import BookmarkBorder from '@mui/icons-material/BookmarkBorder'
import Bookmark from '@mui/icons-material/Bookmark'
import Search from '@mui/icons-material/Search'
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

type Comment = { id: number; username: string; content: string; createdAt?: string }

const isImage = (name?: string | null) => {
    if (!name) return false
    const n = name.toLowerCase()
    return n.endsWith('.png') || n.endsWith('.jpg') || n.endsWith('.jpeg') || n.endsWith('.gif') || n.endsWith('.webp')
}

const guessMime = (name?: string | null) => {
    if (!name) return 'image/png'
    const n = name.toLowerCase()
    if (n.endsWith('.jpg') || n.endsWith('.jpeg')) return 'image/jpeg'
    if (n.endsWith('.gif')) return 'image/gif'
    if (n.endsWith('.webp')) return 'image/webp'
    return 'image/png'
}

const PostCard: React.FC<{
    post: Post
    onLike: (id: number) => void
    onBookmark: (id: number) => void
    onCommentSubmit: (id: number, text: string) => void
    onToggleComments: (id: number) => void
    canInteract: boolean
    commentsOpen: boolean
    comments: Comment[] | null | undefined
    commentsLoading: boolean
}> = ({ post, onLike, onBookmark, onCommentSubmit, onToggleComments, canInteract, commentsOpen, comments, commentsLoading }) => {
    const [comment, setComment] = useState('')
    const dataUrl = useMemo(() => {
        if (!post.fileBase64 || !isImage(post.fileName)) return undefined
        return `data:${guessMime(post.fileName)};base64,${post.fileBase64}`
    }, [post.fileBase64, post.fileName])

    const submitComment = () => {
        const t = comment.trim()
        if (!t) return
        onCommentSubmit(post.id, t)
        setComment('')
    }

    return (
        <div className="rounded-xl bg-white shadow-sm ring-1 ring-primary/10">
            <div className="flex items-center gap-4 p-4">
                <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-gray-800">
                    {(post.authorUsername || '?').slice(0, 1).toUpperCase()}
                </div>
                <div className="flex-1">
                    <p className="font-bold text-gray-900">{post.authorUsername}</p>
                    {post.postedOn && <p className="text-xs text-gray-500">{new Date(post.postedOn).toLocaleString()}</p>}
                </div>
                <button className="text-gray-500 hover:text-primary" aria-label="Mehr Aktionen">
                    <MoreHoriz />
                </button>
            </div>

            {dataUrl && <img alt="Bild zum Post" className="aspect-video w-full object-cover" src={dataUrl} />}

            <div className="p-4">
                <p className="mb-4 text-sm text-gray-800 " dangerouslySetInnerHTML={{ __html: post.text }}></p>

                <div className="flex items-center justify-between text-gray-600">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => canInteract && onLike(post.id)}
                            className="flex items-center gap-2 rounded-full border border-primary/20 px-3 py-1.5 text-xs font-medium hover:bg-primary/10 disabled:opacity-50"
                            disabled={!canInteract}
                        >
                            {post.liked ? <Favorite fontSize="small" className="text-primary" /> : <FavoriteBorder fontSize="small" className="text-primary" />}
                            <span>{post.likesCount}</span>
                        </button>

                        <button
                            onClick={() => onToggleComments(post.id)}
                            className="flex items-center gap-2 rounded-full border border-primary/20 px-3 py-1.5 text-xs font-medium hover:bg-primary/10"
                        >
                            <ChatBubbleOutline fontSize="small" className="text-primary" />
                            <span>{post.commentCount}</span>
                        </button>
                    </div>

                    <button
                        onClick={() => canInteract && onBookmark(post.id)}
                        className="text-primary hover:text-primary/80 disabled:opacity-50"
                        aria-label="Merken"
                        disabled={!canInteract}
                    >
                        {post.bookmarked ? <Bookmark /> : <BookmarkBorder />}
                    </button>
                </div>
            </div>

            {}
            {commentsOpen && (
                <div className="border-t border-primary/10 p-4 space-y-4">
                    {commentsLoading ? (
                        <div className="text-sm text-gray-600">Kommentare werden geladen…</div>
                    ) : comments && comments.length > 0 ? (
                        <ul className="space-y-2">
                            {comments.map((c) => (
                                <li key={c.id} className="text-sm">
                                    <span className="font-semibold">{c.username}</span>{' '}
                                    <span className="text-gray-700" dangerouslySetInnerHTML={{ __html: c.content }}></span>
                                    {c.createdAt && <span className="text-gray-400 text-xs"> · {new Date(c.createdAt).toLocaleString()}</span>}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-sm text-gray-600">Keine Kommentare vorhanden.</div>
                    )}

                    <div className="flex items-center gap-2">
                        <input
                            className="h-10 flex-1 rounded-lg border border-primary/20 bg-primary/10 px-3 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-60"
                            placeholder={canInteract ? 'Kommentar hinzufügen…' : 'Zum Kommentieren anmelden'}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') submitComment() }}
                            disabled={!canInteract}
                        />
                        <button
                            onClick={submitComment}
                            className="px-3 h-10 rounded-lg bg-primary text-gray-900 text-sm font-semibold hover:bg-opacity-90 disabled:opacity-50"
                            disabled={!canInteract || comment.trim() === ''}
                        >
                            Kommentieren
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

const ExplorePage: React.FC = () => {
    const { username } = useAuth()
    const [posts, setPosts] = useState<Post[] | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [query, setQuery] = useState('')
    const [openComments, setOpenComments] = useState<Record<number, boolean>>({})
    const [commentsByPost, setCommentsByPost] = useState<Record<number, Comment[] | null>>({})
    const [commentsLoading, setCommentsLoading] = useState<Record<number, boolean>>({})

    const load = async () => {
        setError(null)
        try {
            const q = username ? `?username=${encodeURIComponent(username)}` : ''
            const resp = await fetch(`${API_BASE}/api/posts${q}`, { method: 'GET' })
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
                bookmarked: p.bookmarked ?? false,
            }))
            setPosts(mapped)
        } catch (e) {
            console.error(e)
            setError('Fehler beim Laden der Posts.')
            setPosts([])
        }
    }

    useEffect(() => { load() }, [username])

    const mutate = (id: number, patch: Partial<Post>) => {
        setPosts((prev) => prev ? prev.map(p => p.id === id ? { ...p, ...patch } : p) : prev)
    }

    const onLike = async (id: number) => {
        if (!username) return
        const p = posts?.find(x => x.id === id); if (!p) return
        mutate(id, { liked: !p.liked, likesCount: p.likesCount + (p.liked ? -1 : 1) })
        try {
            const resp = await fetch(`${API_BASE}/api/posts/${id}/like`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username }),
            })
            if (!resp.ok) throw new Error(await resp.text())
            const data = await resp.json() as { liked: boolean; likesCount: number }
            mutate(id, { liked: data.liked, likesCount: data.likesCount })
        } catch {
            mutate(id, { liked: p.liked, likesCount: p.likesCount })
        }
    }

    const onBookmark = async (id: number) => {
        if (!username) return
        const p = posts?.find(x => x.id === id); if (!p) return
        mutate(id, { bookmarked: !p.bookmarked })
        try {
            const resp = await fetch(`${API_BASE}/api/posts/${id}/bookmark`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username }),
            })
            if (!resp.ok) throw new Error(await resp.text())
            const data = await resp.json() as { bookmarked: boolean }
            mutate(id, { bookmarked: data.bookmarked })
        } catch {
            mutate(id, { bookmarked: p.bookmarked })
        }
    }

    const onToggleComments = async (id: number) => {
        setOpenComments((prev) => ({ ...prev, [id]: !prev[id] }))
        const isOpening = !openComments[id]
        if (isOpening && commentsByPost[id] === undefined) {
            setCommentsLoading((prev) => ({ ...prev, [id]: true }))
            try {
                const resp = await fetch(`${API_BASE}/api/posts/${id}/comments`)
                if (!resp.ok) throw new Error(await resp.text())
                const arr = (await resp.json()) as Comment[]
                setCommentsByPost((prev) => ({ ...prev, [id]: arr }))
            } catch {
                setCommentsByPost((prev) => ({ ...prev, [id]: [] }))
            } finally {
                setCommentsLoading((prev) => ({ ...prev, [id]: false }))
            }
        }
    }

    const onCommentSubmit = async (id: number, text: string) => {
        if (!username) return
        const p = posts?.find(x => x.id === id); if (!p) return
        mutate(id, { commentCount: p.commentCount + 1 })
        setCommentsByPost((prev) => {
            const list = prev[id] ?? []
            const appended = [...list, { id: Date.now(), username, content: text, createdAt: new Date().toISOString() }]
            return { ...prev, [id]: appended }
        })
        try {
            const resp = await fetch(`${API_BASE}/api/posts/${id}/comment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, content: text }),
            })
            if (!resp.ok) throw new Error(await resp.text())
            const data = await resp.json() as { commentCount: number }
            mutate(id, { commentCount: data.commentCount })
        } catch {
            await onToggleComments(id) ; await onToggleComments(id)
            mutate(id, { commentCount: p.commentCount })
        }
    }

    const visiblePosts = useMemo(() => {
        if (!posts) return null
        const q = query.trim().toLowerCase()
        if (q === '') return posts
        return posts.filter(p =>
            (p.authorUsername || '').toLowerCase().includes(q) ||
            (p.text || '').toLowerCase().includes(q) ||
            (p.fileName || '').toLowerCase().includes(q)
        )
    }, [posts, query])

    return (
        <main className="flex flex-1 justify-center py-8 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-2xl space-y-8">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" fontSize="small" />
                    <input
                        className="h-10 w-full min-w-[200px] rounded-full border-none bg-primary/10 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="Suchen"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>

                {visiblePosts === null ? (
                    <div className="text-sm text-gray-600">Lade Posts…</div>
                ) : error ? (
                    <div className="text-sm text-red-600">{error}</div>
                ) : visiblePosts.length === 0 ? (
                    <div className="text-sm text-gray-600">Keine Posts gefunden.</div>
                ) : (
                    visiblePosts.map((p) => (
                        <PostCard
                            key={p.id}
                            post={p}
                            onLike={onLike}
                            onBookmark={onBookmark}
                            onCommentSubmit={onCommentSubmit}
                            onToggleComments={onToggleComments}
                            canInteract={!!username}
                            commentsOpen={!!openComments[p.id]}
                            comments={commentsByPost[p.id]}
                            commentsLoading={!!commentsLoading[p.id]}
                        />
                    ))
                )}
            </div>
        </main>
    )
}

export default ExplorePage