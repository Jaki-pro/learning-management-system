import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const initialReviews = [
  { name: "Sarah J.", job: "Marketing Lead", photo: "https://placehold.co/56x56/4c6ef5/ffffff?text=SJ", desc: "The responsiveness and attention to detail surpassed all expectations. Highly recommended!" },
  { name: "John P.", job: "Software Engineer", photo: "https://placehold.co/56x56/20c997/ffffff?text=JP", desc: "A game-changer for our workflow. Setup was easy, and the results were immediate." },
  { name: "Emily K.", job: "Product Designer", photo: "https://placehold.co/56x56/fa5252/ffffff?text=EK", desc: "Fantastic UI/UX design. Clean, intuitive, and a pleasure to use every day." },
  { name: "David L.", job: "CEO, Innovate", photo: "https://placehold.co/56x56/fcc419/ffffff?text=DL", desc: "Incredible value for the price. Our team productivity has seen a massive boost." },
];

const reviews = [...initialReviews, ...initialReviews];

const ReviewSection = () => {
  const customStyles = `
    @keyframes scroll-x {
      from { transform: translateX(0); }
      to { transform: translateX(calc(-1 * (300px + 1.5rem) * ${initialReviews.length})); }
    }

    .animate-scroll-x {
      animation: scroll-x 40s linear infinite;
    }

    .animate-scroll-x:hover {
      animation-play-state: paused;
    }
  `;

  const backgroundClass = "min-h-screen text-gray-900 dark:text-gray-100 p-8 flex flex-col items-center";
  const cardClasses = "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700";
  const textMutedClasses = "text-gray-500 dark:text-gray-400";
  const borderClasses = "border-gray-300 dark:border-gray-600";

  return (
    <div className={backgroundClass}>
      <h2 className="text-4xl font-bold mb-10 text-center">What Our Students Say</h2>

      <style>{customStyles}</style>

      <div className="w-full max-w-7xl">
        <div className="relative w-full overflow-hidden">
          <div className={`flex gap-6 animate-scroll-x`}>
            {reviews.map((r, i) => (
              <motion.div
                key={i}
                initial={i < initialReviews.length ? { opacity: 0, y: 20 } : undefined}
                whileInView={i < initialReviews.length ? { opacity: 1, y: 0 } : undefined}
                transition={i < initialReviews.length ? { duration: 0.5, delay: i * 0.1 } : {}}
                className={`min-w-[300px] max-w-sm ${cardClasses} border ${borderClasses} rounded-2xl p-6 shadow-xl flex-shrink-0`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <Image
                    src={r.photo}
                    alt={r.name}
                    width={56}
                    height={56}
                    className={`w-14 h-14 rounded-full object-cover border ${borderClasses}`}
                  />
                  <div>
                    <h4 className="font-semibold">{r.name}</h4>
                    <p className={`text-xs ${textMutedClasses}`}>{r.job}</p>
                  </div>
                </div>
                <p className={`text-sm italic ${textMutedClasses}`}>“{r.desc}”</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewSection;
