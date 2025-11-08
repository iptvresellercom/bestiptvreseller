import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';

interface BlogPost {
  id: number;
  slug: string;
  title: {
    rendered: string;
  };
  excerpt: {
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

const BlogPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        // Fetch blog posts from WordPress
        const response = await fetch('https://blrparis.com/wp-json/wp/v2/posts?per_page=100&_embed');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data: BlogPost[] = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="bg-black text-white min-h-screen">
        <Header />
        <main className="pt-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 mb-4"></div>
              <p className="text-white/70">Loading blog posts...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black text-white min-h-screen">
        <Header />
        <main className="pt-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
            <div className="text-center py-20">
              <h1 className="text-3xl font-bold text-red-500 mb-4">Error</h1>
              <p className="text-white/70 mb-6">{error}</p>
              <Link to="/" className="text-amber-400 hover:text-amber-300 underline">
                ← Back to Home
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen">
      <Helmet>
        <title>Blog - BITR</title>
        <meta name="description" content="Stay updated with the latest news, tips, and insights about IPTV services and technology" />
      </Helmet>
      <Header />
      <main className="pt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="mb-8">
            <Link to="/" className="text-amber-400 hover:text-amber-300 flex items-center gap-2">
              ← Back to Home
            </Link>
          </div>
          
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Latest news, updates, and insights from our team
            </p>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-white/70">No blog posts found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => {
                // Parse the excerpt content
                const parser = new DOMParser();
                const excerptDoc = parser.parseFromString(post.excerpt.rendered, 'text/html');
                const excerptText = excerptDoc.body.textContent || '';
                
                // Format the date
                const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                });

                return (
                  <Link 
                    to={`/blog/${post.slug}`} 
                    key={post.id}
                    className="bg-gray-900 rounded-3xl overflow-hidden border border-gray-800 hover:border-amber-500/50 transition-all duration-300 group"
                  >
                    {post._embedded?.['wp:featuredmedia']?.[0]?.source_url ? (
                      <div className="relative h-48">
                        <img 
                          src={post._embedded['wp:featuredmedia'][0].source_url} 
                          alt={post.title.rendered} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                      </div>
                    ) : (
                      <div className="h-48 bg-gray-800 flex items-center justify-center">
                        <div className="text-amber-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                          </svg>
                        </div>
                      </div>
                    )}
                    <div className="p-6">
                      <div className="text-amber-400 text-sm mb-2">{formattedDate}</div>
                      <h2 className="text-xl font-bold mb-3 group-hover:text-amber-400 transition-colors">
                        {post.title.rendered}
                      </h2>
                      <p className="text-gray-400 mb-4 line-clamp-3">
                        {excerptText}
                      </p>
                      <div className="flex items-center text-amber-400 font-medium">
                        Read more
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default BlogPage;