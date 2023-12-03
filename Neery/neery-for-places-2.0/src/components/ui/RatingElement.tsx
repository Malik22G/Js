import { HalfStar, Star } from "@/components/ui/icons";

export type RatingCardSize = "small" | "large";

const starSizeStyles: { [S in RatingCardSize]: string } = {
  "small": "w-[0.88em] h-[0.8em]",
  "large": "w-[1.3em] h-[1.25em]",
};

const halfStarSizeStyles: { [S in RatingCardSize]: string } = {
  "small": "w-[0.95em] h-[0.8em]",
  "large": "w-[1.4em] h-[1.25em]",
};

const textSizeStyles: { [S in RatingCardSize]: string } = {
  "small": "text-sm",
  "large": "text-lg font-bold",
};

export default function RatingElement({
  rating,
  size = "small",
  starsOnly = false,
  textStyle,
}: {
  rating: number,
  size?: RatingCardSize,
  starsOnly?: boolean,
  textStyle?: string
}) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const halfStars = hasHalfStar ? 1 : 0;

  const stars = [];
  for (let i = 0; i < fullStars; i++) {
    stars.push(<Star className={`text-warning ${starSizeStyles[size]}`} key={i} />);
  }
  if (hasHalfStar) {
    stars.push(<HalfStar className={`text-warning ${halfStarSizeStyles[size]}`} key={fullStars} />);
  }
  for (let i = fullStars + halfStars; i < 5; i++) {
    stars.push(<Star className={`text-neutral-300 ${starSizeStyles[size]}`} key={i} />);
  }

  return (
    <div className="flex flex-row gap-2 items-center">
      {starsOnly === false ? <div className={`${textSizeStyles[size]} ${textStyle}`}>{rating.toFixed(1)}</div> : null}
      <div className="flex items-center">{stars}</div>
    </div>
  );
}
