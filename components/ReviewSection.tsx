import React, { useState, useEffect } from "react";

// Diagonal arrow icon component
const DiagonalArrowIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
    />
  </svg>
);

// Star icon component
const StarIcon: React.FC<{ filled?: boolean }> = ({ filled = true }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`h-5 w-5 ${filled ? 'text-amber-400' : 'text-gray-700'}`}
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

// Quote icon
const QuoteIcon: React.FC = () => (
  <svg 
    className="h-8 w-8 text-amber-500/30" 
    fill="currentColor" 
    viewBox="0 0 24 24"
  >
    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
  </svg>
);

// Review Interface
interface Review {
  id: number;
  review_data: {
    customer_name: string;
    rating: number;
    review_date: string;
    featured: boolean;
    comment: string;
  };
}

// Helper function to strip HTML and WordPress comments from text
const stripHtmlAndComments = (html: string): string => {
  if (!html) return '';
  
  // Remove WordPress block comments
  let text = html.replace(/<!-- \/?(wp:paragraph|wp:[a-z-]+) -->/g, '');
  
  // Create a temporary div to parse HTML
  const temp = document.createElement('div');
  temp.innerHTML = text;
  
  // Get text content (removes all HTML tags)
  return temp.textContent || temp.innerText || '';
};

// Review card component - Enhanced Design
const ReviewCard: React.FC<{ 
  name: string; 
  rating: number; 
  comment: string;
  date: string;
  featured?: boolean;
}> = ({ name, rating, comment, date, featured = false }) => {
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className={`flex-shrink-0 w-96 mx-3 bg-gradient-to-br from-zinc-900 to-zinc-950 p-6 rounded-2xl border transition-all duration-300 hover:scale-105 relative overflow-hidden ${
      featured 
        ? 'border-amber-500/50 shadow-lg shadow-amber-500/20' 
        : 'border-gray-800 hover:border-amber-500/30'
    }`}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 opacity-5">
        <QuoteIcon />
      </div>
      
      {/* Featured badge */}
      {featured && (
        <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          Featured
        </div>
      )}
      
      <div className="flex items-center mb-5 relative z-10">
        <div className="bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full w-12 h-12 flex items-center justify-center mr-4 shadow-lg">
          <span className="font-bold text-black text-lg">{name.charAt(0).toUpperCase()}</span>
        </div>
        <div>
          <h4 className="font-bold text-white text-lg">{name}</h4>
          <p className="text-gray-500 text-sm">{formatDate(date)}</p>
        </div>
      </div>
      
      <div className="flex mb-5 gap-1">
        {[...Array(5)].map((_, i) => (
          <StarIcon key={i} filled={i < rating} />
        ))}
      </div>
      
      <p className="text-gray-300 leading-relaxed relative z-10">{comment}</p>
      
      {/* Bottom gradient effect */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-zinc-950/80 to-transparent pointer-events-none"></div>
    </div>
  );
};

