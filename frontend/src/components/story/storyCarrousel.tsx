import { timeAgo } from "@/lib/utils/timeAgo";
import { IStory } from "@/types/story";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";
import { useEffect, useState } from "react";

const StoryCarousel = ({ stories }: { stories: IStory[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const currentStory = stories[currentIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          setCurrentIndex((prevIndex) =>
            prevIndex < stories.length - 1 ? prevIndex + 1 : 0
          );
          return 0;
        }
        return prevProgress + 0.1;
      });
    }, 10);

    return () => clearInterval(interval);
  }, [stories.length]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < stories.length - 1 ? prevIndex + 1 : 0
    );
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : stories.length - 1
    );
    setProgress(0);
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
    setProgress(0);
  };

  return (
    <section className="relative">
      <div className="w-full max-w-md mx-auto">
        <div className="h-1 bg-gray-300 rounded overflow-hidden ">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="flex justify-between items-center mt-2">
          <button
            onClick={handlePrev}
            className="p-2 rounded-full hover:text-primary"
          >
            <ArrowBigLeft />
          </button>

          <div className="w-full max-w-md h-[550px] flex flex-col items-center justify-center gap-y-10">
            <p className="italic text-sm text-center mb-2">
              "{currentStory.content}"
            </p>

            <img
              src={currentStory.mediaUrl}
              alt={currentStory.content || "Hikaye"}
              className="object-contain rounded "
            />
          </div>

          <button
            onClick={handleNext}
            className="p-2 rounded-full hover:text-primary"
          >
            <ArrowBigRight />
          </button>
        </div>

        <p className="text-xs mt-2 text-gray-400 text-center">
          {timeAgo(currentStory.createdAt)}
        </p>
        <div className="flex justify-center mt-4 gap-x-2">
          {stories.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-3 h-3 rounded-full ${
                currentIndex === index ? "bg-primary" : "bg-gray-300"
              } transition-colors`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StoryCarousel;
