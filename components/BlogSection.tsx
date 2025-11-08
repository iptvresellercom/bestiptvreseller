import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface BlogPost {
  id: number;
  slug: string;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  date: string;
  _embedded?: {
    'wp:featuredmedia'?: {
      source_url: string;
    }[];
  };
}

const BlogSection: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        // Fetch only the latest 3 blog posts
        const response = await fetch('https://blrparis.com/wp-json/wp/v2/posts?per_page=3&_embed');
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
      <section className="bg-black text-white py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">
              Latest from our <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-500">Blog</span>
            </h2>
            <p className="text-lg text-white/70 mt-4 max-w-2xl mx-auto">
              Stay updated with the latest news and insights
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-900 rounded-3xl overflow-hidden border border-gray-800 animate-pulse">
                <div className="h-48 bg-gray-800"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-800 rounded mb-4"></div>
                  <div className="h-6 bg-gray-800 rounded mb-4"></div>
                  <div className="h-4 bg-gray-800 rounded mb-2"></div>
                  <div className="h-4 bg-gray-800 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || posts.length === 0) {
    return null; // Don't show the section if there's an error or no posts
  }

  return (
    <section className="bg-black text-white py-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">
            Latest from our <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-500">Blog</span>
          </h2>
          <p className="text-lg text-white/70 mt-4 max-w-2xl mx-auto">
            Stay updated with the latest news and insights
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => {
            // Parse the excerpt content
            const parser = new DOMParser();
            const excerptDoc = parser.parseFromString(post.excerpt.rendered, 'text/html');
            const excerptText = excerptDoc.body.textContent || '';
            
            // Format the date
            const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
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
                  <h3 className="text-xl font-bold mb-3 group-hover:text-amber-400 transition-colors">
                    {post.title.rendered}
                  </h3>
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
        <div className="text-center mt-12">
          <Link 
            to="/blog" 
            className="inline-block bg-black text-white border border-amber-500 hover:bg-amber-900 font-bold py-4 px-8 rounded-xl transition duration-300"
          >
            Show all blog posts
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;