const ReviewSection: React.FC = () => {
  const [email, setEmail] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch reviews from WordPress
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://blrparis.com/wp-json/wp/v2/reviews?per_page=20&orderby=date&order=desc');
        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }
        const data: Review[] = await response.json();
        setReviews(data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        // Keep empty array if fetch fails
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Handle email subscription
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Subscribing email:", email);
    alert(`Thank you for subscribing with: ${email}`);
    setEmail("");
  };

  // Duplicate reviews for seamless looping
  const marqueeReviews = reviews.length > 0 ? [...reviews, ...reviews] : [];

  // Show loading state
  if (loading) {
    return (
      <section className="bg-black text-white py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-amber-500 mb-6"></div>
            <p className="text-white/70 text-xl">Loading reviews...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-black text-white py-28 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-2 mb-6">
            <svg className="h-5 w-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-amber-500 font-semibold text-sm">Testimonials</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
            What Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600">
              Customers Say
            </span>
          </h2>
          <p className="text-lg text-white/60 mt-4 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust our IPTV services
          </p>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-900 rounded-full mb-6">
              <svg className="h-10 w-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <p className="text-gray-400 text-xl">No reviews yet. Be the first to share your experience!</p>
          </div>
        ) : (
          <>
            {/* Marquee Row 1 - Slides from right to left */}
            <div className="mb-6">
              <div className="flex w-max animate-marquee-ltr">
                {marqueeReviews.map((review, index) => (
                  <ReviewCard
                    key={`${review.id}-${index}`}
                    name={review.review_data.customer_name}
                    rating={review.review_data.rating}
                    comment={stripHtmlAndComments(review.review_data.comment)}
                    date={review.review_data.review_date}
                    featured={review.review_data.featured}
                  />
                ))}
              </div>
            </div>

            {/* Marquee Row 2 - Slides from left to right */}
            <div className="mt-6">
              <div className="flex w-max animate-marquee-rtl">
                {[...marqueeReviews].reverse().map((review, index) => (
                  <ReviewCard
                    key={`${review.id}-${index}-reverse`}
                    name={review.review_data.customer_name}
                    rating={review.review_data.rating}
                    comment={stripHtmlAndComments(review.review_data.comment)}
                    date={review.review_data.review_date}
                    featured={review.review_data.featured}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer Section */}
      <div className="max-w-5xl mx-auto px-6 mt-28">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Community Card */}
          <div className="md:col-span-2 relative bg-gradient-to-br from-zinc-900 to-zinc-950 p-6 rounded-2xl border border-gray-800 hover:border-amber-500/30 transition-all duration-300 group">
            <div className="absolute top-6 right-6 text-gray-500 group-hover:text-amber-500 transition-colors duration-300">
              <DiagonalArrowIcon />
            </div>
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-amber-500/10 p-2 rounded-lg">
                <svg className="h-6 w-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Community</h3>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Join our thriving community to connect with fellow IPTV enthusiasts, share experiences, and get expert advice.
            </p>
          </div>

          {/* Support Card */}
          <div className="relative bg-gradient-to-br from-zinc-900 to-zinc-950 p-6 rounded-2xl border border-gray-800 hover:border-amber-500/30 transition-all duration-300 group">
            <div className="absolute top-6 right-6 text-gray-500 group-hover:text-amber-500 transition-colors duration-300">
              <DiagonalArrowIcon />
            </div>
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-blue-500/10 p-2 rounded-lg">
                <svg className="h-6 w-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Support</h3>
            </div>
            <p className="text-gray-400 leading-relaxed">
              24/7 expert support for all your technical questions and setup assistance.
            </p>
          </div>

          {/* Blogs Card */}
          <div className="relative bg-gradient-to-br from-zinc-900 to-zinc-950 p-6 rounded-2xl border border-gray-800 hover:border-amber-500/30 transition-all duration-300 group">
            <div className="absolute top-6 right-6 text-gray-500 group-hover:text-amber-500 transition-colors duration-300">
              <DiagonalArrowIcon />
            </div>
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-purple-500/10 p-2 rounded-lg">
                <svg className="h-6 w-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Blog</h3>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Stay updated with the latest IPTV trends, tips, and industry insights.
            </p>
          </div>

          {/* Newsletter Card */}
          <div className="md:col-span-2 relative bg-gradient-to-br from-amber-900/20 to-zinc-950 p-6 rounded-2xl border border-amber-500/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-amber-500/10 p-2 rounded-lg">
                <svg className="h-6 w-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Stay in the loop</h3>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Get exclusive deals, updates, and IPTV tips delivered straight to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 bg-black/50 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                placeholder="your@email.com"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold rounded-xl hover:from-amber-600 hover:to-yellow-600 transition-all duration-300 hover:scale-105"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

<<<<<<< HEAD
export default ReviewSection;
=======
export default ReviewSection;
>>>>>>> master
