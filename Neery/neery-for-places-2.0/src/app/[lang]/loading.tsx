import { Loader } from "@/components/ui/icons";

export default function Loading() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Loader className="text-primary" />
    </div>
  );
}
