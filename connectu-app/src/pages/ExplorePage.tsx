import React from 'react'
import MoreHoriz from '@mui/icons-material/MoreHoriz'
import FavoriteBorder from '@mui/icons-material/FavoriteBorder'
import ChatBubbleOutline from '@mui/icons-material/ChatBubbleOutline'
import Send from '@mui/icons-material/Send'
import BookmarkBorder from '@mui/icons-material/BookmarkBorder'
import SentimentSatisfied from '@mui/icons-material/SentimentSatisfied'
import Search from '@mui/icons-material/Search'

type Post = {
    id: string
    author: string
    avatar: string
    time: string
    image: string
    text: string
    likes: string | number
    comments: string | number
    shares: string | number
}

const posts: Post[] = [
    {
        id: '1',
        author: 'tech_enthusiast',
        avatar:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCSSqbduFXH0wo8zWBoTCv1YQ1XTHDZ_5tXAYj5Iy5FeWsc76jsjmVkmVVDl6pynMLhzXKFzCOgvC05DbUgfIvm9atJ9fr4Bf9YxLelvHgvCBDAdFjoVrRm3vUqmB8U8ljeuqlEdsFZTONEuaDFIoXuoWcK8gpr4ct-QgksQfpRXW9muCXiYiPqrnSq50xKwjT4bmqLvvnoAgbG0Ds5Mf0-oywRZaYycYgsUJ3n7Rtw0UNIdcIrlG8fBLWP5qcD6PPE5INVIChECA',
        time: '2 hours ago',
        image:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCKINyHPlVG1dfZjphja791GJEu17cDfaSVWG4NFnX3GGamCW8ps_Wa1Vb1VbNr-TQ8p9rPci5w_QqRJOVWQN0nk5iK55PIVcd6qU2GWXgpYIQYgch3gZkB95AxHEfLWrRqObV14Stc0Ut6wjzxRhz6OJjP4DBa2vchOXGe86ky6JYI7jChuMbETDQpXdKPGqtfskox4z9OHyie3J9Rmlikvt4zq2eqaDlVHUS_l8MnsM9bygM33ITASOBVa-YPCaEMJraKRxQbPQ',
        text: 'Exciting tech conference in San Francisco! 🚀',
        likes: '7.9k',
        comments: 834,
        shares: 347,
    },
    {
        id: '2',
        author: 'design_lover',
        avatar:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCIij7TZ5j5RtT2x7eVbICBYGhg91Nf6LyKl1i5Pxg802SVw56qdmSBhQ2WiEtaoaAkQSqVya9MKvlb4a5jFt3gVoY_-AgckQXMs5UcSfbVPwjImPOzglIKDm9m_QohfJLG3BtIf56Oanpm6lfNkDjKjoRKLx_4kuodn_nab-nMylznwUsZCRGJ1onZylJT_X3ixQyFa_fH91kj_vNd2vqUaoSQrlNjnAabayIcK-Gic7Zw5lTo8YsawXNiGM-aUO-aOy3ySJOtYg',
        time: '5 hours ago',
        image:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuC2T_iGfDPYmek9R4iPNIkiZTElFrmyUg3DQov8kxCFL2YOEk9VBJ6j2apYd05dEyR_Jw1RL2fvohNnkDe-tyV-y0q0b8BtFgsZeMUv5648sk9ndi3Z2BrwRezBjC5IpqFaE8XHSO4kFSdYA7ikuOjgnh4iD1mEbZ-QbRWINKNoJ8W9mOuGNcz_VSXRrhqxGII76dLIgc4DHTb_qowvjPnBfR8nwNrcoQNSCG4NHSpagMlPYXVeFbHU7sOT37nX3IH9qbqUNBSgBA',
        text: 'Love this modern interior design! So calming.',
        likes: 512,
        comments: 874,
        shares: 342,
    },
]

const PostCard: React.FC<{ post: Post }> = ({ post }) => {
    return (
        <div className="rounded-xl bg-white shadow-sm ring-1 ring-primary/10">
            <div className="flex items-center gap-4 p-4">
                <img alt={`${post.author} avatar`} className="size-10 rounded-full object-cover" src={post.avatar} />
                <div className="flex-1">
                    <p className="font-bold text-gray-900">{post.author}</p>
                    <p className="text-xs text-gray-500">{post.time}</p>
                </div>
                <button className="text-gray-500 hover:text-primary" aria-label="More actions">
                    <MoreHoriz />
                </button>
            </div>

            <img alt="Post image" className="aspect-video w-full object-cover" src={post.image} />

            <div className="p-4">
                <p className="mb-4 text-sm text-gray-800 ">{post.text}</p>

                <div className="flex items-center justify-between text-gray-600">
                    <div className="flex items-center gap-4">
                        <button className="flex items-center gap-2 rounded-full border border-primary/20 px-3 py-1.5 text-xs font-medium hover:bg-primary/10">
                            <FavoriteBorder fontSize="small" className="text-primary" />
                            <span>{post.likes}</span>
                        </button>
                        <button className="flex items-center gap-2 rounded-full border border-primary/20 px-3 py-1.5 text-xs font-medium hover:bg-primary/10">
                            <ChatBubbleOutline fontSize="small" className="text-primary" />
                            <span>{post.comments}</span>
                        </button>
                        <button className="flex items-center gap-2 rounded-full border border-primary/20 px-3 py-1.5 text-xs font-medium hover:bg-primary/10">
                            <Send fontSize="small" className="text-primary" />
                            <span>{post.shares}</span>
                        </button>
                    </div>
                    <button className="text-primary hover:text-primary/80" aria-label="Bookmark">
                        <BookmarkBorder />
                    </button>
                </div>
            </div>

            <div className="border-t border-primary/10 p-4">
                <div className="relative">
                    <input
                        className="h-10 w-full rounded-full border-none bg-primary/10 pl-4 pr-10 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="Add a comment..."
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 text-primary hover:text-primary/80" aria-label="Emoji">
                        <SentimentSatisfied />
                    </button>
                </div>
            </div>
        </div>
    )
}

const ExplorePage: React.FC = () => {
    return (
        <main className="flex flex-1 justify-center py-8 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-2xl space-y-8">
                <div className="relative hidden sm:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" fontSize="small" />
                    <input
                        className="h-10 w-full min-w-[200px] rounded-full border-none bg-primary/10 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="Search"
                    />
                </div>

                {posts.map((p) => (
                    <PostCard key={p.id} post={p} />
                ))}
            </div>
        </main>
    )
}

export default ExplorePage