import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ChatWidget from '../components/ChatWidget';

interface BlogPost {
  id: number;
  slug: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  date: string;
  _embedded?: {
    'wp:featuredmedia'?: {
      source_url: string;
    }[];
  };
}

const BlogPostPage: React.FC = () => {
  const { postSlug } = useParams<{ postSlug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        // Fetch the specific post by slug
        const response = await fetch(`https://blrparis.com/wp-json/wp/v2/posts?slug=${postSlug}&_embed`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data: BlogPost[] = await response.json();
        
        if (data.length > 0) {
          setPost(data[0]);
        } else {
          setError('Post not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (postSlug) {
      fetchPost();
    }
  }, [postSlug]);

  if (loading) {
    return (
      <div className="bg-black text-white min-h-screen">
        <Header />
        <main className="pt-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20">
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 mb-4"></div>
              <p className="text-white/70">Loading blog post...</p>
            </div>
          </div>
        </main>
        <Footer />
        <ChatWidget />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="bg-black text-white min-h-screen">
        <Header />
        <main className="pt-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20">
            <div className="text-center py-20">
              <h1 className="text-3xl font-bold text-red-500 mb-4">Error</h1>
              <p className="text-white/70 mb-6">{error || 'Post not found'}</p>
              <Link to="/blog" className="text-amber-400 hover:text-amber-300 underline">
                ← Back to Blog
              </Link>
            </div>
          </div>
        </main>
        <Footer />
        <ChatWidget />
      </div>
    );
  }

  // Format the date
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Extract content from HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(post.content.rendered, 'text/html');
  const firstParagraph = doc.querySelector('p')?.textContent || '';
  
  // Create a description from the first paragraph (truncated to 160 characters)
  const postDescription = firstParagraph.substring(0, 160) + (firstParagraph.length > 160 ? '...' : '');

  return (
    <div className="bg-black text-white min-h-screen">
      <Helmet>
        <title>{post.title.rendered} - BITR Blog</title>
        <meta property="og:title" content={post.title.rendered} />
        <meta name="description" content={postDescription} />
      </Helmet>
      <Header />
      <main className="pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <div className="mb-8">
            <Link to="/blog" className="text-amber-400 hover:text-amber-300 flex items-center gap-2">
              ← Back to Blog
            </Link>
          </div>
          
          <article className="bg-gray-900 rounded-3xl overflow-hidden border border-gray-800">
            {post._embedded?.['wp:featuredmedia']?.[0]?.source_url ? (
              <div className="relative h-96">
                <img 
                  src={post._embedded['wp:featuredmedia'][0].source_url} 
                  alt={post.title.rendered} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              </div>
            ) : null}
            
            <div className="p-8 md:p-12">
              <div className="text-amber-400 text-lg mb-4">{formattedDate}</div>
              <h1 className="text-3xl md:text-4xl font-bold mb-8">{post.title.rendered}</h1>
              <div 
                className="prose prose-invert max-w-none blog-content"
                dangerouslySetInnerHTML={{ __html: post.content.rendered }}
              />
            </div>
          </article>
        </div>
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
};

export default BlogPostPage;