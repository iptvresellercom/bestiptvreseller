import React, { useState } from "react";

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
    className={`h-5 w-5 ${filled ? 'text-yellow-400' : 'text-gray-600'}`}
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

// Review card component
const ReviewCard: React.FC<{ 
  name: string; 
  rating: number; 
  comment: string;
  date: string;
}> = ({ name, rating, comment, date }) => {
  return (
    <div className="flex-shrink-0 w-96 mx-2 bg-zinc-900 p-6 rounded-xl border border-gray-800 hover:border-amber-500/50 transition-all duration-300">
      <div className="flex items-center mb-4">
        <div className="bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center mr-3">
          <span className="font-bold text-white">{name.charAt(0)}</span>
        </div>
        <div>
          <h4 className="font-bold text-white">{name}</h4>
          <p className="text-gray-400 text-sm">{date}</p>
        </div>
      </div>
      
      <div className="flex mb-4">
        {[...Array(5)].map((_, i) => (
          <StarIcon key={i} filled={i < rating} />
        ))}
      </div>
      
      <p className="text-gray-300">{comment}</p>
    </div>
  );
};

const ReviewSection: React.FC = () => {
  // State for email subscription
  const [email, setEmail] = useState("");

  // Handle email subscription
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send this to your backend
    console.log("Subscribing email:", email);
    alert(`Thank you for subscribing with: ${email}`);
    setEmail("");
  };

  // Array of sample reviews
  const reviews = [
    {
      id: 1,
      name: "Alex Johnson",
      rating: 5,
      comment: "Best IPTV service I've ever used. The panel is intuitive and the streaming quality is exceptional.",
      date: "2025-10-15"
    },
    {
      id: 2,
      name: "Maria Garcia",
      rating: 4,
      comment: "Reliable service with great customer support. Channels load quickly and the interface is user-friendly.",
      date: "2025-10-10"
    },
    {
      id: 3,
      name: "David Smith",
      rating: 5,
      comment: "Outstanding value for money. The reseller options have helped me grow my business significantly.",
      date: "2025-10-05"
    },
    {
      id: 4,
      name: "Sarah Williams",
      rating: 4,
      comment: "Good selection of channels and stable connections. The mobile app works flawlessly.",
      date: "2025-09-28"
    },
    {
      id: 5,
      name: "Michael Brown",
      rating: 5,
      comment: "Professional service with regular updates. Technical support is responsive and helpful.",
      date: "2025-09-20"
    },
    {
      id: 6,
      name: "Emma Davis",
      rating: 4,
      comment: "Great for both personal use and reselling. The dashboard makes management easy.",
      date: "2025-09-15"
    }
  ];

  // Duplicate reviews for seamless looping
  const marqueeReviews = [...reviews, ...reviews];

  return (
    <section className="bg-black text-white py-28 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">
            Customer{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-500">
              Reviews
            </span>
          </h2>
          <p className="text-lg text-white/70 mt-4 max-w-2xl mx-auto">
            Real feedback from our satisfied customers
          </p>
        </div>

        {/* Marquee Row 1 - Slides from right to left */}
        <div className="mb-4">
          <div className="flex w-max animate-marquee-ltr">
            {marqueeReviews.map((review, index) => (
              <ReviewCard
                key={`${review.id}-${index}`}
                name={review.name}
                rating={review.rating}
                comment={review.comment}
                date={review.date}
              />
            ))}
          </div>
        </div>

        {/* Marquee Row 2 - Slides from left to right */}
        <div className="mt-4">
          <div className="flex w-max animate-marquee-rtl">
            {[...marqueeReviews].reverse().map((review, index) => (
              <ReviewCard
                key={`${review.id}-${index}-reverse`}
                name={review.name}
                rating={review.rating}
                comment={review.comment}
                date={review.date}
              />
            ))}
          </div>
        </div>
      </div>

      {/* New Footer Section with updated styling */}
      <div className="max-w-5xl mx-auto px-6 mt-28">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Community Card - Wide top-left */}
          <div className="footer-card md:col-span-2 relative bg-zinc-950 p-5 rounded-xl">
            <div className="absolute top-6 right-6 text-gray-400">
              <DiagonalArrowIcon />
            </div>
            <h3 className="text-xl font-bold mb-3">Community</h3>
            <p className="text-gray-400">
              A place to get your questions answered, and to connect with fellow
              sovereign individuals.
            </p>
          </div>

          {/* Support Card - Narrow top-right */}
          <div className="footer-card relative bg-zinc-950 p-5 rounded-xl">
            <div className="absolute top-6 right-6 text-gray-400">
              <DiagonalArrowIcon />
            </div>
            <h3 className="text-xl font-bold mb-3">Support</h3>
            <p className="text-gray-400">
              Get help with installing and troubleshooting umbrelOS and Umbrel
              Home.
            </p>
          </div>

          {/* Academy Card - Narrow bottom-left */}
          <div className="footer-card relative bg-zinc-950 p-5 rounded-xl">
            <div className="absolute top-6 right-6 text-gray-400">
              <DiagonalArrowIcon />
            </div>
            <h3 className="text-xl font-bold mb-3">Blogs</h3>
            <p className="text-gray-400">
              We're hiring! Join us and shape the future of Umbrel.
            </p>
          </div>

          {/* Stay in the loop Card - Wide bottom-right */}
          <div className="footer-card md:col-span-2 relative bg-zinc-950 p-5 rounded-xl">
            <h3 className="text-xl font-bold mb-3">Stay in the loop</h3>
            <p className="text-gray-400 mb-4">
              Follow our journey in enabling sovereign individuals to truly own
              their data. Better yet, be a part of it.
            </p>
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col space-y-3"
            >
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-black rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="your@email.com"
                  required
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-colors duration-300 w-full"
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

export default ReviewSection;