import DOMPurify from 'dompurify'
import { ArrowLeft, Calendar, User, Clock, Share2 } from 'lucide-react'
import { useEffect } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'

import { ContentNavbar } from '@/components/layout/ContentNavbar'
import { blogPosts } from '@/data/blogs'
import { blogSeo } from '@/lib/blogSeo'
import { useSeo } from '@/lib/seo'

// Blog content is our own static data; DOMPurify needs a DOM, so during
// build-time prerendering (no window) the trusted HTML is used as-is.
const sanitize = (html) => (typeof window === 'undefined' ? html : DOMPurify.sanitize(html))

export default function BlogPostPage() {
  const { slug } = useParams()
  const post = blogPosts.find(p => p.slug === slug)

  if (!post) {
    return <Navigate to="/blog" replace />
  }
  return <BlogArticle key={post.slug} post={post} />
}

function BlogArticle({ post }) {
  useSeo(blogSeo(post))
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className="min-h-screen bg-ink">
      <ContentNavbar />
      
      <article className="pt-24 pb-20 px-6 max-w-4xl mx-auto">
        
        {/* Navigation & Metadata */}
        <div className="mb-10">
          <Link to="/blog" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold hover:text-white transition-colors mb-8">
            <ArrowLeft size={16} /> Back to Blog
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white leading-tight mb-6">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-white/50 border-y border-white/10 py-4">
            <span className="flex items-center gap-2"><User size={16} className="text-gold" /> {post.author}</span>
            <span className="flex items-center gap-2"><Calendar size={16} className="text-gold" /> {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            <span className="flex items-center gap-2"><Clock size={16} className="text-gold" /> {post.readTime}</span>
            <button className="flex items-center gap-2 ml-auto hover:text-gold transition-colors">
              <Share2 size={16} /> Share
            </button>
          </div>
        </div>

        {/* Featured Image */}
        <div className="w-full h-auto aspect-[21/9] rounded-2xl overflow-hidden mb-12 border border-white/10 relative">
          <div className="absolute inset-0 bg-ink/10 z-10 pointer-events-none" />
          <img 
            src={post.imageUrl} 
            alt={post.title} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Body */}
        {/* We use a prose-like custom styling to match Aureate Cyber */}
        <div className="prose prose-invert prose-lg max-w-none text-white/75
          prose-headings:font-serif prose-headings:text-white prose-headings:font-bold
          prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b prose-h2:border-white/10 prose-h2:pb-4
          prose-h3:text-xl prose-h3:text-gold
          prose-a:text-gold hover:prose-a:text-white prose-a:transition-colors
          prose-strong:text-white prose-strong:font-semibold
          prose-ul:list-disc prose-ul:pl-6
          prose-ol:list-decimal prose-ol:pl-6
          prose-li:mb-2
          "
          dangerouslySetInnerHTML={{ __html: sanitize(post.content) }}
        />
        
        {/* Footer actions */}
        <div className="mt-16 pt-8 border-t border-white/10 flex justify-between items-center">
          <Link to="/blog" className="btn btn-outline border-white/20 text-white hover:bg-white/5">
            <ArrowLeft size={16} className="mr-2" /> All Articles
          </Link>
          <Link to="/login?register=1" className="btn btn-gold">
            Start Free Certification
          </Link>
        </div>
      </article>
    </div>
  )
}
